import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

async function requireAdmin(email: string) {
  if (!validateEmail(email)) {
    throw new Error("Invalid email.");
  }
  const supabase = createSupabaseServiceClient();
  const { data: adminRecord } = await supabase
    .from("admins")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!adminRecord) {
    throw new Error("Not authorized.");
  }
  return supabase;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get("email") ?? "";
    const email = rawEmail.trim().toLowerCase();
    const supabase = await requireAdmin(email);

    const { data, error } = await supabase
      .from("admins")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ admins: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    const status = message === "Not authorized." ? 403 : 400;
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();
    const rawTarget = typeof body?.targetEmail === "string" ? body.targetEmail : "";
    const targetEmail = rawTarget.trim().toLowerCase();

    const supabase = await requireAdmin(email);
    if (!validateEmail(targetEmail)) {
      return NextResponse.json({ message: "Invalid target email." }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("admins")
      .select("id")
      .eq("email", targetEmail)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ message: "Already an admin." }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("admins")
      .insert({ email: targetEmail })
      .select("id, email, created_at")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ admin: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    const status = message === "Not authorized." ? 403 : 400;
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();
    const rawTarget = typeof body?.targetEmail === "string" ? body.targetEmail : "";
    const targetEmail = rawTarget.trim().toLowerCase();
    const supabase = await requireAdmin(email);

    if (!validateEmail(targetEmail)) {
      return NextResponse.json({ message: "Invalid target email." }, { status: 400 });
    }

    const { error } = await supabase.from("admins").delete().eq("email", targetEmail);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    const status = message === "Not authorized." ? 403 : 400;
    return NextResponse.json({ message }, { status });
  }
}
