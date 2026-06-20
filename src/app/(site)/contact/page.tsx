import type { Metadata } from "next";
import { ContactExperience } from "@/components/ContactExperience";

export const metadata: Metadata = {
  title: "Contact",
  description: "Open a channel — Melani Laurent S.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
