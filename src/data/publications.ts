export const googleScholarUrl =
  "https://scholar.google.com/citations?user=vke09BMAAAAJ&hl=en";

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  kind: "patent" | "article";
}

export const publicationProfile = {
  name: "Melani Laurent S.",
  affiliation:
    "The Bronx High School of Science · Columbia University Neuroscience · NIURA",
  scholarUrl: googleScholarUrl,
};

export const publications: Publication[] = [
  {
    title:
      "Charging and processing case for wireless earbuds with in-the-ear electroencephalography implementation",
    authors:
      "R Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
    venue: "US Patent App. 18/459,379",
    year: 2023,
    kind: "patent",
  },
  {
    title:
      "Earbud apparatus with integration of real time in-the-ear electroencephalography and electrode port that can simultaneously play audio via speaker housing",
    authors:
      "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
    venue: "US Patent App. 18/452,526",
    year: 2024,
    kind: "patent",
  },
  {
    title:
      "Electrode system for rubber ear tips with conductivity from n-doped silicone or conductive filaments in mixture for electroencephalography",
    authors:
      "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
    venue: "US Patent App. 18/454,063",
    year: 2023,
    kind: "patent",
  },
  {
    title:
      "In-ear electroencephalography electrodes with multi-parameter vitals monitor connectivity",
    authors:
      "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
    venue: "US Patent App. 18/452,561",
    year: 2024,
    kind: "patent",
  },
];
