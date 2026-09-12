"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminCookieOptions,
  adminSecretsEqual,
  signAdminSession,
} from "@/lib/auth";

export async function loginWithSecret(formData: FormData) {
  const secret = String(formData.get("secret") || "");
  if (!adminSecretsEqual(secret)) {
    redirect("/admin/login?error=1");
  }

  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const store = await cookies();
  store.set(ADMIN_COOKIE, signAdminSession(expiresAt), adminCookieOptions());
  redirect("/admin");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
