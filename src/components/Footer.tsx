import Link from "next/link";
import { BrandWordmark } from "./BrandWordmark";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandWordmark size="sm" />
          <p className="mt-1 font-mono-label text-muted-foreground">
            research · build · med-tech
          </p>
        </div>
        <p className="font-mono-label text-muted-foreground">
          <kbd className="rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px]">
            ~
          </kbd>{" "}
          <Link href="/research" className="hover:text-accent transition-colors">
            /research
          </Link>
        </p>
      </div>
    </footer>
  );
}
