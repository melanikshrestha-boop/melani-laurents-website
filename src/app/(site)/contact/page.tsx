import type { Metadata } from "next";
import { ContactExperience } from "@/components/ContactExperience";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send Celine Nova a message about building, research, photography, or anything else.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
