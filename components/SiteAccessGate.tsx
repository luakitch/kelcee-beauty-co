"use client";

import { useEffect, useState } from "react";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";
import { shouldShowUnderConstruction } from "@/lib/site-access";

type SiteAccessGateProps = {
  children: React.ReactNode;
};

export function SiteAccessGate({ children }: SiteAccessGateProps) {
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setBlocked(shouldShowUnderConstruction());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-pulse rounded-full bg-blush-200" />
      </div>
    );
  }

  if (blocked) {
    return <UnderConstructionPage />;
  }

  return <>{children}</>;
}
