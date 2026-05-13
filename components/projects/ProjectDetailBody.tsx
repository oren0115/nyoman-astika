import type { Project } from "@prisma/client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  GithubLogo,
  Lightning,
  CheckCircle,
  Code,
  TerminalWindow,
  Database,
  Plugs,
  Cloud,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectGallery, type GallerySlide } from "@/components/projects/ProjectGallery";
import { ProjectDetailShell, type TocItem } from "@/components/projects/ProjectDetailShell";
import { parseProjectCaseStudy, type ProjectCaseStudy } from "@/lib/project-case-study";
import {
  groupTechStack,
  type TechCategoryId,
  type TechCategoryMeta,
} from "@/lib/tech-stack-groups";
import { formatDate, formatDateShort, splitIntoParagraphs } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** `caseStudy` ada di schema; tipe Prisma ikut setelah `prisma generate`. */
type ProjectDetailRecord = Project & { caseStudy?: unknown };

function DetailSection({
  id,
  title,
  kicker,
  children,
}: {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-toc-section={id}
      className="scroll-mt-28 border-b border-border/40 pb-14 last:border-b-0 last:pb-0 sm:scroll-mt-32"
    >
      <header className="mb-8 max-w-2xl">
        {kicker ? (
          <p className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {kicker}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h2>
        <div
          className="mt-4 h-px max-w-xs bg-gradient-to-r from-primary/50 via-border to-transparent"
          aria-hidden
        />
      </header>
      {children}
    </section>
  );
}

function categoryIcon(meta: TechCategoryMeta): React.ReactNode {
  const common = "size-4 shrink-0 opacity-90";
  const id = meta.id;
  const map: Record<TechCategoryId, React.ReactNode> = {
    frontend: <Code className={common} weight="duotone" aria-hidden />,
    backend: <TerminalWindow className={common} weight="duotone" aria-hidden />,
    database: <Database className={common} weight="duotone" aria-hidden />,
    networking: <Plugs className={common} weight="duotone" aria-hidden />,
    infrastructure: <Cloud className={common} weight="duotone" aria-hidden />,
    tools: <Wrench className={common} weight="duotone" aria-hidden />,
  };
  return map[id] ?? <Wrench className={common} weight="duotone" aria-hidden />;
}

function TechStackBlock({
  groups,
}: {
  groups: { meta: TechCategoryMeta; items: string[] }[];
}) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={`${group.meta.label}-${group.items.join(",")}`}>
          <div className="mb-3 flex items-center gap-2">
            {categoryIcon(group.meta)}
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {group.meta.label}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.map((tech) => (
              <span
                key={tech}
                className={cn(
                  "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                  group.meta.className,
                )}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function buildToc(args: {
  techCount: number;
  cs: ProjectCaseStudy | null;
  galleryLen: number;
  hasContent: boolean;
  hasLinks: boolean;
}): TocItem[] {
  const { techCount, cs, galleryLen, hasContent, hasLinks } = args;
  const items: TocItem[] = [{ id: "overview", label: "Overview" }];

  if (cs?.problem || cs?.solution) {
    items.push({ id: "problem", label: "Problem & solution" });
  }
  if (techCount > 0) items.push({ id: "tech-stack", label: "Tech stack" });
  if (cs?.stats?.length) items.push({ id: "stats", label: "Metrics" });
  if (cs?.features?.length) items.push({ id: "features", label: "Features" });
  if (galleryLen > 0) items.push({ id: "screenshots", label: "Screenshots" });
  if (cs?.architectureSteps?.length) {
    items.push({ id: "architecture", label: "Architecture" });
  }
  if (cs?.challenges?.length) items.push({ id: "challenges", label: "Challenges" });
  if (cs?.impact?.length) items.push({ id: "impact", label: "Impact" });
  if (cs?.timeline?.length) items.push({ id: "timeline", label: "Timeline" });
  if (hasContent) items.push({ id: "write-up", label: "Write-up" });
  if (hasLinks) items.push({ id: "links", label: "Links" });

  return items;
}

export function ProjectDetailBody({ project }: { project: ProjectDetailRecord }) {
  const cs = parseProjectCaseStudy(project.caseStudy);

  const gallerySources =
    project.images && project.images.length > 0
      ? project.images
      : project.coverImage
        ? [project.coverImage]
        : [];

  const slides: GallerySlide[] = gallerySources.map((src, index) => ({
    src,
    alt: index === 0 ? project.title : `${project.title} — ${index + 1}`,
    caption: cs?.imageCaptions?.[index]?.trim() || undefined,
  }));

  const techGroups = groupTechStack(project.techStack, cs);
  const overviewParagraphs = splitIntoParagraphs(project.description);
  const hasLinks = Boolean(project.liveUrl || project.githubUrl || cs?.docsUrl);

  const toc = buildToc({
    techCount: project.techStack.length,
    cs,
    galleryLen: slides.length,
    hasContent: Boolean(project.content?.trim()),
    hasLinks,
  });

  const metaLine = [
    cs?.category,
    cs?.role,
    cs?.periodLabel,
  ].filter(Boolean);

  const displayStatus = cs?.displayStatus;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <header className="relative mb-14 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-muted/40 via-background/80 to-background p-8 shadow-sm ring-1 ring-foreground/[0.04] backdrop-blur-md sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/[0.07] blur-3xl" aria-hidden />
        <div className="relative max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {displayStatus ? (
              <Badge className="rounded-md border-0 bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                {displayStatus}
              </Badge>
            ) : null}
            {project.featured ? (
              <Badge variant="outline" className="rounded-md text-[11px]">
                Featured
              </Badge>
            ) : null}
            <span className="text-[11px] text-muted-foreground">
              Updated {formatDateShort(project.updatedAt)}
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
            {project.title}
          </h1>

          {cs?.headline ? (
            <p className="mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {cs.headline}
            </p>
          ) : null}

          {metaLine.length > 0 ? (
            <p className="mb-8 max-w-2xl text-sm leading-relaxed tracking-tight text-foreground/80 sm:text-base">
              {metaLine.join(" · ")}
            </p>
          ) : (
            <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {formatDate(project.createdAt)}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {project.liveUrl ? (
              <Button asChild size="sm" className="gap-1.5 rounded-lg">
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live demo
                  <ArrowUpRight className="size-3.5" weight="bold" aria-hidden />
                </Link>
              </Button>
            ) : null}
            {project.githubUrl ? (
              <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-lg">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GithubLogo className="size-3.5" weight="duotone" aria-hidden />
                  GitHub
                </Link>
              </Button>
            ) : null}
            {cs?.docsUrl ? (
              <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-lg">
                <Link href={cs.docsUrl} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="size-3.5" weight="duotone" aria-hidden />
                  Documentation
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <ProjectDetailShell tocItems={toc}>
        <article className="max-w-3xl">
          <DetailSection id="overview" title="Overview" kicker="Summary">
            <div className="max-w-2xl space-y-5 text-sm leading-[1.75] text-muted-foreground sm:text-[15px] sm:leading-[1.8]">
              {overviewParagraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </DetailSection>

          {cs?.problem || cs?.solution ? (
            <DetailSection id="problem" title="Problem & solution" kicker="How it started">
              <div className="grid max-w-2xl gap-8 lg:grid-cols-2 lg:gap-10">
                {cs.problem ? (
                  <div>
                    <h3 className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                      Problem
                    </h3>
                    <p className="whitespace-pre-line text-sm leading-[1.75] text-muted-foreground sm:text-[15px] sm:leading-[1.8]">
                      {cs.problem}
                    </p>
                  </div>
                ) : null}
                {cs.solution ? (
                  <div>
                    <h3 className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                      Solution
                    </h3>
                    <p className="whitespace-pre-line text-sm leading-[1.75] text-muted-foreground sm:text-[15px] sm:leading-[1.8]">
                      {cs.solution}
                    </p>
                  </div>
                ) : null}
              </div>
            </DetailSection>
          ) : null}

          {project.techStack.length > 0 ? (
            <DetailSection id="tech-stack" title="Tech stack" kicker="Engineering">
              <TechStackBlock groups={techGroups} />
            </DetailSection>
          ) : null}

          {cs?.stats && cs.stats.length > 0 ? (
            <DetailSection id="stats" title="At a glance" kicker="Metrics">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cs.stats.map((row) => (
                  <Card
                    key={row.label}
                    size="sm"
                    className="rounded-xl border-border/70 bg-card/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
                  >
                    <CardContent className="pt-4">
                      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                        {row.label}
                      </p>
                      <p className="mt-2 whitespace-pre-line font-mono text-sm font-semibold tracking-tight text-foreground">
                        {row.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          ) : null}

          {cs?.features && cs.features.length > 0 ? (
            <DetailSection id="features" title="Key features" kicker="Product">
              <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
                {cs.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-foreground/90 transition-colors hover:border-primary/25 hover:bg-muted/35"
                  >
                    <Lightning className="mt-0.5 size-4 shrink-0 text-primary" weight="duotone" aria-hidden />
                    <span className="whitespace-pre-line leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {slides.length > 0 ? (
            <DetailSection id="screenshots" title="Screenshots" kicker="Preview">
              <ProjectGallery slides={slides} projectTitle={project.title} />
            </DetailSection>
          ) : null}

          {cs?.architectureSteps && cs.architectureSteps.length > 0 ? (
            <DetailSection id="architecture" title="Architecture & flow" kicker="System design">
              <div className="max-w-xl rounded-xl border border-border/60 bg-muted/15 px-6 py-8 font-mono text-sm leading-relaxed text-foreground/90">
                {cs.architectureSteps.map((step, i) => (
                  <div key={`${step}-${i}`} className="flex flex-col items-center gap-1">
                    <span className="whitespace-pre-line text-center">{step}</span>
                    {i < cs.architectureSteps!.length - 1 ? (
                      <span className="my-1 text-lg text-primary/70" aria-hidden>
                        ↓
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </DetailSection>
          ) : null}

          {cs?.challenges && cs.challenges.length > 0 ? (
            <DetailSection id="challenges" title="Technical challenges" kicker="Problem solving">
              <ul className="max-w-2xl space-y-3 border-l-2 border-primary/35 pl-5">
                {cs.challenges.map((c) => (
                  <li key={c} className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {c}
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {cs?.impact && cs.impact.length > 0 ? (
            <DetailSection id="impact" title="Results & impact" kicker="Outcomes">
              <ul className="max-w-2xl space-y-4">
                {cs.impact.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed sm:text-[15px]">
                    <CheckCircle
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      weight="fill"
                      aria-hidden
                    />
                    <span className="whitespace-pre-line text-foreground/90">{line}</span>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {cs?.timeline && cs.timeline.length > 0 ? (
            <DetailSection id="timeline" title="Activity" kicker="Timeline">
              <ol className="relative max-w-xl space-y-0 border-l border-border/80 pl-5">
                {cs.timeline.map((t, i) => (
                  <li key={`${t.period}-${i}`} className="relative pb-8 pl-4 last:pb-0">
                    <span
                      className="absolute top-1.5 left-[-21px] size-2.5 rounded-full bg-primary ring-4 ring-background"
                      aria-hidden
                    />
                    <p className="text-xs font-semibold tracking-wide text-primary">{t.period}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{t.title}</p>
                  </li>
                ))}
              </ol>
            </DetailSection>
          ) : null}

          {project.content?.trim() ? (
            <DetailSection id="write-up" title="Deep dive" kicker="Notes">
              <div
                className="prose prose-sm max-w-2xl dark:prose-invert prose-p:my-3 prose-p:leading-[1.75] prose-headings:scroll-mt-28 prose-headings:tracking-tight prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-lg prose-h2:font-semibold prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-base prose-h3:font-semibold prose-li:my-1 prose-ul:my-3 prose-ol:my-3 [&_h1]:mt-12 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li>p]:my-0 [&_li]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-muted-foreground [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground [&_blockquote]:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </DetailSection>
          ) : null}

          {hasLinks ? (
            <DetailSection id="links" title="Try it out" kicker="Links">
              <div className="flex max-w-xl flex-wrap gap-2">
                {project.liveUrl ? (
                  <Button asChild size="sm" className="rounded-lg">
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      Live demo <ArrowUpRight className="size-3.5" weight="bold" aria-hidden />
                    </Link>
                  </Button>
                ) : null}
                {project.githubUrl ? (
                  <Button asChild size="sm" variant="outline" className="rounded-lg">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <GithubLogo className="size-3.5" weight="duotone" aria-hidden />
                      GitHub
                    </Link>
                  </Button>
                ) : null}
                {cs?.docsUrl ? (
                  <Button asChild size="sm" variant="outline" className="rounded-lg">
                    <Link href={cs.docsUrl} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="size-3.5" weight="duotone" aria-hidden />
                      Documentation
                    </Link>
                  </Button>
                ) : null}
              </div>
            </DetailSection>
          ) : null}
        </article>
      </ProjectDetailShell>
    </div>
  );
}
