import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Get full access to surplus funds data. Start free or upgrade to Pro for CSV exports, OSINT tools, and unlimited county lookups. Plans from $1.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing | SurplusClickIT',
    description: 'Plans from $1 — full surplus funds data access, OSINT tools, and CSV exports.',
    url: 'https://surplusclickit.com/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
