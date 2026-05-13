"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

interface ProjectDetailShellProps {
  tocItems: TocItem[];
  children: React.ReactNode;
}

/** Garis baca di bawah navbar sticky; section yang judulnya sudah di atas garis ini = aktif. */
const VIEWPORT_ACTIVATION_PX = 112;

function pickActiveId(ids: string[]): string {
  let active = ids[0] ?? "";
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= VIEWPORT_ACTIVATION_PX) {
      active = id;
    }
  }
  return active;
}

interface ProjectDetailShellProps {
  tocItems: TocItem[];
  children: React.ReactNode;
}

export function ProjectDetailShell({ tocItems, children }: ProjectDetailShellProps) {
  const ids = tocItems.map((t) => t.id);
  const [active, setActive] = useState(tocItems[0]?.id ?? "");

  const syncFromScroll = useCallback(() => {
    if (ids.length === 0) return;
    setActive(pickActiveId(ids));
  }, [ids]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (hash && ids.includes(hash)) {
      setActive(hash);
    } else {
      syncFromScroll();
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        syncFromScroll();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const t = window.setTimeout(syncFromScroll, 100);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t);
    };
  }, [tocItems.length, ids, syncFromScroll]);

  function handleTocClick(id: string) {
    setActive(id);
    requestAnimationFrame(() => {
      requestAnimationFrame(syncFromScroll);
    });
  }

  if (tocItems.length === 0) {
    return <>{children}</>;
  }

  const linkClass = (id: string) =>
    cn(
      "block rounded-lg px-2.5 py-1.5 text-xs transition-colors",
      active === id
        ? "bg-primary/10 font-medium text-primary"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    );

  return (
    <div className="relative">
      <nav
        aria-label="On this page"
        className="sticky top-14 z-30 -mx-4 mb-8 border-b border-border/60 bg-background/90 px-4 py-2 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 lg:hidden"
      >
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => handleTocClick(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs whitespace-nowrap transition-colors",
                active === item.id
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/80 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="lg:grid lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-16">
        <aside className="relative hidden lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-28 space-y-0.5 border-l border-border/60 pl-4"
          >
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              On this page
            </p>
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => handleTocClick(item.id)}
                className={linkClass(item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
