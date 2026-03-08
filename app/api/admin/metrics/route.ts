import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const METRICS_KEY = "singleton";

type MetricsPayload = {
  macroBiasScore: number;
  sp500Ytd: number;
  macroBiasYtd: number;
  tenYearCagr: number;
  fiveYearCagr: number;
  twoYearCagr: number;
  maxDrawdownMacroBias: number;
  maxDrawdownSp500: number;
  atAGlance: string;
};

function mapMetricsRow(row: {
  macro_bias_score: number;
  sp500_ytd: number;
  macro_bias_ytd: number;
  ten_year_cagr: number;
  five_year_cagr: number;
  two_year_cagr: number;
  max_drawdown_macro_bias: number;
  max_drawdown_sp500: number;
  at_a_glance: string;
  updated_at: string | null;
}): MetricsPayload & { updatedAt: string | null } {
  return {
    macroBiasScore: row.macro_bias_score,
    sp500Ytd: row.sp500_ytd,
    macroBiasYtd: row.macro_bias_ytd,
    tenYearCagr: row.ten_year_cagr,
    fiveYearCagr: row.five_year_cagr,
    twoYearCagr: row.two_year_cagr,
    maxDrawdownMacroBias: row.max_drawdown_macro_bias,
    maxDrawdownSp500: row.max_drawdown_sp500,
    atAGlance: row.at_a_glance,
    updatedAt: row.updated_at,
  };
}

function parseNumber(value: unknown, fieldName: string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return parsed;
}

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("homepage_metrics")
      .select(
        "macro_bias_score, sp500_ytd, macro_bias_ytd, ten_year_cagr, five_year_cagr, two_year_cagr, max_drawdown_macro_bias, max_drawdown_sp500, at_a_glance, updated_at"
      )
      .eq("key", METRICS_KEY)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      metrics: data ? mapMetricsRow(data) : null,
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

    const payload: MetricsPayload = {
      macroBiasScore: parseNumber(body?.macroBiasScore, "macro bias score"),
      sp500Ytd: parseNumber(body?.sp500Ytd, "S&P 500 YTD"),
      macroBiasYtd: parseNumber(body?.macroBiasYtd, "macro bias YTD"),
      tenYearCagr: parseNumber(body?.tenYearCagr, "10-year CAGR"),
      fiveYearCagr: parseNumber(body?.fiveYearCagr, "5-year CAGR"),
      twoYearCagr: parseNumber(body?.twoYearCagr, "2-year CAGR"),
      maxDrawdownMacroBias: parseNumber(
        body?.maxDrawdownMacroBias,
        "max drawdown (macro bias)"
      ),
      maxDrawdownSp500: parseNumber(
        body?.maxDrawdownSp500,
        "max drawdown (S&P 500)"
      ),
      atAGlance:
        typeof body?.atAGlance === "string" ? body.atAGlance.trim() : "",
    };

    const { data, error } = await supabase
      .from("homepage_metrics")
      .upsert(
        {
          key: METRICS_KEY,
          macro_bias_score: payload.macroBiasScore,
          sp500_ytd: payload.sp500Ytd,
          macro_bias_ytd: payload.macroBiasYtd,
          ten_year_cagr: payload.tenYearCagr,
          five_year_cagr: payload.fiveYearCagr,
          two_year_cagr: payload.twoYearCagr,
          max_drawdown_macro_bias: payload.maxDrawdownMacroBias,
          max_drawdown_sp500: payload.maxDrawdownSp500,
          at_a_glance: payload.atAGlance,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      )
      .select(
        "macro_bias_score, sp500_ytd, macro_bias_ytd, ten_year_cagr, five_year_cagr, two_year_cagr, max_drawdown_macro_bias, max_drawdown_sp500, at_a_glance, updated_at"
      )
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      metrics: data ? mapMetricsRow(data) : payload,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 }
    );
  }
}
