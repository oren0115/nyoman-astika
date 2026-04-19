import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getSession } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "File type not allowed. Use JPG, PNG, WebP, or GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: `File too large. Max size is ${MAX_SIZE_MB}MB.` },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${randomUUID()}.${ext}`;

    // Use Vercel Blob in production; fall back to local disk in development
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, file, { access: "public" });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // Local development fallback
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
