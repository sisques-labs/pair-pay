import { JoinCoupleForm } from '@/features/couple/components/join-couple-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { getCurrentCouple } from '@/features/couple/actions';

export default async function JoinCouplePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // If the user already belongs to a couple, show status/invite instead of join form.
  const couple = await getCurrentCouple();
  if (couple) {
    redirect('/couple');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <JoinCoupleForm />
    </div>
  );
}
