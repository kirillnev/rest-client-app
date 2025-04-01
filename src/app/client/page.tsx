// import { getAuth } from 'firebase/auth';
import { redirect } from 'next/navigation';
import RestClient from '@/components/RestClient/RestClient';

export default async function ClientPage() {
  const user = true;
  if (!user) {
    redirect('/auth/signin');
  }
  return <RestClient />;
}
