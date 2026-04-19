import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { postSchema } from "@/lib/validations/post";
import { createPost, getPosts } from "@/lib/services/post.service";
import type { PostStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as PostStatus | null;
    const featured = searchParams.get("featured");
    const tag = searchParams.get("tag") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    const result = await getPosts({
      ...(status && { status }),
      ...(featured !== null && { featured: featured === "true" }),
      tag,
      search,
      page,
      limit,
    });

    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const post = await createPost(result.data);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "A post with this slug already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 },
    );
  }
}
