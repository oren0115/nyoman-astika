import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ArrowUpRight, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectsTableActions } from "@/components/admin/ProjectsTableActions";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { getProjects } from "@/lib/services/project.service";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects — Admin" };

interface Props {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function AdminProjectsPage({ searchParams }: Props) {
  const { page = "1", search, status } = await searchParams;
  const currentPage = parseInt(page, 10);

  const { projects, total, totalPages } = await getProjects({
    search,
    status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
    page: currentPage,
    limit: 15,
  }).catch(() => ({ projects: [], total: 0, totalPages: 1, page: 1, limit: 15 }));

  return (
    <div>
      <AdminHeader
        title="Projects"
        description={`${total} total project${total !== 1 ? "s" : ""}`}
        actions={
          <Button asChild size="xs">
            <Link href="/admin/projects/new">
              <Plus /> New Project
            </Link>
          </Button>
        }
      />

      <div className="p-6">
        <ProjectsTableActions currentSearch={search} currentStatus={status} />

        <div className="mt-4 rounded-none border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Title</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Tech Stack</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Created</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-xs text-muted-foreground"
                  >
                    {search || status
                      ? "No projects match your filters."
                      : "No projects yet. "}
                    {!search && !status && (
                      <Link
                        href="/admin/projects/new"
                        className="text-primary hover:underline"
                      >
                        Create your first
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <p className="text-xs font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {project.slug}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "PUBLISHED"
                            ? "default"
                            : project.status === "DRAFT"
                              ? "outline"
                              : "muted"
                        }
                        className="text-xs"
                      >
                        {project.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="text-xs px-1.5 py-0"
                          >
                            {t}
                          </Badge>
                        ))}
                        {project.techStack.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            +{project.techStack.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {formatDateShort(project.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {project.status === "PUBLISHED" && (
                          <Button asChild variant="ghost" size="icon-xs">
                            <Link
                              href={`/projects/${project.slug}`}
                              target="_blank"
                            >
                              <ArrowUpRight />
                            </Link>
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="icon-xs">
                          <Link href={`/admin/projects/${project.id}/edit`}>
                            <PencilSimple />
                          </Link>
                        </Button>
                        <DeleteProjectButton id={project.id} title={project.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Button asChild variant="outline" size="xs">
                  <Link
                    href={`?page=${currentPage - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}
              {currentPage < totalPages && (
                <Button asChild variant="outline" size="xs">
                  <Link
                    href={`?page=${currentPage + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
