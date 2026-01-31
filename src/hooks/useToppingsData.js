import { useState, useEffect } from 'react';
import { databases, appwriteConfig, Query } from '../lib/appwrite';
import localToppingsData from '../data/updatedToppings.json';

export function useToppingsData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [source, setSource] = useState('local'); // 'local' or 'remote'

    useEffect(() => {
        async function fetchData() {
            if (!appwriteConfig.projectId || !appwriteConfig.dbId || !appwriteConfig.toppingsCollectionId) {
                console.warn("Appwrite Toppings not configured, using local data.");
                setData(localToppingsData.toppings);
                setLoading(false);
                return;
            }

            try {
                // Fetch all documents. Using limit(100) to be safe for now
                const response = await databases.listDocuments(
                    appwriteConfig.dbId,
                    appwriteConfig.toppingsCollectionId,
                    [
                        Query.limit(100)
                    ]
                );

                if (response.documents.length > 0) {
                    // Map Appwrite documents to our data structure
                    const processedDocs = response.documents
                        .filter(doc => !doc.id.startsWith('metadata_')) // Filter out metadata if any
                        .map(doc => ({
                        ...doc,
                        // Ensure price is a number
                        price: Number(doc.price)
                    }));
                    setData(processedDocs);
                    setSource('remote');
                } else {
                    // Database is empty, fallback to local
                    console.info("Appwrite Toppings DB is empty, falling back to local JSON.");
                    setData(localToppingsData.toppings);
                    setSource('local');
                }
            } catch (err) {
                console.error("Failed to fetch Toppings from Appwrite:", err);
                // Fallback on error
                setData(localToppingsData.toppings);
                setSource('local_fallback');
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { data, loading, error, source };
}
