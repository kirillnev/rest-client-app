import { redirect } from 'next/navigation';
import History from '@/components/History';

export default async function HistoryPage() {
  const user = true;
  if (!user) {
    redirect('/auth/signin');
  }
  return <History />;
}
