"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { ProjectDetailShell, type TocItem } from "@/components/projects/ProjectDetailShell";
import { ProjectGallery, type GallerySlide } from "@/components/projects/ProjectGallery";
import { slugify } from "@/lib/utils";

function BlogSection({
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

function buildHeadingToc(root: HTMLElement): TocItem[] {
  const headings = root.querySelectorAll("h2");
  const used = new Set<string>();
  const items: TocItem[] = [];

  headings.forEach((el, i) => {
    let id = el.id?.trim();
    if (!id || used.has(id)) {
      const raw = slugify(el.textContent || `section-${i}`);
      const base = raw || `section-${i}`;
      let candidate = base;
      let n = 0;
      while (used.has(candidate) || document.getElementById(candidate)) {
        n += 1;
        candidate = `${base}-${n}`;
      }
      id = candidate;
      el.id = id;
    }
    used.add(id);
    el.classList.add("scroll-mt-28", "sm:scroll-mt-32");
    const label = (el.textContent || `Section ${i + 1}`).trim().slice(0, 72);
    items.push({ id, label: label || `Section ${i + 1}` });
  });

  return items;
}

export interface BlogPostLayoutProps {
  title: string;
  excerptParagraphs: string[];
  tags: string[];
  featured: boolean;
  publishedLabel: string;
  updatedLabel: string;
  slides: GallerySlide[];
  contentHtml: string;
}

export function BlogPostLayout({
  title,
  excerptParagraphs,
  tags,
  featured,
  publishedLabel,
  updatedLabel,
  slides,
  contentHtml,
}: BlogPostLayoutProps) {
  const proseRef = useRef<HTMLDivElement>(null);
  const [headingToc, setHeadingToc] = useState<TocItem[]>([]);

  useLayoutEffect(() => {
    const root = proseRef.current;
    if (!root) return;
    setHeadingToc(buildHeadingToc(root));
  }, [contentHtml]);

  const baseToc: TocItem[] = [{ id: "intro", label: "Overview" }];
  if (slides.length > 0) {
    baseToc.push({ id: "gallery", label: "Images" });
  }
  const tocItems = [...baseToc, ...headingToc];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to blog
      </Link>

      <header className="relative mb-14 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-muted/40 via-background/80 to-background p-8 shadow-sm ring-1 ring-foreground/[0.04] backdrop-blur-md sm:p-10 lg:p-12">
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/[0.07] blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <time>{publishedLabel}</time>
            <span>·</span>
            <span>Updated {updatedLabel}</span>
            {featured ? (
              <>
                <span>·</span>
                <Badge variant="outline" className="rounded-md text-[11px]">
                  Featured
                </Badge>
              </>
            ) : null}
          </div>

          <h1 className="mb-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
            {title}
          </h1>

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-md text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <ProjectDetailShell tocItems={tocItems}>
        <article className="max-w-3xl">
          <BlogSection id="intro" title="Overview" kicker="Summary">
            <div className="max-w-2xl space-y-5 text-sm leading-[1.75] text-muted-foreground sm:text-[15px] sm:leading-[1.8]">
              {excerptParagraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </BlogSection>

          {slides.length > 0 ? (
            <BlogSection id="gallery" title="Images" kicker="Media">
              <ProjectGallery slides={slides} projectTitle={title} />
            </BlogSection>
          ) : null}

          <div
            ref={proseRef}
            className="blog-prose prose prose-sm max-w-2xl border-b border-border/40 pb-14 dark:prose-invert prose-p:my-3 prose-p:leading-[1.75] prose-headings:scroll-mt-28 prose-headings:tracking-tight prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-lg prose-h2:font-semibold prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-base prose-h3:font-semibold prose-li:my-1 prose-ul:my-3 prose-ol:my-3 [&_h1]:mt-12 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_li>p]:my-0 [&_li]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-muted-foreground [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>
      </ProjectDetailShell>
    </div>
  );
}
