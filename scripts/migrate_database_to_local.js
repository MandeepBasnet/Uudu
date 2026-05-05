import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const SOURCE = {
  endpoint: process.env.VITE_APPWRITE_ENDPOINT,
  projectId: process.env.VITE_APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  dbId: process.env.VITE_APPWRITE_DB_ID,
};

const DEST = {
  endpoint: 'https://appwrite.itsoch.com/v1',
  projectId: '69f9a29a0038ab889426',
  apiKey: process.env.DEST_APPWRITE_API_KEY,
  dbId: process.env.VITE_APPWRITE_DB_ID, // keep same DB ID
};

if (!DEST.apiKey) { console.error('Missing DEST_APPWRITE_API_KEY in .env'); process.exit(1); }

const srcDb = new Databases(new Client().setEndpoint(SOURCE.endpoint).setProject(SOURCE.projectId).setKey(SOURCE.apiKey));
const dstDb = new Databases(new Client().setEndpoint(DEST.endpoint).setProject(DEST.projectId).setKey(DEST.apiKey));

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Database ──────────────────────────────────────────────────────────────────

async function ensureDatabase() {
  try {
    await dstDb.get(DEST.dbId);
    console.log('Database already exists.');
  } catch {
    const srcInfo = await srcDb.get(SOURCE.dbId);
    await dstDb.create(DEST.dbId, srcInfo.name);
    console.log(`Created database: ${srcInfo.name}`);
  }
}

// ── Collections ───────────────────────────────────────────────────────────────

async function listAllCollections() {
  const all = [];
  let cursor = null;
  while (true) {
    const q = [Query.limit(100)];
    if (cursor) q.push(Query.cursorAfter(cursor));
    const res = await srcDb.listCollections(SOURCE.dbId, q);
    all.push(...res.collections);
    if (res.collections.length < 100) break;
    cursor = res.collections.at(-1).$id;
  }
  return all;
}

async function ensureCollection(col) {
  try {
    await dstDb.getCollection(DEST.dbId, col.$id);
    console.log(`  Collection exists: ${col.name}`);
  } catch {
    await dstDb.createCollection(DEST.dbId, col.$id, col.name, col.$permissions, col.documentSecurity, col.enabled);
    console.log(`  Created collection: ${col.name}`);
  }
}

// ── Attributes ────────────────────────────────────────────────────────────────

async function ensureAttributes(colId) {
  const srcAttrs = (await srcDb.listAttributes(SOURCE.dbId, colId)).attributes;
  const dstAttrs = (await dstDb.listAttributes(DEST.dbId, colId)).attributes;
  const existing = new Set(dstAttrs.map(a => a.key));

  for (const attr of srcAttrs) {
    if (existing.has(attr.key)) continue;
    const { key, type, required, array, status } = attr;
    if (status !== 'available') continue;

    try {
      switch (type) {
        case 'string':
          await dstDb.createStringAttribute(DEST.dbId, colId, key, attr.size, required, attr.default ?? null, array ?? false);
          break;
        case 'integer':
          await dstDb.createIntegerAttribute(DEST.dbId, colId, key, required, attr.min ?? null, attr.max ?? null, attr.default ?? null, array ?? false);
          break;
        case 'double':
          await dstDb.createFloatAttribute(DEST.dbId, colId, key, required, attr.min ?? null, attr.max ?? null, attr.default ?? null, array ?? false);
          break;
        case 'boolean':
          await dstDb.createBooleanAttribute(DEST.dbId, colId, key, required, attr.default ?? null, array ?? false);
          break;
        case 'datetime':
          await dstDb.createDatetimeAttribute(DEST.dbId, colId, key, required, attr.default ?? null, array ?? false);
          break;
        case 'email':
          await dstDb.createEmailAttribute(DEST.dbId, colId, key, required, attr.default ?? null, array ?? false);
          break;
        case 'url':
          await dstDb.createUrlAttribute(DEST.dbId, colId, key, required, attr.default ?? null, array ?? false);
          break;
        case 'ip':
          await dstDb.createIpAttribute(DEST.dbId, colId, key, required, attr.default ?? null, array ?? false);
          break;
        case 'enum':
          await dstDb.createEnumAttribute(DEST.dbId, colId, key, attr.elements, required, attr.default ?? null, array ?? false);
          break;
        default:
          console.log(`    SKIP attr '${key}' (unsupported type: ${type})`);
          continue;
      }
      console.log(`    + attr: ${key} (${type})`);
    } catch (e) {
      console.error(`    FAIL attr '${key}': ${e.message}`);
    }
  }

  // Wait for all attributes to become available
  await waitForAttributes(colId);
}

async function waitForAttributes(colId) {
  for (let i = 0; i < 30; i++) {
    const attrs = (await dstDb.listAttributes(DEST.dbId, colId)).attributes;
    const pending = attrs.filter(a => a.status === 'processing');
    if (pending.length === 0) return;
    process.stdout.write('.');
    await sleep(1000);
  }
  process.stdout.write('\n');
}

// ── Indexes ───────────────────────────────────────────────────────────────────

async function ensureIndexes(colId) {
  const srcIdxs = (await srcDb.listIndexes(SOURCE.dbId, colId)).indexes;
  const dstIdxs = (await dstDb.listIndexes(DEST.dbId, colId)).indexes;
  const existing = new Set(dstIdxs.map(i => i.key));

  for (const idx of srcIdxs) {
    if (existing.has(idx.key)) continue;
    try {
      await dstDb.createIndex(DEST.dbId, colId, idx.key, idx.type, idx.attributes, idx.orders ?? []);
      console.log(`    + index: ${idx.key}`);
    } catch (e) {
      console.error(`    FAIL index '${idx.key}': ${e.message}`);
    }
  }
}

// ── Documents ─────────────────────────────────────────────────────────────────

async function migrateDocuments(colId) {
  let cursor = null;
  let total = 0, skipped = 0, failed = 0;

  while (true) {
    const q = [Query.limit(100)];
    if (cursor) q.push(Query.cursorAfter(cursor));
    const res = await srcDb.listDocuments(SOURCE.dbId, colId, q);

    for (const doc of res.documents) {
      const { $id, $permissions, ...rest } = doc;
      // Strip all internal $-prefixed fields — older Appwrite versions reject them
      const data = Object.fromEntries(Object.entries(rest).filter(([k]) => !k.startsWith('$')));
      try {
        await dstDb.getDocument(DEST.dbId, colId, $id);
        skipped++;
      } catch {
        try {
          await dstDb.createDocument(DEST.dbId, colId, $id, data, $permissions);
          total++;
        } catch (e) {
          console.error(`    FAIL doc ${$id}: ${e.message}`);
          failed++;
        }
      }
    }

    if (res.documents.length < 100) break;
    cursor = res.documents.at(-1).$id;
  }

  console.log(`    docs: ${total} created, ${skipped} skipped, ${failed} failed`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Source:     ', SOURCE.endpoint, SOURCE.projectId, '| db:', SOURCE.dbId);
  console.log('Destination:', DEST.endpoint, DEST.projectId, '| db:', DEST.dbId);
  console.log('');

  await ensureDatabase();

  const collections = await listAllCollections();
  console.log(`\nFound ${collections.length} collections.\n`);

  for (const col of collections) {
    console.log(`\n[${col.$id}] ${col.name}`);
    await ensureCollection(col);
    console.log('  Attributes:');
    await ensureAttributes(col.$id);
    console.log('  Indexes:');
    await ensureIndexes(col.$id);
    console.log('  Documents:');
    await migrateDocuments(col.$id);
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
