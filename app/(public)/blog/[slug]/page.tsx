import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetailBody } from "@/components/blog/BlogDetailBody";
import { getPostBySlug, getPublishedPosts } from "@/lib/services/post.service";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images:
        post.images && post.images.length > 0
          ? post.images
          : post.coverImage
            ? [post.coverImage]
            : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export const revalidate = 60;

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  return <BlogDetailBody post={post} />;
}
