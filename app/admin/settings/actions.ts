"use server";

import { requireAdmin } from "@/lib/admin/require-editor";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveSiteSettingsAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const footer = String(formData.get("footer_tagline") ?? "").slice(0, 5000);
  const blogIntro = String(formData.get("home_blog_intro") ?? "").slice(0, 2000);

  const { error } = await supabase.from("site_settings").upsert(
    [
      { key: "footer_tagline", value: footer, public_readable: true },
      { key: "home_blog_intro", value: blogIntro, public_readable: true },
    ],
    { onConflict: "key" }
  );

  if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/admin/settings?saved=1");
}
