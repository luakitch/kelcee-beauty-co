import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { navLinks, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-blush-200/60 bg-blush-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-4">
              <BrandLogo size="md" showName={false} />
            </div>
            <p className="text-sm leading-relaxed text-charcoal/70">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-display text-base font-semibold text-charcoal">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal/70 transition hover:text-blush-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-display text-base font-semibold text-charcoal">
              Visit Us
            </h3>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li>{siteConfig.location}</li>
              <li>{siteConfig.hours.weekdays}</li>
              <li>{siteConfig.hours.saturday}</li>
              <li>{siteConfig.hours.sunday}</li>
            </ul>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-blush-600 transition hover:text-blush-700"
            >
              Follow on Instagram →
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-blush-200/60 pt-6 text-center text-xs text-charcoal/50">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
