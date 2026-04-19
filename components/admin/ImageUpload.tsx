"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  UploadSimple,
  X,
  Image as ImageIcon,
  CircleNotch,
  Warning,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "video" | "square";
}

export function ImageUpload({
  value,
  onChange,
  label = "Cover Image",
  aspectRatio = "video",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Upload failed");
          return;
        }
        onChange(data.url);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragging(false);
    }
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setError("");
  }

  const aspectClass = aspectRatio === "video" ? "aspect-video" : "aspect-square";

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-foreground">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {value ? (
        /* Preview */
        <div className={cn("group relative overflow-hidden rounded-none border border-border bg-muted", aspectClass)}>
          <Image
            src={value}
            alt="Cover image preview"
            fill
            className="object-cover"
            unoptimized={value.startsWith("/uploads/")}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <CircleNotch className="size-3 animate-spin" />
              ) : (
                <UploadSimple className="size-3" />
              )}
              Replace
            </Button>
            <Button
              type="button"
              size="icon-xs"
              variant="destructive"
              onClick={handleRemove}
              disabled={uploading}
              aria-label="Remove image"
            >
              <X />
            </Button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          disabled={uploading}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-none border-2 border-dashed transition-colors",
            aspectClass,
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:border-muted-foreground/40 hover:bg-muted/50",
            uploading && "cursor-not-allowed opacity-60",
          )}
        >
          {uploading ? (
            <>
              <CircleNotch className="size-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Uploading…</span>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-none border border-border bg-background">
                {dragging ? (
                  <UploadSimple className="size-5 text-primary" />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xs font-medium text-foreground">
                  {dragging ? "Drop to upload" : "Click or drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP, GIF · max 5 MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <Warning className="size-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
