'use client';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number } | null>(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (res.ok) {
      setResult(data.data);
    } else {
      setError(data.error || 'Upload failed');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">Upload Counties CSV</h1>

      <Card>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload a CSV file with columns: <code className="rounded bg-gray-100 px-1">rank, county, state, pop, source, notes</code>.
            Existing counties (matched by name + state) will be updated.
          </p>

          <div
            className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById('csv-input')?.click()}
          >
            <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              {file ? file.name : 'Click to select a CSV file'}
            </p>
            <input
              id="csv-input"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button
            onClick={handleUpload}
            loading={loading}
            disabled={!file}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload and Import
          </Button>

          {result && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              Successfully imported <strong>{result.imported}</strong> counties.
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}
        </div>
      </Card>
    </div>
  );
}
