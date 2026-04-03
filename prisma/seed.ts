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
    {
      slug: "unifi-segmentation-main-guest-iot-casting",
      title:
        "UniFi segmentation on a Dream Machine Pro: Main, Guest, IoT—and still Cast / AirPlay",
      excerpt:
        "Split Main, Guest, and IoT networks on a UDM Pro, keep IoT off your trusted LAN, and allow Chromecast and AirPlay from phones and laptops without flattening security.",
      content: `## What we are aiming for

Three **logical networks** on your **UniFi Dream Machine Pro (UDM Pro)**:

- **Main** — laptops, phones, NAS, trusted devices.
- **Guest** — visitors and untrusted clients, isolated from Main.
- **IoT** — speakers (Sonos), voice assistants (Alexa/Google), TVs, **Home Assistant**, smart plugs, cameras: things that phone home, rarely need to talk to your PCs, and are a favourite target for botnets.

You still want **Google Cast** and **AirPlay** to work when the **controller** (phone, tablet, browser) is on **Main** or **Guest**, while **speakers and displays** live on **IoT**. That breaks by default because discovery uses **multicast DNS (mDNS / Bonjour)** and **SSDP**, which do not cross VLANs unless you design for it.

## Why IoT gets its own VLAN

IoT devices should not browse your SMB shares or poke at printers. A simple pattern:

- **IoT → Main / Guest:** **blocked** (with narrow exceptions if you truly need HA talking to a specific server—prefer reverse connections instead).
- **Main / Guest → IoT:** **allowed** for the services you need (streaming, Home Assistant UI, etc.).
- **IoT → Internet:** **allowed** (updates, clouds) unless you run a strict deny-all egress lab.

On UniFi, that usually means **separate VLANs**, **WiFi SSIDs** mapped to those networks, and **firewall rules** (plus DNS filtering if you use it).

## Build the networks on the UDM Pro

Exact clicks move between UniFi Network versions, but the shape is stable:

1. **Settings → Networks** — create VLANs (e.g. Main = native LAN or VLAN 10, Guest = VLAN 20, IoT = VLAN 30). Assign subnets and DHCP pools.
2. **Settings → WiFi** — create SSIDs: e.g. \`Home\` → Main, \`Guest\` → Guest (enable **guest policies** / client isolation as offered), \`IoT\` → IoT VLAN.
3. **Firewall** — start from a **default deny** from IoT to RFC1918 **except** what you explicitly allow, or use UniFi’s **Traffic & Security** / **Firewall** UI to add **“Block IoT to LAN”** style rules. Your UDM Pro is the router—rules apply **before** traffic leaves the gateway.

Document your **CIDRs** (e.g. \`192.168.10.0/24\` Main, \`192.168.20.0/24\` Guest, \`192.168.30.0/24\` IoT) so firewall rules stay readable.

## Why Cast and AirPlay break across VLANs

- **Discovery** relies on **mDNS** (UDP **5353**) and **multicast**, not only a single TCP port.
- **AirPlay** and **Chromecast** expect the controller to **see** the receiver on the network via Bonjour-style names.
- **Guest WiFi** often has **client isolation** and extra blocks—casting from Guest to IoT needs **both** discovery and **session** traffic permitted.

So you need **two** things: **multicast / mDNS handling** between VLANs, and **stateful firewall rules** that allow **Main → IoT** and **Guest → IoT** for streaming while keeping **IoT → Main** closed.

## Multicast DNS (mDNS) on UniFi

UniFi has moved menus over time; on recent **Network** apps for the UDM Pro, look under **Settings** for anything named like **Multicast DNS**, **mDNS**, or **Multicast / Bonjour** services that **reflect** or **bridge** discovery between VLANs.

If your build exposes it:

- **Enable mDNS / multicast reflection** between **Main**, **Guest**, and **IoT** (or at least from Main+Guest **toward** IoT). That lets phones find \`Kitchen TV._googlecast._tcp.local\` or AirPlay targets on the IoT subnet.

If your controller version **does not** offer a tidy global toggle:

- Some admins run an **mDNS reflector** on a small Linux/RPi box on multiple VLANs—outside the scope of this post, but it is the fallback when the gateway cannot reflect Bonjour.

After any change, **reboot a test phone**—mDNS caches aggressively.

## Firewall rules that match the goal

Think in **direction**:

1. **Allow established / related** return traffic (UniFi often does this implicitly; confirm for your rule set).
2. **Allow Main → IoT** and **Guest → IoT** for:
   - **UDP 5353** (mDNS) if you are not using a reflector and are testing—often **not** enough alone across VLANs; pairing with mDNS reflection is the usual fix.
   - **TCP/UDP** for the actual streaming session—Chromecast and AirPlay use additional ranges; **vendor docs** list current ports. Apple and Google publish port lists for AirPlay and Cast—use them when tightening rules.
3. **Block IoT → Main** and **IoT → Guest** for **new** connections (exceptions only for things like Home Assistant to one specific IP if you must).

**Guest → IoT:** Guest WiFi may block **AP-to-AP** or **LAN** access by default. You may need a **specific rule** that allows **Guest subnet → IoT subnet** for casting, while still blocking **Guest → Main**.

**Main → IoT:** Usually allowed once you add positive rules; confirm **WiFi** → **IoT** is not blocked by a **“block inter-VLAN”** switch on the SSID.

## Sonos, Home Assistant, and the rest

- **Sonos** often needs **discovery** between controller and speakers plus **HTTP** control to speakers. Keep controllers and Sonos on the same **logical “audio” policy**: if Sonos is on IoT, allow **Main/Guest → IoT** for Sonos documented ports after mDNS works.
- **Home Assistant** on IoT should be reached by browsers on Main via **HTTPS** to its IP or name; use **Split DNS** or local DNS records so you do not need IoT to initiate to Main.

## Testing on a UDM Pro

1. Put a **Chromecast** or **Apple TV** on **IoT** only.
2. Join a phone to **Main** SSID—confirm the **Google Home** or **screen mirror** target appears.
3. Join the same phone to **Guest**—repeat. If discovery fails only on Guest, the issue is **guest isolation** or **missing Guest → IoT** allow rules.
4. Use **Insights → Traffic** (or **Flow Analytics**) on the UDM Pro to see **drops** on firewall rules you created—adjust until you see **allow** hits for the right subnets.

## Summary

- **Segment** into **Main**, **Guest**, and **IoT** VLANs with **WiFi** mapped to each.
- **Default deny IoT toward trusted LANs**, allow **Main/Guest → IoT** for what you need.
- **Enable mDNS / multicast reflection** (or an external reflector) so **Cast** and **AirPlay** can **discover** receivers on IoT.
- **Layer firewall rules** for **Guest** carefully so visitors get casting **without** reaching your **Main** network.

UI names change—**search UniFi’s release notes for “mDNS” or “multicast”** for your exact Network version. When in doubt, capture **one** failing discovery with a packet trace on the IoT VLAN and adjust rules until you see **UDP 5353** and the stream ports flowing **from phone VLAN to IoT VLAN**.`,
      labels: ["Networking", "Firewall", "Configuration"],
      publishedAt: new Date("2026-04-04T10:00:00.000Z"),
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
