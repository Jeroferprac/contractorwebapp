'use client';

import { useProductCategories } from '@/lib/hooks/useProductCategories';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function CategorySelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (val: string) => void;
}) {
  const { categories, loading, error } = useProductCategories();

  return (
    <div>
      <label className="block mb-1 font-medium">Category</label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? 'Loading...' : 'Select a category'} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.category} value={cat.category}>
              {cat.category} {typeof cat.count === 'number' ? `(${cat.count})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <div className="text-red-500 mt-1">{error}</div>}
    </div>
  );
} 