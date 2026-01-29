import { ExpenseCard } from './expense-card';
import type { ExpenseWithUser } from '../types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

interface ExpenseListProps {
  expenses: ExpenseWithUser[];
  currentUserId: string;
}

export function ExpenseList({ expenses, currentUserId }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay gastos registrados</h3>
        <p className="text-muted-foreground mb-4">
          Comienza agregando tu primer gasto compartido
        </p>
      </div>
    );
  }

  // Group expenses by date
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = new Date(expense.expenseDate).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, ExpenseWithUser[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedExpenses).map(([date, dateExpenses]) => (
        <div key={date} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-2">
            {date}
          </h3>
          <div className="space-y-2">
            {dateExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
