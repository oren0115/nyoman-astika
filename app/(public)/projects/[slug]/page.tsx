import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedProjects } from "@/lib/services/project.service";
import { ProjectDetailBody } from "@/components/projects/ProjectDetailBody";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return { title: "Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images:
        project.images && project.images.length > 0
          ? project.images
          : project.coverImage
            ? [project.coverImage]
            : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects().catch(() => []);
  return projects.map((p) => ({ slug: p.slug }));
}

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  return <ProjectDetailBody project={project} />;
}
