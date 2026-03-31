'use client';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ScrapeButtonProps {
  countyId: string;
  hasListUrl: boolean;
}

export default function ScrapeButton({ countyId, hasListUrl }: ScrapeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleScrape = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/scrape/${countyId}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Done — ${data.data?.count ?? 0} records found`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(data.error || 'Scrape failed');
      }
    } catch {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!hasListUrl) {
    return (
      <p className="text-xs text-gray-400">No list URL configured. Add one in admin panel.</p>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={handleScrape} loading={loading} size="sm" variant="outline">
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        Refresh data
      </Button>
      {message && <p className="text-xs text-gray-500">{message}</p>}
    </div>
  );
}
