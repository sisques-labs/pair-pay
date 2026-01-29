import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { getCurrentCouple } from '@/features/couple/actions';
import { ExpenseForm } from '@/features/expenses/components/expense-form';

export default async function NewExpensePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const couple = await getCurrentCouple();
  if (!couple || couple.profiles.length < 2) {
    redirect('/couple');
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ExpenseForm members={couple.profiles} currentUserId={user.id} />
    </div>
  );
}
