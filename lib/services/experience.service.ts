import { prisma } from "@/lib/prisma";
import type { ExperienceInput, ExperienceUpdateInput } from "@/lib/validations/experience";

export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
}

export async function getExperienceById(id: string) {
  return prisma.experience.findUnique({ where: { id } });
}

export async function createExperience(data: ExperienceInput) {
  return prisma.experience.create({
    data: {
      company: data.company,
      role: data.role,
      location: data.location || null,
      logoUrl: data.logoUrl || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current,
      description: data.description,
      skills: data.skills,
      order: data.order,
    },
  });
}

export async function updateExperience(id: string, data: ExperienceUpdateInput) {
  return prisma.experience.update({
    where: { id },
    data: {
      ...(data.company !== undefined && { company: data.company }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.location !== undefined && { location: data.location || null }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl || null }),
      ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && {
        endDate: data.endDate ? new Date(data.endDate) : null,
      }),
      ...(data.current !== undefined && { current: data.current }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.skills !== undefined && { skills: data.skills }),
      ...(data.order !== undefined && { order: data.order }),
    },
  });
}

export async function deleteExperience(id: string) {
  return prisma.experience.delete({ where: { id } });
}
