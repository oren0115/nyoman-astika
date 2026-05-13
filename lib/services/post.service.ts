import { prisma } from "@/lib/prisma";
import type { PostInput, PostUpdateInput } from "@/lib/validations/post";
import type { PostStatus } from "@prisma/client";

export interface PostFilters {
  status?: PostStatus;
  featured?: boolean;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getPosts(filters: PostFilters = {}) {
  const { status, featured, tag, search, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(featured !== undefined && { featured }),
    ...(tag && { tags: { has: tag } }),
    ...(search && {
      OR: [{ title: { contains: search } }, { excerpt: { contains: search } }],
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export async function createPost(data: PostInput) {
  const { images, coverImage, publishedAt, ...rest } = data;
  const gallery =
    images.length > 0 ? images : coverImage ? [coverImage] : [];
  return prisma.post.create({
    data: {
      ...rest,
      images: gallery,
      coverImage: gallery[0] ?? null,
      publishedAt:
        data.status === "PUBLISHED"
          ? publishedAt
            ? new Date(publishedAt)
            : new Date()
          : null,
    },
  });
}

export async function updatePost(id: string, data: PostUpdateInput) {
  const { images, coverImage, ...rest } = data;
  const updateData: Record<string, unknown> = { ...rest };

  if (images !== undefined || coverImage !== undefined) {
    const gallery =
      images !== undefined ? images : coverImage ? [coverImage] : [];
    updateData.images = gallery;
    updateData.coverImage = gallery[0] ?? null;
  }

  if (data.status === "PUBLISHED" && data.publishedAt === undefined) {
    updateData.publishedAt = new Date();
  }
  return prisma.post.update({ where: { id }, data: updateData });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}

export async function getFeaturedPosts(limit = 3) {
  return prisma.post.findMany({
    where: { featured: true, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
}
