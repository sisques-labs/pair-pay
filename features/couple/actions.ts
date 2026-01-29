'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUser } from '@/features/auth/actions';
import { generateInvitationCode } from '@/lib/utils/format';
import type { CreateCoupleResponse, JoinCoupleResponse } from './types';

function getUserFullName(user: unknown): string | undefined {
  const maybeMeta = (user as { user_metadata?: unknown } | null)?.user_metadata as
    | { full_name?: unknown; fullName?: unknown }
    | undefined;

  const fullName =
    (typeof maybeMeta?.full_name === 'string' && maybeMeta.full_name.trim()) ||
    (typeof maybeMeta?.fullName === 'string' && maybeMeta.fullName.trim()) ||
    undefined;

  return fullName;
}

/**
 * Create a new couple
 */
export async function createCouple(): Promise<CreateCoupleResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    if (!user.email) {
      return { success: false, error: 'Email no disponible para el usuario actual' };
    }

    // Check if user already has a couple
    // Ensure profile exists (Supabase trigger might not be configured yet).
    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        ...(getUserFullName(user) ? { fullName: getUserFullName(user) } : {}),
      },
      create: {
        id: user.id,
        email: user.email,
        ...(getUserFullName(user) ? { fullName: getUserFullName(user) } : {}),
      },
      include: { couple: true },
    });

    if (profile?.coupleId) {
      return { success: false, error: 'Ya perteneces a una pareja' };
    }

    // Generate unique invitation code
    let invitationCode = generateInvitationCode();
    let isUnique = false;

    while (!isUnique) {
      const existing = await prisma.couple.findUnique({
        where: { invitationCode },
      });
      if (!existing) {
        isUnique = true;
      } else {
        invitationCode = generateInvitationCode();
      }
    }

    const couple = await prisma.$transaction(async (tx) => {
      // Create couple
      const created = await tx.couple.create({
        data: {
          invitationCode,
          createdBy: user.id,
        },
      });

      // Update user profile with couple ID
      await tx.profile.update({
        where: { id: user.id },
        data: { coupleId: created.id },
      });

      return created;
    });

    revalidatePath('/couple');
    return { success: true, couple };
  } catch (error) {
    console.error('Error creating couple:', error);
    return { success: false, error: 'Error al crear la pareja' };
  }
}

/**
 * Join an existing couple using invitation code
 */
export async function joinCouple(invitationCode: string): Promise<JoinCoupleResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    if (!user.email) {
      return { success: false, error: 'Email no disponible para el usuario actual' };
    }

    // Check if user already has a couple
    // Ensure profile exists (Supabase trigger might not be configured yet).
    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        ...(getUserFullName(user) ? { fullName: getUserFullName(user) } : {}),
      },
      create: {
        id: user.id,
        email: user.email,
        ...(getUserFullName(user) ? { fullName: getUserFullName(user) } : {}),
      },
      include: { couple: true },
    });

    if (profile?.coupleId) {
      return { success: false, error: 'Ya perteneces a una pareja' };
    }

    // Find couple by invitation code
    const couple = await prisma.couple.findUnique({
      where: { invitationCode: invitationCode.toUpperCase() },
      include: {
        profiles: true,
      },
    });

    if (!couple) {
      return { success: false, error: 'Código de invitación inválido' };
    }

    // Check if couple already has 2 members
    if (couple.profiles.length >= 2) {
      return { success: false, error: 'Esta pareja ya tiene 2 miembros' };
    }

    // Join couple
    await prisma.profile.update({
      where: { id: user.id },
      data: { coupleId: couple.id },
    });

    revalidatePath('/couple');
    redirect('/expenses');
  } catch (error) {
    console.error('Error joining couple:', error);
    return { success: false, error: 'Error al unirse a la pareja' };
  }
}

/**
 * Get current user's couple with members
 */
export async function getCurrentCouple() {
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
          },
        },
      },
    });

    return profile?.couple ?? null;
  } catch (error) {
    console.error('Error getting couple:', error);
    return null;
  }
}
