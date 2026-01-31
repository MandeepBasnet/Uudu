import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

export const appwriteConfig = {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    dbId: import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
    toppingsCollectionId: import.meta.env.VITE_APPWRITE_TOPPINGS_COLLECTION_ID,
};

const client = new Client();

if (appwriteConfig.endpoint && appwriteConfig.projectId) {
    client
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };
