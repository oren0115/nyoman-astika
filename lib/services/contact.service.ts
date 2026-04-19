import { prisma } from "@/lib/prisma";
import type { ContactInput } from "@/lib/validations/contact";

export async function createContactMessage(data: ContactInput) {
  return prisma.contactMessage.create({ data });
}

export async function getContactMessages(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contactMessage.count(),
  ]);
  return { messages, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function markMessageRead(id: string, read: boolean) {
  return prisma.contactMessage.update({ where: { id }, data: { read } });
}

export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}

export async function getUnreadCount() {
  return prisma.contactMessage.count({ where: { read: false } });
}
