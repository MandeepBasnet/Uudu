import { Client, Users } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const users = new Users(client);

const EMAIL = 'uudu_admin@example.com';
const PASSWORD = 'uudu@123#admin';
const NAME = 'Uudu Admin';

async function main() {
  try {
    const user = await users.create('unique()', EMAIL, undefined, PASSWORD, NAME);
    console.log('Admin user created:', user.$id, user.email);
  } catch (e) {
    if (e.type === 'user_already_exists') {
      console.log('User already exists.');
    } else {
      throw e;
    }
  }
}

main().catch(err => { console.error(err.message); process.exit(1); });
