'use client';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { MapPin, Search, Bell, LayoutDashboard, Settings, LogOut, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
          <MapPin className="h-5 w-5" />
          <span className="hidden sm:block">Surplus Funds</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/directory"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:block">Directory</span>
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:block">Dashboard</span>
              </Link>

              {session.user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:block">Admin</span>
                </Link>
              )}

              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Sign out</span>
              </button>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn()}>
              <LogIn className="mr-1.5 h-4 w-4" />
              Sign in
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
