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
      <div className="w-full max-w-none p-6 lg:px-8 xl:px-10">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
