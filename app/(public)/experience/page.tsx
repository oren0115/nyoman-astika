import type { Metadata } from "next";
import type { Experience } from "@prisma/client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExperienceCard } from "@/components/public/ExperienceCard";
import { getExperiences } from "@/lib/services/experience.service";

export const metadata: Metadata = {
  title: "Experience",
  description: "My professional journey — roles, companies, and what I built along the way.",
};

export const revalidate = 60;

async function ExperienceList() {
  const experiences: Experience[] = await getExperiences().catch(() => []);

  if (experiences.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-border py-20 text-center">
        <p className="text-sm text-muted-foreground">No experience entries yet.</p>
      </div>
    );
  }

  return (
    <div>
      {experiences.map((exp, i) => (
        <ExperienceCard
          key={exp.id}
          experience={exp}
          isLast={i === experiences.length - 1}
        />
      ))}
    </div>
  );
}

function ExperienceListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-56" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Experience</h1>
        <p className="text-sm text-muted-foreground">
          My professional journey — roles, companies, and what I built along the way.
        </p>
      </div>
      <Suspense fallback={<ExperienceListSkeleton />}>
        <ExperienceList />
      </Suspense>
    </div>
  );
}
