const DEFAULT_ADMIN_EMAILS = [
  "kitchelsoftware@gmail.com",
  "kelcee05@icloud.com",
  "mkenzie2000@hotmail.com",
] as const;

function parseEmailList(value: string): string[] {
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminEmails(): string[] {
  const fromList = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (fromList) {
    return parseEmailList(fromList);
  }

  const legacy = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  if (legacy) {
    return [legacy];
  }

  return [...DEFAULT_ADMIN_EMAILS];
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
