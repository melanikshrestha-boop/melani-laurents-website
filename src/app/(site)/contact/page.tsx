import type { Metadata } from "next";
import { ContactExperience } from "@/components/ContactExperience";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact and email — building, research, business, personal, photography, bugs.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
