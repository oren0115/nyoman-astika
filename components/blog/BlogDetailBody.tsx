import type { Post } from "@prisma/client";
import type { GallerySlide } from "@/components/projects/ProjectGallery";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { formatDate, formatDateShort, splitIntoParagraphs } from "@/lib/utils";

export function BlogDetailBody({ post }: { post: Post }) {
  const gallerySources =
    post.images && post.images.length > 0
      ? post.images
      : post.coverImage
        ? [post.coverImage]
        : [];

  const slides: GallerySlide[] = gallerySources.map((src, index) => ({
    src,
    alt: index === 0 ? post.title : `${post.title} — ${index + 1}`,
  }));

  const excerptParagraphs = splitIntoParagraphs(post.excerpt);
  const lede =
    excerptParagraphs.length > 0 ? excerptParagraphs : [post.excerpt.trim() || "—"];

  return (
    <BlogPostLayout
      title={post.title}
      excerptParagraphs={lede}
      tags={post.tags}
      featured={post.featured}
      publishedLabel={formatDate(post.publishedAt ?? post.createdAt)}
      updatedLabel={formatDateShort(post.updatedAt)}
      slides={slides}
      contentHtml={post.content}
    />
  );
}
