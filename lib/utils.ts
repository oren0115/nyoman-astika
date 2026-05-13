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

/** Split long descriptions into readable paragraphs for case-study layouts. */
export function splitIntoParagraphs(text: string, softMax = 360): string[] {
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  if (blocks.length > 1) return blocks;

  const single = blocks[0] ?? text.trim();
  if (single.length <= softMax) return single ? [single] : [];

  const sentences = single.split(/(?<=[.!?])\s+/);
  const out: string[] = [];
  let buf = "";
  for (const s of sentences) {
    const next = buf ? `${buf} ${s}` : s;
    if (next.length > softMax && buf) {
      out.push(buf.trim());
      buf = s;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}
