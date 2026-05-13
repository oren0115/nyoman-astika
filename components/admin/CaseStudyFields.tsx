"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CaseStudyDraft } from "@/lib/project-case-study";

const STATUS_OPTIONS = [
  "Live",
  "Production",
  "In development",
  "Beta",
  "Archived",
] as const;

interface CaseStudyFieldsProps {
  value: CaseStudyDraft;
  onChange: (next: CaseStudyDraft) => void;
  imageCount: number;
}

export function CaseStudyFields({ value, onChange, imageCount }: CaseStudyFieldsProps) {
  function patch(partial: Partial<CaseStudyDraft>) {
    onChange({ ...value, ...partial });
  }

  return (
    <details className="rounded-lg border border-border bg-muted/20 px-4 py-3">
      <summary className="cursor-pointer text-xs font-medium text-foreground select-none">
        Case study layout (hero, metrics, architecture, timeline…)
      </summary>
      <div className="mt-6 space-y-6 pb-2">
        <p className="text-xs text-muted-foreground">
          Isi opsional. Data ini membangun halaman detail proyek dengan struktur case study (overview, metrik,
          tantangan teknis, dsb.).
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Headline / subtitle</Label>
            <Input
              value={value.headline}
              onChange={(e) => patch({ headline: e.target.value })}
              placeholder="Network Monitoring System"
              maxLength={200}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status (tampilan)</Label>
            <Select
              value={value.displayStatus || "__none__"}
              onValueChange={(v) => patch({ displayStatus: v === "__none__" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="cursor-pointer">
                  —
                </SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s} className="cursor-pointer">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Kategori</Label>
            <Input
              value={value.category}
              onChange={(e) => patch({ category: e.target.value })}
              placeholder="Fullstack, DevOps…"
              maxLength={120}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Peran</Label>
            <Input
              value={value.role}
              onChange={(e) => patch({ role: e.target.value })}
              placeholder="Fullstack Developer"
              maxLength={120}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Periode</Label>
            <Input
              value={value.periodLabel}
              onChange={(e) => patch({ periodLabel: e.target.value })}
              placeholder="2025 — 2026"
              maxLength={120}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Dokumentasi URL</Label>
            <Input
              value={value.docsUrl}
              onChange={(e) => patch({ docsUrl: e.target.value })}
              placeholder="https://…"
              type="url"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Problem</Label>
            <Textarea
              value={value.problem}
              onChange={(e) => patch({ problem: e.target.value })}
              rows={4}
              placeholder="Masalah yang diselesaikan…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Solution</Label>
            <Textarea
              value={value.solution}
              onChange={(e) => patch({ solution: e.target.value })}
              rows={4}
              placeholder="Pendekatan solusi…"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Arsitektur / alur (satu langkah per baris)</Label>
          <Textarea
            value={value.architectureText}
            onChange={(e) => patch({ architectureText: e.target.value })}
            rows={5}
            placeholder={"Router / Switch\nSNMP Poller\nExpress API"}
            className="font-mono text-xs"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Fitur (satu per baris)</Label>
            <Textarea
              value={value.featuresText}
              onChange={(e) => patch({ featuresText: e.target.value })}
              rows={5}
              placeholder="Real-time monitoring"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tantangan teknis (satu per baris)</Label>
            <Textarea
              value={value.challengesText}
              onChange={(e) => patch({ challengesText: e.target.value })}
              rows={5}
              placeholder="Handling SNMP timeout"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Impact / hasil (satu per baris)</Label>
          <Textarea
            value={value.impactText}
            onChange={(e) => patch({ impactText: e.target.value })}
            rows={4}
            placeholder="Reduced response time by 60%"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Metrik (label + nilai)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[11px]"
              onClick={() =>
                patch({ stats: [...value.stats, { label: "", value: "" }] })
              }
            >
              + Baris
            </Button>
          </div>
          <div className="space-y-2">
            {value.stats.map((row, i) => (
              <div key={i} className="flex flex-wrap gap-2 sm:flex-nowrap">
                <Input
                  placeholder="Label"
                  value={row.label}
                  onChange={(e) => {
                    const stats = [...value.stats];
                    stats[i] = { ...stats[i]!, label: e.target.value };
                    patch({ stats });
                  }}
                  className="text-xs sm:flex-1"
                />
                <Input
                  placeholder="Nilai"
                  value={row.value}
                  onChange={(e) => {
                    const stats = [...value.stats];
                    stats[i] = { ...stats[i]!, value: e.target.value };
                    patch({ stats });
                  }}
                  className="text-xs sm:flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 shrink-0 text-muted-foreground"
                  onClick={() => patch({ stats: value.stats.filter((_, j) => j !== i) })}
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Timeline (periode + judul)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[11px]"
              onClick={() =>
                patch({ timeline: [...value.timeline, { period: "", title: "" }] })
              }
            >
              + Baris
            </Button>
          </div>
          <div className="space-y-2">
            {value.timeline.map((row, i) => (
              <div key={i} className="flex flex-wrap gap-2 sm:flex-nowrap">
                <Input
                  placeholder="Jan 2026"
                  value={row.period}
                  onChange={(e) => {
                    const timeline = [...value.timeline];
                    timeline[i] = { ...timeline[i]!, period: e.target.value };
                    patch({ timeline });
                  }}
                  className="text-xs sm:w-36"
                />
                <Input
                  placeholder="SNMP Poller"
                  value={row.title}
                  onChange={(e) => {
                    const timeline = [...value.timeline];
                    timeline[i] = { ...timeline[i]!, title: e.target.value };
                    patch({ timeline });
                  }}
                  className="text-xs sm:flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 shrink-0 text-muted-foreground"
                  onClick={() =>
                    patch({ timeline: value.timeline.filter((_, j) => j !== i) })
                  }
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
        </div>

        {imageCount > 0 ? (
          <div className="space-y-2">
            <Label className="text-xs">Caption screenshot (sesuai urutan gambar)</Label>
            <div className="space-y-2">
              {Array.from({ length: imageCount }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-[10px] text-muted-foreground">{i + 1}</span>
                  <Input
                    value={value.imageCaptions[i] ?? ""}
                    onChange={(e) => {
                      const imageCaptions = [...value.imageCaptions];
                      while (imageCaptions.length < imageCount) imageCaptions.push("");
                      imageCaptions[i] = e.target.value;
                      patch({ imageCaptions });
                    }}
                    placeholder={`Caption gambar ${i + 1}`}
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </details>
  );
}
