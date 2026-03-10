import { useState, useEffect } from 'react';
import { databases, appwriteConfig, Query } from '../lib/appwrite';
import localRamenData from '../data/updatedRamen.json';

/**
 * Assigns sequential display_id (N01–N30) to available noodles.
 * Unavailable noodles (coming_soon / out_of_stock) get display_id = null.
 * Items are sorted by their raw `id` field first to preserve shelf order.
 */
function assignDisplayIds(items) {
    // Sort by the raw id field to get canonical shelf order (N01, N02, …)
    const sorted = [...items].sort((a, b) => {
        const numA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 999;
        const numB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 999;
        return numA - numB;
    });

    let counter = 1;
    return sorted.map(item => {
        const isUnavailable = item.status === 'coming_soon' || item.status === 'out_of_stock';
        if (isUnavailable || counter > 30) {
            return { ...item, display_id: null };
        }
        const display_id = `N${String(counter).padStart(2, '0')}`;
        counter++;
        return { ...item, display_id };
    });
}

export function useRamenData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [source, setSource] = useState('local'); // 'local' or 'remote'

    useEffect(() => {
        async function fetchData() {
            if (!appwriteConfig.projectId || !appwriteConfig.dbId) {
                console.warn("Appwrite not configured, using local data.");
                setData(assignDisplayIds(localRamenData.ramen));
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
                    const processedDocs = response.documents
                        .filter(doc => !doc.id.startsWith('metadata_')) // Filter out metadata
                        .map(doc => ({
                        ...doc,
                        // Parse suggested_videos if it's a string (from Appwrite)
                        suggested_videos: typeof doc.suggested_videos === 'string' 
                            ? JSON.parse(doc.suggested_videos) 
                            : doc.suggested_videos
                    }));
                    setData(assignDisplayIds(processedDocs));
                    setSource('remote');
                } else {
                    // Database is empty, fallback to local
                    console.info("Appwrite DB is empty, falling back to local JSON.");
                    setData(assignDisplayIds(localRamenData.ramen));
                    setSource('local');
                }
            } catch (err) {
                console.error("Failed to fetch from Appwrite:", err);
                // Fallback on error
                setData(assignDisplayIds(localRamenData.ramen));
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
