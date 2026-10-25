"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminCatalogServicesProvider } from "@/components/admin/AdminCatalogServicesContext";
import { AdminGalleryManager } from "@/components/admin/AdminGalleryManager";
import { AdminHoursEditor } from "@/components/admin/AdminHoursEditor";
import { AdminPromotionsEditor } from "@/components/admin/AdminPromotionsEditor";
import { AdminServicesEditor } from "@/components/admin/AdminServicesEditor";

const TABS = [
  { id: "hours", label: "Hours" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "promos", label: "Promos" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isTabId(value: string): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

function tabFromHash(): TabId {
  if (typeof window === "undefined") {
    return "hours";
  }
  const hash = window.location.hash.replace("#", "");
  return isTabId(hash) ? hash : "hours";
}

export function AdminDashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("hours");

  useEffect(() => {
    setActiveTab(tabFromHash());

    function onHashChange() {
      setActiveTab(tabFromHash());
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const selectTab = useCallback((id: TabId) => {
    setActiveTab(id);
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  return (
    <AdminCatalogServicesProvider>
    <div className="space-y-8">
      <nav
        aria-label="Admin sections"
        className="grid grid-cols-2 gap-1.5 rounded-2xl border border-blush-200 bg-white/80 p-1.5 shadow-sm sm:grid-cols-4 sm:gap-2 sm:p-2 lg:flex lg:flex-wrap"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:px-5 sm:text-sm ${
                isActive
                  ? "bg-blush-500 text-white shadow-sm"
                  : "text-charcoal/70 hover:bg-blush-50 hover:text-charcoal"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div>
        <div className={activeTab === "hours" ? undefined : "hidden"}>
          <AdminHoursEditor />
        </div>
        <div className={activeTab === "services" ? undefined : "hidden"}>
          <AdminServicesEditor />
        </div>
        <div className={activeTab === "gallery" ? undefined : "hidden"}>
          <AdminGalleryManager />
        </div>
        <div className={activeTab === "promos" ? undefined : "hidden"}>
          <AdminPromotionsEditor isActive={activeTab === "promos"} />
        </div>
      </div>
    </div>
    </AdminCatalogServicesProvider>
  );
}
