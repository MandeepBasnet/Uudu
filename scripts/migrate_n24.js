
import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

// Configure dotenv to read from .env.local
dotenv.config({ path: '.env.local' });

const client = new Client();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const dbId = process.env.VITE_APPWRITE_DB_ID;
const collectionId = process.env.VITE_APPWRITE_COLLECTION_ID;

// New N24 Data
const newN24 = {
  id: "N24",
  name: "Mom's SurfMama Sichuan Spicy Flavor",
  type: "Sauce",
  menu: "Menu 2",
  country: "Taiwan",
  description: "Premium thick, bouncy wheat noodles coated in a fragrant Sichuan-style mala sauce, built around the gently tongue-numbing buzz of Sichuan peppercorns and layered chili heat for a balanced, crave-worthy bump. A cult Taiwanese favorite among intrepid noodle hackers.",
  price_packet: 2.75,
  price_bowl: 3.00,
  spiciness: "8 out of 10 flames",
  suggested_videos: JSON.stringify([
    {
      "url": "https://www.youtube.com/watch?v=JNHjEU6L4uA",
      "description": "Hack Video"
    }
  ]),
  image_url: "mom's-surfMama-sichuan-spicy-flavor.png"
};

const runMigration = async () => {
  if (!endpoint || !projectId || !dbId || !collectionId) {
    console.error("Missing Appwrite configuration.");
    return;
  }

  client
    .setEndpoint(endpoint)
    .setProject(projectId);

  if (process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY);
  } else {
      console.warn("No APPWRITE_API_KEY found. This will likely fail.");
  }

  const databases = new Databases(client);

  try {
    console.log("Searching for document with id field 'N24'...");
    const response = await databases.listDocuments(
      dbId,
      collectionId,
      [
        Query.equal('id', 'N24') 
      ]
    );

    if (response.documents.length === 0) {
      console.error("Document with N24 not found.");
      return;
    }

    const docId = response.documents[0].$id;
    console.log(`Found document with ID: ${docId}, updating...`);

    const result = await databases.updateDocument(
      dbId,
      collectionId,
      docId,
      newN24
    );

    console.log("Migration successful!", result);
  } catch (error) {
    console.error("Migration failed:", error);
  }
};

runMigration();
