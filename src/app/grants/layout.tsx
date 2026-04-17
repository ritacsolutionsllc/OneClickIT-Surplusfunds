import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grants Directory — Veteran, Small Business & Tech/AI Grants',
  description:
    'Nationwide directory of veteran-owned, small business, and tech/AI grants. Active and archived programs with direct links, amounts, deadlines, and eligibility.',
  alternates: { canonical: '/grants' },
};

export default function GrantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
