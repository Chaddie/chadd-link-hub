export type ConsultancyService = {
  title: string;
  price: string;
  summary: string;
  points: readonly string[];
};

export const CONSULTANCY_SERVICES = [
  {
    title: "Microsoft Intune & M365 consulting",
    price: "From £400+",
    summary:
      "Hands-on help to design, deploy, and mature your Microsoft 365 and Intune estate—without unnecessary complexity.",
    points: [
      "Tenant and identity foundations (Entra ID, conditional access patterns, licensing alignment).",
      "Device management strategy: Windows, mobile, and patch cadence that fits your risk profile.",
      "Application delivery: Win32, Store, and line-of-business packaging considerations.",
      "Operational readiness: monitoring hooks, documentation, and handover so your team can run it day-to-day.",
    ],
  },
  {
    title: "Web design for small businesses",
    price: "From £500+",
    summary:
      "Fast, credible websites that explain what you do, build trust, and convert visitors—without enterprise overhead.",
    points: [
      "Discovery and structure: messaging, pages, and calls-to-action tailored to your audience.",
      "Modern, responsive layouts with performance and accessibility in mind.",
      "Content guidance: headlines, imagery direction, and SEO basics for local and niche search.",
      "Deployment and handover: hosting recommendations, analytics setup, and light training so you can update copy safely.",
    ],
  },
  {
    title: "Cyber security assessment",
    price: "From £500+",
    summary:
      "A structured review of how your organisation protects data and systems, with prioritised, practical recommendations.",
    points: [
      "Scope aligned to your size: identity, endpoints, email, backups, and third-party risk at a proportionate level.",
      "Review of configuration and policy gaps against common attack paths (not generic checkbox audits).",
      "Clear report: findings grouped by severity, with suggested remediation order and effort.",
      "Optional follow-up sessions to validate fixes or plan a phased improvement roadmap.",
    ],
  },
] as const satisfies readonly ConsultancyService[];

/** Last option for contact form — not a consultancy card. */
export const CONTACT_INQUIRY_OTHER = "Other" as const;

/** Dropdown values: each consultancy title plus Other. */
export const CONTACT_INQUIRY_OPTIONS: string[] = [
  ...CONSULTANCY_SERVICES.map((s) => s.title),
  CONTACT_INQUIRY_OTHER,
];

export function isValidContactInquiry(value: string): boolean {
  return CONTACT_INQUIRY_OPTIONS.includes(value);
}
