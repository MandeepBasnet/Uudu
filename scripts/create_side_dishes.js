import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.VITE_APPWRITE_DB_ID;
const TOPPINGS_COL = process.env.VITE_APPWRITE_TOPPINGS_COLLECTION_ID;
const SIDES_COL = 'side_dishes';

const perms = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function ensureCollection() {
  try {
    await db.getCollection(DB_ID, SIDES_COL);
    console.log('side_dishes collection already exists.');
  } catch {
    await db.createCollection(DB_ID, SIDES_COL, 'Side Dishes', perms);
    console.log('Created side_dishes collection.');

    const attrs = [
      () => db.createStringAttribute(DB_ID, SIDES_COL, 'id', 100, true),
      () => db.createStringAttribute(DB_ID, SIDES_COL, 'name', 500, true),
      () => db.createFloatAttribute(DB_ID, SIDES_COL, 'price', true),
      () => db.createEnumAttribute(DB_ID, SIDES_COL, 'status', ['available', 'coming_soon'], false, 'available'),
      () => db.createStringAttribute(DB_ID, SIDES_COL, 'image_url', 5000, false),
      () => db.createStringAttribute(DB_ID, SIDES_COL, 'description', 2000, false),
      () => db.createStringAttribute(DB_ID, SIDES_COL, 'color_code', 20, false),
    ];
    for (const fn of attrs) { await fn(); }
    console.log('Attributes created. Waiting...');
    for (let i = 0; i < 30; i++) {
      const list = await db.listAttributes(DB_ID, SIDES_COL);
      if (!list.attributes.some(a => a.status === 'processing')) break;
      process.stdout.write('.');
      await sleep(1000);
    }
    console.log('\nAttributes ready.');
  }
}

async function migrate() {
  // Read T28, T29, T30 from toppings
  const sourceIds = ['T28', 'T29', 'T30'];
  const newIds =    ['SD01', 'SD02', 'SD03'];

  for (let i = 0; i < sourceIds.length; i++) {
    const src = sourceIds[i];
    const dst = newIds[i];
    try {
      const doc = await db.getDocument(DB_ID, TOPPINGS_COL, src);
      try {
        await db.getDocument(DB_ID, SIDES_COL, dst);
        console.log(`  SKIP ${dst} (already exists)`);
      } catch {
        await db.createDocument(DB_ID, SIDES_COL, dst, {
          id: dst,
          name: doc.name,
          price: doc.price,
          status: doc.status || 'available',
          image_url: doc.image_url || '',
          description: doc.description || '',
          color_code: '#FF66FF',
        });
        console.log(`  CREATED ${dst}: ${doc.name}`);
      }
    } catch (e) {
      console.error(`  FAIL reading ${src}: ${e.message}`);
    }
  }

  // Popcorn Chicken (new)
  try {
    await db.getDocument(DB_ID, SIDES_COL, 'SD04');
    console.log('  SKIP SD04 (already exists)');
  } catch {
    await db.createDocument(DB_ID, SIDES_COL, 'SD04', {
      id: 'SD04',
      name: 'Popcorn Chicken',
      price: 2.75,
      status: 'available',
      image_url: '',
      description: '',
      color_code: '#FF66FF',
    });
    console.log('  CREATED SD04: Popcorn Chicken');
  }
}

async function removeFromToppings() {
  for (const id of ['T28', 'T29', 'T30']) {
    try {
      await db.deleteDocument(DB_ID, TOPPINGS_COL, id);
      console.log(`  DELETED ${id} from toppings`);
    } catch (e) {
      if (e.code === 404) console.log(`  ${id} already removed`);
      else console.error(`  FAIL deleting ${id}: ${e.message}`);
    }
  }
}

async function main() {
  console.log('--- Creating side_dishes collection ---');
  await ensureCollection();
  console.log('\n--- Migrating items ---');
  await migrate();
  console.log('\n--- Removing from toppings ---');
  await removeFromToppings();
  console.log('\nDone.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
