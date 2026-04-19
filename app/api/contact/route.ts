import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { createContactMessage, getContactMessages } from "@/lib/services/contact.service";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 },
      );
    }
    await createContactMessage(result.data);
    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const result = await getContactMessages(page);
  return NextResponse.json({ success: true, ...result });
}
