import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  location: z.string().max(200).optional(),
  logoUrl: z
    .string()
    .refine((v) => !v || v.startsWith("/") || v.startsWith("http"), {
      message: "Must be a valid URL or uploaded path",
    })
    .optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullish(),
  current: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
  skills: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
export const experienceUpdateSchema = experienceSchema.partial();
export type ExperienceUpdateInput = z.infer<typeof experienceUpdateSchema>;
