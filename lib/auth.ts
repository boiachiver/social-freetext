import {
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

/**
 * Sign out the current user
 */
export async function signOut() {
  await firebaseSignOut(auth);
}

/**
 * Send a password reset email
 */
export async function resetPassword(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error("Please enter your email address.");
  }

  await sendPasswordResetEmail(auth, cleanEmail);
}
