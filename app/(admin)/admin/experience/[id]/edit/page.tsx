import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { getExperienceById } from "@/lib/services/experience.service";

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: "Edit Experience — Admin" };

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params;
  const experience = await getExperienceById(id).catch(() => null);
  if (!experience) notFound();

  return (
    <div>
      <AdminHeader
        title={`Edit: ${experience.role}`}
        description={experience.company}
      />
      <div className="p-6 max-w-2xl">
        <ExperienceForm experience={experience} mode="edit" />
      </div>
    </div>
  );
}
