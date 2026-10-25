"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type AdminStickyTabsContextValue = {
  tabsNavRef: RefObject<HTMLElement | null>;
  stickyTabsHeight: number;
};

const AdminStickyTabsContext = createContext<AdminStickyTabsContextValue>({
  tabsNavRef: { current: null },
  stickyTabsHeight: 0,
});

export function AdminStickyTabsProvider({ children }: { children: ReactNode }) {
  const tabsNavRef = useRef<HTMLElement | null>(null);
  const [stickyTabsHeight, setStickyTabsHeight] = useState(0);

  useLayoutEffect(() => {
    const node = tabsNavRef.current;
    if (!node) {
      return;
    }

    const update = () => setStickyTabsHeight(node.offsetHeight);

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <AdminStickyTabsContext.Provider value={{ tabsNavRef, stickyTabsHeight }}>
      {children}
    </AdminStickyTabsContext.Provider>
  );
}

export function useAdminStickyTabsHeight() {
  return useContext(AdminStickyTabsContext).stickyTabsHeight;
}

export function useAdminTabsNavRef() {
  return useContext(AdminStickyTabsContext).tabsNavRef;
}
