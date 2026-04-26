import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClaimsClient from './ClaimsClient';

export default async function ClaimsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');
  const isPro = session.user.role === 'pro' || session.user.role === 'admin';
  if (!isPro) redirect('/pricing');
  return <ClaimsClient />;
}
