import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { authConfigured } from "./app/lib/auth-config.mjs";

export async function proxy(request) {
  let response = NextResponse.next({ request });
  if (!authConfigured()) return response;
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (values) => {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getClaims();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/acceso", "/cuenta/:path*", "/admin/:path*", "/auth/:path*", "/api/auth/:path*"] };
