import Link from "next/link";
import Image from "next/image";
import type { Post } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate, truncate } from "@/lib/utils";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt?.toISOString() ?? post.createdAt.toISOString()}>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
          {post.featured && (
            <>
              <span>·</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                Featured
              </Badge>
            </>
          )}
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="font-medium text-foreground hover:text-primary transition-colors leading-snug line-clamp-2"
        >
          {post.title}
        </Link>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {truncate(post.excerpt, 160)}
        </p>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
