import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Checks if a string matches standard bcrypt hash format ($2a$, $2b$, $2y$).
 */
export const isBcryptHash = (str) => {
  if (typeof str !== "string") return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str.trim());
};

/**
 * Hashes a plaintext passcode with bcrypt (10 salt rounds).
 */
export const hashPasscode = async (plainPasscode) => {
  if (!plainPasscode || typeof plainPasscode !== "string") {
    throw new Error("Invalid passcode payload for hashing");
  }
  return await bcrypt.hash(plainPasscode.trim(), 10);
};

/**
 * Verifies a supplied passcode against a stored hash or legacy plaintext string.
 * Supports constant-time string comparison for plaintext and optional auto-migration callback.
 */
export const verifyPasscode = async (suppliedPasscode, storedPasscodeOrHash, onMigratePlaintext = null) => {
  if (!suppliedPasscode || !storedPasscodeOrHash) return false;
  const supplied = String(suppliedPasscode).trim();
  const stored = String(storedPasscodeOrHash).trim();

  // 1. If stored value is a bcrypt hash
  if (isBcryptHash(stored)) {
    return await bcrypt.compare(supplied, stored);
  }

  // 2. Legacy Plaintext comparison (timing-safe)
  try {
    const suppliedBuf = Buffer.from(supplied);
    const storedBuf = Buffer.from(stored);
    const match = suppliedBuf.length === storedBuf.length && crypto.timingSafeEqual(suppliedBuf, storedBuf);
    if (match) {
      if (typeof onMigratePlaintext === "function") {
        onMigratePlaintext(supplied);
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Recursively strips keys starting with '$' or containing '.' to prevent MongoDB operator injection.
 */
export const sanitizeNoSql = (data) => {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) {
    return data.map(sanitizeNoSql);
  }
  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }
    clean[key] = sanitizeNoSql(value);
  }
  return clean;
};

/**
 * Strips script & HTML tags and truncates string length.
 */
export const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim()
    .substring(0, maxLength);
};

/**
 * Validates request origin against allowed list and safe domain patterns.
 */
export const isOriginAllowed = (origin, customAllowedOrigins = []) => {
  if (!origin) return true; // Allow non-browser requests / curl / health checks
  if (customAllowedOrigins.includes(origin)) return true;
  // Localhost / 127.0.0.1 with any port
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  // Production portfolio domain
  if (/^https:\/\/([a-zA-Z0-9-]+\.)?swarajvecha\.in$/.test(origin)) return true;
  // Vercel deployment & preview URLs
  if (/^https:\/\/([a-zA-Z0-9-]+\.)?vercel\.app$/.test(origin)) return true;
  return false;
};
