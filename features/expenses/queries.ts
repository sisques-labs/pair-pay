'use server';

import { prisma } from '@/lib/prisma/client';
import { getCurrentUser } from '@/features/auth/actions';
import type { ExpenseWithUser } from './types';

/**
 * Get all expenses for the current user's couple
 */
export async function getExpenses(): Promise<ExpenseWithUser[]> {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { coupleId: true },
    });

    if (!profile?.coupleId) return [];

    const expenses = await prisma.expense.findMany({
      where: { coupleId: profile.coupleId },
      include: {
        paidByUser: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: { expenseDate: 'desc' },
    });

    return expenses.map(expense => ({
      ...expense,
      amount: expense.amount.toNumber(),
    })) as ExpenseWithUser[];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

/**
 * Get a single expense by ID
 */
export async function getExpenseById(id: string): Promise<ExpenseWithUser | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { coupleId: true },
    });

    if (!profile?.coupleId) return null;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        coupleId: profile.coupleId,
      },
      include: {
        paidByUser: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!expense) return null;

    return {
      ...expense,
      amount: expense.amount.toNumber(),
    } as ExpenseWithUser;
  } catch (error) {
    console.error('Error fetching expense:', error);
    return null;
  }
}
