import { AuthForm } from '@/components/auth/AuthForm';
import RedirectIfAuthenticated from '@/components/auth/RedirectIfAuthenticated';

export default function SignInPage() {
  return (
    <RedirectIfAuthenticated>
      <AuthForm mode="signin" />
    </RedirectIfAuthenticated>
  );
}
