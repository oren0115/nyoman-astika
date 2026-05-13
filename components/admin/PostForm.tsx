"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RichEditor } from "@/components/admin/RichEditor";
import { TagInput } from "@/components/admin/TagInput";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";

/** Setelah `prisma generate`, `images` ada di model Post dari Prisma. */
type PostForForm = Post & { images?: string[] };

interface PostFormProps {
  post?: PostForForm;
  mode: "create" | "edit";
}

export function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [images, setImages] = useState<string[]>(() => {
    if (post?.images?.length) return post.images;
    if (post?.coverImage) return [post.coverImage];
    return [];
  });
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    post?.status ?? "DRAFT",
  );

  function handleTitleChange(val: string) {
    setTitle(val);
    if (mode === "create") {
      setSlug(slugify(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      title,
      slug,
      excerpt,
      content,
      images,
      tags,
      featured,
      status,
    };

    try {
      const url = mode === "create" ? "/api/posts" : `/api/posts/${post!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-none border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My Thoughts On…"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug" className="text-xs">
            Slug <span className="text-destructive">*</span>
          </Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-thoughts-on"
            required
            pattern="^[a-z0-9\-]+$"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt" className="text-xs">
          Excerpt <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A brief summary for previews and SEO…"
          rows={2}
          required
        />
        <p className="text-xs text-muted-foreground">{excerpt.length}/300</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">
          Content <span className="text-destructive">*</span>
        </Label>
        <RichEditor
          value={content}
          onChange={setContent}
          placeholder="Start writing your post…"
        />
      </div>

      <Separator />

      <ImageUpload
        multiple
        values={images}
        onMultipleChange={setImages}
        label="Gambar artikel"
      />
      <p className="text-xs text-muted-foreground">
        Foto pertama dipakai sebagai sampul di daftar blog. Anda bisa mengunggah beberapa gambar sekaligus.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as typeof status)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Tags</Label>
        <TagInput
          value={tags}
          onChange={setTags}
          placeholder="Add tag (react, typescript…), press Enter"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-3.5 w-3.5 rounded-none accent-primary"
        />
        <label htmlFor="featured" className="text-xs text-muted-foreground cursor-pointer">
          Featured post (show on homepage)
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" className="cursor-pointer" disabled={loading}>
          {loading
            ? mode === "create"
              ? "Publishing…"
              : "Saving…"
            : mode === "create"
              ? "Create Post"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
