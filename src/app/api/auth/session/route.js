import { NextResponse } from "next/server";
import { serverClient } from "../../../lib/supabase-server";

export async function GET() {
  const supabase = await serverClient();
  if (!supabase) return NextResponse.json({ configured: false, authenticated: false }, { headers: { "Cache-Control": "private, no-store" } });
  const { data, error } = await supabase.auth.getUser();
  return NextResponse.json({ configured: true, authenticated: !error && Boolean(data.user) }, { headers: { "Cache-Control": "private, no-store" } });
}
