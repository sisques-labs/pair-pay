'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCategoryEmoji, getCategoryColor, getCategoryName } from '@/lib/constants/categories';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import type { ExpenseWithUser } from '../types';
import { cn } from '@/lib/utils/cn';

interface ExpenseCardProps {
  expense: ExpenseWithUser;
  currentUserId: string;
}

export function ExpenseCard({ expense, currentUserId }: ExpenseCardProps) {
  const categoryEmoji = getCategoryEmoji(expense.category);
  const categoryColor = getCategoryColor(expense.category);
  const categoryName = getCategoryName(expense.category);

  const isPaidByCurrentUser = expense.paidBy === currentUserId;
  const paidByName = expense.paidByUser.fullName || expense.paidByUser.email.split('@')[0];
  const splitAmount = expense.amount / 2;

  return (
    <Link href={`/expenses/${expense.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl flex-shrink-0"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              {categoryEmoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-base truncate">{expense.description}</h3>
                <span className="font-bold text-lg whitespace-nowrap">
                  {formatCurrency(expense.amount)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                <Badge variant="secondary" className="text-xs">
                  {categoryName}
                </Badge>
                <span>•</span>
                <span>{formatDate(expense.expenseDate, 'relative')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Pagó: <span className="font-medium text-foreground">{paidByName}</span>
                </span>
                <div className={cn(
                  "text-sm font-medium",
                  isPaidByCurrentUser ? "text-primary" : "text-muted-foreground"
                )}>
                  {isPaidByCurrentUser ? (
                    <>Te deben: {formatCurrency(splitAmount)}</>
                  ) : (
                    <>Debes: {formatCurrency(splitAmount)}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
