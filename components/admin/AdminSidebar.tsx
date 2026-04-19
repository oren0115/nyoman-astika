"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  FolderOpen,
  Article,
  SignOut,
  Gauge,
  Briefcase,
  EnvelopeSimple,
  SidebarSimple,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/posts", label: "Blog Posts", icon: Article },
  { href: "/admin/messages", label: "Messages", icon: EnvelopeSimple },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Restore preference from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  // Avoid layout shift before mount
  if (!mounted) return <aside className="w-56 shrink-0 border-r border-border bg-sidebar" />;

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          "flex h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200 ease-in-out",
          collapsed ? "w-14" : "w-56",
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
          {!collapsed && (
            <Link
              href="/"
              target="_blank"
              className="truncate font-mono text-sm font-semibold text-sidebar-foreground transition-colors hover:text-sidebar-primary"
            >
              {siteConfig.author.name}
              <span className="text-sidebar-primary">.</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            className={cn(
              "shrink-0 cursor-pointer text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed && "mx-auto",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <SidebarSimple className="size-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

            const linkClass = cn(
              "flex items-center rounded-none px-2.5 py-2 text-xs font-medium transition-colors",
              collapsed ? "justify-center" : "gap-2.5",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            );

            if (collapsed) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link href={href} className={linkClass} aria-label={label}>
                      <Icon className="size-5 shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link key={href} href={href} className={linkClass}>
                <Icon className="size-4.5 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2">
          <Separator className="mb-2 bg-sidebar-border" />

          {collapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    target="_blank"
                    aria-label="View Site"
                    className="flex items-center justify-center rounded-none px-2.5 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                  >
                    <House className="size-5 shrink-0" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">View Site</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    aria-label="Sign out"
                    className="flex w-full items-center justify-center rounded-none px-2.5 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-destructive transition-colors"
                  >
                    <SignOut className="size-5 shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign out</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2.5 rounded-none px-3 py-2 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
              >
                <House className="size-4.5 shrink-0" />
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-none px-3 py-2 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-destructive transition-colors"
              >
                <SignOut className="size-4.5 shrink-0" />
                Sign out
              </button>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
