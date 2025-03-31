// import { getAuth } from 'firebase/auth';
import { redirect } from 'next/navigation';
import HistorySection from '@/components/History/History';

export default async function HistoryPage() {
  const user = true;
  if (!user) {
    redirect('/auth/signin');
  }
  return <HistorySection />;
}
