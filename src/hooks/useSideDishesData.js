import { useState, useEffect } from 'react';
import { databases, appwriteConfig, Query } from '../lib/appwrite';

export function assignSideDishDisplayIds(items, sortOrder) {
  let ordered = [...items];
  if (sortOrder && Array.isArray(sortOrder)) {
    const indexMap = new Map(sortOrder.map((id, i) => [id, i]));
    ordered.sort((a, b) => {
      const ai = indexMap.has(a.id) ? indexMap.get(a.id) : 999;
      const bi = indexMap.has(b.id) ? indexMap.get(b.id) : 999;
      return ai - bi;
    });
  }
  let counter = 1;
  return ordered.map((item) => {
    const isUnavailable = item.status === 'coming_soon' || item.status === 'out_of_stock';
    if (isUnavailable || counter > 99) return { ...item, display_id: null };
    const display_id = `S${String(counter).padStart(2, '0')}`;
    counter++;
    return { ...item, display_id };
  });
}

export function useSideDishesData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.dbId,
          appwriteConfig.sideDishesCollectionId,
          [Query.limit(100)]
        );
        const docs = response.documents;
        const sortDoc = docs.find((d) => d.id === 'metadata_sort_order');
        let sortOrder = null;
        if (sortDoc?.description) {
          try { sortOrder = JSON.parse(sortDoc.description); } catch (e) {}
        }
        const filtered = docs.filter((d) => !d.id.startsWith('metadata_'));
        const withIds = assignSideDishDisplayIds(filtered, sortOrder);
        setData(withIds);
      } catch (e) {
        console.error('useSideDishesData error:', e);
      } finally {
        setLoading(false);
      }
    }
    if (appwriteConfig.dbId && appwriteConfig.sideDishesCollectionId) {
      fetchData();
    }
  }, []);

  return { data, loading };
}
