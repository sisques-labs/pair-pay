import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { getCurrentUser } from '@/features/auth/actions';
import { getExpenseById } from '@/features/expenses/queries';
import { getCategoryEmoji, getCategoryName, getCategoryColor } from '@/lib/constants/categories';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { DeleteExpenseButton } from '@/features/expenses/components/delete-expense-button';

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const expense = await getExpenseById(id);
  if (!expense) {
    notFound();
  }

  const categoryEmoji = getCategoryEmoji(expense.category);
  const categoryName = getCategoryName(expense.category);
  const categoryColor = getCategoryColor(expense.category);
  const splitAmount = expense.amount / 2;
  const isCreator = expense.createdBy === user.id;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/expenses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a gastos
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-4xl"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                {categoryEmoji}
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">{expense.description}</CardTitle>
                <Badge variant="secondary">{categoryName}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(expense.amount)}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Pagado por</div>
              <div className="font-medium">
                {expense.paidByUser.fullName || expense.paidByUser.email}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Fecha</div>
              <div className="font-medium">{formatDate(expense.expenseDate, 'long')}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">División (50/50)</div>
              <div className="font-medium">{formatCurrency(splitAmount)} por persona</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Creado por</div>
              <div className="font-medium">
                {expense.createdByUser.fullName || expense.createdByUser.email}
              </div>
            </div>
          </div>

          {expense.notes && (
            <>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-2">Notas</div>
                <p className="text-sm">{expense.notes}</p>
              </div>
            </>
          )}

          {isCreator && (
            <>
              <Separator />
              <div className="flex gap-2">
                <Link href={`/expenses/${expense.id}/edit`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <DeleteExpenseButton expenseId={expense.id} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
