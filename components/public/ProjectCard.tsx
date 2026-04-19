import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { truncate } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {project.coverImage && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {project.title}
          </Link>
          {project.featured && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {truncate(project.description, 150)}
        </p>

        {project.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs px-1.5 py-0">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                +{project.techStack.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        {project.liveUrl && (
          <Button asChild size="xs" variant="default">
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Live <ArrowUpRight />
            </Link>
          </Button>
        )}
        {project.githubUrl && (
          <Button asChild size="xs" variant="outline">
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <GithubLogo /> Code
            </Link>
          </Button>
        )}
        <Button asChild size="xs" variant="ghost" className="ml-auto">
          <Link href={`/projects/${project.slug}`}>View detail →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
