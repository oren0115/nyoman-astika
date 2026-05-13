import type { ProjectCaseStudy } from "@/lib/project-case-study";

export type TechCategoryId =
  | "frontend"
  | "backend"
  | "database"
  | "networking"
  | "infrastructure"
  | "tools";

export interface TechCategoryMeta {
  id: TechCategoryId;
  label: string;
  className: string;
}

const CATEGORY_ORDER: TechCategoryId[] = [
  "frontend",
  "backend",
  "database",
  "networking",
  "infrastructure",
  "tools",
];

const CATEGORY_META: Record<TechCategoryId, TechCategoryMeta> = {
  frontend: {
    id: "frontend",
    label: "Frontend",
    className:
      "border-emerald-500/25 bg-emerald-500/5 text-emerald-200/90 hover:border-emerald-500/40",
  },
  backend: {
    id: "backend",
    label: "Backend",
    className:
      "border-amber-500/25 bg-amber-500/5 text-amber-200/90 hover:border-amber-500/40",
  },
  database: {
    id: "database",
    label: "Database",
    className: "border-sky-500/25 bg-sky-500/5 text-sky-200/90 hover:border-sky-500/40",
  },
  networking: {
    id: "networking",
    label: "Networking",
    className:
      "border-violet-500/25 bg-violet-500/5 text-violet-200/90 hover:border-violet-500/40",
  },
  infrastructure: {
    id: "infrastructure",
    label: "Infrastructure",
    className:
      "border-orange-500/25 bg-orange-500/5 text-orange-200/90 hover:border-orange-500/40",
  },
  tools: {
    id: "tools",
    label: "Tools & other",
    className: "border-border/80 bg-muted/40 text-muted-foreground hover:bg-muted/60",
  },
};

function detectCategory(tech: string): TechCategoryId {
  const t = tech.toLowerCase();

  const frontend = [
    "react",
    "next",
    "next.js",
    "vue",
    "nuxt",
    "svelte",
    "angular",
    "tailwind",
    "css",
    "scss",
    "sass",
    "html",
    "typescript",
    "javascript",
    "vite",
    "webpack",
    "redux",
    "zustand",
    "tanstack",
    "framer",
  ];
  const backend = [
    "node",
    "express",
    "nestjs",
    "nest",
    "fastify",
    "python",
    "django",
    "flask",
    "fastapi",
    "go",
    "golang",
    "rust",
    "java",
    "spring",
    "php",
    "laravel",
    "ruby",
    "rails",
    "graphql",
    "trpc",
    "websocket",
    "socket.io",
    "api",
  ];
  const database = [
    "postgres",
    "postgresql",
    "mysql",
    "mariadb",
    "mongo",
    "mongodb",
    "redis",
    "sqlite",
    "prisma",
    "drizzle",
    "orm",
    "elasticsearch",
    "cassandra",
  ];
  const networking = [
    "snmp",
    "mqtt",
    "tcp",
    "udp",
    "http",
    "https",
    "grpc",
    "vpn",
    "dns",
    "nginx",
    "caddy",
    "traefik",
    "load balancer",
    "network",
  ];
  const infrastructure = [
    "docker",
    "kubernetes",
    "k8s",
    "aws",
    "gcp",
    "azure",
    "vercel",
    "cloudflare",
    "terraform",
    "ansible",
    "ci",
    "cd",
    "github actions",
    "gitlab",
    "linux",
    "ubuntu",
    "debian",
  ];

  if (frontend.some((k) => t.includes(k))) return "frontend";
  if (backend.some((k) => t.includes(k))) return "backend";
  if (database.some((k) => t.includes(k))) return "database";
  if (networking.some((k) => t.includes(k))) return "networking";
  if (infrastructure.some((k) => t.includes(k))) return "infrastructure";
  return "tools";
}

export function groupTechStack(
  techStack: string[],
  caseStudy: ProjectCaseStudy | null,
): { meta: TechCategoryMeta; items: string[] }[] {
  if (caseStudy?.techGroups?.length) {
    const listed = new Set<string>();
    const groups: { meta: TechCategoryMeta; items: string[] }[] = [];

    for (const g of caseStudy.techGroups) {
      g.items.forEach((i) => listed.add(i));
      groups.push({
        meta: {
          id: "tools",
          label: g.name,
          className: CATEGORY_META.tools.className,
        },
        items: [...g.items],
      });
    }

    const rest = techStack.filter((t) => !listed.has(t));
    if (rest.length) {
      const byCat = new Map<TechCategoryId, string[]>();
      for (const tech of rest) {
        const id = detectCategory(tech);
        const arr = byCat.get(id) ?? [];
        arr.push(tech);
        byCat.set(id, arr);
      }
      for (const id of CATEGORY_ORDER) {
        const items = byCat.get(id);
        if (items?.length) {
          groups.push({ meta: CATEGORY_META[id], items });
        }
      }
    }

    return groups;
  }

  const byCat = new Map<TechCategoryId, string[]>();
  for (const tech of techStack) {
    const id = detectCategory(tech);
    const arr = byCat.get(id) ?? [];
    arr.push(tech);
    byCat.set(id, arr);
  }

  const out: { meta: TechCategoryMeta; items: string[] }[] = [];
  for (const id of CATEGORY_ORDER) {
    const items = byCat.get(id);
    if (items?.length) {
      out.push({ meta: CATEGORY_META[id], items });
    }
  }
  return out;
}
