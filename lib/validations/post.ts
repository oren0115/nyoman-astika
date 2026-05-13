import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/u,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  excerpt: z.string().min(1, "Excerpt is required").max(300),
  content: z.string().min(1, "Content is required"),
  coverImage: z
    .string()
    .refine((v) => !v || v.startsWith("/") || v.startsWith("http"), {
      message: "Must be a valid URL or uploaded path",
    })
    .optional(),
  images: z
    .array(
      z.string().refine((v) => v.startsWith("/") || v.startsWith("http"), {
        message: "Must be a valid URL or uploaded path",
      }),
    )
    .max(10)
    .default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().nullable(),
});

export type PostInput = z.infer<typeof postSchema>;

export const postUpdateSchema = postSchema.partial();
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
