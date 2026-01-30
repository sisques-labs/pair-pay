'use server';

import { prisma } from '@/lib/prisma/client';
import { getCurrentUser } from '@/features/auth/actions';
import type { CoupleBalance, SettlementWithUsers } from './types';

/**
 * Calculate the balance for the current user's couple
 */
export async function getCoupleBalance(): Promise<CoupleBalance | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        couple: {
          include: {
            profiles: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
            expenses: true,
            settlements: true,
          },
        },
      },
    });

    if (!profile?.couple || profile.couple.profiles.length !== 2) {
      return null;
    }

    const [user1, user2] = profile.couple.profiles;
    const expenses = profile.couple.expenses;
    const settlements = profile.couple.settlements;

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum: number, expense) => sum + expense.amount.toNumber(),
      0
    );
    const halfExpenses = totalExpenses / 2;

    // Calculate how much each user paid
    const user1Paid = expenses
      .filter(e => e.paidBy === user1.id)
      .reduce((sum: number, e) => sum + e.amount.toNumber(), 0);

    const user2Paid = expenses
      .filter(e => e.paidBy === user2.id)
      .reduce((sum: number, e) => sum + e.amount.toNumber(), 0);

    // Calculate settlements offset
    const user1SettlementsPaid = settlements
      .filter(s => s.fromUser === user1.id)
      .reduce((sum: number, s) => sum + s.amount.toNumber(), 0);

    const user2SettlementsPaid = settlements
      .filter(s => s.fromUser === user2.id)
      .reduce((sum: number, s) => sum + s.amount.toNumber(), 0);

    // Calculate net balance (positive = user1 owes user2, negative = user2 owes user1)
    const user1Balance = user1Paid - halfExpenses - user1SettlementsPaid + user2SettlementsPaid;
    const user2Balance = user2Paid - halfExpenses - user2SettlementsPaid + user1SettlementsPaid;

    // Determine who owes whom
    const netBalance = Math.abs(user1Balance);
    const owedBy = user1Balance < 0 ? user1.id : user2.id;
    const owedTo = user1Balance < 0 ? user2.id : user1.id;

    return {
      user1: {
        userId: user1.id,
        email: user1.email,
        fullName: user1.fullName,
        totalPaid: user1Paid,
        totalOwed: halfExpenses,
        balance: user1Balance,
      },
      user2: {
        userId: user2.id,
        email: user2.email,
        fullName: user2.fullName,
        totalPaid: user2Paid,
        totalOwed: halfExpenses,
        balance: user2Balance,
      },
      netBalance,
      owedBy,
      owedTo,
    };
  } catch (error) {
    console.error('Error calculating balance:', error);
    return null;
  }
}

/**
 * Get all settlements for the current user's couple
 */
export async function getSettlements(): Promise<SettlementWithUsers[]> {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { coupleId: true },
    });

    if (!profile?.coupleId) return [];

    const settlements = await prisma.settlement.findMany({
      where: { coupleId: profile.coupleId },
      include: {
        fromUserProfile: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        toUserProfile: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: { settledAt: 'desc' },
    });

    return settlements.map(settlement => ({
      ...settlement,
      amount: settlement.amount.toNumber(),
    })) as SettlementWithUsers[];
  } catch (error) {
    console.error('Error fetching settlements:', error);
    return [];
  }
}
