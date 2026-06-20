import Link from "next/link";
import { MelaniSignature } from "@/components/MelaniSignature";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--hub-void,#030508)] px-6 text-center">
      <MelaniSignature variant="light" className="mb-12" />
      <p className="font-mono-label text-amber/70 mb-4">404</p>
      <h1 className="font-display text-3xl text-foreground">Page not found</h1>
      <p className="mt-4 text-muted">
        The path you requested doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-white/10 px-6 py-2.5 text-sm text-white/50 transition-colors hover:border-amber/40 hover:text-amber/90"
      >
        Back home
      </Link>
    </div>
  );
}
