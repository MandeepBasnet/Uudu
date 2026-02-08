
import { Client, Account } from 'appwrite';
import dotenv from 'dotenv';

// Configure dotenv to read from .env.local
dotenv.config({ path: '.env.local' });

const client = new Client();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
    console.error("Missing Appwrite configuration in .env.local");
    process.exit(1);
}

console.log(`Testing login against:`);
console.log(`Endpoint: ${endpoint}`);
console.log(`Project ID: ${projectId}`);

client
    .setEndpoint(endpoint)
    .setProject(projectId);

const account = new Account(client);

const email = "uudu_admin@example.com";
const password = "uudu@123#admin";

const testLogin = async () => {
    try {
        console.log(`Attempting login for ${email}...`);
        const session = await account.createEmailPasswordSession(email, password);
        console.log("LOGIN SUCCESSFUL!");
        console.log("Session ID:", session.$id);
        console.log("User ID:", session.userId);
    } catch (error) {
        console.error("LOGIN FAILED");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Error Type:", error.type);
    }
};

testLogin();
