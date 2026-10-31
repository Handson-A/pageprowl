type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "key",
  "authorization",
  "cookie",
  "apikey",
  "service_role",
  "access_token",
  "refresh_token",
]);

/**
 * Redacts sensitive fields from objects before logging.
 */
function sanitize(obj: unknown, depth = 0): unknown {
  if (depth > 5) return "[Truncated]";
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Redact Bearer tokens
    if (obj.startsWith("Bearer ") || obj.length > 100) {
      return "[Redacted String]";
    }
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item, depth + 1));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      sanitized[k] = "[Redacted]";
    } else {
      sanitized[k] = sanitize(v, depth + 1);
    }
  }
  return sanitized;
}

function formatLog(level: LogLevel, payload: LogPayload): string {
  const timestamp = new Date().toISOString();
  const entry: Record<string, unknown> = {
    timestamp,
    level: level.toUpperCase(),
    message: payload.message,
  };

  if (payload.context) {
    entry.context = sanitize(payload.context);
  }

  if (payload.error) {
    if (payload.error instanceof Error) {
      entry.error = {
        name: payload.error.name,
        message: payload.error.message,
      };
    } else {
      entry.error = String(payload.error);
    }
  }

  return JSON.stringify(entry);
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatLog("debug", { message, context }));
    }
  },

  info(message: string, context?: Record<string, unknown>) {
    console.info(formatLog("info", { message, context }));
  },

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(formatLog("warn", { message, context }));
  },

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    console.error(formatLog("error", { message, error, context }));
  },
};
