import {
  projectCaseStudySchema,
  type ProjectCaseStudyInput,
} from "@/lib/validations/project";

export type ProjectCaseStudy = ProjectCaseStudyInput;

function isEmptyObject(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  );
}

export function parseProjectCaseStudy(raw: unknown): ProjectCaseStudy | null {
  if (raw == null || raw === "" || isEmptyObject(raw)) return null;
  const parsed = projectCaseStudySchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

function isNonEmptyString(v: string | undefined): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function isNonEmptyArray<T>(v: T[] | undefined): v is T[] {
  return Array.isArray(v) && v.length > 0;
}

/** Strip empty fields; return `undefined` if nothing meaningful to persist. */
export function serializeProjectCaseStudy(
  input: ProjectCaseStudy | null | undefined,
): ProjectCaseStudy | undefined {
  if (!input) return undefined;

  const out: Record<string, unknown> = {};

  if (isNonEmptyString(input.headline)) out.headline = input.headline!.trim();
  if (input.displayStatus) out.displayStatus = input.displayStatus;
  if (isNonEmptyString(input.role)) out.role = input.role!.trim();
  if (isNonEmptyString(input.periodLabel)) out.periodLabel = input.periodLabel!.trim();
  if (isNonEmptyString(input.category)) out.category = input.category!.trim();
  if (isNonEmptyString(input.docsUrl)) out.docsUrl = input.docsUrl!.trim();

  if (isNonEmptyString(input.problem)) out.problem = input.problem!.trim();
  if (isNonEmptyString(input.solution)) out.solution = input.solution!.trim();

  if (isNonEmptyArray(input.architectureSteps)) {
    out.architectureSteps = input.architectureSteps.map((s) => s.trim()).filter(Boolean);
  }
  if (isNonEmptyArray(input.features)) {
    out.features = input.features.map((s) => s.trim()).filter(Boolean);
  }
  if (isNonEmptyArray(input.challenges)) {
    out.challenges = input.challenges.map((s) => s.trim()).filter(Boolean);
  }
  if (isNonEmptyArray(input.impact)) {
    out.impact = input.impact.map((s) => s.trim()).filter(Boolean);
  }

  if (isNonEmptyArray(input.stats)) {
    out.stats = input.stats
      .map((s) => ({
        label: s.label.trim(),
        value: s.value.trim(),
      }))
      .filter((s) => s.label && s.value);
  }

  if (isNonEmptyArray(input.timeline)) {
    out.timeline = input.timeline
      .map((t) => ({
        period: t.period.trim(),
        title: t.title.trim(),
      }))
      .filter((t) => t.period && t.title);
  }

  if (isNonEmptyArray(input.imageCaptions)) {
    out.imageCaptions = input.imageCaptions.map((c) => c.trim());
  }

  if (isNonEmptyArray(input.techGroups)) {
    out.techGroups = input.techGroups
      .map((g) => ({
        name: g.name.trim(),
        items: g.items.map((i) => i.trim()).filter(Boolean),
      }))
      .filter((g) => g.name && g.items.length > 0);
  }

  if (Object.keys(out).length === 0) return undefined;
  const parsed = projectCaseStudySchema.safeParse(out);
  return parsed.success ? parsed.data : undefined;
}

/** Admin form shape (no optional undefined — easier controlled inputs). */
export interface CaseStudyDraft {
  headline: string;
  displayStatus: string;
  role: string;
  periodLabel: string;
  category: string;
  docsUrl: string;
  problem: string;
  solution: string;
  architectureText: string;
  featuresText: string;
  challengesText: string;
  impactText: string;
  stats: { label: string; value: string }[];
  timeline: { period: string; title: string }[];
  imageCaptions: string[];
}

export function emptyCaseStudyDraft(): CaseStudyDraft {
  return {
    headline: "",
    displayStatus: "",
    role: "",
    periodLabel: "",
    category: "",
    docsUrl: "",
    problem: "",
    solution: "",
    architectureText: "",
    featuresText: "",
    challengesText: "",
    impactText: "",
    stats: [],
    timeline: [],
    imageCaptions: [],
  };
}

export function caseStudyToDraft(raw: unknown, imageCount: number): CaseStudyDraft {
  const cs = parseProjectCaseStudy(raw);
  const base = emptyCaseStudyDraft();
  if (!cs) {
    base.imageCaptions = Array.from({ length: imageCount }, () => "");
    return base;
  }

  const captions = [...(cs.imageCaptions ?? [])];
  while (captions.length < imageCount) captions.push("");
  if (captions.length > imageCount) captions.length = imageCount;

  return {
    headline: cs.headline ?? "",
    displayStatus: cs.displayStatus ?? "",
    role: cs.role ?? "",
    periodLabel: cs.periodLabel ?? "",
    category: cs.category ?? "",
    docsUrl: cs.docsUrl ?? "",
    problem: cs.problem ?? "",
    solution: cs.solution ?? "",
    architectureText: (cs.architectureSteps ?? []).join("\n"),
    featuresText: (cs.features ?? []).join("\n"),
    challengesText: (cs.challenges ?? []).join("\n"),
    impactText: (cs.impact ?? []).join("\n"),
    stats: cs.stats?.length ? cs.stats.map((s) => ({ ...s })) : [],
    timeline: cs.timeline?.length ? cs.timeline.map((t) => ({ ...t })) : [],
    imageCaptions: captions,
  };
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function draftToCaseStudyInput(draft: CaseStudyDraft): ProjectCaseStudyInput {
  const displayStatus = draft.displayStatus as ProjectCaseStudyInput["displayStatus"];
  const validStatus =
    displayStatus &&
    ["Live", "Production", "In development", "Beta", "Archived"].includes(displayStatus)
      ? displayStatus
      : undefined;

  return {
    headline: draft.headline.trim() || undefined,
    displayStatus: validStatus,
    role: draft.role.trim() || undefined,
    periodLabel: draft.periodLabel.trim() || undefined,
    category: draft.category.trim() || undefined,
    docsUrl: draft.docsUrl.trim() || undefined,
    problem: draft.problem.trim() || undefined,
    solution: draft.solution.trim() || undefined,
    architectureSteps: linesToArray(draft.architectureText).length
      ? linesToArray(draft.architectureText)
      : undefined,
    features: linesToArray(draft.featuresText).length ? linesToArray(draft.featuresText) : undefined,
    challenges: linesToArray(draft.challengesText).length
      ? linesToArray(draft.challengesText)
      : undefined,
    impact: linesToArray(draft.impactText).length ? linesToArray(draft.impactText) : undefined,
    stats: draft.stats.length
      ? draft.stats
          .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
          .filter((s) => s.label && s.value)
      : undefined,
    timeline: draft.timeline.length
      ? draft.timeline
          .map((t) => ({ period: t.period.trim(), title: t.title.trim() }))
          .filter((t) => t.period && t.title)
      : undefined,
    imageCaptions: draft.imageCaptions.some((c) => c.trim())
      ? draft.imageCaptions.map((c) => c.trim())
      : undefined,
  };
}
