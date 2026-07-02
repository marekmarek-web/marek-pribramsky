import type { User } from "@supabase/supabase-js";
import { canManageBlog, type UserRole } from "@/lib/auth/roles";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export type EditorSession = {
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  user: User;
  role: UserRole;
  displayName: string | null;
};

/** Pro route handlery — bez redirectu. Stejný fallback profilu jako `requireEditor()`. */
export async function getEditorSessionOrNull(): Promise<EditorSession | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

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
        console.error("[getEditorSessionOrNull] service role profile read:", e);
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
    if (!canManageBlog(role)) return null;

    const displayName =
      profile?.full_name?.trim() ||
      (typeof user.email === "string" && user.email ? user.email.split("@")[0] : null);

    return { supabase, user, role: role!, displayName };
  } catch {
    return null;
  }
}
