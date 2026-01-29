import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getCurrentUser } from '@/features/auth/actions';
import { getCurrentCouple } from '@/features/couple/actions';
import { getExpenses } from '@/features/expenses/queries';
import { ExpenseList } from '@/features/expenses/components/expense-list';

export default async function ExpensesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const couple = await getCurrentCouple();
  if (!couple || couple.profiles.length < 2) {
    redirect('/couple');
  }

  const expenses = await getExpenses();

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gastos</h1>
          <p className="text-muted-foreground">Gestiona tus gastos compartidos</p>
        </div>
        <Link href="/expenses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Gasto
          </Button>
        </Link>
      </div>

      <ExpenseList expenses={expenses} currentUserId={user.id} />
    </div>
  );
}
