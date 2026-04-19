"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@prisma/client";
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

interface ProjectFormProps {
  project?: Project;
  mode: "create" | "edit";
}

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [content, setContent] = useState(project?.content ?? "");
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [techStack, setTechStack] = useState<string[]>(project?.techStack ?? []);
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    project?.status ?? "DRAFT",
  );
  const [order, setOrder] = useState(project?.order ?? 0);

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
      description,
      content: content || undefined,
      coverImage: coverImage || undefined,
      techStack,
      liveUrl: liveUrl || undefined,
      githubUrl: githubUrl || undefined,
      featured,
      status,
      order,
    };

    try {
      const url =
        mode === "create" ? "/api/projects" : `/api/projects/${project!.id}`;
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

      router.push("/admin/projects");
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
            placeholder="My Awesome Project"
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
            placeholder="my-awesome-project"
            required
            pattern="^[a-z0-9\-]+$"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-xs">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of your project…"
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground">{description.length}/500</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Content</Label>
        <RichEditor
          value={content}
          onChange={setContent}
          placeholder="Describe your project in detail…"
        />
      </div>

      <Separator />

      <ImageUpload value={coverImage} onChange={setCoverImage} label="Cover Image" />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="order" className="text-xs">
            Sort Order
          </Label>
          <Input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10))}
            min={0}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="liveUrl" className="text-xs">
            Live URL
          </Label>
          <Input
            id="liveUrl"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://myproject.com"
            type="url"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="githubUrl" className="text-xs">
            GitHub URL
          </Label>
          <Input
            id="githubUrl"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            type="url"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Tech Stack</Label>
        <TagInput
          value={techStack}
          onChange={setTechStack}
          placeholder="Add tech (React, Next.js…), press Enter"
        />
      </div>

      <Separator />

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
              <SelectItem value="DRAFT" className="cursor-pointer">Draft</SelectItem>
              <SelectItem value="PUBLISHED" className="cursor-pointer">Published</SelectItem>
              <SelectItem value="ARCHIVED" className="cursor-pointer">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Featured</Label>
          <div className="flex items-center gap-2 h-8">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-3.5 w-3.5 rounded-none accent-primary cursor-pointer"
            />
            <label htmlFor="featured" className="text-xs text-muted-foreground cursor-pointer">
              Show on homepage
            </label>
          </div>
        </div>
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
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create Project"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
