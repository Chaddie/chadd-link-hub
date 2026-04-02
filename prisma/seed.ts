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
      avatarUrl: null,
    },
    update: {},
  });

  const sections = [
    { key: "blogs", title: "Personal Blogs", intro: null as string | null, order: 1 },
    { key: "referrals", title: "Referrals", intro: null, order: 2 },
    {
      key: "projects",
      title: "Projects",
      intro:
        "Some of the websites I have done for businesses and non-profits.",
      order: 3,
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
    {
      label: "Email",
      url: "mailto:hello@example.com",
      order: 0,
    },
    { label: "☕", url: "https://buymeacoffee.com/chaddie", order: 1 },
    { label: "GitHub", url: "https://github.com/chaddie", order: 2 },
    {
      label: "Software Bundles",
      url: "https://www.humblebundle.com/software",
      order: 3,
    },
  ];

  const sectionLinks: SeedLink[] = [
    {
      label: "chaddie.co.uk",
      url: "https://chaddie.co.uk/",
      sectionKey: "blogs",
      order: 0,
    },
    {
      label: "nathanchadwick.com",
      url: "https://nathanchadwick.com/",
      sectionKey: "blogs",
      order: 1,
    },
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
      label: "PC Build",
      url: "https://nathanchadwick.com/pc-build/",
      sectionKey: "referrals",
      order: 3,
    },
    {
      label: "Friends Play",
      url: "https://friendsplay.org.uk/",
      sectionKey: "projects",
      order: 0,
    },
    {
      label: "Disposable Souls",
      url: "https://disposablesouls.co.uk/",
      sectionKey: "projects",
      order: 1,
    },
    {
      label: "MPB Renewables",
      url: "https://mpbrenewables.co.uk/",
      sectionKey: "projects",
      order: 2,
    },
  ];

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

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
