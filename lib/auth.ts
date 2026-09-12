import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "./auth-constants";

export { ADMIN_COOKIE };
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function adminSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }
  return secret;
}

export function signAdminSession(expiresAt: number) {
  const payload = String(expiresAt);
  const sig = createHmac("sha256", adminSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminSession(token: string | undefined) {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  let expected: string;
  try {
    expected = createHmac("sha256", adminSecret()).update(payload).digest("hex");
  } catch {
    return false;
  }

  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length === 0 || a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function adminSecretsEqual(input: string) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function getAdminSession() {
  const store = await cookies();
  return verifyAdminSession(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  const ok = await getAdminSession();
  if (!ok) {
    const err = new Error("Unauthorized");
    err.name = "UnauthorizedError";
    throw err;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}
