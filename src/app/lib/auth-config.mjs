export const authConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export function safeReturnPath(value) {
  return ["/", "/cuenta", "/admin", "/?carrito=1"].includes(value) ? value : "/cuenta";
}

export function parseProduct(form) {
  const nombre = String(form.get("nombre") || "").trim();
  const categoria = String(form.get("categoria") || "").trim();
  const precio = String(form.get("precio") || "").trim();
  const stock = String(form.get("stock") || "").trim();
  const imagen = String(form.get("imagen") || "").trim();
  if (!nombre || nombre.length > 200 || !categoria || categoria.length > 100) throw new Error("Nombre o categoria invalidos.");
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(precio) || !/^\d{1,8}$/.test(stock)) throw new Error("Precio o existencias invalidos.");
  if (imagen && (!imagen.startsWith("https://") || imagen.length > 2000)) throw new Error("La imagen debe usar una URL HTTPS.");
  if (imagen) { try { new URL(imagen); } catch { throw new Error("URL de imagen invalida."); } }
  return { nombre, categoria, precio_centavos: Math.round(Number(precio) * 100), stock: Number(stock), imagen: imagen || null, activo: form.get("activo") === "on" };
}
