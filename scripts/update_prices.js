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
const TOPPINGS_COL = process.env.VITE_APPWRITE_TOPPINGS_COLLECTION_ID;

// price_bowl stays $3.00; only price_packet changes (total = packet + bowl)
const ramenUpdates = {
  // $4.75 total → packet = 1.75
  N25: { price_packet: 1.75 },
  N26: { price_packet: 1.75 }, // already correct, harmless

  // $6.00 total → packet = 3.00
  N01: { price_packet: 3.00 }, N02: { price_packet: 3.00 },
  N03: { price_packet: 3.00 }, N04: { price_packet: 3.00 },
  N05: { price_packet: 3.00 }, N06: { price_packet: 3.00 },
  N07: { price_packet: 3.00 }, N08: { price_packet: 3.00 },
  N10: { price_packet: 3.00 }, N11: { price_packet: 3.00 },
  N12: { price_packet: 3.00 }, N13: { price_packet: 3.00 },
  N14: { price_packet: 3.00 }, N15: { price_packet: 3.00 },
  N16: { price_packet: 3.00 }, N17: { price_packet: 3.00 },
  N18: { price_packet: 3.00 }, N19: { price_packet: 3.00 },
  N20: { price_packet: 3.00 }, N21: { price_packet: 3.00 },
  N22: { price_packet: 3.00 }, N23: { price_packet: 3.00 },
  N24: { price_packet: 3.00 }, N27: { price_packet: 3.00 },
  N28: { price_packet: 3.00 }, N29: { price_packet: 3.00 },

  // $8.50 total → packet = 5.50
  N30: { price_packet: 5.50 },
};

const toppingUpdates = {
  // $0.35 → $0.40
  T02: 0.40, // Corn
  T07: 0.40, // Mayonnaise (House)
  T09: 0.40, // Butter
  T11: 0.40, // Chili Oil (House)
  T17: 0.40, // Lime

  // $0.70 → $0.75
  T01: 0.75, // Bok Choy
  T03: 0.75, // Kimchi
  T13: 0.75, // Rocket Booster #1
  T14: 0.75, // Rocket Booster #2
  T18: 0.75, // Mozzarella Cheese
  T19: 0.75, // Mexican Blend Cheese
  T20: 0.75, // Flamin' Hot Cheetos Crumble
  T22: 0.75, // Egg - Hard Boiled

  // $1.75 → $2.75 (Side Dishes)
  T28: 2.75, // Crispy Pork Egg Roll
  T29: 2.75, // K-Spam Crunch
  T30: 2.75, // Fish Balls with Egg Roe
};

async function main() {
  console.log('--- Noodles ---');
  for (const [id, data] of Object.entries(ramenUpdates)) {
    try {
      await db.updateDocument(DB_ID, RAMEN_COL, id, data);
      const total = (data.price_packet + 3).toFixed(2);
      console.log(`  OK  ${id}: packet $${data.price_packet.toFixed(2)} → total $${total}`);
    } catch (e) {
      console.error(`  FAIL ${id}: ${e.message}`);
    }
  }

  console.log('\n--- Toppings ---');
  for (const [id, price] of Object.entries(toppingUpdates)) {
    try {
      await db.updateDocument(DB_ID, TOPPINGS_COL, id, { price });
      console.log(`  OK  ${id}: $${price.toFixed(2)}`);
    } catch (e) {
      console.error(`  FAIL ${id}: ${e.message}`);
    }
  }

  console.log('\nDone. Note: "Popcorn Chicken" is not in the DB — add it manually via the Edit page.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
