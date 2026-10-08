"use server";
import { redirect } from "next/navigation";
import { serverClient } from "../lib/supabase-server";
import { safeReturnPath } from "../lib/auth-config.mjs";

export async function loginGoogle(form) {
  const supabase = await serverClient();
  if (!supabase) redirect("/acceso?error=configuracion");
  const next = safeReturnPath(form.get("next"));
  const site = process.env.SITE_URL;
  if (!site) redirect("/acceso?error=configuracion");
  const callback = new URL("/auth/callback", site);
  callback.searchParams.set("next", next);
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback.toString(), queryParams: { prompt: "select_account" } } });
  if (error || !data.url) redirect("/acceso?error=google");
  redirect(data.url);
}

export async function logout() {
  const supabase = await serverClient();
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) redirect("/cuenta?error=salida");
  }
  redirect("/");
}
