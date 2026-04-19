import type { Metadata } from "next";
import type { Project } from "@prisma/client";
import { Suspense } from "react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectCardSkeleton } from "@/components/public/SkeletonCard";
import { getPublishedProjects } from "@/lib/services/project.service";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of my work — web apps, tools, and experiments.",
};

export const revalidate = 60;

async function ProjectsList() {
  const projects: Project[] = await getPublishedProjects().catch(() => []);

  if (projects.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-border py-20 text-center">
        <p className="text-sm text-muted-foreground">No projects published yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectsListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          A selection of things I&apos;ve built — from side projects to production apps.
        </p>
      </div>
      <Suspense fallback={<ProjectsListSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}
