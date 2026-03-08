import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type PositionPayload = {
  exposureType: string;
  instrument: string;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  unrealizedPnL: number;
  isActive: boolean;
  isInRunProgression: boolean;
  runProgressionOrder: number | null;
  createdAt?: string;
};

function mapPositionRow(row: {
  id: string;
  exposure_type: string;
  instrument: string;
  entry_price: number;
  stop_loss: number;
  position_size: number;
  unrealized_pnl: number;
  is_active: boolean;
  is_in_run_progression: boolean;
  run_progression_order: number | null;
  created_at: string;
}): PositionPayload & { id: string } {
  return {
    id: row.id,
    exposureType: row.exposure_type,
    instrument: row.instrument,
    entryPrice: row.entry_price,
    stopLoss: row.stop_loss,
    positionSize: row.position_size,
    unrealizedPnL: row.unrealized_pnl,
    isActive: row.is_active,
    isInRunProgression: row.is_in_run_progression,
    runProgressionOrder: row.run_progression_order,
    createdAt: row.created_at,
  };
}

function parseNumber(value: unknown, fieldName: string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return parsed;
}

function parseBoolean(value: unknown): boolean {
  return value === true;
}

function parseRunProgressionOrder(value: unknown): number | null {
  if (value == null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid run progression order.");
  }
  return Math.round(parsed);
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
      .from("positions")
      .select(
        "id, exposure_type, instrument, entry_price, stop_loss, position_size, unrealized_pnl, is_active, is_in_run_progression, run_progression_order, created_at"
      )
      .order("run_progression_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      positions: (data ?? []).map(mapPositionRow),
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

    const payload: PositionPayload = {
      exposureType:
        typeof body?.exposureType === "string" ? body.exposureType.trim() : "",
      instrument:
        typeof body?.instrument === "string" ? body.instrument.trim() : "",
      entryPrice: parseNumber(body?.entryPrice, "entry price"),
      stopLoss: parseNumber(body?.stopLoss, "stop loss"),
      positionSize: parseNumber(body?.positionSize, "position size"),
      unrealizedPnL: parseNumber(body?.unrealizedPnL, "unrealized P&L"),
      isActive: parseBoolean(body?.isActive),
      isInRunProgression: parseBoolean(body?.isInRunProgression),
      runProgressionOrder: parseRunProgressionOrder(body?.runProgressionOrder),
    };

    const normalizedRunOrder = payload.isInRunProgression
      ? payload.runProgressionOrder
      : null;

    if (payload.isActive) {
      await supabase
        .from("positions")
        .update({ is_active: false })
        .not("id", "is", null);
    }

    const { data, error } = await supabase
      .from("positions")
      .insert({
        exposure_type: payload.exposureType,
        instrument: payload.instrument,
        entry_price: payload.entryPrice,
        stop_loss: payload.stopLoss,
        position_size: payload.positionSize,
        unrealized_pnl: payload.unrealizedPnL,
        is_active: payload.isActive,
        is_in_run_progression: payload.isInRunProgression,
        run_progression_order: normalizedRunOrder,
        updated_at: new Date().toISOString(),
      })
      .select(
        "id, exposure_type, instrument, entry_price, stop_loss, position_size, unrealized_pnl, is_active, is_in_run_progression, run_progression_order, created_at"
      )
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      position: data ? mapPositionRow(data) : payload,
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
      return NextResponse.json({ message: "Missing position id." }, { status: 400 });
    }

    const payload: PositionPayload = {
      exposureType:
        typeof body?.exposureType === "string" ? body.exposureType.trim() : "",
      instrument:
        typeof body?.instrument === "string" ? body.instrument.trim() : "",
      entryPrice: parseNumber(body?.entryPrice, "entry price"),
      stopLoss: parseNumber(body?.stopLoss, "stop loss"),
      positionSize: parseNumber(body?.positionSize, "position size"),
      unrealizedPnL: parseNumber(body?.unrealizedPnL, "unrealized P&L"),
      isActive: parseBoolean(body?.isActive),
      isInRunProgression: parseBoolean(body?.isInRunProgression),
      runProgressionOrder: parseRunProgressionOrder(body?.runProgressionOrder),
    };

    const normalizedRunOrder = payload.isInRunProgression
      ? payload.runProgressionOrder
      : null;

    if (payload.isActive) {
      await supabase
        .from("positions")
        .update({ is_active: false })
        .neq("id", id);
    }

    const { data, error } = await supabase
      .from("positions")
      .update({
        exposure_type: payload.exposureType,
        instrument: payload.instrument,
        entry_price: payload.entryPrice,
        stop_loss: payload.stopLoss,
        position_size: payload.positionSize,
        unrealized_pnl: payload.unrealizedPnL,
        is_active: payload.isActive,
        is_in_run_progression: payload.isInRunProgression,
        run_progression_order: normalizedRunOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, exposure_type, instrument, entry_price, stop_loss, position_size, unrealized_pnl, is_active, is_in_run_progression, run_progression_order, created_at"
      )
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      position: data ? mapPositionRow(data) : { id, ...payload },
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
      return NextResponse.json({ message: "Missing position id." }, { status: 400 });
    }

    const { error } = await supabase.from("positions").delete().eq("id", id);

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
