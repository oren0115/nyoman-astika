import type { Metadata } from "next";
import type { Post } from "@prisma/client";
import { Suspense } from "react";
import { BlogCard } from "@/components/public/BlogCard";
import { BlogCardSkeleton } from "@/components/public/SkeletonCard";
import { getPublishedPosts } from "@/lib/services/post.service";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on code, design, and building products.",
};

export const revalidate = 60;

async function PostsList() {
  const posts: Post[] = await getPublishedPosts().catch(() => []);

  if (posts.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-border py-20 text-center">
        <p className="text-sm text-muted-foreground">No posts published yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostsListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="text-sm text-muted-foreground">
          Thoughts on code, design, and building products.
        </p>
      </div>
      <Suspense fallback={<PostsListSkeleton />}>
        <PostsList />
      </Suspense>
    </div>
  );
}
