import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Our partners: OneClickIT.ai for technology and AI automation, OneClickITLeads.com for surplus-funds data and lead generation.',
  alternates: { canonical: '/partners' },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
