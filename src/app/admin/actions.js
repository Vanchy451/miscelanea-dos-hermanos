"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../lib/supabase-server";
import { parseProduct } from "../lib/auth-config.mjs";

export async function actualizarProducto(form) {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id") || "");
  const updatedAt = String(form.get("updated_at") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !updatedAt) redirect("/admin?error=datos");
  let producto;
  try { producto = parseProduct(form); } catch { redirect("/admin?error=datos"); }
  // Avoid overwriting another administrator's concurrent edit.
  const { data, error } = await supabase.from("productos").update(producto).eq("id", id).eq("updated_at", updatedAt).select("id");
  if (error) redirect("/admin?error=guardar");
  if (!data?.length) redirect("/admin?error=conflicto");
  revalidatePath("/admin");
  redirect("/admin?guardado=1");
}
