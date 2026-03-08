import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type PerformanceYearlyPayload = {
  year: number;
  macroBias: number;
  sp500: number;
  alpha: number;
};

function mapPerformanceYearlyRow(row: {
  id: string;
  year: number;
  macro_bias: number;
  sp500: number;
  alpha: number;
}): PerformanceYearlyPayload & { id: string } {
  return {
    id: row.id,
    year: row.year,
    macroBias: row.macro_bias,
    sp500: row.sp500,
    alpha: row.alpha,
  };
}

function parseNumber(value: unknown, fieldName: string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return parsed;
}

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

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("performance_yearly")
      .select("id, year, macro_bias, sp500, alpha")
      .order("year", { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      yearlyPerformance: (data ?? []).map(mapPerformanceYearlyRow),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();
    const supabase = await requireAdmin(email);

    const payload: PerformanceYearlyPayload = {
      year: Math.round(parseNumber(body?.year, "year")),
      macroBias: parseNumber(body?.macroBias, "macro bias"),
      sp500: parseNumber(body?.sp500, "S&P 500"),
      alpha: parseNumber(body?.alpha, "alpha"),
    };

    const { data, error } = await supabase
      .from("performance_yearly")
      .insert({
        year: payload.year,
        macro_bias: payload.macroBias,
        sp500: payload.sp500,
        alpha: payload.alpha,
        updated_at: new Date().toISOString(),
      })
      .select("id, year, macro_bias, sp500, alpha")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      yearlyPerformance: data ? mapPerformanceYearlyRow(data) : payload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    const status = message === "Not authorized." ? 403 : 400;
    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();
    const supabase = await requireAdmin(email);
    const id = typeof body?.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json(
        { message: "Missing performance year id." },
        { status: 400 }
      );
    }

    const payload: PerformanceYearlyPayload = {
      year: Math.round(parseNumber(body?.year, "year")),
      macroBias: parseNumber(body?.macroBias, "macro bias"),
      sp500: parseNumber(body?.sp500, "S&P 500"),
      alpha: parseNumber(body?.alpha, "alpha"),
    };

    const { data, error } = await supabase
      .from("performance_yearly")
      .update({
        year: payload.year,
        macro_bias: payload.macroBias,
        sp500: payload.sp500,
        alpha: payload.alpha,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, year, macro_bias, sp500, alpha")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      yearlyPerformance: data ? mapPerformanceYearlyRow(data) : { id, ...payload },
    });
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
    const supabase = await requireAdmin(email);
    const id = typeof body?.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json(
        { message: "Missing performance year id." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("performance_yearly")
      .delete()
      .eq("id", id);

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
