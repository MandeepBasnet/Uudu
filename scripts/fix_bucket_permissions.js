import { Client, Storage, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);
const BUCKET_ID = process.env.VITE_APPWRITE_BUCKET_ID;

const permissions = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

async function main() {
  const bucket = await storage.getBucket(BUCKET_ID);
  await storage.updateBucket(
    BUCKET_ID,
    bucket.name,
    permissions,
    false,        // fileSecurity
    true,         // enabled
    30000000,     // maximumFileSize 30MB
    [],           // allowedFileExtensions
    'none',       // compression
    false,        // encryption
    false         // antivirus
  );
  console.log(`Updated permissions for bucket [${BUCKET_ID}]`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
