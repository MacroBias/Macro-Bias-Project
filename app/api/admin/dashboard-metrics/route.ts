import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const METRICS_KEY = "singleton";

type DashboardMetricsPayload = {
  dailyMacroScore: number;
  monthlyMacroScore: number;
  regimeExplanation: string;
  navigationGuideText: string;
};

function mapMetricsRow(row: {
  daily_macro_score: number;
  monthly_macro_score: number;
  regime_explanation: string;
  navigation_guide_text: string;
  updated_at: string | null;
}): DashboardMetricsPayload & { updatedAt: string | null } {
  return {
    dailyMacroScore: row.daily_macro_score,
    monthlyMacroScore: row.monthly_macro_score,
    regimeExplanation: row.regime_explanation,
    navigationGuideText: row.navigation_guide_text,
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
      .from("dashboard_metrics")
      .select(
        "daily_macro_score, monthly_macro_score, regime_explanation, navigation_guide_text, updated_at"
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

    const payload: DashboardMetricsPayload = {
      dailyMacroScore: parseNumber(body?.dailyMacroScore, "daily macro score"),
      monthlyMacroScore: parseNumber(body?.monthlyMacroScore, "monthly macro score"),
      regimeExplanation:
        typeof body?.regimeExplanation === "string"
          ? body.regimeExplanation.trim()
          : "",
      navigationGuideText:
        typeof body?.navigationGuideText === "string"
          ? body.navigationGuideText.trim()
          : "",
    };

    const { data, error } = await supabase
      .from("dashboard_metrics")
      .upsert(
        {
          key: METRICS_KEY,
          daily_macro_score: payload.dailyMacroScore,
          monthly_macro_score: payload.monthlyMacroScore,
          regime_explanation: payload.regimeExplanation,
          navigation_guide_text: payload.navigationGuideText,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      )
      .select(
        "daily_macro_score, monthly_macro_score, regime_explanation, navigation_guide_text, updated_at"
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
