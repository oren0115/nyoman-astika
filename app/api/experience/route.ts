import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { experienceSchema } from "@/lib/validations/experience";
import { createExperience, getExperiences } from "@/lib/services/experience.service";

export async function GET() {
  try {
    const experiences = await getExperiences();
    return NextResponse.json({ success: true, data: experiences });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const result = experienceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 },
      );
    }
    const experience = await createExperience(result.data);
    return NextResponse.json({ success: true, data: experience }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/experience]", err);
    return NextResponse.json({ success: false, error: "Failed to create experience" }, { status: 500 });
  }
}
