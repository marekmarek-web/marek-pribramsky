import type { User } from "@supabase/supabase-js";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isServiceRoleConfigured } from "@/lib/supabase/env";
import { canManageBlog, isAdminRole, type UserRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export type CmsSession = {
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  user: User;
  role: UserRole;
  displayName: string | null;
};

/**
 * Blog + storage + posts: přístup pro interní role `admin` a `editor`.
 */
export async function requireEditor(): Promise<CmsSession> {
  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  try {
    supabase = await createServerSupabaseClient();
  } catch {
    redirect("/login?error=config");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  /** RLS na `profiles` často chybí / je jiná než v migracích → anon klient vrátí 0 řádků i při existujícím admin řádku. */
  let profile: { role: string | null; full_name: string | null } | null = null;
  if (isServiceRoleConfigured()) {
    try {
      const admin = createAdminSupabaseClient();
      const { data } = await admin
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .maybeSingle();
      profile = data ?? null;
    } catch (e) {
      console.error("[requireEditor] service role profile read:", e);
    }
  }
  if (profile == null) {
    const { data } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();
    profile = data ?? null;
  }

  const role = profile?.role as UserRole | undefined;
  if (!canManageBlog(role)) {
    redirect("/login?error=forbidden");
  }

  const displayName =
    profile?.full_name?.trim() ||
    (typeof user.email === "string" && user.email ? user.email.split("@")[0] : null);

  return { supabase, user, role: role!, displayName };
}

/**
 * Citlivější části (např. globální texty webu v site_settings) — pouze `admin`.
 */
export async function requireAdmin(): Promise<CmsSession> {
  const session = await requireEditor();
  if (!isAdminRole(session.role)) {
    redirect("/admin?notice=no-admin");
  }
  return session;
}
