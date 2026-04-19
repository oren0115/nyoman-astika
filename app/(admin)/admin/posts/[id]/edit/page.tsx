import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PostForm } from "@/components/admin/PostForm";
import { getPostById } from "@/lib/services/post.service";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id).catch(() => null);
  return { title: post ? `Edit: ${post.title} — Admin` : "Edit Post — Admin" };
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id).catch(() => null);

  if (!post) notFound();

  return (
    <div>
      <AdminHeader
        title={`Edit: ${post.title}`}
        description="Update post content and settings."
      />
      <div className="p-6 max-w-3xl">
        <PostForm post={post} mode="edit" />
      </div>
    </div>
  );
}
