import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type ProductPayload = {
  exposureType: "Long" | "Short";
  name: string;
  isin: string;
  leverage: string;
  liquidity: string;
  factsheetLink: string;
};

function normalizeLiquidity(liquidity: string): string {
  const normalized = liquidity.trim().toLowerCase();
  return normalized === "very low liquidity" ? "Very low liquidity" : liquidity;
}

function leverageRank(leverage: string): number {
  const value = Number.parseFloat(leverage.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

function mapProductRow(row: {
  id: string;
  exposure_type: string;
  name: string;
  isin: string;
  leverage: string;
  liquidity: string;
  factsheet_link: string;
}): ProductPayload & { id: string } {
  return {
    id: row.id,
    exposureType: row.exposure_type as "Long" | "Short",
    name: row.name,
    isin: row.isin,
    leverage: row.leverage,
    liquidity: normalizeLiquidity(row.liquidity),
    factsheetLink: row.factsheet_link,
  };
}

function liquidityRank(liquidity: string): number {
  const label = normalizeLiquidity(liquidity).trim().toLowerCase();
  if (label === "high") return 0;
  if (label === "medium") return 1;
  if (label === "low") return 2;
  if (label === "very low liquidity") return 3;
  return 4;
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
      .from("products")
      .select(
        "id, exposure_type, name, isin, leverage, liquidity, factsheet_link"
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const sorted = (data ?? [])
      .map(mapProductRow)
      .sort((a, b) => {
        if (a.exposureType === b.exposureType) {
          const leverageDiff = leverageRank(a.leverage) - leverageRank(b.leverage);
          if (leverageDiff !== 0) return leverageDiff;
          return liquidityRank(a.liquidity) - liquidityRank(b.liquidity);
        }
        return a.exposureType.localeCompare(b.exposureType);
      });

    return NextResponse.json({ products: sorted });
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

    const payload: ProductPayload = {
      exposureType: body?.exposureType === "Short" ? "Short" : "Long",
      name: typeof body?.name === "string" ? body.name.trim() : "",
      isin: typeof body?.isin === "string" ? body.isin.trim() : "",
      leverage: typeof body?.leverage === "string" ? body.leverage.trim() : "",
      liquidity: normalizeLiquidity(
        typeof body?.liquidity === "string" ? body.liquidity.trim() : ""
      ),
      factsheetLink:
        typeof body?.factsheetLink === "string" ? body.factsheetLink.trim() : "",
    };

    const { data, error } = await supabase
      .from("products")
      .insert({
        exposure_type: payload.exposureType,
        name: payload.name,
        isin: payload.isin,
        leverage: payload.leverage,
        liquidity: payload.liquidity,
        factsheet_link: payload.factsheetLink,
        updated_at: new Date().toISOString(),
      })
      .select(
        "id, exposure_type, name, isin, leverage, liquidity, factsheet_link"
      )
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      product: data ? mapProductRow(data) : payload,
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
      return NextResponse.json({ message: "Missing product id." }, { status: 400 });
    }

    const payload: ProductPayload = {
      exposureType: body?.exposureType === "Short" ? "Short" : "Long",
      name: typeof body?.name === "string" ? body.name.trim() : "",
      isin: typeof body?.isin === "string" ? body.isin.trim() : "",
      leverage: typeof body?.leverage === "string" ? body.leverage.trim() : "",
      liquidity: normalizeLiquidity(
        typeof body?.liquidity === "string" ? body.liquidity.trim() : ""
      ),
      factsheetLink:
        typeof body?.factsheetLink === "string" ? body.factsheetLink.trim() : "",
    };

    const { data, error } = await supabase
      .from("products")
      .update({
        exposure_type: payload.exposureType,
        name: payload.name,
        isin: payload.isin,
        leverage: payload.leverage,
        liquidity: payload.liquidity,
        factsheet_link: payload.factsheetLink,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, exposure_type, name, isin, leverage, liquidity, factsheet_link"
      )
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      product: data ? mapProductRow(data) : { id, ...payload },
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
      return NextResponse.json({ message: "Missing product id." }, { status: 400 });
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

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
