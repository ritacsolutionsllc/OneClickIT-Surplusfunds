import { FundEntry } from '@/types';
import Badge from '@/components/ui/Badge';

interface FundsTableProps {
  funds: FundEntry[];
  scrapedAt?: Date | null;
}

export default function FundsTable({ funds, scrapedAt }: FundsTableProps) {
  if (funds.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        No funds data available. Try scraping this county or check the source URL directly.
      </div>
    );
  }

  return (
    <div>
      {scrapedAt && (
        <p className="mb-2 text-xs text-gray-400">
          Last updated: {new Date(scrapedAt).toLocaleDateString()}
        </p>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Property</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Claimant</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {funds.map((fund, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 max-w-xs truncate">{fund.property || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{fund.claimant || '—'}</td>
                <td className="px-4 py-3">
                  {fund.amount ? (
                    <Badge variant="success">{fund.amount}</Badge>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{fund.date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-400">{funds.length} record(s) found</p>
    </div>
  );
}
