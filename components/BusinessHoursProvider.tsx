"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useBusinessHours } from "@/components/useBusinessHours";
import type { HoursScheduleEntry } from "@/lib/hours";

type BusinessHoursContextValue = {
  schedule: HoursScheduleEntry[];
  loaded: boolean;
};

const BusinessHoursContext = createContext<BusinessHoursContextValue | null>(
  null,
);

export function BusinessHoursProvider({ children }: { children: ReactNode }) {
  const value = useBusinessHours();
  return (
    <BusinessHoursContext.Provider value={value}>
      {children}
    </BusinessHoursContext.Provider>
  );
}

export function useBusinessHoursContext(): BusinessHoursContextValue {
  const context = useContext(BusinessHoursContext);
  if (!context) {
    throw new Error(
      "useBusinessHoursContext must be used within BusinessHoursProvider",
    );
  }
  return context;
}
