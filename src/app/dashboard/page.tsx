import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Bell, Bookmark, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id, active: true },
    include: { county: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {session.user.name || session.user.email}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Alerts */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" /> Active Alerts
            </h2>
            <Badge variant="info">{alerts.length}</Badge>
          </div>
          {alerts.length > 0 ? (
            <ul className="space-y-3">
              {alerts.map(alert => (
                <li key={alert.id} className="flex items-center justify-between text-sm">
                  <Link href={`/county/${alert.countyId}`} className="text-blue-600 hover:underline">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {alert.county.name}, {alert.county.state}
                    </span>
                  </Link>
                  {alert.minAmount && (
                    <span className="text-xs text-gray-400">&gt;${alert.minAmount.toLocaleString()}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">
              No alerts yet.{' '}
              <Link href="/directory" className="text-blue-600 hover:underline">Browse counties</Link>{' '}
              to subscribe.
            </p>
          )}
        </Card>

        {/* Quick actions */}
        <Card>
          <h2 className="mb-4 font-semibold text-gray-900 flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-blue-600" /> Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/directory"
              className="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              Browse county directory
            </Link>
            <Link
              href="/directory?state=CA"
              className="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              California counties
            </Link>
            <Link
              href="/directory?maxPop=50000"
              className="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              Small rural counties (&lt;50k pop)
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
