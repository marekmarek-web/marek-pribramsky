"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

export async function signOutAction() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    /* cookie session už nemusí existovat */
  }
  redirect("/");
}
