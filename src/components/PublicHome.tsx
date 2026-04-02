import Image from "next/image";
import type { Link as LinkModel, LinkSection, SiteProfile } from "@prisma/client";

type SectionWithLinks = LinkSection & { links: LinkModel[] };

type Props = {
  profile: SiteProfile;
  topLinks: LinkModel[];
  sections: SectionWithLinks[];
};

export function PublicHome({ profile, topLinks, sections }: Props) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <div className="mx-auto flex max-w-md flex-col items-center px-5 pb-24 pt-14 sm:max-w-lg sm:pt-20">
        <header className="mb-10 flex w-full flex-col items-center text-center">
          {profile.avatarUrl ? (
            <div className="relative mb-5 h-28 w-28 overflow-hidden rounded-full border border-[var(--border)] bg-white shadow-sm">
              <Image
                src={profile.avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="112px"
                unoptimized
              />
            </div>
          ) : (
            <div
              className="mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--avatar-placeholder)] text-3xl font-semibold text-[var(--text-muted)] shadow-sm"
              aria-hidden
            >
              {profile.displayName
                .split(/\s+/)
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Share
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text-heading)] sm:text-4xl">
            {profile.displayName}
          </h1>
          {profile.tagline ? (
            <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--text-secondary)]">
              {profile.tagline}
            </p>
          ) : null}
        </header>

        <nav className="w-full space-y-3" aria-label="Links">
          {topLinks.map((link) => (
            <TrackedLink key={link.id} link={link} />
          ))}
        </nav>

        {sections.map((section) => (
          <section key={section.id} className="mt-12 w-full">
            <h2 className="mb-1 text-center font-serif text-xl font-semibold text-[var(--text-heading)]">
              {section.title}
            </h2>
            {section.intro ? (
              <p className="mb-6 text-center text-sm leading-relaxed text-[var(--text-secondary)]">
                {section.intro}
              </p>
            ) : (
              <div className="mb-6" />
            )}
            <div className="space-y-3">
              {section.links.map((link) => (
                <TrackedLink key={link.id} link={link} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function TrackedLink({ link }: { link: LinkModel }) {
  return (
    <div>
      <a
        href={`/go/${link.id}`}
        className="flex w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3.5 text-center text-[15px] font-medium leading-snug text-[var(--text-heading)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-px hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
      >
        {link.label}
      </a>
      {link.description ? (
        <p className="mt-2 px-1 text-center text-sm leading-snug text-[var(--text-secondary)]">
          {link.description}
        </p>
      ) : null}
    </div>
  );
}
