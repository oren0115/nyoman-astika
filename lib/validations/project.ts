import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/u,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  description: z.string().min(1, "Description is required").max(500),
  content: z.string().optional(),
  coverImage: z
    .string()
    .refine((v) => !v || v.startsWith("/") || v.startsWith("http"), {
      message: "Must be a valid URL or uploaded path",
    })
    .optional(),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  order: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const projectUpdateSchema = projectSchema.partial();
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
