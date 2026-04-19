import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { markMessageRead, deleteContactMessage } from "@/lib/services/contact.service";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { read } = await request.json();
  const message = await markMessageRead(id, read);
  return NextResponse.json({ success: true, data: message });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteContactMessage(id);
  return NextResponse.json({ success: true });
}
