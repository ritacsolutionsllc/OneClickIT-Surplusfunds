import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/Auth/AuthProvider';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Surplus Funds Directory | OneClickIT',
  description:
    'Search publicly available surplus funds lists from rural US counties. Find unclaimed property overages, tax sale proceeds, and foreclosure surpluses.',
  keywords: 'surplus funds, unclaimed property, tax sale proceeds, excess proceeds, county directory',
  openGraph: {
    title: 'Surplus Funds Directory',
    description: 'Find surplus funds from rural US county public records',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
