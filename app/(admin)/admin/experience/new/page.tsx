import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export const metadata: Metadata = { title: "Add Experience — Admin" };

export default function NewExperiencePage() {
  return (
    <div>
      <AdminHeader title="Add Experience" description="Add a new work experience entry." />
      <div className="p-6 max-w-2xl">
        <ExperienceForm mode="create" />
      </div>
    </div>
  );
}
