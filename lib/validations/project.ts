import { z } from "zod";

const statEntrySchema = z.object({
  label: z.string().min(1).max(120),
  value: z.string().min(1).max(200),
});

const timelineEntrySchema = z.object({
  period: z.string().min(1).max(80),
  title: z.string().min(1).max(200),
});

const techGroupSchema = z.object({
  name: z.string().min(1).max(60),
  items: z.array(z.string().min(1).max(80)).max(30),
});

export const projectCaseStudySchema = z.object({
  headline: z.string().max(200).optional(),
  displayStatus: z
    .enum(["Live", "Production", "In development", "Beta", "Archived"])
    .optional(),
  role: z.string().max(120).optional(),
  periodLabel: z.string().max(120).optional(),
  category: z.string().max(120).optional(),
  docsUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  problem: z.string().max(8000).optional(),
  solution: z.string().max(8000).optional(),
  architectureSteps: z.array(z.string().max(200)).max(24).optional(),
  features: z.array(z.string().max(200)).max(48).optional(),
  challenges: z.array(z.string().max(300)).max(48).optional(),
  impact: z.array(z.string().max(400)).max(48).optional(),
  stats: z.array(statEntrySchema).max(16).optional(),
  timeline: z.array(timelineEntrySchema).max(24).optional(),
  imageCaptions: z.array(z.string().max(200)).max(12).optional(),
  techGroups: z.array(techGroupSchema).max(12).optional(),
});

export type ProjectCaseStudyInput = z.infer<typeof projectCaseStudySchema>;

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
  images: z
    .array(
      z.string().refine((v) => v.startsWith("/") || v.startsWith("http"), {
        message: "Must be a valid URL or uploaded path",
      }),
    )
    .max(10)
    .default([]),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  caseStudy: projectCaseStudySchema.nullable().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  order: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const projectUpdateSchema = projectSchema.partial();
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
