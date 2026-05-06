import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.VITE_APPWRITE_DB_ID;
const COL_ID = process.env.VITE_APPWRITE_TOPPINGS_COLLECTION_ID;

async function main() {
  const list = await db.listAttributes(DB_ID, COL_ID);
  const exists = list.attributes.some(a => a.key === 'color_code');
  if (exists) {
    console.log('color_code attribute already exists — nothing to do.');
    return;
  }
  await db.createStringAttribute(DB_ID, COL_ID, 'color_code', 20, false);
  console.log('color_code attribute created on toppings collection.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
