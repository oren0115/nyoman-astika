import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug, getPublishedPosts } from "@/lib/services/post.service";
import { formatDate } from "@/lib/utils";

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
      images: post.coverImage ? [post.coverImage] : [],
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
        <Link href="/blog">
          <ArrowLeft /> Back to blog
        </Link>
      </Button>

      <article>
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={post.publishedAt?.toISOString() ?? post.createdAt.toISOString()}>
              {formatDate(post.publishedAt ?? post.createdAt)}
            </time>
            {post.featured && (
              <>
                <span>·</span>
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              </>
            )}
          </div>

          <h1 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {post.title}
          </h1>

          <p className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-none border border-border bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <Separator className="mb-8" />

        <div
          className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&>h2]:text-base [&>h2]:font-semibold [&>h2]:text-foreground [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:text-foreground [&>p]:text-muted-foreground [&>ul]:text-muted-foreground [&>ol]:text-muted-foreground [&>blockquote]:border-l-2 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:text-xs"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
