import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

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

// Public read, authenticated users can create/update/delete
const permissions = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

async function main() {
  for (const colId of COLLECTIONS) {
    const col = await db.getCollection(DB_ID, colId);
    await db.updateCollection(DB_ID, colId, col.name, permissions, false, true);
    console.log(`Updated permissions for [${colId}]`);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
