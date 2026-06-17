export const siteConfig = {
  name: "MelaniKirstein",
  url: "https://melanikirstein.com",
  title: "Melani Kirstein",
  description:
    "Technical builder, content creator, and researcher at the intersection of med-tech and entrepreneurship.",
  email: "hello@melanikirstein.com",
  location: "United States",
  // Update hrefs when you have final profile URLs
  socialLinks: [
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/melanishresthaa/",
    },
    {
      id: "x",
      label: "X",
      href: "https://x.com/melanikirstein",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/melanikirstein/",
    },
    {
      id: "tiktok",
      label: "TikTok",
      href: "https://www.tiktok.com/@melanikirstein",
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@melanikirstein",
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/melanikshrestha-boop",
    },
  ],
  nav: [
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research" },
    { label: "M.K.", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SocialId = (typeof siteConfig.socialLinks)[number]["id"];
