/**
 * Allowed labels for blog posts (admin + public filter). Keep in sync with admin UI.
 */
export const BLOG_LABELS = [
  "Automation",
  "Azure",
  "Backup & Recovery",
  "Cloud Infrastructure",
  "Compliance",
  "Conditional Access",
  "Configuration",
  "Cyber Security",
  "DNS",
  "Endpoint",
  "Entra ID",
  "Firewall",
  "Governance",
  "IAM",
  "Identity",
  "Intune",
  "M365",
  "Monitoring",
  "Networking",
  "PowerShell",
  "Scripts",
  "Security Operations",
  "Storage",
  "Virtualisation",
  "Windows Server",
  "Zero Trust",
] as const;

export type BlogLabel = (typeof BLOG_LABELS)[number];

export function parseLabelsFromForm(formData: FormData): string[] {
  const raw = formData.getAll("labels");
  const set = new Set<string>();
  for (const v of raw) {
    const s = String(v);
    if (BLOG_LABELS.includes(s as BlogLabel)) set.add(s);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function isValidBlogLabel(value: string): value is BlogLabel {
  return BLOG_LABELS.includes(value as BlogLabel);
}

/**
 * Distinct pill colours for labels (index cycles for long lists). Used on blog chips and filter.
 */
const BLOG_LABEL_PALETTE = [
  "border-amber-500/35 bg-amber-500/10 text-amber-950 dark:text-amber-100",
  "border-sky-500/35 bg-sky-500/10 text-sky-950 dark:text-sky-100",
  "border-emerald-500/35 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100",
  "border-violet-500/35 bg-violet-500/10 text-violet-950 dark:text-violet-100",
  "border-rose-500/35 bg-rose-500/10 text-rose-950 dark:text-rose-100",
  "border-cyan-500/35 bg-cyan-500/10 text-cyan-950 dark:text-cyan-100",
  "border-orange-500/35 bg-orange-500/10 text-orange-950 dark:text-orange-100",
  "border-indigo-500/35 bg-indigo-500/10 text-indigo-950 dark:text-indigo-100",
  "border-lime-500/40 bg-lime-500/10 text-lime-950 dark:text-lime-100",
  "border-fuchsia-500/35 bg-fuchsia-500/10 text-fuchsia-950 dark:text-fuchsia-100",
] as const;

function labelColourIndex(label: string): number {
  const i = BLOG_LABELS.indexOf(label as BlogLabel);
  if (i >= 0) return i;
  let h = 0;
  for (let c = 0; c < label.length; c++) h = (h + label.charCodeAt(c)) % 10007;
  return h;
}

/** Classes for a label pill (border + background + text), no layout. */
export function blogLabelChipClass(label: string): string {
  return BLOG_LABEL_PALETTE[labelColourIndex(label) % BLOG_LABEL_PALETTE.length];
}

/** Filter nav pill: coloured when inactive; stronger ring when active. */
export function blogLabelFilterChipClass(label: string, isActive: boolean): string {
  const colour = blogLabelChipClass(label);
  if (isActive) {
    return `${colour} ring-2 ring-[color:var(--accent)] ring-offset-2 ring-offset-background font-semibold`;
  }
  return `${colour} hover:opacity-95`;
}
