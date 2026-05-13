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
  value?: string;
  onChange?: (url: string) => void;
  values?: string[];
  onMultipleChange?: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  aspectRatio?: "video" | "square";
}

export function ImageUpload({
  value,
  onChange,
  values = [],
  onMultipleChange,
  multiple = false,
  maxFiles = 10,
  label = "Cover Image",
  aspectRatio = "video",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const currentValues = multiple ? values : value ? [value] : [];

  const upload = useCallback(
    async (selectedFiles: File[]) => {
      if (selectedFiles.length === 0) return;
      setError("");
      setUploading(true);
      try {
        const formData = new FormData();
        if (multiple) {
          const remainingSlots = Math.max(maxFiles - currentValues.length, 0);
          const filesToUpload = selectedFiles.slice(0, remainingSlots);
          if (filesToUpload.length === 0) {
            setError(`Maksimal ${maxFiles} foto.`);
            return;
          }
          for (const file of filesToUpload) {
            formData.append("files", file);
          }
        } else {
          formData.append("file", selectedFiles[0]);
        }

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Upload failed");
          return;
        }

        if (multiple) {
          const uploadedUrls: string[] = Array.isArray(data.urls)
            ? data.urls
            : data.url
              ? [data.url]
              : [];
          onMultipleChange?.([...currentValues, ...uploadedUrls]);
        } else if (data.url) {
          onChange?.(data.url);
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [currentValues, maxFiles, multiple, onChange, onMultipleChange],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) upload(files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length > 0) upload(files);
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
    onChange?.("");
    setError("");
  }

  function handleRemoveAt(index: number) {
    const next = currentValues.filter((_, i) => i !== index);
    onMultipleChange?.(next);
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
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {multiple ? (
        <div className="min-h-0 space-y-2">
          {currentValues.length > 0 && (
            <div className="grid min-h-0 grid-cols-2 gap-2 sm:grid-cols-3">
              {currentValues.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className={cn("group relative overflow-hidden rounded-none border border-border bg-muted", aspectClass)}
                >
                  <Image
                    src={imageUrl}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={imageUrl.startsWith("/uploads/")}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAt(index)}
                    className="absolute right-1 top-1 rounded-none border border-border bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Remove image ${index + 1}`}
                    disabled={uploading}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            disabled={uploading || currentValues.length >= maxFiles}
            className={cn(
              "flex w-full shrink-0 flex-col items-center justify-center gap-3 rounded-none border-2 border-dashed transition-colors",
              aspectClass,
              dragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-muted-foreground/40 hover:bg-muted/50",
              (uploading || currentValues.length >= maxFiles) && "cursor-not-allowed opacity-60",
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
                    JPG, PNG, WebP, GIF · max 5 MB · hingga {maxFiles} foto
                  </p>
                </div>
              </>
            )}
          </button>
        </div>
      ) : value ? (
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
            "flex w-full shrink-0 flex-col items-center justify-center gap-3 rounded-none border-2 border-dashed transition-colors",
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
