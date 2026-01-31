
import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const dbId = process.env.VITE_APPWRITE_DB_ID;
const collectionId = process.env.VITE_APPWRITE_COLLECTION_ID;

// Updates based on user request
const updates = [
  {
    id: "N07",
    suggested_videos: JSON.stringify([
      {
        "url": "https://www.youtube.com/watch?v=x_Qftlm7MpU",
        "description": "Hack Video"
      }
    ])
  },
  {
    id: "N08",
    suggested_videos: JSON.stringify([
      {
        "url": "https://www.youtube.com/watch?v=kIc6-Z8IG3A",
        "description": "Hack Video 1"
      },
      {
        "url": "https://www.youtube.com/watch?v=va4RfCCG1AA",
        "description": "Hack Video 2"
      }
    ])
  },
  {
    id: "N30",
    suggested_videos: JSON.stringify([
      {
        "url": "https://www.youtube.com/watch?v=oC426HmqoIg",
        "description": "Hack Video"
      }
    ])
  },
  {
    id: "N31",
    suggested_videos: JSON.stringify([
      {
        "url": "https://www.youtube.com/watch?v=ZUZE9rS970c&ab_channel=SIASlurps",
        "description": "Taste Test - Sia Slurps (01:56)"
      },
      {
        "url": "https://www.youtube.com/shorts/pYY99aHxvfI",
        "description": "Taste Test - apopofficial (00:21)"
      },
      {
        "url": "https://www.youtube.com/watch?v=Bxx-SVOxJAA&t=454s",
        "description": "Taste Test - Noodle Journey (09:40)"
      }
    ])
  }
];

const runMigration = async () => {
  if (!endpoint || !projectId || !dbId || !collectionId) {
    console.error("Missing Appwrite configuration.");
    return;
  }

  client.setEndpoint(endpoint).setProject(projectId);

  if (process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY);
  } else {
    console.warn("No APPWRITE_API_KEY found. This will likely fail.");
  }

  const databases = new Databases(client);

  for (const update of updates) {
    try {
      console.log(`Searching for document with id field '${update.id}'...`);
      const response = await databases.listDocuments(
        dbId,
        collectionId,
        [
          Query.equal('id', update.id) 
        ]
      );

      if (response.documents.length === 0) {
        console.error(`Document with ${update.id} not found.`);
        continue;
      }

      const docId = response.documents[0].$id;
      console.log(`Found ${update.id} (Doc ID: ${docId}), updating videos...`);

      const result = await databases.updateDocument(
        dbId,
        collectionId,
        docId,
        {
          suggested_videos: update.suggested_videos
        }
      );

      console.log(`Update successful for ${update.id}`);
    } catch (error) {
      console.error(`Failed to update ${update.id}:`, error);
    }
  }
};

runMigration();
