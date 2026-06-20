import type { NerdFact } from "@/data/mk-page";

interface NerdSheetProps {
  facts: NerdFact[];
}

export function NerdSheet({ facts }: NerdSheetProps) {
  return (
    <div className="rounded-xl border border-border bg-surface/80 p-4 font-mono text-sm md:p-6">
      <p className="font-mono-label mb-4 text-accent">~/nerd_sheet.json</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact.key}
            className="group rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 transition-colors hover:border-accent/30"
          >
            <dt className="font-mono-label text-[10px] text-muted-foreground">
              {fact.key}
            </dt>
            <dd className="mt-1 text-foreground/90">{fact.value}</dd>
            {fact.note && (
              <dd className="mt-1 text-[10px] text-accent/80">// {fact.note}</dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
