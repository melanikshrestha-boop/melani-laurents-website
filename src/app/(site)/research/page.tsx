import type { Metadata } from "next";
import { NeuroplasticityRemodel } from "@/components/NeuroplasticityRemodel";
import { ResearchTimeline } from "@/components/ResearchTimeline";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research notes on biomedical engineering, neural interfaces, brain-computer interfaces, biotechnology, and neurotechnology.",
};

export default function ResearchPage() {
  return (
    <div className="research-index">
      <header className="research-index__masthead">
        <div className="research-index__kicker-row">
          <p className="research-index__kicker">Research</p>
          <p className="research-index__edition">USC · Caltech</p>
        </div>

        <div className="research-index__hero-grid">
          <h1>Building neural interfaces.</h1>

          <div className="research-index__about">
            <p className="research-index__kicker">About me</p>
            <p>
              I&apos;m Melani Laurent, a Biomedical Engineering student at USC
              researching neural interfaces and brain-computer interfaces at
              Caltech.
            </p>
            <p>
              I&apos;m interested in the emergence of biotechnology, especially
              neurotechnology, and how tools that interact with the nervous
              system will reshape medicine and what it means to be human.
            </p>
          </div>
        </div>
      </header>

      <section className="research-index__experience" aria-labelledby="experience-title">
        <div className="research-index__section-intro">
          <p className="research-index__kicker">Research experience</p>
          <h2 id="experience-title">From wet lab to neural interfaces.</h2>
        </div>

        <ResearchTimeline />
      </section>

      <section className="research-index__plasticity" aria-labelledby="plasticity-title">
        <div className="research-index__section-intro">
          <p className="research-index__kicker">Neuroplasticity</p>
          <h2 id="plasticity-title">The brain redraws itself.</h2>
        </div>
        <NeuroplasticityRemodel />
      </section>
    </div>
  );
}
