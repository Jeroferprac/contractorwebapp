import { useEffect, useState } from 'react';
import { getProductCategories } from '@/lib/inventory';

export function useProductCategories() {
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProductCategories()
      .then((data) => setCategories(data))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
} 