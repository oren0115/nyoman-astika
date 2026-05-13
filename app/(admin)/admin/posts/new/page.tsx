import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "New Post — Admin" };

export default function NewPostPage() {
  return (
    <div>
      <AdminHeader
        title="New Blog Post"
        description="Write and publish a new post."
      />
      <div className="w-full max-w-none p-6 lg:px-8 xl:px-10">
        <PostForm mode="create" />
      </div>
    </div>
  );
}
