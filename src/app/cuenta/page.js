import Link from "next/link";
import { requireUser } from "../lib/supabase-server";
import { logout } from "../auth/actions";
export const dynamic = "force-dynamic";
export const metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };

export default async function Cuenta({ searchParams }) {
  const { supabase, user } = await requireUser();
  const { data: admin } = await supabase.rpc("es_administrador");
  const params = await searchParams;
  return <main className="account-page">
    <Link href="/" className="account-brand">Miscelanea Dos Hermanos</Link>
    <section className="account-panel"><h1>Mi cuenta</h1><p>{user.email}</p>
      {params.error && <p role="alert">{params.error === "permisos" ? "Esta cuenta no tiene permisos de administrador." : "No pudimos cerrar la sesion. Intenta de nuevo."}</p>}
      <div className="account-links"><Link href="/?carrito=1">Continuar mi compra</Link>{admin === true && <Link href="/admin">Administrar productos</Link>}</div>
      <form action={logout}><button className="account-secondary">Cerrar sesion</button></form>
    </section>
  </main>;
}
