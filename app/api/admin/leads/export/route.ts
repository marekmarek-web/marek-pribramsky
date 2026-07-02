import { NextResponse } from "next/server";
import { getEditorSessionOrNull } from "@/lib/admin/get-editor-session";
import { isProductionRuntime } from "@/lib/security/isProduction";

function csvEscape(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const session = await getEditorSessionOrNull();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: rows, error } = await session.supabase
    .from("leads")
    .select(
      "id,created_at,updated_at,status,name,email,phone,consent,source_type,raw_source,source_path,lead_category,calculator_type,result_summary,topic,interest,possible_duplicate,duplicate_of_id,assignee_id,internal_notes",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: isProductionRuntime() ? "Export se nepodařil." : error.message },
      { status: 500 },
    );
  }

  const headers = [
    "id",
    "created_at",
    "updated_at",
    "status",
    "name",
    "email",
    "phone",
    "consent",
    "source_type",
    "raw_source",
    "source_path",
    "lead_category",
    "calculator_type",
    "result_summary",
    "topic",
    "interest",
    "possible_duplicate",
    "duplicate_of_id",
    "assignee_id",
    "internal_notes",
  ];

  const lines = [headers.join(",")];
  for (const row of rows ?? []) {
    const r = row as Record<string, unknown>;
    lines.push(
      headers
        .map((h) => csvEscape(r[h] == null ? "" : String(r[h])))
        .join(","),
    );
  }

  const body = lines.join("\r\n");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
