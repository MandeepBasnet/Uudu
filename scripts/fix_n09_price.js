import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.VITE_APPWRITE_DB_ID;
const RAMEN_COL = process.env.VITE_APPWRITE_COLLECTION_ID;

async function main() {
  // N09 was skipped in update_prices.js — should be $6.00 (packet $3.00)
  try {
    const doc = await db.getDocument(DB_ID, RAMEN_COL, 'N09');
    console.log(`N09 current price_packet: $${doc.price_packet}`);
    if (Math.abs(doc.price_packet - 3.00) > 0.001) {
      await db.updateDocument(DB_ID, RAMEN_COL, 'N09', { price_packet: 3.00 });
      console.log('N09 updated → $3.00 packet ($6.00 total)');
    } else {
      console.log('N09 already correct, no update needed.');
    }
  } catch (e) {
    console.error(`FAIL N09: ${e.message}`);
  }
}

main().catch(err => { console.error(err.message); process.exit(1); });
