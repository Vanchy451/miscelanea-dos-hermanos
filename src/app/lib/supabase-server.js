import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authConfigured } from "./auth-config.mjs";

export async function serverClient() {
  if (!authConfigured()) return null;
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        // Server Components cannot write cookies; the proxy refreshes their session.
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { }
      },
    },
  });
}

export async function requireUser(next = "/cuenta") {
  const supabase = await serverClient();
  if (!supabase) redirect("/acceso");
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect(`/acceso?next=${encodeURIComponent(next)}`);
  return { supabase, user: data.user };
}

export async function requireAdmin() {
  const { supabase, user } = await requireUser("/admin");
  const { data, error } = await supabase.rpc("es_administrador");
  if (error || data !== true) redirect("/cuenta?error=permisos");
  return { supabase, user };
}
