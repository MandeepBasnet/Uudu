import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const OLD_BASE = 'https://sgp.cloud.appwrite.io/v1';
const OLD_PROJECT = '6974b11a002cfed1d9e5';
const NEW_BASE = 'https://appwrite.itsoch.com/v1';
const NEW_PROJECT = '69f9a29a0038ab889426';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.VITE_APPWRITE_DB_ID;
const COLLECTIONS = [
  process.env.VITE_APPWRITE_COLLECTION_ID,
  process.env.VITE_APPWRITE_TOPPINGS_COLLECTION_ID,
];

function fixUrl(url) {
  if (!url || !url.startsWith('http')) return url;
  return url
    .replace(OLD_BASE, NEW_BASE)
    .replace(OLD_PROJECT, NEW_PROJECT);
}

async function fixCollection(colId) {
  let cursor = null;
  let updated = 0, skipped = 0;

  while (true) {
    const q = [Query.limit(100)];
    if (cursor) q.push(Query.cursorAfter(cursor));
    const res = await db.listDocuments(DB_ID, colId, q);

    for (const doc of res.documents) {
      const oldUrl = doc.image_url;
      const newUrl = fixUrl(oldUrl);

      if (newUrl !== oldUrl) {
        await db.updateDocument(DB_ID, colId, doc.$id, { image_url: newUrl });
        console.log(`  UPDATED [${doc.$id}] ${oldUrl?.slice(0, 60)}...`);
        updated++;
      } else {
        skipped++;
      }
    }

    if (res.documents.length < 100) break;
    cursor = res.documents.at(-1).$id;
  }

  console.log(`  ${updated} updated, ${skipped} skipped\n`);
}

async function main() {
  console.log(`Fixing image URLs: ${OLD_BASE} → ${NEW_BASE}\n`);
  for (const colId of COLLECTIONS) {
    console.log(`[${colId}]`);
    await fixCollection(colId);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
