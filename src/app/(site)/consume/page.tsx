import { redirect } from "next/navigation";

/** Old name — permanently Diary now */
export default function ConsumeRedirect() {
  redirect("/diary");
}
