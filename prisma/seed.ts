import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn(
      "Skipping admin user: set ADMIN_EMAIL and ADMIN_PASSWORD in .env for seed."
    );
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      create: { email, passwordHash, isAdmin: true },
      update: { passwordHash, isAdmin: true },
    });
    console.log("Admin user ready:", email);
  }

  await prisma.siteProfile.upsert({
    where: { id: "site" },
    create: {
      id: "site",
      displayName: "Nathan Chadwick",
      tagline: "Technologist. SE. Frenchie Dad.",
      /* Default headshot is inlined in code (`src/lib/chadd-profile-image.ts` + `public/profile-avatar.jpg`). */
      avatarUrl: null,
    },
    update: {},
  });

  const oldBlogs = await prisma.linkSection.findFirst({
    where: { title: "Personal Blogs" },
  });
  if (oldBlogs) {
    await prisma.link.deleteMany({ where: { sectionId: oldBlogs.id } });
    await prisma.linkSection.delete({ where: { id: oldBlogs.id } });
    console.log("Removed legacy Personal Blogs section.");
  }

  const sections = [
    { key: "referrals", title: "Referrals", intro: null as string | null, order: 1 },
    {
      key: "projects",
      title: "Projects",
      intro:
        "Some of the websites I have done for businesses and non-profits.",
      order: 2,
    },
  ] as const;

  const sectionRows: Record<string, { id: string }> = {};

  for (const s of sections) {
    const existing = await prisma.linkSection.findFirst({
      where: { title: s.title },
    });
    if (existing) {
      sectionRows[s.key] = existing;
      await prisma.linkSection.update({
        where: { id: existing.id },
        data: { intro: s.intro, sortOrder: s.order },
      });
    } else {
      sectionRows[s.key] = await prisma.linkSection.create({
        data: {
          title: s.title,
          intro: s.intro,
          sortOrder: s.order,
        },
      });
    }
  }

  type SeedLink = {
    label: string;
    url: string;
    description?: string | null;
    sectionKey?: keyof typeof sectionRows;
    order: number;
  };

  const topLinks: SeedLink[] = [
    { label: "☕", url: "https://buymeacoffee.com/chaddie", order: 0 },
    { label: "GitHub", url: "https://github.com/chaddie", order: 1 },
    {
      label: "Software Bundles",
      url: "https://www.humblebundle.com/software",
      order: 2,
    },
  ];

  const sectionLinks: SeedLink[] = [
    {
      label: "Trading212",
      url: "https://trading212.com/invite/199hzLoAFF",
      description:
        "Get a free share up to £100 when signing up with this link!",
      sectionKey: "referrals",
      order: 0,
    },
    {
      label: "Tesla",
      url: "https://tesla.com/referral/nathaniel482470",
      description: "get £500 off your tesla",
      sectionKey: "referrals",
      order: 1,
    },
    {
      label: "Octopus Energy",
      url: "https://share.octopus.energy/silk-lord-41",
      description: "get £50 credit when signing up with this link!",
      sectionKey: "referrals",
      order: 2,
    },
    {
      label: "SIMMER EATS",
      url: "https://www.simmereats.com/r/NATHAN-KTH",
      description: "get 30% off if you want to give it a go!",
      sectionKey: "referrals",
      order: 3,
    },
    {
      label: "Three (mobile)",
      url: "https://aklam.io/2StGK2PA",
      description: "Get up to £40 in cash!",
      sectionKey: "referrals",
      order: 4,
    },
    {
      label: "Fitness Tracker",
      url: "https://tracker.chadd.ie",
      description: "Training and workout tracking app.",
      sectionKey: "projects",
      order: 0,
    },
    {
      label: "Friends Play",
      url: "https://friendsplay.org.uk/",
      sectionKey: "projects",
      order: 1,
    },
    {
      label: "Disposable Souls",
      url: "https://disposablesouls.co.uk/",
      sectionKey: "projects",
      order: 2,
    },
    {
      label: "MPB Renewables",
      url: "https://mpbrenewables.co.uk/",
      sectionKey: "projects",
      order: 3,
    },
  ];

  await prisma.link.deleteMany({
    where: { url: "https://nathanchadwick.com/pc-build/" },
  });
  await prisma.link.deleteMany({
    where: { url: "mailto:hello@example.com" },
  });

  for (const l of topLinks) {
    const hit = await prisma.link.findFirst({
      where: { sectionId: null, label: l.label, url: l.url },
    });
    if (!hit) {
      await prisma.link.create({
        data: {
          sectionId: null,
          label: l.label,
          url: l.url,
          description: l.description ?? null,
          sortOrder: l.order,
        },
      });
    }
  }

  for (const l of sectionLinks) {
    const sec = l.sectionKey ? sectionRows[l.sectionKey] : null;
    if (!sec) continue;
    const hit = await prisma.link.findFirst({
      where: { sectionId: sec.id, label: l.label, url: l.url },
    });
    if (!hit) {
      await prisma.link.create({
        data: {
          sectionId: sec.id,
          label: l.label,
          url: l.url,
          description: l.description ?? null,
          sortOrder: l.order,
        },
      });
    }
  }

  const exampleBlogPosts = [
    {
      slug: "entra-conditional-access-patterns",
      title: "Conditional access patterns that survive real users",
      excerpt:
        "Structuring Entra ID policies so security improves without endless exclusions.",
      content: `## Start with a small pilot

Roll out conditional access in phases: break-glass accounts, named locations, and clear naming. Document every exception before you grant it.

## What usually breaks

Overly broad "require MFA" policies without registration campaigns, and blocking legacy auth without checking dependencies. Review sign-in logs weekly for the first month.`,
      labels: ["Entra ID", "Conditional Access", "Zero Trust"],
      publishedAt: new Date("2025-11-12T09:00:00.000Z"),
    },
    {
      slug: "intune-win11-rollout-checklist",
      title: "Intune rollout checklist for Windows 11",
      excerpt:
        "A practical order of operations before you flip enforcement policies.",
      content: `## Baseline

Inventory apps that need elevation, confirm update rings, and align with WSUS or Windows Update for Business where hybrid.

## Rings

Pilot → early adopters → broad. Use filters for departments, not one-off device exceptions unless documented.`,
      labels: ["Intune", "Configuration", "Endpoint"],
      publishedAt: new Date("2025-10-28T14:30:00.000Z"),
    },
    {
      slug: "azure-backup-restore-drill",
      title: "Running a restore drill without the drama",
      excerpt:
        "Why quarterly test restores beat a perfect backup policy on paper.",
      content: `## Scope

Pick one VM, one database, and one file share per quarter. Time the restore and assign an owner for gaps.

## Monitoring

Alert on backup job failures and vault replication lag before you need them in an incident.`,
      labels: ["Azure", "Backup & Recovery", "Monitoring"],
      publishedAt: new Date("2025-09-05T11:00:00.000Z"),
    },
    {
      slug: "powershell-guardrails-for-admins",
      title: "PowerShell guardrails for admin workstations",
      excerpt:
        "Constrained language, logging, and approval flows for high-privilege sessions.",
      content: `## Transcription

Send script block logging to your SIEM. Block remote sessions from machines that are not hardened admin tier.

## Just enough access

Time-bound elevation beats standing local admin. Pair with PIM where possible.`,
      labels: ["PowerShell", "Governance", "Compliance"],
      publishedAt: new Date("2025-08-19T08:15:00.000Z"),
    },
    {
      slug: "dns-hygiene-zero-trust",
      title: "DNS hygiene notes for a zero-trust network",
      excerpt:
        "Split-horizon, logging, and filtering without turning your helpdesk into a ticket factory.",
      content: `## Visibility

Log queries at resolvers you control. Unexpected NXDOMAIN bursts often precede larger issues.

## Policy

Align internal zones with device trust signals; avoid flat internal DNS that mirrors the public internet blindly.`,
      labels: ["DNS", "Networking", "Cyber Security"],
      publishedAt: new Date("2025-07-22T16:45:00.000Z"),
    },
    {
      slug: "package-exe-intunewin-silent-intune",
      title: "Package an .exe for silent deployment: build an .intunewin for Intune",
      excerpt:
        "Use Microsoft’s Win32 Content Prep Tool to wrap your installer folder into an .intunewin, then publish a Win32 app with silent install and detection.",
      content: `## What you are building

Intune deploys **Win32 apps** from a packaged file named **.intunewin**. That file is **not** your .exe renamed—it is output from **Microsoft Win32 Content Prep Tool** (often called **IntuneWinAppUtil**), which zips your **source folder** and encrypts it for upload to Intune.

## Before you start

- Confirm **silent switches** for your installer (vendor docs, \`/S\`, \`/quiet\`, \`/qn\`, etc.). Intune needs a command that returns quickly and does not prompt the user.
- Put **everything the setup needs** in one folder: the .exe (or setup.exe), transforms, config files, or extra MSIs if the vendor requires them side-by-side.

## Folder layout

Example:

\`\`\`text
C:\\Packages\\MyApp\\
  setup.exe
  (optional extra files the vendor requires)
\`\`\`

The prep tool will ask for this folder as the **source** path.

## Build the .intunewin

1. Download **Win32 Content Prep Tool** from Microsoft (search for “Win32 app packaging tool” / IntuneWinAppUtil).
2. Run **IntuneWinAppUtil.exe** (GUI or command line).
3. Provide:
   - **Source folder**: \`C:\\Packages\\MyApp\` (folder containing setup.exe).
   - **Setup file**: the main installer name, e.g. \`setup.exe\`.
   - **Output folder**: where to write the finished package (e.g. \`C:\\Packages\\output\`).
4. When it finishes, you get **\`MyApp.intunewin\`** (name follows your setup file / folder naming).

Command-line example (same idea; paths may vary):

\`\`\`text
IntuneWinAppUtil.exe -c C:\\Packages\\MyApp -s setup.exe -o C:\\Packages\\output
\`\`\`

## Upload to Intune

1. **Microsoft Intune admin center** → **Apps** → **All apps** → **Add** → **Windows app (Win32)**.
2. Select your **.intunewin** file and complete app information.
3. **Install command**: full silent command, e.g. \`setup.exe /S\` or whatever the vendor documents (test on a VM first).
4. **Uninstall command**: use the vendor’s documented uninstall, or MSI product code if the app is an MSI under the hood.
5. **Requirements**: OS architecture, minimum Windows version, disk space if needed.
6. **Detection rules**: Prefer **MSI** product code/version if the installer is MSI-based; otherwise **file** or **registry** key that proves the app version you deployed. A bad detection rule is the most common reason installs “succeed” but show as failed in Intune.

## Assign and test

Assign to a small **pilot** group first. On a test device, confirm **Company Portal** or policy triggers install, no UI prompts, and detection shows **Installed**.

## Practical tips

- Re-run the prep tool whenever you change the installer bits or folder contents; the .intunewin is tied to that snapshot.
- Keep a short README in your package repo with the exact **install**, **uninstall**, and **detection** values you used—future you will thank you.
- If the install only works when run from a specific working directory, bake that into a small wrapper script and package the script plus binaries, or use \`cmd /c\` / PowerShell with explicit paths in the Intune install command.`,
      labels: ["Intune", "Endpoint", "Configuration"],
      publishedAt: new Date("2026-04-03T12:00:00.000Z"),
    },
  ] as const;

  for (const post of exampleBlogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        labels: [...post.labels],
        published: true,
        publishedAt: post.publishedAt,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        labels: [...post.labels],
        published: true,
        publishedAt: post.publishedAt,
      },
    });
  }
  console.log(`Upserted ${exampleBlogPosts.length} example blog posts.`);

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
