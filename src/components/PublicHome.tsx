import Image from "next/image";
import type { Link as LinkModel, LinkSection, SiteProfile } from "@prisma/client";
import { ProfileSocialLinks } from "@/components/ProfileSocialLinks";
import { ShareProfileButton } from "@/components/ShareProfileButton";
import { getDefaultProfileImageDataUrl } from "@/lib/site-avatar";

type SectionWithLinks = LinkSection & { links: LinkModel[] };

type Props = {
  profile: SiteProfile;
  topLinks: LinkModel[];
  sections: SectionWithLinks[];
  shareUrl: string;
};

export function PublicHome({ profile, topLinks, sections, shareUrl }: Props) {
  const avatarSrc =
    profile.avatarUrl?.trim() || getDefaultProfileImageDataUrl();

  return (
    <div className="relative px-4 pb-28 pt-10 sm:pt-14">
      <div className="mx-auto w-full max-w-md sm:max-w-lg">
        <div className="glass-panel">
          <div className="glass-panel-shine" aria-hidden />
          <div className="relative">
            <header className="mb-10 flex w-full flex-col items-center text-center">
              <div className="relative mb-6">
                <div
                  className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-400/35 via-white/15 to-cyan-400/25 opacity-90 blur-md dark:from-violet-400/40 dark:via-white/20"
                  aria-hidden
                />
                <div className="relative h-[7.5rem] w-[7.5rem] overflow-hidden rounded-full border border-[color:var(--link-border)] bg-black/10 shadow-xl ring-2 ring-black/[0.06] dark:bg-black/20 dark:ring-white/10">
                  <Image
                    src={avatarSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                    priority
                    unoptimized={
                      avatarSrc.startsWith("data:") ||
                      avatarSrc.includes("chadd.ie")
                    }
                  />
                </div>
              </div>
              <ShareProfileButton
                shareUrl={shareUrl}
                title={profile.displayName}
                text={profile.tagline ?? undefined}
              />
              <h1 className="font-display text-[1.85rem] font-semibold tracking-tight sm:text-4xl sm:leading-tight">
                {profile.displayName}
              </h1>
              {profile.tagline ? (
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  {profile.tagline}
                </p>
              ) : null}
              <ProfileSocialLinks
                className={profile.tagline ? "mt-5" : "mt-4"}
              />
            </header>

            <nav className="w-full space-y-3" aria-label="Links">
              {topLinks.map((link) => (
                <TrackedLink key={link.id} link={link} />
              ))}
            </nav>

            {sections.map((section) => (
              <section key={section.id} className="mt-12 w-full">
                <h2 className="mb-2 text-center font-display text-xl font-semibold tracking-tight">
                  {section.title}
                </h2>
                {section.intro ? (
                  <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
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
      </div>
    </div>
  );
}

function TrackedLink({ link }: { link: LinkModel }) {
  return (
    <div>
      <a
        href={`/go/${link.id}`}
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl border px-4 py-3.5 text-center text-[15px] font-medium leading-snug shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:[background:var(--link-bg-hover)] active:translate-y-0"
        style={{
          borderColor: "var(--link-border)",
          background: "var(--link-bg)",
          color: "var(--foreground)",
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
          }}
          aria-hidden
        />
        <span className="relative">{link.label}</span>
      </a>
      {link.description ? (
        <p className="mt-2.5 px-1 text-center text-[13px] leading-snug text-muted-foreground">
          {link.description}
        </p>
      ) : null}
    </div>
  );
}
