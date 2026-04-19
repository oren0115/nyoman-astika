"use client";

import { useRouter, usePathname } from "next/navigation";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

interface ProjectsTableActionsProps {
  currentSearch?: string;
  currentStatus?: string;
}

export function ProjectsTableActions({
  currentSearch,
  currentStatus,
}: ProjectsTableActionsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      if (currentSearch && key !== "search") params.set("search", currentSearch);
      if (currentStatus && key !== "status") params.set("status", currentStatus);
      if (value) params.set(key, value);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [currentSearch, currentStatus, pathname, router],
  );

  const clearFilters = () => router.push(pathname);
  const hasFilters = currentSearch || currentStatus;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <MagnifyingGlass className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects…"
          defaultValue={currentSearch}
          onChange={(e) => {
            const val = e.target.value;
            const timeout = setTimeout(() => updateParams("search", val), 400);
            return () => clearTimeout(timeout);
          }}
          className="pl-8 h-7 text-xs"
        />
      </div>

      <Select
        value={currentStatus ?? "all"}
        onValueChange={(v) => updateParams("status", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-32 h-7 text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="DRAFT">Draft</SelectItem>
          <SelectItem value="PUBLISHED">Published</SelectItem>
          <SelectItem value="ARCHIVED">Archived</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="xs" onClick={clearFilters}>
          <X /> Clear
        </Button>
      )}
    </div>
  );
}
