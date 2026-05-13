import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { getDatabaseUrl, getPrismaPgPoolConfig } from "@/lib/database-url";

if (!getDatabaseUrl()) {
  console.error("DATABASE_URL is missing. Set it in .env before running the seed.");
  process.exit(1);
}

const adapter = new PrismaPg(getPrismaPgPoolConfig());
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
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

  console.log(`✅ Created admin user: ${admin.email}`);

  // Create sample projects
  const projects = [
    {
      title: "Portfolio CMS",
      slug: "portfolio-cms",
      description:
        "A full-stack CMS for managing portfolio content, built with Next.js and PostgreSQL.",
      content:
        "<h2>Overview</h2><p>This portfolio CMS was built to manage projects and blog posts with a clean admin interface.</p>",
      techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/portfolio",
      featured: true,
      status: "PUBLISHED" as const,
      order: 1,
    },
    {
      title: "E-Commerce Platform",
      slug: "ecommerce-platform",
      description:
        "A modern e-commerce solution with real-time inventory management.",
      content:
        "<h2>Overview</h2><p>Built a scalable e-commerce platform with real-time features.</p>",
      techStack: ["React", "Node.js", "PostgreSQL", "Redis"],
      featured: true,
      status: "PUBLISHED" as const,
      order: 2,
    },
    {
      title: "Design System",
      slug: "design-system",
      description: "A comprehensive design system and component library.",
      techStack: ["React", "Storybook", "TypeScript"],
      featured: false,
      status: "DRAFT" as const,
      order: 3,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
    console.log(`✅ Created project: ${project.title}`);
  }

  // Create sample posts
  const posts = [
    {
      title: "Building a Modern Portfolio with Next.js",
      slug: "building-modern-portfolio-nextjs",
      excerpt:
        "A deep dive into building a production-ready portfolio with Next.js App Router, Prisma, and shadcn/ui.",
      content:
        "<h2>Introduction</h2><p>In this post, I'll walk through how I built this portfolio CMS from scratch using modern tools.</p><h2>Tech Stack</h2><p>The stack includes Next.js 15+, TypeScript, Prisma ORM, PostgreSQL, and shadcn/ui components.</p>",
      tags: ["nextjs", "typescript", "portfolio"],
      featured: true,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      title: "TypeScript Best Practices in 2026",
      slug: "typescript-best-practices-2026",
      excerpt:
        "A collection of TypeScript patterns and practices that make code more maintainable.",
      content:
        "<h2>Overview</h2><p>TypeScript has evolved significantly. Here are the best practices I follow.</p>",
      tags: ["typescript", "javascript"],
      featured: false,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log(`✅ Created post: ${post.title}`);
  }

  // Create sample experiences
  const experienceEntries = [
    {
      company: "Tech Startup Inc.",
      role: "Senior Frontend Engineer",
      location: "Remote",
      startDate: new Date("2023-01-01"),
      endDate: null,
      current: true,
      description:
        "Led frontend architecture for a SaaS platform serving 50k+ users. Built reusable component library with React and TypeScript. Improved Core Web Vitals scores by 40%.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
      order: 1,
    },
    {
      company: "Digital Agency Co.",
      role: "Frontend Developer",
      location: "Bali, Indonesia",
      startDate: new Date("2021-03-01"),
      endDate: new Date("2022-12-31"),
      current: false,
      description:
        "Developed responsive web applications for 10+ clients across e-commerce, fintech, and healthcare. Collaborated with design and backend teams in agile sprints.",
      skills: ["Vue.js", "React", "JavaScript", "SCSS", "REST APIs"],
      order: 2,
    },
    {
      company: "Freelance",
      role: "Full Stack Developer",
      location: "Remote",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2021-02-28"),
      current: false,
      description:
        "Built and delivered 5+ web projects for small businesses. Handled full project lifecycle from requirements gathering to deployment.",
      skills: ["React", "Node.js", "PostgreSQL", "Express"],
      order: 3,
    },
  ];

  for (const exp of experienceEntries) {
    await prisma.experience.create({ data: exp });
    console.log(`✅ Created experience: ${exp.role} @ ${exp.company}`);
  }

  console.log("\n🎉 Seed complete!");
  console.log("   Admin login: admin@portfolio.dev / admin123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
