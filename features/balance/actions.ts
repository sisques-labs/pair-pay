'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUser } from '@/features/auth/actions';
import { getCoupleBalance } from './queries';
import type { CreateSettlementResponse } from './types';

/**
 * Create a settlement to pay off the balance
 */
export async function createSettlement(notes?: string): Promise<CreateSettlementResponse> {
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

    // Get current balance
    const balance = await getCoupleBalance();
    if (!balance) {
      return { success: false, error: 'No se pudo calcular el balance' };
    }

    if (balance.netBalance === 0) {
      return { success: false, error: 'No hay balance pendiente' };
    }

    // Create settlement
    const settlement = await prisma.settlement.create({
      data: {
        coupleId: profile.coupleId,
        fromUser: balance.owedBy,
        toUser: balance.owedTo,
        amount: balance.netBalance,
        notes,
      },
    });

    revalidatePath('/balance');
    revalidatePath('/expenses');

    return {
      success: true,
      settlement: {
        ...settlement,
        amount: settlement.amount.toNumber(),
      },
    };
  } catch (error) {
    console.error('Error creating settlement:', error);
    return { success: false, error: 'Error al crear la liquidación' };
  }
}
