import Link from "next/link";
import { GithubLogo, LinkedinLogo, TwitterLogo } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();
  const { author } = siteConfig;

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-xs text-muted-foreground">
          © {year} {author.name}. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          {author.github && (
            <Link
              href={author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <GithubLogo className="size-4" />
            </Link>
          )}
          {author.linkedin && (
            <Link
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <LinkedinLogo className="size-4" />
            </Link>
          )}
          {author.twitter && (
            <Link
              href={author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Twitter"
            >
              <TwitterLogo className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
