"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BowAccent } from "@/components/BowAccent";
import { navLinks, siteConfig } from "@/lib/site-config";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blush-200/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <BowAccent size={28} className="text-blush-400 transition group-hover:text-blush-500" />
          <span className="font-display text-xl font-semibold tracking-wide text-charcoal sm:text-2xl">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-blush-600 ${
                pathname === link.href ? "text-blush-600" : "text-charcoal/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-charcoal md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-blush-200/60 bg-cream px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-medium transition hover:bg-blush-100 ${
                    pathname === link.href ? "text-blush-600" : "text-charcoal/80"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
