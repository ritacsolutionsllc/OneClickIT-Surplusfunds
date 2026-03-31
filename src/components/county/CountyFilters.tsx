'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { US_STATES } from '@/lib/constants';

export default function CountyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/directory?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-56">
        <Input
          placeholder="Search counties..."
          defaultValue={searchParams.get('q') || ''}
          onChange={e => update('q', e.target.value)}
        />
      </div>
      <div className="w-36">
        <Select
          defaultValue={searchParams.get('state') || ''}
          onChange={e => update('state', e.target.value)}
        >
          <option value="">All states</option>
          {US_STATES.map(s => (
            <option key={s.code} value={s.code}>{s.code} – {s.name}</option>
          ))}
        </Select>
      </div>
      <div className="w-40">
        <Select
          defaultValue={searchParams.get('popRange') || ''}
          onChange={e => {
            const [min, max] = e.target.value.split('-');
            update('minPop', min || '');
            update('maxPop', max || '');
          }}
        >
          <option value="">Any population</option>
          <option value="0-999">Under 1,000</option>
          <option value="1000-10000">1k – 10k</option>
          <option value="10001-50000">10k – 50k</option>
          <option value="50001-500000">50k – 500k</option>
          <option value="500001-">500k+</option>
        </Select>
      </div>
    </div>
  );
}
