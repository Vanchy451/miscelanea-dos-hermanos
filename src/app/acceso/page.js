import Link from "next/link";
import { loginGoogle } from "../auth/actions";
import { authConfigured, safeReturnPath } from "../lib/auth-config.mjs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Iniciar sesion", robots: { index: false, follow: false } };

export default async function Acceso({ searchParams }) {
  const params = await searchParams;
  const ready = authConfigured() && Boolean(process.env.SITE_URL);
  return <main className="account-page">
    <Link href="/" className="account-brand">Miscelanea Dos Hermanos</Link>
    <section className="account-panel">
      <h1>Bienvenido</h1><p>Inicia sesion para continuar con tu compra.</p>
      {!ready && <p role="status">El acceso con Google estara disponible proximamente. Puedes seguir explorando la tienda.</p>}
      {ready && params.error && <p role="alert">No pudimos iniciar tu sesion. Intenta de nuevo.</p>}
      <form action={loginGoogle}><input type="hidden" name="next" value={safeReturnPath(params.next)} /><button disabled={!ready} className="account-primary">Continuar con Google</button></form>
      <Link href="/">Volver a la tienda</Link>
    </section>
  </main>;
}
