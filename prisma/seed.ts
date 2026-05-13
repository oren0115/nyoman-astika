import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is missing. Set it in .env before running the seed.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding admin user...");

  const hashedPassword = await bcrypt.hash("admin123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@portfolio.dev" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@portfolio.dev",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin ready: ${admin.email}`);
  console.log("   Login: admin@portfolio.dev / admin123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
