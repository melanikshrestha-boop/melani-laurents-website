import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily",
  description: "Daily posts — art, writing, and notes. Updated as I publish.",
};

export default function DailyPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono-label text-[10px] tracking-[0.35em] text-amber/70 uppercase">
        Daily
      </p>
      <h1 className="mt-4 font-display text-3xl text-foreground">Posting daily soon</h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        Visual notes, writing, and whatever I&apos;m making that day — one stream,
        updated as I go.
      </p>
      <Link
        href="/"
        className="mt-10 font-mono-label text-[10px] tracking-[0.2em] text-amber/80 uppercase hover:text-amber"
      >
        ← Back home
      </Link>
    </div>
  );
}
