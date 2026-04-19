import Image from "next/image";
import type { Experience } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "@phosphor-icons/react/dist/ssr";

interface ExperienceCardProps {
  experience: Experience;
  isLast?: boolean;
}

function formatPeriod(start: Date, end: Date | null, current: boolean): string {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(d);
  return `${fmt(start)} — ${current ? "Present" : end ? fmt(end) : ""}`;
}

function getDuration(start: Date, end: Date | null, current: boolean): string {
  const endDate = current ? new Date() : (end ?? new Date());
  const months =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth());
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y}y`);
  if (m > 0) parts.push(`${m}mo`);
  return parts.join(" ") || "< 1 mo";
}

export function ExperienceCard({ experience, isLast = false }: ExperienceCardProps) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
      )}

      {/* Logo / dot */}
      <div className="relative z-10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-border bg-background">
        {experience.logoUrl ? (
          <Image
            src={experience.logoUrl}
            alt={experience.company}
            width={28}
            height={28}
            className="object-contain"
          />
        ) : (
          <span className="text-xs font-semibold text-muted-foreground">
            {experience.company.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-1">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{experience.role}</h3>
            <p className="text-xs font-medium text-primary">{experience.company}</p>
          </div>
          {experience.current && (
            <Badge variant="secondary" className="text-xs shrink-0">
              Current
            </Badge>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatPeriod(experience.startDate, experience.endDate, experience.current)}
            <span className="text-muted-foreground/60">
              · {getDuration(experience.startDate, experience.endDate, experience.current)}
            </span>
          </span>
          {experience.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {experience.location}
            </span>
          )}
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
          {experience.description}
        </p>

        {experience.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {experience.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs px-1.5 py-0">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
