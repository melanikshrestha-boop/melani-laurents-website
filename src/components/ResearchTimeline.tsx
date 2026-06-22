"use client";

import { motion, useReducedMotion } from "framer-motion";

const experiences = [
  {
    years: "2023 → present",
    organization: "NIURA, BioTech Company",
    href: "https://www.niura.io/",
    role: "Engineering Intern",
    location: "New York City, NY",
    details: [
      "Co-authored four USPTO utility patents for EEG-integrated earbuds designed for productivity optimization and clinical brainwave monitoring.",
      "Presented the company at TechCrunch Startup Battlefield, the Wharton Neuroscience Initiative, and the BMES National Competition.",
      "Helped secure more than $8M in venture capital through pitches to Fortune 500 executives and biotech investors.",
    ],
  },
  {
    years: "2024 → 2025",
    organization: "Mount Sinai Charles Mobbs Neuroscience Lab",
    href: "https://labs.neuroscience.mssm.edu/project/mobbs-lab/",
    role: "Research Intern",
    location: "New York City, NY",
    details: [
      "Developed an AI model to identify molecules that reverse harmful SORL1 gene expression linked to Alzheimer’s disease.",
      "Screened five candidate compounds and tested three in C. elegans to evaluate therapeutic potential in neurodegeneration models.",
    ],
  },
  {
    years: "2023 → 2025",
    organization: "Columbia University Irving Medical Center, Sher Lab",
    href: "https://sherlab.org/",
    role: "Research Intern",
    location: "New York City, NY",
    details: [
      "Investigated LINE1 retrotransposons and PLCG2 gene variants using CRISPR-Cas9, RNA sequencing, and lipidomics to study neurodegeneration.",
      "Applied AI-based drug-repurposing models to identify five FDA-approved therapeutics targeting PLCG2.",
      "Authored a 20-page manuscript combining wet-lab and computational results and presented the findings at research conferences.",
    ],
  },
];

export function ResearchTimeline() {
  const reduced = useReducedMotion();

  return (
    <div className="research-timeline">
      {experiences.map((experience, index) => (
        <motion.article
          className="research-timeline__item"
          key={experience.organization}
          initial={reduced ? false : { opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="research-timeline__date">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <time>{experience.years}</time>
          </div>

          <div className="research-timeline__marker" aria-hidden>
            <motion.span
              className="research-timeline__segment"
              initial={reduced ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            />
            <motion.span
              className="research-timeline__dot"
              initial={reduced ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 240, damping: 18, delay: index * 0.1 }}
            />
          </div>

          <div className="research-timeline__content">
            <div className="research-timeline__heading">
              <div>
                <h3>
                  <a href={experience.href} target="_blank" rel="noopener noreferrer">
                    {experience.organization} <span aria-hidden>↗</span>
                  </a>
                </h3>
                <p>{experience.role}</p>
              </div>
              <span>{experience.location}</span>
            </div>
            <ul>
              {experience.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
