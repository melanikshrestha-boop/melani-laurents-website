import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="font-display text-2xl text-foreground mt-10 mb-4" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-lg font-medium text-foreground mt-8 mb-3" {...props} />
  ),
  p: (props) => <p className="mb-5 text-muted leading-relaxed" {...props} />,
  ul: (props) => (
    <ul className="mb-5 list-disc pl-6 text-muted space-y-2" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-5 list-decimal pl-6 text-muted space-y-2" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  code: (props) => (
    <code
      className="font-mono text-sm bg-surface-elevated px-1.5 py-0.5 rounded text-accent"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-accent pl-4 my-6 italic text-muted"
      {...props}
    />
  ),
  a: (props) => (
    <a className="text-accent underline underline-offset-3" {...props} />
  ),
};
