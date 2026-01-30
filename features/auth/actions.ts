'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from './types';

/**
 * Login user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  revalidatePath('/', 'layout');
  redirect('/expenses');
}

/**
 * Register new user
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        full_name: credentials.fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  revalidatePath('/', 'layout');
  redirect('/couple/create');
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { success: true };
}
