import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/services/project.service";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id).catch(() => null);
  return { title: project ? `Edit: ${project.title} — Admin` : "Edit Project — Admin" };
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id).catch(() => null);

  if (!project) notFound();

  return (
    <div>
      <AdminHeader
        title={`Edit: ${project.title}`}
        description="Update project details."
      />
      <div className="w-full max-w-none p-6 lg:px-8 xl:px-10">
        <ProjectForm project={project} mode="edit" />
      </div>
    </div>
  );
}
