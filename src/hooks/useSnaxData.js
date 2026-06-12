import { useState, useEffect } from 'react';
import { databases, appwriteConfig, Query } from '../lib/appwrite';

export function assignSnaxDisplayIds(items, sortOrder = null) {
  let sorted;
  if (sortOrder && sortOrder.length > 0) {
    sorted = [...items].sort((a, b) => {
      const posA = sortOrder.indexOf(a.id);
      const posB = sortOrder.indexOf(b.id);
      const rankA = posA === -1 ? sortOrder.length + (parseInt((a.id || '').replace(/\D/g, ''), 10) || 999) : posA;
      const rankB = posB === -1 ? sortOrder.length + (parseInt((b.id || '').replace(/\D/g, ''), 10) || 999) : posB;
      return rankA - rankB;
    });
  } else {
    sorted = [...items].sort((a, b) => {
      const numA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 999;
      const numB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 999;
      return numA - numB;
    });
  }

  let counter = 1;
  return sorted.map((item) => {
    const isUnavailable = item.status === 'coming_soon' || item.status === 'out_of_stock';
    if (isUnavailable) return { ...item, display_id: null };
    if (counter > 99) return { ...item, display_id: null };
    const display_id = `X${String(counter).padStart(2, '0')}`;
    counter++;
    return { ...item, display_id };
  });
}

export function useSnaxData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('local');

  useEffect(() => {
    async function fetchData() {
      if (!appwriteConfig.projectId || !appwriteConfig.dbId || !appwriteConfig.snaxCollectionId) {
        setData([]);
        setLoading(false);
        return;
      }

      try {
        const response = await databases.listDocuments(
          appwriteConfig.dbId,
          appwriteConfig.snaxCollectionId,
          [Query.limit(100)]
        );

        if (response.documents.length > 0) {
          const sortOrderDoc = response.documents.find((doc) => doc.id === 'metadata_sort_order');
          let parsedSortOrder = null;
          if (sortOrderDoc?.description) {
            try { parsedSortOrder = JSON.parse(sortOrderDoc.description); } catch (e) {}
          }

          const processedDocs = response.documents
            .filter((doc) => !doc.id.startsWith('metadata_'))
            .map((doc) => ({ ...doc, price: Number(doc.price) }));

          setData(assignSnaxDisplayIds(processedDocs, parsedSortOrder));
          setSource('remote');
        } else {
          setData([]);
          setSource('local');
        }
      } catch (err) {
        console.error('Failed to fetch Snax from Appwrite:', err);
        setData([]);
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
