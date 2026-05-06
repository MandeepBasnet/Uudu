import { Client, Databases, Storage, Permission, Role, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = '/Users/sarojraut/Downloads/beveragesdataphotos';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const storage = new Storage(client);

const DB_ID = process.env.VITE_APPWRITE_DB_ID;
const COL_ID = 'beverages';
const BUCKET_ID = process.env.VITE_APPWRITE_BUCKET_ID;

const collectionPermissions = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

// Data from Excel
const beverages = [
  { id: 'B01', name: 'Arizona - Green Tea, 15 oz',       price: 1.75 },
  { id: 'B02', name: 'Arizona - Lemon, 15 oz',           price: 1.75 },
  { id: 'B03', name: 'Arizona - Palmer LT, 15 oz',       price: 1.75 },
  { id: 'B04', name: 'Arizona - Peach, 15 oz',           price: 1.75 },
  { id: 'B05', name: 'Binggrae - Banana Milk, 6.8 oz',   price: 1.75 },
  { id: 'B06', name: 'Binggrae - Strawberry Milk, 6.8 oz', price: 1.75 },
  { id: 'B07', name: 'Binggrae - Taro Milk, 6.8 oz',    price: 1.75 },
  { id: 'B08', name: 'Dasani - Water, 16.9 oz',          price: 1.50 },
  { id: 'B09', name: 'Jarritos - Guava, 12.5 oz',        price: 2.00 },
  { id: 'B10', name: 'Jarritos - Lime, 12.5 oz',         price: 2.00 },
  { id: 'B11', name: 'Jarritos - Mandarin, 12.5 oz',     price: 2.00 },
  { id: 'B12', name: 'Jarritos - Pineapple, 12.5 oz',    price: 2.00 },
  { id: 'B13', name: 'Milkis - Grape, 8.45 oz',          price: 1.75 },
  { id: 'B14', name: 'Milkis - Melon, 8.45 oz',          price: 1.75 },
  { id: 'B15', name: 'Milkis - Original, 8.45 oz',       price: 1.75 },
  { id: 'B16', name: 'Milkis - Peach, 8.45 oz',          price: 1.75 },
  { id: 'B17', name: 'Mogu Mogu - Lychee, 10.8 oz',      price: 2.00 },
  { id: 'B18', name: 'Mogu Mogu - Mango, 10.8 oz',       price: 2.00 },
  { id: 'B19', name: 'Pepsi - 12 oz',                    price: 1.75 },
  { id: 'B20', name: 'Pepsi - Diet, 12 oz',              price: 1.75 },
  { id: 'B21', name: 'Sprite - 12 oz',                   price: 2.00 },
  { id: 'B22', name: 'Topo Chico - Blueberry 12 oz',     price: 1.75 },
  { id: 'B23', name: 'Topo Chico - Lime 12 oz',          price: 1.75 },
  { id: 'B24', name: 'Topo Chico - Passion Fruit 12 oz', price: 1.75 },
  { id: 'B25', name: 'Topo Chico - Raspberry 12 oz',     price: 1.75 },
  { id: 'B26', name: 'VTalk - Blue Lemon, 11.8 oz',      price: 2.00 },
];

// Map B-id to photo filename
const photoMap = {
  B01: 'B01 - Arizona Green.png',
  B02: 'B02 - Arizona Lemon.png',
  B03: 'B03 - Arizona Palmer.png',
  B04: 'B04 - Arizona Peach.png',
  B05: 'B05 - Binggrae Banana.png',
  B06: 'B06 - Binggrae Strawberry.png',
  B07: 'B07 - Binggrae Taro.png',
  B08: 'B08 - Dasani Water.png',
  B09: 'B09 - Jarritos Guava.png',
  B10: 'B10 - Jarritos Lime.png',
  B11: 'B11 - Jarritos Mandarin.png',
  B12: 'B12 - Jarritos Pineapple.png',
  B13: 'B13 - Milkis Grape.png',
  B14: 'B14 - Milkis Melon.png',
  B15: 'B15 - Milkis Original.png',
  B16: 'B16 - Milkis Peach.png',
  B17: 'B17 - Mogu Lychee.png',
  B18: 'B18 - Mogu Mango.png',
  B19: 'B19 - Pepsi.jpg',
  B20: 'B20 - Pepsi Diet.png',
  B21: 'B21 - Sprite.png',
  B22: 'B22 - Topo Chico - Blueberry.png',
  B23: 'B23 - Topo Chico - Lime.png',
  B24: 'B24 - Topo Chico - Passion Fruit.png',
  B25: 'B25 - Topo Chico - Raspberry.png',
  B26: 'B26 - VTalk Blue Lnade (350ml can).png',
};

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function ensureCollection() {
  try {
    await db.getCollection(DB_ID, COL_ID);
    console.log('Collection already exists.');
  } catch {
    await db.createCollection(DB_ID, COL_ID, 'Beverages', collectionPermissions);
    console.log('Created collection: beverages');

    const attrs = [
      () => db.createStringAttribute(DB_ID, COL_ID, 'id', 100, true),
      () => db.createStringAttribute(DB_ID, COL_ID, 'name', 500, true),
      () => db.createFloatAttribute(DB_ID, COL_ID, 'price', true),
      () => db.createEnumAttribute(DB_ID, COL_ID, 'status', ['available', 'coming_soon'], false, 'available'),
      () => db.createStringAttribute(DB_ID, COL_ID, 'image_url', 5000, false),
      () => db.createStringAttribute(DB_ID, COL_ID, 'description', 2000, false),
    ];

    for (const fn of attrs) {
      await fn();
    }
    console.log('Attributes created. Waiting for them to be ready...');

    // Wait for attributes to become available
    for (let i = 0; i < 30; i++) {
      const list = await db.listAttributes(DB_ID, COL_ID);
      const pending = list.attributes.filter(a => a.status === 'processing');
      if (pending.length === 0) break;
      process.stdout.write('.');
      await sleep(1000);
    }
    console.log('\nAttributes ready.');
  }
}

async function uploadPhoto(bevId) {
  const filename = photoMap[bevId];
  if (!filename) return null;

  const filepath = join(PHOTOS_DIR, filename);
  let buffer;
  try {
    buffer = readFileSync(filepath);
  } catch {
    console.log(`  Photo not found: ${filename}`);
    return null;
  }

  const mimeType = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  const file = new File([buffer], filename, { type: mimeType });
  const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
  const url = `${process.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${process.env.VITE_APPWRITE_PROJECT_ID}`;
  return url;
}

async function seedDocuments() {
  for (const bev of beverages) {
    try {
      await db.getDocument(DB_ID, COL_ID, bev.id);
      console.log(`  SKIP  ${bev.id} (already exists)`);
      continue;
    } catch {}

    process.stdout.write(`  ${bev.id} uploading photo... `);
    const imageUrl = await uploadPhoto(bev.id);
    console.log(imageUrl ? 'OK' : 'no photo');

    await db.createDocument(DB_ID, COL_ID, bev.id, {
      id: bev.id,
      name: bev.name,
      price: bev.price,
      status: 'available',
      image_url: imageUrl || '',
      description: '',
    });
    console.log(`  CREATED ${bev.id}: ${bev.name} $${bev.price}`);
  }
}

async function main() {
  console.log('Setting up beverages collection...\n');
  await ensureCollection();
  console.log('\nSeeding beverages documents + uploading photos...\n');
  await seedDocuments();
  console.log('\nDone! 26 beverages ready.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
