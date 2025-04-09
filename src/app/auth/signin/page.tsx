import RedirectIfAuthenticated from '@/components/auth/RedirectIfAuthenticated';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <RedirectIfAuthenticated>
      <SignInForm />
    </RedirectIfAuthenticated>
  );
}
