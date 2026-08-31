export type DesignWork = {
  id: string;
  title: string;
  note: string;
  still: string;
  href?: string;
};

/** UI she designed. Notes are her words. Add more as she sends them. */
export const designWorks: DesignWork[] = [
  {
    id: "lunara-glow",
    title: "Lunara Glows",
    note: "The UI I built for Lunara Glows is for me, and the chatbots are for me.",
    still: "/builds/designs/lunara-glow.jpg",
  },
  {
    id: "this-design-page",
    title: "this design page",
    note: "",
    still: "/builds/designs/celine-nova.jpg",
    href: "/",
  },
];
