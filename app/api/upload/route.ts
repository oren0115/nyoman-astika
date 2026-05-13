import { NextResponse } from "next/server";
<<<<<<< HEAD
=======
import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
>>>>>>> 07cf2d6e38a0cdfdd91117dcaebdddf6d22fe4d4
import { randomUUID } from "node:crypto";
import { getSession } from "@/lib/auth";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const UPLOAD_FOLDER = "portfolio";

function uploadBuffer(buffer: Buffer, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error("Cloudinary returned no URL"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Image storage is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 503 },
    );
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

<<<<<<< HEAD
    const publicId = randomUUID();
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadBuffer(buffer, publicId);

    return NextResponse.json({ success: true, url });
=======
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (cloudinaryConfigured()) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "portfolio/uploads",
        public_id: filename.replace(/\.[^.]+$/, ""),
        overwrite: false,
        resource_type: "image",
      });

      return NextResponse.json({ success: true, url: result.secure_url });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
>>>>>>> 07cf2d6e38a0cdfdd91117dcaebdddf6d22fe4d4
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
