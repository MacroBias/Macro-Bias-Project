import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();

    if (!validateEmail(email)) {
      return NextResponse.json({ message: "Please provide a valid email." }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    const { error } = await supabase
      .from("access_requests")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const { data: adminRecord, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (adminError) {
      return NextResponse.json({ message: adminError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, isAdmin: Boolean(adminRecord) });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 }
    );
  }
}
