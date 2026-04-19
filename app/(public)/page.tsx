import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProjectCard } from "@/components/public/ProjectCard";
import { BlogCard } from "@/components/public/BlogCard";
import { getFeaturedProjects } from "@/lib/services/project.service";
import { getFeaturedPosts } from "@/lib/services/post.service";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProjects, featuredPosts] = await Promise.all([
    getFeaturedProjects(3).catch(() => []),
    getFeaturedPosts(3).catch(() => []),
  ]);

  const { author } = siteConfig;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      {/* Hero */}
      <section className="mb-20">
        <div className="max-w-2xl">
          <Badge variant="outline" className="mb-4 text-xs">
            Available for work
          </Badge>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Hi, I&apos;m {author.name} 👋
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {siteConfig.description} I focus on building clean, performant, and
            accessible digital experiences that make a real impact.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="sm">
              <Link href="/projects">
                View Projects <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`mailto:${author.email}`}>Get in touch</Link>
            </Button>
            <div className="flex items-center gap-2 ml-1">
              {author.github && (
                <Button asChild size="icon-sm" variant="ghost">
                  <Link href={author.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <GithubLogo />
                  </Link>
                </Button>
              )}
              {author.linkedin && (
                <Button asChild size="icon-sm" variant="ghost">
                  <Link href={author.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <LinkedinLogo />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Featured Projects
            </h2>
            <Button asChild variant="ghost" size="xs">
              <Link href="/projects">
                All projects <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <Separator className="mb-20" />

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Latest Writing
            </h2>
            <Button asChild variant="ghost" size="xs">
              <Link href="/blog">
                All posts <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state for fresh install */}
      {featuredProjects.length === 0 && featuredPosts.length === 0 && (
        <div className="rounded-none border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No content yet.{" "}
            <Link href="/admin" className="text-primary hover:underline">
              Go to admin
            </Link>{" "}
            to add your first project.
          </p>
        </div>
      )}
    </div>
  );
}
