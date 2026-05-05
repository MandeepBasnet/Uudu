import { Client, Storage, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const SOURCE = {
  endpoint: process.env.VITE_APPWRITE_ENDPOINT,
  projectId: process.env.VITE_APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  bucketId: process.env.VITE_APPWRITE_BUCKET_ID,
};

const DEST = {
  endpoint: 'https://appwrite.itsoch.com/v1',
  projectId: '69f9a29a0038ab889426',
  apiKey: process.env.DEST_APPWRITE_API_KEY,
  bucketId: process.env.VITE_APPWRITE_BUCKET_ID, // keep same bucket ID so image_url fields stay valid
};

if (!DEST.apiKey) {
  console.error('Missing DEST_APPWRITE_API_KEY in .env');
  process.exit(1);
}

const srcClient = new Client().setEndpoint(SOURCE.endpoint).setProject(SOURCE.projectId).setKey(SOURCE.apiKey);
const dstClient = new Client().setEndpoint(DEST.endpoint).setProject(DEST.projectId).setKey(DEST.apiKey);

const srcStorage = new Storage(srcClient);
const dstStorage = new Storage(dstClient);

async function createBucketIfMissing() {
  try {
    await dstStorage.getBucket(DEST.bucketId);
    console.log('Bucket already exists on destination.');
  } catch {
    console.log('Creating bucket on destination...');
    await dstStorage.createBucket(
      DEST.bucketId,
      'Uudu Images',
      undefined, // permissions (inherit project defaults)
      false,     // fileSecurity
      true,      // enabled
      30000000,  // maximumFileSize: 30MB
      [],        // allowedFileExtensions
      'none',    // compression
      false,     // encryption
      false      // antivirus
    );
    console.log('Bucket created.');
  }
}

async function listAllFiles() {
  const files = [];
  let cursor = null;
  const limit = 100;

  while (true) {
    const queries = [Query.limit(limit)];
    if (cursor) queries.push(Query.cursorAfter(cursor));

    const res = await srcStorage.listFiles(SOURCE.bucketId, queries);
    files.push(...res.files);
    if (res.files.length < limit) break;
    cursor = res.files[res.files.length - 1].$id;
  }

  return files;
}

async function downloadFile(fileId) {
  const url = `${SOURCE.endpoint}/storage/buckets/${SOURCE.bucketId}/files/${fileId}/download`;
  const res = await fetch(url, {
    headers: {
      'X-Appwrite-Project': SOURCE.projectId,
      'X-Appwrite-Key': SOURCE.apiKey,
    },
  });
  if (!res.ok) throw new Error(`Download failed for ${fileId}: ${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

async function migrateFile(file) {
  try {
    await dstStorage.getFile(DEST.bucketId, file.$id);
    console.log(`  SKIP  ${file.name} (already exists)`);
    return 'skipped';
  } catch {
    // doesn't exist, proceed
  }

  const buffer = await downloadFile(file.$id);
  const inputFile = new File([buffer], file.name, { type: file.mimeType });
  await dstStorage.createFile(DEST.bucketId, file.$id, inputFile);
  console.log(`  OK    ${file.name} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return 'ok';
}

async function main() {
  console.log('Source:     ', SOURCE.endpoint, SOURCE.projectId);
  console.log('Destination:', DEST.endpoint, DEST.projectId);
  console.log('');

  await createBucketIfMissing();

  console.log('\nListing files from source...');
  const files = await listAllFiles();
  console.log(`Found ${files.length} files.\n`);

  let ok = 0, skipped = 0, failed = 0;

  for (const file of files) {
    try {
      const result = await migrateFile(file);
      if (result === 'skipped') skipped++;
      else ok++;
    } catch (err) {
      console.error(`  FAIL  ${file.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${ok} migrated, ${skipped} skipped, ${failed} failed.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
