import Link from "next/link";
import { requireAdmin } from "../lib/supabase-server";
import { actualizarProducto } from "./actions";
export const dynamic = "force-dynamic";
export const metadata = { title: "Administracion", robots: { index: false, follow: false } };

export default async function Admin({ searchParams }) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const q = String(params.q || "").slice(0, 100);
  const page = Math.min(10000, Math.max(1, Number.parseInt(params.page, 10) || 1));
  let query = supabase.from("productos").select("*", { count: "exact" }).order("nombre").order("id").range((page - 1) * 50, page * 50 - 1);
  if (q) query = query.ilike("nombre", `%${q.replace(/[\\%_]/g, "\\$&")}%`);
  const { data: productos, error, count } = await query;
  const errores = { datos: "Revisa el nombre, categoria, precio, existencias y URL de imagen.", guardar: "No se pudieron guardar los cambios.", conflicto: "Otro administrador modifico este producto. Recarga antes de editarlo." };
  const link = (n) => `/admin?${new URLSearchParams({ q, page: String(n) })}`;
  return <main className="admin-page">
    <header className="admin-heading"><div><Link href="/">Miscelanea Dos Hermanos</Link><h1>Productos</h1></div><Link href="/cuenta">Mi cuenta</Link></header>
    <form className="admin-search"><input name="q" aria-label="Buscar productos" placeholder="Buscar productos" defaultValue={q} maxLength={100} /><button>Buscar</button></form>
    {params.guardado && <p role="status">Cambios guardados.</p>}
    {params.error && <p role="alert">{errores[params.error] || "No se pudo completar la operacion."}</p>}
    {error ? <p role="alert">No pudimos consultar el inventario. Revisa la conexion y la configuracion de la base de datos.</p> : <>
      <p>{count} productos</p>
      {!productos?.length && <p>No hay productos para mostrar.</p>}
      <div className="admin-products">{productos?.map((producto) => <form key={producto.id} action={actualizarProducto} className="admin-product">
        <input type="hidden" name="id" value={producto.id} /><input type="hidden" name="updated_at" value={producto.updated_at} />
        <h2>{producto.nombre}</h2><small>Codigo: {producto.codigo || "Sin codigo"}</small>
        <label>Nombre<input name="nombre" defaultValue={producto.nombre} required maxLength={200} /></label>
        <label>Categoria<input name="categoria" defaultValue={producto.categoria} required maxLength={100} /></label>
        <div className="admin-numbers"><label>Precio (MXN)<input type="number" name="precio" min="0" max="9999999.99" step="0.01" required defaultValue={(producto.precio_centavos / 100).toFixed(2)} /></label><label>Existencias<input type="number" name="stock" min="0" max="99999999" step="1" required defaultValue={producto.stock} /></label></div>
        <label>URL de imagen<input name="imagen" type="url" maxLength={2000} defaultValue={producto.imagen || ""} /></label>
        <label className="admin-checkbox"><input type="checkbox" name="activo" defaultChecked={producto.activo} />Visible en el catalogo</label>
        <button>Guardar cambios</button>
      </form>)}</div>
      <nav className="admin-pagination" aria-label="Paginas de productos">{page > 1 && <Link href={link(page - 1)}>Anterior</Link>}<span>Pagina {page}</span>{page * 50 < count && <Link href={link(page + 1)}>Siguiente</Link>}</nav>
    </>}
  </main>;
}
