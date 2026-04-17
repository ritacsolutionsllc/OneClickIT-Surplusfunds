'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, ExternalLink, Filter, AlertTriangle, Search } from 'lucide-react';
import { grants, categoryLabels, statusMeta, type GrantCategory, type GrantStatus } from './data';

const categoryFilters: { value: 'all' | GrantCategory; label: string }[] = [
  { value: 'all', label: 'All grants' },
  { value: 'veteran', label: 'Veteran' },
  { value: 'small-business', label: 'Small business' },
  { value: 'tech-ai', label: 'Tech / AI' },
  { value: 'women-minority', label: 'Women / Minority' },
];

const statusFilters: { value: 'all' | 'active' | GrantStatus; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active only (Open/Rolling/Monthly)' },
  { value: 'OPEN', label: 'Open' },
  { value: 'ROLLING', label: 'Rolling' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'COHORT', label: 'Cohort' },
  { value: 'OPENS_LATER', label: 'Opens later' },
  { value: 'CLOSED', label: 'Closed / archived' },
];

export default function GrantsPage() {
  const [category, setCategory] = useState<'all' | GrantCategory>('all');
  const [status, setStatus] = useState<'all' | 'active' | GrantStatus>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return grants.filter(g => {
      if (category !== 'all' && !g.categories.includes(category)) return false;
      if (status === 'active' && !['OPEN', 'ROLLING', 'MONTHLY'].includes(g.status)) return false;
      if (status !== 'all' && status !== 'active' && g.status !== status) return false;
      if (q) {
        const hay = `${g.name} ${g.sponsor} ${g.eligibility} ${g.notes ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [category, status, query]);

  const activeCount = grants.filter(g => ['OPEN', 'ROLLING', 'MONTHLY'].includes(g.status)).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <Award className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Grants Directory</h1>
        <p className="mx-auto mt-2 max-w-2xl text-gray-500">
          Nationwide directory of veteran-owned, small business, and tech/AI grants. Includes currently open,
          rolling, cohort-based, and archived programs with reopen dates. {grants.length} programs listed,{' '}
          {activeCount} active today.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Filter className="h-4 w-4" /> Filter
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as 'all' | GrantCategory)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categoryFilters.map(f => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'all' | 'active' | GrantStatus)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {statusFilters.map(f => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. veteran, SBIR, California…"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Showing {filtered.length} of {grants.length} programs
        </div>
      </div>

      {/* Grant cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No grants match your filters. Try widening the category or status.
          </div>
        )}

        {filtered.map(g => {
          const statusBadge = statusMeta[g.status];
          return (
            <article
              key={g.name}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-900 sm:text-lg">{g.name}</h2>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadge.tone}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{g.sponsor}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-blue-700">{g.amount}</div>
                  <div className="text-xs text-gray-500">{g.deadline}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <span className="font-medium text-gray-900">Eligibility: </span>
                {g.eligibility}
              </div>

              {g.notes && (
                <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{g.notes}</div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {g.categories.map(c => (
                    <span
                      key={c}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                    >
                      {categoryLabels[c]}
                    </span>
                  ))}
                </div>

                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Apply / Learn more <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4" /> Verify before you apply
        </div>
        <p className="leading-relaxed">
          Grant cycles, amounts, and eligibility change frequently. This directory was last verified on{' '}
          <strong>2026-04-09</strong>. Always confirm current status on the sponsor&apos;s official page (linked above)
          before investing time in an application. SurplusClickIT does not administer or distribute these grants —
          apply directly through each sponsor.
        </p>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        <Link href="/learn" className="underline hover:text-gray-600">
          ← Back to Learning Center
        </Link>
      </div>
    </div>
  );
}
