'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const RegisterSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  dateOfBirth: z.string().refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }, { message: "You must be 18+ to register." }),
});

export async function register(prevState: any, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    // Return the first error message
    const firstError = validatedFields.error.errors[0]?.message || 'Invalid fields.';
    return {
      error: firstError,
    };
  }

  const { firstName, lastName, email, password, dateOfBirth } = validatedFields.data;
  const fullName = `${firstName} ${lastName}`.trim();

  // Check if user exists
  const existingUserResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const existingUser = existingUserResult[0];

  if (existingUser) {
    return {
      error: 'Email already registered.',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      email,
      password: hashedPassword,
      full_name: fullName,
      name: fullName, // Fallback
      username: email.split('@')[0], // Simple username generation
      role: 'user',
      date_of_birth: new Date(dateOfBirth),
    });
  } catch (error) {
    console.error('Registration error:', error);
    return {
      error: 'Database error: Failed to create user.',
    };
  }

  // Auto sign in after registration not supported directly in server action easily without redirect, 
  // users usually redirect to login or dashboard.
  // For now, let's redirect to login with success message? Or allow frontend to handle redirect.
  // Since useActionState expects a return value, we return success.
  
  // Note: We can't call signIn() here easily if it redirects. 
  // Let's return success and let component redirect.
  // actually signIn works in server actions.
  
  try {
     // await signIn('credentials', { email, password, redirectTo: '/dashboard' });
     // For now, let's just return success so user can login manually or auto-login logic can be added.
  } catch (err) {
      // ignore redirect error if signIn throws
      if ((err as Error).message.includes('NEXT_REDIRECT')) throw err;
  }
  
  // Return undefined or success object? usage in component decides.
  // The component expects { error?: string } or similar.
  // Returning nothing implies success?
  
  // To auto-login:
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
     if ((error as any).message === 'NEXT_REDIRECT') {
        throw error;
     }
     throw error;
  }
}

export async function handleSignOut() {
    await signOut();
}
