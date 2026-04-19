import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProjectBySlug, getPublishedProjects } from "@/lib/services/project.service";
import { formatDate } from "@/lib/utils";

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
      images: project.coverImage ? [project.coverImage] : [],
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
        <Link href="/projects">
          <ArrowLeft /> Back to projects
        </Link>
      </Button>

      <article>
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <time className="text-xs text-muted-foreground">
              {formatDate(project.createdAt)}
            </time>
            {project.featured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
          </div>

          <h1 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.title}
          </h1>

          <p className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {project.description}
          </p>

          {project.techStack.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {project.liveUrl && (
              <Button asChild size="sm">
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Demo <ArrowUpRight />
                </Link>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild size="sm" variant="outline">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GithubLogo /> Source Code
                </Link>
              </Button>
            )}
          </div>
        </header>

        {project.coverImage && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-none border border-border bg-muted">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {project.content && (
          <>
            <Separator className="mb-8" />
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed text-foreground [&>h2]:text-base [&>h2]:font-semibold [&>h3]:text-sm [&>h3]:font-semibold [&>p]:text-muted-foreground [&>ul]:text-muted-foreground [&>ol]:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </>
        )}
      </article>
    </div>
  );
}
