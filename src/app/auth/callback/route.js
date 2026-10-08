import { NextResponse } from "next/server";
import { serverClient } from "../../lib/supabase-server";
import { safeReturnPath } from "../../lib/auth-config.mjs";

export async function GET(request) {
  const url = new URL(request.url);
  const base = process.env.SITE_URL || url.origin;
  const supabase = await serverClient();
  const code = url.searchParams.get("code");
  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(new URL(safeReturnPath(url.searchParams.get("next")), base));
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  }
  return NextResponse.redirect(new URL("/acceso?error=google", base));
}
