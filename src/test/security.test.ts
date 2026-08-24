// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import {
  isBcryptHash,
  hashPasscode,
  verifyPasscode,
  sanitizeNoSql,
  sanitizeString,
  isOriginAllowed,
} from "../../server/security.js";

describe("Security: Password & Passcode Hashing", () => {
  it("correctly identifies bcrypt hash strings", async () => {
    const validHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
    const plainText = "myAdminPassword123";

    expect(isBcryptHash(validHash)).toBe(true);
    expect(isBcryptHash(plainText)).toBe(false);
    expect(isBcryptHash(null as unknown as string)).toBe(false);
  });

  it("hashes plaintext passcodes with bcrypt salt", async () => {
    const plain = "superSecretAdminPass2026!";
    const hashed = await hashPasscode(plain);

    expect(isBcryptHash(hashed)).toBe(true);
    expect(hashed).not.toBe(plain);
  });

  it("verifies matching passcode against bcrypt hash", async () => {
    const plain = "testSecretPass";
    const hashed = await hashPasscode(plain);

    const isMatch = await verifyPasscode("testSecretPass", hashed);
    const isWrong = await verifyPasscode("wrongPasscode", hashed);

    expect(isMatch).toBe(true);
    expect(isWrong).toBe(false);
  });

  it("supports legacy plaintext verification with timing-safe comparison and triggers migration", async () => {
    const plain = "legacyAdminPasscode";
    const onMigrate = vi.fn();

    const isMatch = await verifyPasscode("legacyAdminPasscode", plain, onMigrate);
    const isWrong = await verifyPasscode("badPasscode", plain, onMigrate);

    expect(isMatch).toBe(true);
    expect(onMigrate).toHaveBeenCalledWith("legacyAdminPasscode");
    expect(isWrong).toBe(false);
  });

  it("rejects empty or missing passcode inputs gracefully", async () => {
    expect(await verifyPasscode("", "somePass")).toBe(false);
    expect(await verifyPasscode("somePass", "")).toBe(false);
    expect(await verifyPasscode(null as unknown as string, "somePass")).toBe(false);
  });
});

describe("Security: NoSQL Injection Prevention & Input Sanitization", () => {
  it("removes dangerous MongoDB operator keys starting with $ or containing .", () => {
    const maliciousPayload = {
      personal: {
        name: "Swaraj",
        $where: "function() { return true; }",
        "nested.traversal": "exploit",
      },
      skills: [
        { heading: "Frontend", $gt: "" },
        { heading: "Backend", valid: true },
      ],
      $ne: "inject",
    };

    interface SanitizedPayload {
      personal?: { name?: string; $where?: string; "nested.traversal"?: string };
      skills?: Array<{ heading?: string; $gt?: string; valid?: boolean }>;
      $ne?: string;
    }
    const sanitized = sanitizeNoSql(maliciousPayload) as SanitizedPayload;

    expect(sanitized.$ne).toBeUndefined();
    expect(sanitized.personal?.$where).toBeUndefined();
    expect(sanitized.personal?.["nested.traversal"]).toBeUndefined();
    expect(sanitized.personal?.name).toBe("Swaraj");
    expect(sanitized.skills?.[0]?.heading).toBe("Frontend");
    expect(sanitized.skills?.[0]?.$gt).toBeUndefined();
    expect(sanitized.skills?.[1]?.valid).toBe(true);
  });

  it("sanitizes HTML and script tags from text inputs (XSS prevention)", () => {
    const rawInput = `<script>alert('xss')</script>Hello <b>World</b> <img src=x onerror=alert(1)>`;
    const clean = sanitizeString(rawInput, 100);

    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("</script>");
    expect(clean).not.toContain("<b>");
    expect(clean).not.toContain("<img");
    expect(clean).toContain("Hello World");
  });

  it("truncates excessively long text inputs", () => {
    const longString = "A".repeat(500);
    const truncated = sanitizeString(longString, 50);

    expect(truncated.length).toBe(50);
  });
});

describe("Security: CORS Origin Whitelisting", () => {
  it("allows localhost origins and empty/same-origin calls", () => {
    expect(isOriginAllowed(undefined)).toBe(true);
    expect(isOriginAllowed("")).toBe(true);
    expect(isOriginAllowed("http://localhost:5173")).toBe(true);
    expect(isOriginAllowed("http://localhost:3000")).toBe(true);
    expect(isOriginAllowed("http://127.0.0.1:5000")).toBe(true);
  });

  it("allows production domain and Vercel domains", () => {
    expect(isOriginAllowed("https://swarajvecha.in")).toBe(true);
    expect(isOriginAllowed("https://www.swarajvecha.in")).toBe(true);
    expect(isOriginAllowed("https://swaraj-portfolio.vercel.app")).toBe(true);
  });

  it("allows custom origins passed in whitelist", () => {
    const customList = ["https://custom-domain.com", "https://staging.preview.com"];
    expect(isOriginAllowed("https://custom-domain.com", customList)).toBe(true);
    expect(isOriginAllowed("https://staging.preview.com", customList)).toBe(true);
  });

  it("blocks unauthorized foreign origins", () => {
    expect(isOriginAllowed("https://malicious-site.com")).toBe(false);
    expect(isOriginAllowed("https://attacker.org")).toBe(false);
    expect(isOriginAllowed("http://swarajvecha.in.evil.com")).toBe(false);
  });
});
