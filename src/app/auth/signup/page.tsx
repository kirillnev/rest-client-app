import { AuthForm } from '@/components/auth/AuthForm';
import RedirectIfAuthenticated from '@/components/auth/RedirectIfAuthenticated';

export default function SignUpPage() {
  return (
    <RedirectIfAuthenticated>
      <AuthForm mode="signup" />
    </RedirectIfAuthenticated>
  );
}
