import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type LegalSectionRow = {
  id: string;
  slug: string;
  title: string;
  body: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapLegalSection(row: LegalSectionRow) {
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

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("legal_sections")
      .select("id, slug, title, body, sort_order, created_at, updated_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      sections: (data ?? []).map((row) => mapLegalSection(row as LegalSectionRow)),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 }
    );
  }
}

