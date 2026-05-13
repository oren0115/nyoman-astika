import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Memecah teks biasa (deskripsi, excerpt, dsb.) untuk tampilan publik:
 * - Paragraf dipisah dengan satu atau lebih baris kosong (`\n\n+`).
 * - Baris tunggal di dalam satu paragraf dipertahankan — render dengan `whitespace-pre-line` pada `<p>`.
 * Tidak lagi memecah otomatis per kalimat (itu mengubah format dari input admin).
 */
export function splitIntoParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.trim()) return [];

  return normalized
    .split(/\n\n+/)
    .map((block) => block.trimEnd())
    .filter((block) => block.length > 0);
}
