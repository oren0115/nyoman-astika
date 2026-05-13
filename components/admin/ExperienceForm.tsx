"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/admin/TagInput";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ExperienceFormProps {
  experience?: Experience;
  mode: "create" | "edit";
}

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function ExperienceForm({ experience, mode }: ExperienceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [company, setCompany] = useState(experience?.company ?? "");
  const [role, setRole] = useState(experience?.role ?? "");
  const [location, setLocation] = useState(experience?.location ?? "");
  const [logoUrl, setLogoUrl] = useState(experience?.logoUrl ?? "");
  const [startDate, setStartDate] = useState(toDateInputValue(experience?.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(experience?.endDate));
  const [current, setCurrent] = useState(experience?.current ?? false);
  const [description, setDescription] = useState(experience?.description ?? "");
  const [skills, setSkills] = useState<string[]>(experience?.skills ?? []);
  const [order, setOrder] = useState(experience?.order ?? 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      company,
      role,
      location: location || undefined,
      logoUrl: logoUrl || undefined,
      startDate,
      endDate: current ? null : endDate || null,
      current,
      description,
      skills,
      order,
    };

    try {
      const url =
        mode === "create" ? "/api/experience" : `/api/experience/${experience!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }

      router.push("/admin/experience");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-none border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-xs">
            Company <span className="text-destructive">*</span>
          </Label>
          <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-xs">
            Role / Title <span className="text-destructive">*</span>
          </Label>
          <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Frontend Engineer" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location" className="text-xs">Location</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote / Bali, Indonesia" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="order" className="text-xs">Sort Order</Label>
          <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(parseInt(e.target.value, 10))} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="startDate" className="text-xs">
            Start Date <span className="text-destructive">*</span>
          </Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="endDate" className="text-xs">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={current}
            placeholder="Leave blank if current"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="current"
          checked={current}
          onChange={(e) => {
            setCurrent(e.target.checked);
            if (e.target.checked) setEndDate("");
          }}
          className="h-3.5 w-3.5 accent-primary"
        />
        <label htmlFor="current" className="text-xs text-muted-foreground cursor-pointer">
          I currently work here
        </label>
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-xs">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your responsibilities, achievements, and impact…"
          rows={4}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Skills / Technologies</Label>
        <TagInput value={skills} onChange={setSkills} placeholder="Add skill (React, Node.js…), press Enter" />
      </div>

      <ImageUpload
        value={logoUrl}
        onChange={setLogoUrl}
        label="Company Logo"
        aspectRatio="square"
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" className="cursor-pointer" variant="outline" size="sm" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="cursor-pointer" disabled={loading}>
          {loading
            ? mode === "create" ? "Creating…" : "Saving…"
            : mode === "create" ? "Add Experience" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
