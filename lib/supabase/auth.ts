import type { Session, User } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/supabase/admin-emails";
import { getAdminAcceptInviteUrl } from "@/lib/site-url";
import { getSupabaseClient } from "@/lib/supabase/client";

export function isAdminUser(user: User | null | undefined): boolean {
  return isAdminEmail(user?.email);
}

export async function getSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  return { error: null };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

function getAuthHashType(): string | null {
  if (typeof window === "undefined") return null;

  const match = window.location.hash.match(/type=([^&]+)/);
  return match?.[1] ?? null;
}

export function isInviteOrRecoveryLink(): boolean {
  const type = getAuthHashType();
  return type === "invite" || type === "recovery" || type === "signup";
}

export function isRecoveryLink(): boolean {
  return getAuthHashType() === "recovery";
}

export function clearAuthHashFromUrl(): void {
  if (typeof window === "undefined") return;
  window.history.replaceState({}, "", window.location.pathname);
}

export async function requestPasswordReset(
  email: string,
): Promise<{ error: string | null; sent: boolean }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: "Supabase is not configured.", sent: false };
  }

  const trimmed = email.trim().toLowerCase();
  if (!isAdminEmail(trimmed)) {
    return {
      error: "That email is not authorized for admin access.",
      sent: false,
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo: getAdminAcceptInviteUrl(),
  });

  if (error) {
    return { error: error.message, sent: false };
  }

  return { error: null, sent: true };
}

export async function setPassword(
  password: string,
): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  return { error: null };
}

export function onAuthStateChange(
  callback: (session: Session | null) => void,
): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) {
    callback(null);
    return () => {};
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => subscription.unsubscribe();
}
