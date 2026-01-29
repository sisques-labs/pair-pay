'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUser } from '@/features/auth/actions';
import type {
  CreateExpenseInput,
  CreateExpenseResponse,
  UpdateExpenseInput,
  UpdateExpenseResponse,
  DeleteExpenseResponse,
} from './types';

/**
 * Create a new expense
 */
export async function createExpense(input: CreateExpenseInput): Promise<CreateExpenseResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { coupleId: true },
    });

    if (!profile?.coupleId) {
      return { success: false, error: 'No perteneces a una pareja' };
    }

    const expense = await prisma.expense.create({
      data: {
        coupleId: profile.coupleId,
        description: input.description,
        amount: input.amount,
        category: input.category,
        paidBy: input.paidBy,
        createdBy: user.id,
        expenseDate: input.expenseDate || new Date(),
        notes: input.notes,
      },
    });

    revalidatePath('/expenses');
    return {
      success: true,
      expense: {
        ...expense,
        amount: expense.amount.toNumber(),
      },
    };
  } catch (error) {
    console.error('Error creating expense:', error);
    return { success: false, error: 'Error al crear el gasto' };
  }
}

/**
 * Update an existing expense
 */
export async function updateExpense(
  id: string,
  input: UpdateExpenseInput
): Promise<UpdateExpenseResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    // Check if user owns this expense
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      return { success: false, error: 'Gasto no encontrado' };
    }

    if (existingExpense.createdBy !== user.id) {
      return { success: false, error: 'No tienes permiso para editar este gasto' };
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(input.description && { description: input.description }),
        ...(input.amount && { amount: input.amount }),
        ...(input.category && { category: input.category }),
        ...(input.paidBy && { paidBy: input.paidBy }),
        ...(input.expenseDate && { expenseDate: input.expenseDate }),
        ...(input.notes !== undefined && { notes: input.notes }),
      },
    });

    revalidatePath('/expenses');
    revalidatePath(`/expenses/${id}`);
    return {
      success: true,
      expense: {
        ...expense,
        amount: expense.amount.toNumber(),
      },
    };
  } catch (error) {
    console.error('Error updating expense:', error);
    return { success: false, error: 'Error al actualizar el gasto' };
  }
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: string): Promise<DeleteExpenseResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    // Check if user owns this expense
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      return { success: false, error: 'Gasto no encontrado' };
    }

    if (existingExpense.createdBy !== user.id) {
      return { success: false, error: 'No tienes permiso para eliminar este gasto' };
    }

    await prisma.expense.delete({
      where: { id },
    });

    revalidatePath('/expenses');
    redirect('/expenses');
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, error: 'Error al eliminar el gasto' };
  }
}
