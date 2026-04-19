import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { experienceUpdateSchema } from "@/lib/validations/experience";
import {
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "@/lib/services/experience.service";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const experience = await getExperienceById(id).catch(() => null);
  if (!experience) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: experience });
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const result = experienceUpdateSchema.safeParse(body);
    if (!result.success)
      return NextResponse.json({ success: false, error: result.error.issues[0].message }, { status: 400 });

    const experience = await updateExperience(id, result.data);
    return NextResponse.json({ success: true, data: experience });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await deleteExperience(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete experience" }, { status: 500 });
  }
}
