import { useState, useEffect } from 'react';
import { databases, appwriteConfig, Query } from '../lib/appwrite';
import localRamenData from '../data/updatedRamen.json';

export function useRamenData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [source, setSource] = useState('local'); // 'local' or 'remote'

    useEffect(() => {
        async function fetchData() {
            if (!appwriteConfig.projectId || !appwriteConfig.dbId) {
                console.warn("Appwrite not configured, using local data.");
                setData(localRamenData.ramen);
                setLoading(false);
                return;
            }

            try {
                // Fetch all documents. Limitation: defaults to 25, need pagination for >25
                // For this use case (approx 20 items), default is fine, but lets set a high limit just in case
                // Using limit(100)
                const response = await databases.listDocuments(
                    appwriteConfig.dbId,
                    appwriteConfig.collectionId,
                    [
                        Query.limit(100)
                    ]
                );

                if (response.documents.length > 0) {
                    // Map Appwrite documents to our data structure
                    const processedDocs = response.documents.map(doc => ({
                        ...doc,
                        // Parse suggested_videos if it's a string (from Appwrite)
                        suggested_videos: typeof doc.suggested_videos === 'string' 
                            ? JSON.parse(doc.suggested_videos) 
                            : doc.suggested_videos
                    }));
                    setData(processedDocs);
                    setSource('remote');
                } else {
                    // Database is empty, fallback to local
                    console.info("Appwrite DB is empty, falling back to local JSON.");
                    setData(localRamenData.ramen);
                    setSource('local');
                }
            } catch (err) {
                console.error("Failed to fetch from Appwrite:", err);
                // Fallback on error
                setData(localRamenData.ramen);
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
