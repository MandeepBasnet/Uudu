
import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv to read from .env.local
dotenv.config({ path: '.env.local' });

const client = new Client();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const dbId = process.env.VITE_APPWRITE_DB_ID;
const collectionId = process.env.VITE_APPWRITE_COLLECTION_ID;
// For node scripts we might need an API key if we don't have a session, 
// BUT the user instructions imply I should migrate "from here" using what I have.
// Standard client side SDKs can write if permissions allow "any" or "users".
// However, node-appwrite usually requires an API Key for server-side ops *or* acts as a client.
// I'll try to use the client setup as provided in the project, but `node-appwrite` is a server SDK.
// If the project uses 'appwrite' (web SDK), I can use that, but I need a browser env or polyfills.
// Given I am in a node env, I should use `node-appwrite`.
// I will check if an API Key is available in env. If not, I might be blocked unless I can use the web SDK with some user auth.
// Let's check .env.local first (I requested to view it).
// If no API key, I will assume public write access is enabled or I should use the Web SDK via a browser tool? 
// No, the user said "code and migrate... from here". 
// I'll try to use the API key if present. 
// If not, I'll assume I need to guide the user or use a trick.
// Wait, I can't read .env.local in this thought block, I have to wait for the previous tool `view_file`.
// I will optimistically write a script that USES the values.
// I'll assume there is an API KEY or I'll try to find one. 
// If there isn't one, I'll have to ask the user for it or use the web sdk if possible.
// Actually, I can use the `appwrite` web SDK in node if I polyfill fetch/etc, but `node-appwrite` is better.
// I will write a script that expects `APPWRITE_API_KEY` (which might not be in .env.local).
// I'll try to find a key.

// New N21 Data
const newN21 = {
  id: "N21",
  name: "Menraku Shoyu Tonkotsu",
  type: "Soup",
  menu: "Menu 3D",
  country: "Japan",
  description: "This Tonkotsu builds on classic pork-bone richness with the added depth of shoyu, delivering a deeper and more complex broth. Menraku's firm noodles carry the layered flavors beautifully, making it a solid step-up option for those ready to explore a richer tonkotsu experience.",
  price_packet: 2.75,
  price_bowl: 3.00,
  spiciness: "4 out of 10 flames",
  suggested_videos: JSON.stringify([
    {
      "url": "https://www.youtube.com/shorts/bLsfQCg0MII",
      "description": "Review Video"
    }
  ]),
  image_url: "menraku-shoyu-tonkotsu.png"
};

const runMigration = async () => {
  if (!endpoint || !projectId || !dbId || !collectionId) {
    console.error("Missing Appwrite configuration.");
    return;
  }

  client
    .setEndpoint(endpoint)
    .setProject(projectId);

  // If we have a secret API key, set it.
  if (process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY);
  } else {
      console.warn("No APPWRITE_API_KEY found. Attempting unauthenticated/client update (likely to fail if permissions are restricted).");
  }

  const databases = new Databases(client);

  try {
    console.log("Searching for document with id field 'N21'...");
    // We need to find the document ID (which might be distinct from our 'id' field)
    const response = await databases.listDocuments(
      dbId,
      collectionId,
      [
        Query.equal('id', 'N21') 
      ]
    );

    if (response.documents.length === 0) {
      console.error("Document with N21 not found.");
      return;
    }

    const docId = response.documents[0].$id;
    console.log(`Found document with ID: ${docId}, updating...`);

    const result = await databases.updateDocument(
      dbId,
      collectionId,
      docId,
      newN21
    );

    console.log("Migration successful!", result);
  } catch (error) {
    console.error("Migration failed:", error);
  }
};

runMigration();
