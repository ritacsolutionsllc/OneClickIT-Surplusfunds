import Link from 'next/link';
import { Users, ExternalLink } from 'lucide-react';
import { County } from '@/types';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

function formatPop(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
}

export default function CountyCard({ county }: { county: County }) {
  return (
    <Card padding="md" className="hover:border-blue-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/county/${county.id}`}
            className="font-semibold text-gray-900 hover:text-blue-600 truncate block"
          >
            {county.name} County
          </Link>
          <p className="text-sm text-gray-500">{county.state}</p>
        </div>
        <Badge variant="info">#{county.rank}</Badge>
      </div>

      <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {formatPop(county.population)}
        </span>
        {county.listUrl && (
          <a
            href={county.listUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            List
          </a>
        )}
      </div>

      {county.notes && (
        <p className="mt-2 text-xs text-gray-400 truncate">{county.notes}</p>
      )}
    </Card>
  );
}
