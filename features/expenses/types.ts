// Types for Expenses feature

import type { ExpenseCategoryId } from '@/lib/constants/categories';

export type Expense = {
  id: string;
  coupleId: string;
  description: string;
  amount: number;
  category: ExpenseCategoryId;
  paidBy: string;
  createdBy: string;
  expenseDate: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseWithUser = Expense & {
  paidByUser: {
    id: string;
    email: string;
    fullName: string | null;
  };
  createdByUser: {
    id: string;
    email: string;
    fullName: string | null;
  };
};

export type CreateExpenseInput = {
  description: string;
  amount: number;
  category: ExpenseCategoryId;
  paidBy: string;
  expenseDate?: Date;
  notes?: string;
};

export type UpdateExpenseInput = Partial<CreateExpenseInput>;

export type CreateExpenseResponse = {
  success: boolean;
  expense?: Expense;
  error?: string;
};

export type UpdateExpenseResponse = {
  success: boolean;
  expense?: Expense;
  error?: string;
};

export type DeleteExpenseResponse = {
  success: boolean;
  error?: string;
};
