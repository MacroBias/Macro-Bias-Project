import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();

    if (!validateEmail(email)) {
      return NextResponse.json({ message: "Invalid email." }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    const { data: adminRecord } = await supabase
      .from("admins")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!adminRecord) {
      return NextResponse.json({ message: "Not authorized." }, { status: 403 });
    }

    const { data: requests, error } = await supabase
      .from("access_requests")
      .select("email, created_at")
      .neq("email", email)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests: requests ?? [] });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 }
    );
  }
}
