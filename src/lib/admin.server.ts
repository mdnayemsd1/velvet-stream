import { getRequestHeader, getRequestIP, useSession } from "@tanstack/react-start/server";

export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_MINUTES = 15;

type AdminSession = { admin?: boolean };

// Built per call: on Workers env is injected per request.
function sessionConfig() {
  const password = process.env["SESSION_SECRET"];
  if (!password) throw new Error("SESSION_SECRET is not configured");
  return {
    password,
    name: "vid_admin",
    maxAge: 60 * 60 * 8,
    // SameSite=None + Partitioned so the cookie also works inside the editor preview frame.
    cookie: { httpOnly: true, secure: true, sameSite: "none" as const, partitioned: true, path: "/" },
  };
}

export function getAdminSession() {
  return useSession<AdminSession>(sessionConfig());
}

export async function isAdmin() {
  const s = await getAdminSession();
  return s.data.admin === true;
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("আপনি লগইন করা নেই। আবার লগইন করুন।");
}

export function clientIp() {
  return getRequestHeader("cf-connecting-ip") ?? getRequestIP({ xForwardedFor: true }) ?? "unknown";
}

export async function passwordMatches(input: string) {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(input)),
    crypto.subtle.digest("SHA-256", enc.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}
