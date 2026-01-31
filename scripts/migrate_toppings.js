
import { Client, Databases, Storage, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv to read from .env.local
dotenv.config({ path: '.env.local' });

const client = new Client();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const dbId = process.env.VITE_APPWRITE_DB_ID;
const collectionId = process.env.VITE_APPWRITE_TOPPINGS_COLLECTION_ID;
const apiKey = process.env.APPWRITE_API_KEY;

// Read updatedToppings.json
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toppingsPath = path.join(__dirname, '../src/data/updatedToppings.json');
const rawData = fs.readFileSync(toppingsPath);
const toppingsData = JSON.parse(rawData).toppings;

const runMigration = async () => {
  if (!endpoint || !projectId || !dbId || !collectionId || !apiKey) {
    console.error("Missing Appwrite configuration.");
    console.log({ endpoint, projectId, dbId, collectionId, hasApiKey: !!apiKey });
    return;
  }

  client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  const databases = new Databases(client);

  console.log(`Starting migration of ${toppingsData.length} toppings...`);
  
  let successCount = 0;
  let failCount = 0;

  for (const item of toppingsData) {
    try {
        const payload = { ...item };
        
        // Ensure price is number
        payload.price = parseFloat(item.price);

        // Remove ID from payload body since we use it as docId
        // Keep it if the schema requires it, but usually docId is separate
        // The implementation plan schema HAS an 'id' attribute, so we keep it.
        const docId = item.id; 

        await databases.createDocument(
            dbId,
            collectionId,
            docId,
            payload
        );
        console.log(`Migrated ${item.id}`);
        successCount++;
    } catch (err) {
        if (err.code === 409) {
            console.log(`Skipping ${item.id} (Already exists)`);
            successCount++; // Count as success since it's there
        } else {
            console.error(`Failed to migrate ${item.id}:`, err.message);
            failCount++;
        }
    }
  }

  console.log(`Migration finished. Success: ${successCount}, Failed: ${failCount}`);
};

runMigration();

