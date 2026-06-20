"use client";

interface HomeScrollExperienceProps {
  children: React.ReactNode;
}

/** Cream archive zone — background morph handled by HomeSections scroll progress. */
export function HomeScrollExperience({ children }: HomeScrollExperienceProps) {
  return <div className="hub-scroll-exp">{children}</div>;
}
