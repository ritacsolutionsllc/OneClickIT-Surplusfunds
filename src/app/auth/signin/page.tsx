'use client';
import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Provider {
  id: string;
  name: string;
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider>>({});

  useEffect(() => {
    getProviders().then(p => {
      if (p) setProviders(p as unknown as Record<string, Provider>);
    });
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-xl bg-blue-600 p-3">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="text-sm text-gray-500">Access your surplus funds dashboard</p>
        </div>

        <div className="space-y-3">
          {Object.values(providers).map(provider => (
            <Button
              key={provider.id}
              className="w-full"
              variant={provider.id === 'google' ? 'primary' : 'outline'}
              onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
            >
              Sign in with {provider.name}
            </Button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By signing in, you agree that surplus funds data is public information.
          No legal claims are made on your behalf.
        </p>
      </div>
    </div>
  );
}
