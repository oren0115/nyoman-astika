import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata: Metadata = { title: "New Project — Admin" };

export default function NewProjectPage() {
  return (
    <div>
      <AdminHeader
        title="New Project"
        description="Add a new project to your portfolio."
      />
      <div className="p-6 max-w-3xl">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
