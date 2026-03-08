import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const NAVIGATION_GUIDES_BUCKET = "navigation-guides";
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

type NavigationGuidePayload = {
  title: string;
  description: string;
  body?: string;
};

type NavigationGuideRow = {
  id: string;
  title: string;
  description: string;
  body: string;
  file_name: string | null;
  file_path: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  created_at: string;
  updated_at: string;
};

function mapGuideRow(row: NavigationGuideRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    body: row.body,
    fileName: row.file_name,
    filePath: row.file_path,
    mimeType: row.mime_type,
    fileSizeBytes: row.file_size_bytes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parsePayload(body: unknown): NavigationGuidePayload {
  const raw = (body ?? {}) as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const description =
    typeof raw.description === "string" ? raw.description.trim() : "";
  const guideBody = typeof raw.body === "string" ? raw.body.trim() : undefined;

  if (!title) {
    throw new Error("Title is required.");
  }

  return {
    title,
    description,
    body: guideBody,
  };
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^\w.\-]/g, "_");
}

async function ensureBucketExists() {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase.storage.listBuckets();
  const exists = (data ?? []).some((bucket) => bucket.name === NAVIGATION_GUIDES_BUCKET);
  if (exists) return;

  await supabase.storage.createBucket(NAVIGATION_GUIDES_BUCKET, {
    public: false,
    fileSizeLimit: 25 * 1024 * 1024,
    allowedMimeTypes: Array.from(ALLOWED_FILE_TYPES),
  });
}

async function createSignedUrl(
  filePath: string | null,
  fileName?: string | null,
  download = false
) {
  if (!filePath) return null;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.storage
    .from(NAVIGATION_GUIDES_BUCKET)
    .createSignedUrl(filePath, 60 * 60, download ? { download: fileName || true } : {});
  if (error) return null;
  return data.signedUrl;
}

async function mapGuideWithDownloadUrl(row: NavigationGuideRow) {
  const mapped = mapGuideRow(row);
  const openUrl = await createSignedUrl(row.file_path, row.file_name, false);
  const downloadUrl = await createSignedUrl(row.file_path, row.file_name, true);
  return {
    ...mapped,
    openUrl,
    downloadUrl,
  };
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
      .from("navigation_guides")
      .select(
        "id, title, description, body, file_name, file_path, mime_type, file_size_bytes, created_at, updated_at"
      )
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      guides: await Promise.all(
        (data ?? []).map((row) => mapGuideWithDownloadUrl(row as NavigationGuideRow))
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
    const form = await request.formData();
    const rawEmail = typeof form.get("email") === "string" ? String(form.get("email")) : "";
    const email = rawEmail.trim().toLowerCase();
    const supabase = await requireAdmin(email);
    const payload = parsePayload({
      title: form.get("title"),
      description: form.get("description"),
      body: "",
    });
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Document file is required." }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Only PDF, Word, and Excel files are allowed." },
        { status: 400 }
      );
    }

    await ensureBucketExists();

    const fileBuffer = await file.arrayBuffer();
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
    const safeName = sanitizeFileName(file.name);
    const filePath = `${crypto.randomUUID()}-${Date.now()}-${safeName}${extension ? "" : ""}`;

    const { error: uploadError } = await supabase.storage
      .from(NAVIGATION_GUIDES_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ message: uploadError.message }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("navigation_guides")
      .insert({
        title: payload.title,
        description: payload.description,
        body: "",
        file_name: file.name,
        file_path: filePath,
        mime_type: file.type,
        file_size_bytes: file.size,
        updated_at: new Date().toISOString(),
      })
      .select(
        "id, title, description, body, file_name, file_path, mime_type, file_size_bytes, created_at, updated_at"
      )
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      guide: data
        ? await mapGuideWithDownloadUrl(data as NavigationGuideRow)
        : { ...payload, body: "" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    const status = message === "Not authorized." ? 403 : 400;
    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    const form = await request.formData();
    const rawEmail = typeof form.get("email") === "string" ? String(form.get("email")) : "";
    const email = rawEmail.trim().toLowerCase();
    const supabase = await requireAdmin(email);
    const id = typeof form.get("id") === "string" ? String(form.get("id")) : "";

    if (!id) {
      return NextResponse.json({ message: "Missing guide id." }, { status: 400 });
    }

    const payload = parsePayload({
      title: form.get("title"),
      description: form.get("description"),
      body: "",
    });
    const uploadedFile = form.get("file");
    const hasReplacementFile = uploadedFile instanceof File && uploadedFile.size > 0;

    const { data: existingGuide, error: existingGuideError } = await supabase
      .from("navigation_guides")
      .select("id, file_path")
      .eq("id", id)
      .maybeSingle();

    if (existingGuideError) {
      return NextResponse.json({ message: existingGuideError.message }, { status: 500 });
    }

    let filePathToSave: string | null = existingGuide?.file_path ?? null;
    let fileNameToSave: string | null = null;
    let mimeTypeToSave: string | null = null;
    let fileSizeToSave: number | null = null;

    if (hasReplacementFile) {
      const file = uploadedFile;
      if (!ALLOWED_FILE_TYPES.has(file.type)) {
        return NextResponse.json(
          { message: "Only PDF, Word, and Excel files are allowed." },
          { status: 400 }
        );
      }

      await ensureBucketExists();

      const fileBuffer = await file.arrayBuffer();
      const safeName = sanitizeFileName(file.name);
      const newPath = `${crypto.randomUUID()}-${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from(NAVIGATION_GUIDES_BUCKET)
        .upload(newPath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json({ message: uploadError.message }, { status: 500 });
      }

      if (filePathToSave) {
        await supabase.storage.from(NAVIGATION_GUIDES_BUCKET).remove([filePathToSave]);
      }

      filePathToSave = newPath;
      fileNameToSave = file.name;
      mimeTypeToSave = file.type;
      fileSizeToSave = file.size;
    }

    const { data, error } = await supabase
      .from("navigation_guides")
      .update({
        title: payload.title,
        description: payload.description,
        body: "",
        file_name: fileNameToSave ?? undefined,
        file_path: filePathToSave ?? undefined,
        mime_type: mimeTypeToSave ?? undefined,
        file_size_bytes: fileSizeToSave ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, title, description, body, file_name, file_path, mime_type, file_size_bytes, created_at, updated_at"
      )
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      guide: data
        ? await mapGuideWithDownloadUrl(data as NavigationGuideRow)
        : { id, ...payload, body: "" },
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
      return NextResponse.json({ message: "Missing guide id." }, { status: 400 });
    }

    const { data: existingGuide } = await supabase
      .from("navigation_guides")
      .select("file_path")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("navigation_guides").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (existingGuide?.file_path) {
      await supabase.storage.from(NAVIGATION_GUIDES_BUCKET).remove([existingGuide.file_path]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    const status = message === "Not authorized." ? 403 : 400;
    return NextResponse.json({ message }, { status });
  }
}
