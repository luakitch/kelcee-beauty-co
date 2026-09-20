/**
 * Coming-soon gate — no env vars required.
 *
 * Cloudflare serves non-production branches on preview URLs (prefix before the
 * project name). Those always get the full site. Production hostnames get coming soon.
 *
 * Workflow:
 *   staging/preview branch → preview.kelceehairco.com → full site
 *   main branch            → kelceehairco.com → coming soon
 *
 * To launch: remove SiteAccessGate from SiteChrome (or delete this file).
 */
const PRODUCTION_HOSTS = new Set([
  "kelceehairco.com",
  "www.kelceehairco.com",
  "kelcee-beauty-co.kitchel301.workers.dev",
  "kelcee-beauty-co.pages.dev",
]);

export function isProductionHost(hostname: string): boolean {
  return PRODUCTION_HOSTS.has(hostname.toLowerCase());
}

/** Cloudflare preview deploys use a prefix before the project name. */
export function isPreviewDeploymentHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (host === "localhost" || host === "127.0.0.1") {
    return true;
  }

  if (
    host === "preview.kelceehairco.com" ||
    host === "kelcee-beauty-co-preview.kitchel301.workers.dev"
  ) {
    return true;
  }

  // e.g. preview-kelcee-beauty-co.kitchel301.workers.dev
  if (/^.+-kelcee-beauty-co\.[^.]+\.workers\.dev$/.test(host)) {
    return true;
  }

  // e.g. abc123.kelcee-beauty-co.pages.dev
  if (
    host.endsWith(".kelcee-beauty-co.pages.dev") &&
    host !== "kelcee-beauty-co.pages.dev"
  ) {
    return true;
  }

  return false;
}

export function shouldShowUnderConstruction(hostname?: string): boolean {
  const host =
    hostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");

  if (!host) {
    return false;
  }

  if (isPreviewDeploymentHost(host)) {
    return false;
  }

  return isProductionHost(host);
}
