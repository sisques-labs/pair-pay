import { CreateCoupleForm } from '@/features/couple/components/create-couple-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { getCurrentCouple } from '@/features/couple/actions';

export default async function CreateCouplePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // If the user already belongs to a couple, send them to the couple status page.
  const couple = await getCurrentCouple();
  if (couple) {
    redirect('/couple');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <CreateCoupleForm />
    </div>
  );
}
