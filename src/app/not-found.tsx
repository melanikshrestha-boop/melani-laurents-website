import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono-label text-accent mb-4">404</p>
      <h1 className="font-display text-3xl text-foreground">Page not found</h1>
      <p className="mt-4 text-muted">
        The path you requested doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-border px-6 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
      >
        Back home
      </Link>
    </div>
  );
}
