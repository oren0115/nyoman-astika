"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowsOutSimple } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface GallerySlide {
  src: string;
  alt: string;
  caption?: string;
}

interface ProjectGalleryProps {
  slides: GallerySlide[];
  projectTitle: string;
}

export function ProjectGallery({ slides, projectTitle }: ProjectGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (slides.length === 0) return null;

  const current = slides[index]!;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {slides.map((slide, i) => (
          <button
            key={`${slide.src}-${i}`}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className={cn(
              "group text-left transition-all duration-200",
              "rounded-xl border border-border/80 bg-card/40 p-3 shadow-sm",
              "ring-1 ring-foreground/[0.04] hover:border-primary/25 hover:shadow-md hover:ring-primary/10",
            )}
          >
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted/50">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                priority={i === 0}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-[11px] font-medium text-foreground shadow-sm">
                  <ArrowsOutSimple className="size-3.5" weight="bold" aria-hidden />
                  Full preview
                </span>
              </div>
            </div>
            {slide.caption ? (
              <p className="mt-3 px-0.5 text-xs font-medium tracking-tight text-foreground/90">
                {slide.caption}
              </p>
            ) : (
              <p className="mt-3 px-0.5 text-xs text-muted-foreground">
                {projectTitle} — {i + 1}
              </p>
            )}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="max-h-[min(92vh,900px)] w-[min(96vw,1100px)] max-w-none gap-0 overflow-hidden rounded-xl border-border/80 p-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">{current.alt}</DialogTitle>
          <div className="relative max-h-[min(78vh,760px)] min-h-[200px] w-full bg-muted/30">
            <Image
              src={current.src}
              alt={current.alt}
              width={1600}
              height={900}
              sizes="(max-width: 1100px) 96vw, 1100px"
              className="mx-auto h-full max-h-[min(78vh,760px)] w-auto object-contain"
            />
          </div>
          {current.caption && (
            <p className="border-t border-border/60 bg-background/95 px-4 py-3 text-xs text-muted-foreground">
              {current.caption}
            </p>
          )}
          {slides.length > 1 && (
            <div className="flex gap-2 border-t border-border/60 bg-muted/20 px-3 py-2.5">
              {slides.map((s, i) => (
                <button
                  key={`thumb-${s.src}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative h-11 w-16 shrink-0 overflow-hidden rounded-md border transition-colors",
                    i === index
                      ? "border-primary ring-1 ring-primary/30"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={s.src} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
