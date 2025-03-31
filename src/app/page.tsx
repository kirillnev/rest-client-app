import { redirect } from 'next/navigation';
import Welcome from '@/components/Welcome/Welcome';
import GoodBye from '@/components/Goodbye/Goodbye';

export default async function Home() {
  const user = true;

  if (!user) {
    return <Welcome />;
  }

  const isLogout = false; // получим состояние из Auth
  if (isLogout) {
    return <GoodBye />;
  }

  redirect('/client'); // что бы url соответсвовал контенту
}
