import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSession } from "@/lib/auth";
import { cloudinary, configureCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_FILES = 10;
const UPLOAD_FOLDER = "portfolio/uploads";

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

  configureCloudinary();

  try {
    const formData = await request.formData();
    const singleFile = formData.get("file");
    const filesFromArray = formData.getAll("files");
    const files = [...filesFromArray, singleFile].filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Too many files. Max ${MAX_FILES} files per upload.` },
        { status: 400 },
      );
    }

    const uploadedUrls: string[] = [];
    for (const file of files) {
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

      const publicId = randomUUID();
      const buffer = Buffer.from(await file.arrayBuffer());
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: UPLOAD_FOLDER,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
      });

      if (!result.secure_url) {
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
      }

      uploadedUrls.push(result.secure_url);
    }

    return NextResponse.json({ success: true, url: uploadedUrls[0], urls: uploadedUrls });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
