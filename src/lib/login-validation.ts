/** Login is email-only — phone numbers are never accepted as an identifier. */
export function isValidLoginEmail(email: string): boolean {
  const value = email.trim();
  if (!value || value.length > 256) return false;
  if (!value.includes("@")) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Normalize the email for backend lookup (trim only). */
export function normalizeLoginEmail(email: string): string {
  return email.trim();
}