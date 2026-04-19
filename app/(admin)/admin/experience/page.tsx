import type { Metadata } from "next";
import Link from "next/link";
import { Plus, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteExperienceButton } from "@/components/admin/DeleteExperienceButton";
import { getExperiences } from "@/lib/services/experience.service";

export const metadata: Metadata = { title: "Experience — Admin" };

function formatPeriod(start: Date, end: Date | null, current: boolean) {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(d);
  return `${fmt(start)} — ${current ? "Present" : end ? fmt(end) : "?"}`;
}

export default async function AdminExperiencePage() {
  const experiences = await getExperiences().catch(() => []);

  return (
    <div>
      <AdminHeader
        title="Experience"
        description={`${experiences.length} entr${experiences.length !== 1 ? "ies" : "y"}`}
        actions={
          <Button asChild size="xs">
            <Link href="/admin/experience/new">
              <Plus /> Add Experience
            </Link>
          </Button>
        }
      />

      <div className="p-6">
        <div className="rounded-none border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Role / Company</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Period</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Skills</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-xs text-muted-foreground">
                    No experience entries yet.{" "}
                    <Link href="/admin/experience/new" className="text-primary hover:underline">
                      Add your first
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                experiences.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>
                      <p className="text-xs font-medium">{exp.role}</p>
                      <p className="text-xs text-primary">{exp.company}</p>
                      {exp.location && (
                        <p className="text-xs text-muted-foreground">{exp.location}</p>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {formatPeriod(exp.startDate, exp.endDate, exp.current)}
                        {exp.current && (
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {exp.skills.slice(0, 3).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs px-1.5 py-0">{s}</Badge>
                        ))}
                        {exp.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">+{exp.skills.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-xs">
                          <Link href={`/admin/experience/${exp.id}/edit`}>
                            <PencilSimple />
                          </Link>
                        </Button>
                        <DeleteExperienceButton id={exp.id} title={`${exp.role} @ ${exp.company}`} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
