import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();

    if (!validateEmail(email)) {
      return NextResponse.json({ ok: false, message: "Invalid email." }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    const [accessResponse, adminResponse] = await Promise.all([
      supabase.from("access_requests").select("id").eq("email", email).maybeSingle(),
      supabase.from("admins").select("id").eq("email", email).maybeSingle(),
    ]);

    const hasAccess = Boolean(accessResponse.data || adminResponse.data);
    return NextResponse.json({ ok: hasAccess });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 }
    );
  }
}
