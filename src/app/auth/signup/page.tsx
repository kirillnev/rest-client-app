import RedirectIfAuthenticated from '@/components/auth/RedirectIfAuthenticated';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <RedirectIfAuthenticated>
      <SignUpForm />
    </RedirectIfAuthenticated>
  );
}
