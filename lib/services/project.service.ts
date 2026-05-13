import { prisma } from "@/lib/prisma";
import type { ProjectInput, ProjectUpdateInput } from "@/lib/validations/project";
import type { ProjectStatus } from "@prisma/client";

export interface ProjectFilters {
  status?: ProjectStatus;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getProjects(filters: ProjectFilters = {}) {
  const { status, featured, search, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(featured !== undefined && { featured }),
    ...(search && {
      OR: [{ title: { contains: search } }, { description: { contains: search } }],
    }),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.project.count({ where }),
  ]);

  return { projects, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function createProject(data: ProjectInput) {
  return prisma.project.create({ data });
}

export async function updateProject(id: string, data: ProjectUpdateInput) {
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export async function getFeaturedProjects(limit = 3) {
  return prisma.project.findMany({
    where: { featured: true, status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}
