export const googleScholarUrl =
  "https://scholar.google.com/citations?user=vke09BMAAAAJ&hl=en";

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  kind: "patent" | "article";
  publicationNumber?: string;
  publicationDate?: string;
  previewImage?: string;
  documentUrl?: string;
}

export const publicationProfile = {
  name: "Celine Nova",
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
    publicationNumber: "US 2023/0417053 A1",
    publicationDate: "Dec. 28, 2023",
    previewImage: "/builds/patents/US20230417053A1-page-1.png",
    documentUrl: "/builds/patents/US20230417053A1.pdf",
  },
  {
    title:
      "Earbud apparatus with integration of real time in-the-ear electroencephalography and electrode port that can simultaneously play audio via speaker housing",
    authors:
      "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
    venue: "US Patent App. 18/452,526",
    year: 2024,
    kind: "patent",
    publicationNumber: "US 2024/0008800 A1",
    publicationDate: "Jan. 11, 2024",
    previewImage: "/builds/patents/US20240008800A1-page-1.png",
    documentUrl: "/builds/patents/US20240008800A1.pdf",
  },
  {
    title:
      "Electrode system for rubber ear tips with conductivity from n-doped silicone or conductive filaments in mixture for electroencephalography",
    authors:
      "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
    venue: "US Patent App. 18/454,063",
    year: 2023,
    kind: "patent",
    publicationNumber: "US 2023/0389847 A1",
    publicationDate: "Dec. 7, 2023",
    previewImage: "/builds/patents/US20230389847A1-page-1.png",
    documentUrl: "/builds/patents/US20230389847A1.pdf",
  },
  {
    title:
      "In-ear electroencephalography electrodes with multi-parameter vitals monitor connectivity",
    authors:
      "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
    venue: "US Patent App. 18/452,561",
    year: 2024,
    kind: "patent",
    publicationNumber: "US 2024/0206794 A1",
    publicationDate: "Jun. 27, 2024",
    previewImage: "/builds/patents/US20240206794A1-page-1.png",
    documentUrl: "/builds/patents/US20240206794A1.pdf",
  },
];
