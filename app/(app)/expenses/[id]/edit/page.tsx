import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { getCurrentCouple } from '@/features/couple/actions';
import { getExpenseById } from '@/features/expenses/queries';
import { ExpenseForm } from '@/features/expenses/components/expense-form';

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const couple = await getCurrentCouple();
  if (!couple || couple.profiles.length < 2) {
    redirect('/couple');
  }

  const expense = await getExpenseById(id);
  if (!expense) {
    notFound();
  }

  // Only allow creator to edit
  if (expense.createdBy !== user.id) {
    redirect(`/expenses/${id}`);
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ExpenseForm expense={expense} members={couple.profiles} currentUserId={user.id} />
    </div>
  );
}
