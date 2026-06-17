import type { Metadata } from "next";
import { BrandWordmark } from "@/components/BrandWordmark";
import { SchematicDiagram } from "@/components/SchematicDiagram";
import { SocialIcons } from "@/components/SocialIcons";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { MkSectionHeader } from "@/components/MkSectionHeader";
import { NerdSheet } from "@/components/NerdSheet";
import { ResumeSection } from "@/components/ResumeSection";
import { StorySection } from "@/components/StorySection";
import { FadeInView } from "@/components/FadeInView";
import {
  mkSections,
  mkIntro,
  nerdFacts,
  principles,
  resumeData,
  specReadout,
} from "@/data/mk-page";
import { storyChapters } from "@/data/story";

export const metadata: Metadata = {
  title: "M.K.",
  description:
    "Melani Kirstein — M.K. story, resume, chapters, nerd sheet, and how I operate in med-tech, research, and content.",
};

export default function AboutPage() {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <FadeInView className="max-w-3xl">
          <h1>
            <BrandWordmark size="lg" />
          </h1>
          <SocialIcons className="mt-8" />
          <SectionJumpNav sections={mkSections} />
        </FadeInView>

        <div className="my-16 border-t border-border/50 lg:my-20" />

        <div className="lg:grid lg:grid-cols-[11rem_1fr] lg:gap-16 xl:gap-24">
          <aside className="hidden lg:block">
            <nav
              aria-label="Section outline"
              className="sticky top-24 space-y-3"
            >
              {mkSections.map((section) => (
                <a
                  key={section.id}
                  href={section.href}
                  className="block font-mono-label text-[10px] text-muted-foreground transition-colors hover:text-accent"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-24 lg:space-y-32">
            <section aria-labelledby="mk-heading">
              <MkSectionHeader id="mk" label="M.K." title={mkIntro.headline} />
              <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
                <div className="space-y-4">
                  {mkIntro.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-muted md:text-lg"
                    >
                      {p}
                    </p>
                  ))}
                  <p className="font-mono-label text-[11px] text-muted-foreground">
                    {"// edit this block with your real story when ready"}
                  </p>
                </div>
                <div className="mt-8 rounded-xl border border-dashed border-accent/25 bg-accent-muted/30 p-6 lg:mt-0">
                  <p className="font-mono-label text-accent mb-3">draft.voice</p>
                  <p className="text-sm leading-relaxed text-muted italic">
                    {mkIntro.draftVoice}
                  </p>
                </div>
              </div>
            </section>

            <section aria-labelledby="chapters-heading">
              <MkSectionHeader
                id="chapters"
                label="Chapters"
                title="The arc"
                description="Five beats — scroll through, or jump here if you already know the headline."
                align="right"
              />
              <StorySection chapters={storyChapters} />
            </section>

            <section aria-labelledby="resume-heading">
              <MkSectionHeader
                id="resume"
                label="Resume"
                title="Research record"
                description="Patents and publications from Google Scholar — experience and skills are yours to extend in mk-page.ts."
              />
              <ResumeSection data={resumeData} />
            </section>

            <section aria-labelledby="nerd-heading">
              <MkSectionHeader
                id="nerd"
                label="Nerd sheet"
                title="Metadata, honestly"
                description="The stuff I'd put in a README about myself if READMEs were allowed to be weird."
                align="right"
              />
              <NerdSheet facts={nerdFacts} />
            </section>

            <section aria-labelledby="operate-heading">
              <MkSectionHeader id="operate" label="Operate" title="How I work" />
              <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
                {principles.map((p) => (
                  <div
                    key={p.title}
                    className="border-l-2 border-accent/30 pl-5"
                  >
                    <h3 className="font-sans text-lg font-medium text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="spec-heading">
              <MkSectionHeader
                id="spec"
                label="Spec"
                title="System sketch"
                description="Block diagram — the nerdy footer for this page."
              />
              <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:items-center">
                <div className="font-mono text-xs text-muted space-y-1.5 mb-8 lg:mb-0 rounded-lg border border-border bg-surface p-4">
                  {Object.entries(specReadout).map(([key, value]) => (
                    <p key={key}>
                      <span className="text-accent">{key}</span>
                      <span className="text-muted-foreground"> = </span>
                      <span className="text-foreground/80">
                        &quot;{value}&quot;
                      </span>
                    </p>
                  ))}
                </div>
                <div className="flex justify-center lg:justify-end">
                  <SchematicDiagram />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
