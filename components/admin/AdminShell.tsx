"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { getSession, signOut } from "@/lib/supabase/auth";

type AdminShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AdminShell({ title, children }: AdminShellProps) {
  const router = useRouter();
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  useEffect(() => {
    getSession().then((session) => {
      setSignedInEmail(session?.user.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    await signOut();
    router.replace("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blush-50 via-cream to-cream">
      <header className="border-b border-blush-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <BrandLogo size="sm" showName={false} />
            <div>
              <p className="font-display text-lg font-semibold text-charcoal">
                {title}
              </p>
              <p className="text-xs text-charcoal/50">Kelcee Beauty Co.</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {signedInEmail && (
              <p className="hidden text-xs text-charcoal/60 md:block">
                Signed in as{" "}
                <span className="font-medium text-charcoal">{signedInEmail}</span>
              </p>
            )}
            <Link
              href="/admin/change-password"
              className="hidden rounded-full border border-blush-300 px-4 py-2 text-xs font-medium text-charcoal transition hover:bg-blush-50 sm:inline-flex"
            >
              Change password
            </Link>
            <Link
              href="/gallery"
              className="hidden rounded-full border border-blush-300 px-4 py-2 text-xs font-medium text-charcoal transition hover:bg-blush-50 sm:inline-flex"
            >
              View public gallery
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-charcoal px-4 py-2 text-xs font-semibold text-white transition hover:bg-charcoal/90"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
