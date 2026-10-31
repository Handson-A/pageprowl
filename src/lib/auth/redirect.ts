/**
 * Validates and sanitizes redirect destinations to prevent open-redirect vulnerabilities.
 * Ensures destinations are safe, internal relative paths without external host escapes.
 */
export function getSafeRedirectUrl(
  target: string | null | undefined,
  fallback = "/studio"
): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();
  if (!trimmed) {
    return fallback;
  }

  // Must begin with a single '/' and not '//' or '/\'
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }

  // Reject backslashes anywhere in path
  if (trimmed.includes("\\")) {
    return fallback;
  }

  // Reject carriage returns, line feeds, tabs, or null characters
  if (/[\r\n\t\0]/.test(trimmed)) {
    return fallback;
  }

  try {
    // Parse against a dummy trusted base to check host/protocol
    const url = new URL(trimmed, "http://localhost");

    // Origin must stay localhost (prevents hostname injection)
    if (url.origin !== "http://localhost") {
      return fallback;
    }

    const pathname = url.pathname;

    // Prevent redirect loops back to auth pages
    if (pathname === "/login" || pathname === "/signup") {
      return fallback;
    }

    // Must be an internal path (starting with /)
    if (!pathname.startsWith("/")) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
