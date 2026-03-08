import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type FrameworkSectionPayload = {
  slug: string;
  title: string;
  body: string;
  sortOrder: number;
};

type FrameworkSectionRow = {
  id: string;
  slug: string;
  title: string;
  body: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapFrameworkSection(row: FrameworkSectionRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
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
      .from("framework_sections")
      .select("id, slug, title, body, sort_order, created_at, updated_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      sections: (data ?? []).map((row) =>
        mapFrameworkSection(row as FrameworkSectionRow)
      ),
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

    const payload: FrameworkSectionPayload = {
      slug: typeof body?.slug === "string" ? body.slug.trim() : "",
      title: typeof body?.title === "string" ? body.title.trim() : "",
      body: typeof body?.body === "string" ? body.body.trim() : "",
      sortOrder: parseNumber(body?.sortOrder, "sort order"),
    };

    if (!payload.slug) {
      return NextResponse.json({ message: "Slug is required." }, { status: 400 });
    }

    if (!payload.title) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("framework_sections")
      .insert({
        slug: payload.slug,
        title: payload.title,
        body: payload.body,
        sort_order: payload.sortOrder,
        updated_at: new Date().toISOString(),
      })
      .select("id, slug, title, body, sort_order, created_at, updated_at")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      section: data ? mapFrameworkSection(data as FrameworkSectionRow) : payload,
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
        { message: "Missing framework section id." },
        { status: 400 }
      );
    }

    const payload: FrameworkSectionPayload = {
      slug: typeof body?.slug === "string" ? body.slug.trim() : "",
      title: typeof body?.title === "string" ? body.title.trim() : "",
      body: typeof body?.body === "string" ? body.body.trim() : "",
      sortOrder: parseNumber(body?.sortOrder, "sort order"),
    };

    if (!payload.slug) {
      return NextResponse.json({ message: "Slug is required." }, { status: 400 });
    }

    if (!payload.title) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("framework_sections")
      .update({
        slug: payload.slug,
        title: payload.title,
        body: payload.body,
        sort_order: payload.sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, slug, title, body, sort_order, created_at, updated_at")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      section: data
        ? mapFrameworkSection(data as FrameworkSectionRow)
        : { id, ...payload },
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
        { message: "Missing framework section id." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("framework_sections")
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

