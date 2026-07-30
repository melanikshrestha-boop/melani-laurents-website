export type Page = {
  id: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
};

export type Block = { id?: string; type?: string; [key: string]: unknown };
