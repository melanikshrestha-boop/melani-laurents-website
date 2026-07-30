/**
 * Public bookshelf — imported from Wonder local library + Greats blogs.
 * Physical books: Amazon search links only (no PDFs / no Ocean reader).
 * 32 books from Wonder scan · 9 blog posts (Sam Altman + Paul Graham).
 */

export type BookshelfKind = "book" | "paper" | "blog" | "podcast";

export type BookshelfEntry = {
  id: string;
  kind: BookshelfKind;
  title: string;
  source: string;
  loggedAt: string;
  summary?: string;
  thoughts?: string;
  applied?: string;
  href?: string;
  year?: number;
  favorite?: boolean;
  favoriteWhy?: string;
};

export const BOOKSHELF_KIND_LABEL: Record<BookshelfKind, string> = {
  book: "Book",
  paper: "Paper",
  blog: "Blog",
  podcast: "Podcast",
};

export const bookshelfEntries: BookshelfEntry[] = [
  {
    id: "book-6d7a4c381c475d37",
    kind: "book",
    title: "Surely You're Joking, Mr. Feynman!",
    source: "Richard P Feynman",
    loggedAt: "2026-07-26",
    href: "https://www.amazon.com/s?k=Surely+You%27re+Joking%2C+Mr.+Feynman%21+Richard+P+Feynman",
  },
  {
    id: "book-b257408ae8a5ff4e",
    kind: "book",
    title: "The Wright Brothers",
    source: "David McCullough",
    loggedAt: "2026-07-26",
    href: "https://www.amazon.com/s?k=The+Wright+Brothers+David+McCullough",
  },
  {
    id: "book-e7f9c6441fe1172d",
    kind: "book",
    title: "YouTube Secrets",
    source: "Benji Travis",
    loggedAt: "2026-07-23",
    href: "https://www.amazon.com/s?k=YouTube+Secrets+Benji+Travis",
  },
  {
    id: "book-2627d126db3f96c6",
    kind: "book",
    title: "Automate the Boring Stuff with Python",
    source: "Al Sweigart",
    loggedAt: "2026-07-09",
    href: "https://www.amazon.com/s?k=Automate+the+Boring+Stuff+with+Python+Al+Sweigart",
  },
  {
    id: "book-4e9ff96473e1851b",
    kind: "book",
    title: "The Feynman Lectures on Physics",
    source: "Richard P. Feynman, Robert B. Leighton, Matthew Sands",
    loggedAt: "2026-07-04",
    href: "https://www.amazon.com/s?k=The+Feynman+Lectures+on+Physics+Richard+P.+Feynman%2C+Robert+B.+Leighton%2C+Matthew+Sands",
  },
  {
    id: "book-0a6fe23bc5ab6261",
    kind: "book",
    title: "The Innovators",
    source: "Walter Isaacson",
    loggedAt: "2026-07-02",
    href: "https://www.amazon.com/s?k=The+Innovators+Walter+Isaacson",
  },
  {
    id: "book-29afba0bcfdb06e3",
    kind: "book",
    title: "The Nvidia Way",
    source: "Tae Kim",
    loggedAt: "2026-06-29",
    href: "https://www.amazon.com/s?k=The+Nvidia+Way+Tae+Kim",
  },
  {
    id: "book-a1611b66632c3b11",
    kind: "book",
    title: "Titan",
    source: "Ron Chernow",
    loggedAt: "2026-06-27",
    href: "https://www.amazon.com/s?k=Titan+Ron+Chernow",
  },
  {
    id: "book-09010af5cb84dd7f",
    kind: "book",
    title: "Steve Jobs",
    source: "Walter Isaacson",
    loggedAt: "2026-06-07",
    href: "https://www.amazon.com/s?k=Steve+Jobs+Walter+Isaacson",
  },
  {
    id: "book-1e1c0a6dcb8fe7a7",
    kind: "book",
    title: "Leonardo Da Vinci",
    source: "Walter Isaacson",
    loggedAt: "2026-06-07",
    href: "https://www.amazon.com/s?k=Leonardo+Da+Vinci+Walter+Isaacson",
  },
  {
    id: "book-20b6aab997b43c52",
    kind: "book",
    title: "The Innovator's Dilemma",
    source: "Clayton M Christensen",
    loggedAt: "2026-06-07",
    href: "https://www.amazon.com/s?k=The+Innovator%27s+Dilemma+Clayton+M+Christensen",
  },
  {
    id: "book-42e0b3b2b24131fe",
    kind: "book",
    title: "Elon Musk",
    source: "Walter Isaacson",
    loggedAt: "2026-06-07",
    href: "https://www.amazon.com/s?k=Elon+Musk+Walter+Isaacson",
  },
  {
    id: "book-ce963a461a6107d1",
    kind: "book",
    title: "Benjamin Franklin an American Life",
    source: "Walter Isaacson",
    loggedAt: "2026-06-07",
    href: "https://www.amazon.com/s?k=Benjamin+Franklin+an+American+Life+Walter+Isaacson",
  },
  {
    id: "book-f9d60c7daa0d8a2f",
    kind: "book",
    title: "Michael Jackson Inc",
    source: "Zack O'Malley Greenburg",
    loggedAt: "2026-06-04",
    href: "https://www.amazon.com/s?k=Michael+Jackson+Inc+Zack+O%27Malley+Greenburg",
  },
  {
    id: "book-ccc87d6ca1a8c997",
    kind: "book",
    title: "Man in the Music",
    source: "Joseph Vogel",
    loggedAt: "2026-06-04",
    href: "https://www.amazon.com/s?k=Man+in+the+Music+Joseph+Vogel",
  },
  {
    id: "book-aeb4a7f1c8211302",
    kind: "book",
    title: "Moonwalk",
    source: "Michael Jackson",
    loggedAt: "2026-06-03",
    href: "https://www.amazon.com/s?k=Moonwalk+Michael+Jackson",
  },
  {
    id: "book-fe08f07f76ff9be9",
    kind: "book",
    title: "100M Offers",
    source: "Alex Hormozi",
    loggedAt: "2026-03-29",
    href: "https://www.amazon.com/s?k=100M+Offers+Alex+Hormozi",
  },
  {
    id: "book-04ab6be86966f247",
    kind: "book",
    title: "The Stranger",
    source: "Albert Camus",
    loggedAt: "2026-03-21",
    href: "https://www.amazon.com/s?k=The+Stranger+Albert+Camus",
  },
  {
    id: "book-c1e4800144be8ed4",
    kind: "book",
    title: "Fahrenheit 451",
    source: "Ray Bradbury",
    loggedAt: "2026-03-21",
    href: "https://www.amazon.com/s?k=Fahrenheit+451+Ray+Bradbury",
  },
  {
    id: "book-1492f3c3d8b92a43",
    kind: "book",
    title: "Zero to One",
    source: "Peter Thiel",
    loggedAt: "2026-03-21",
    href: "https://www.amazon.com/s?k=Zero+to+One+Peter+Thiel",
    favorite: true,
    favoriteWhy: "Contrarian questions for what I ship.",
  },
  {
    id: "book-301ccfb4ff510d83",
    kind: "book",
    title: "1984",
    source: "George Orwell",
    loggedAt: "2026-03-21",
    href: "https://www.amazon.com/s?k=1984+George+Orwell",
  },
  {
    id: "book-0df09c9d265ac04a",
    kind: "book",
    title: "Deep Work",
    source: "Cal Newport",
    loggedAt: "2026-03-17",
    href: "https://www.amazon.com/s?k=Deep+Work+Cal+Newport",
  },
  {
    id: "book-3727bd322ea6dc75",
    kind: "book",
    title: "Influence",
    source: "Robert B Cialdini",
    loggedAt: "2026-03-17",
    href: "https://www.amazon.com/s?k=Influence+Robert+B+Cialdini",
  },
  {
    id: "book-fa595a4a2d3bff12",
    kind: "book",
    title: "Atomic Habits",
    source: "James Clear",
    loggedAt: "2026-03-17",
    href: "https://www.amazon.com/s?k=Atomic+Habits+James+Clear",
  },
  {
    id: "book-6b917f8361b02708",
    kind: "book",
    title: "Talk Like Ted",
    source: "Carmine Gallo",
    loggedAt: "2026-03-17",
    href: "https://www.amazon.com/s?k=Talk+Like+Ted+Carmine+Gallo",
  },
  {
    id: "book-2b7e66ba09b8ab01",
    kind: "book",
    title: "I Will Teach You to Be Rich",
    source: "Ramit Sethi",
    loggedAt: "2026-03-16",
    href: "https://www.amazon.com/s?k=I+Will+Teach+You+to+Be+Rich+Ramit+Sethi",
  },
  {
    id: "book-a8610f910c8c1a79",
    kind: "book",
    title: "Man's Search for Meaning",
    source: "Viktor Frankl",
    loggedAt: "2026-03-16",
    href: "https://www.amazon.com/s?k=Man%27s+Search+for+Meaning+Viktor+Frankl",
  },
  {
    id: "book-de7b7544706eadbc",
    kind: "book",
    title: "Five People You Meet in Heaven",
    source: "Mitch Albom",
    loggedAt: "2026-03-16",
    href: "https://www.amazon.com/s?k=Five+People+You+Meet+in+Heaven+Mitch+Albom",
  },
  {
    id: "book-b429d7a384fa8a4d",
    kind: "book",
    title: "Psycho-Cybernetics",
    source: "Maxwell Maltz",
    loggedAt: "2026-03-16",
    href: "https://www.amazon.com/s?k=Psycho-Cybernetics+Maxwell+Maltz",
  },
  {
    id: "book-92272d172f40eff3",
    kind: "book",
    title: "The Psychology of Money",
    source: "Morgan Housel",
    loggedAt: "2026-03-16",
    href: "https://www.amazon.com/s?k=The+Psychology+of+Money+Morgan+Housel",
  },
  {
    id: "book-498b428cba4250d8",
    kind: "book",
    title: "Tuesdays with Morrie",
    source: "Mitch Albom",
    loggedAt: "2026-03-16",
    href: "https://www.amazon.com/s?k=Tuesdays+with+Morrie+Mitch+Albom",
  },
  {
    id: "blog-sa-growth-gov",
    kind: "blog",
    title: "Growth and government",
    source: "Sam Altman",
    loggedAt: "2026-06-15",
    summary: "How growth, policy, and power shape the future",
    href: "https://blog.samaltman.com/growth-and-government",
  },
  {
    id: "blog-sa-how-to-be-successful",
    kind: "blog",
    title: "How to Be Successful",
    source: "Sam Altman",
    loggedAt: "2026-06-14",
    href: "https://blog.samaltman.com/how-to-be-successful",
  },
  {
    id: "blog-sa-productivity",
    kind: "blog",
    title: "Productivity",
    source: "Sam Altman",
    loggedAt: "2026-06-13",
    href: "https://blog.samaltman.com/productivity",
  },
  {
    id: "blog-sa-hard",
    kind: "blog",
    title: "Hard tech is back",
    source: "Sam Altman",
    loggedAt: "2026-06-12",
    href: "https://blog.samaltman.com/hard-tech-is-back",
  },
  {
    id: "blog-pg-ds",
    kind: "blog",
    title: "Do Things that Don't Scale",
    source: "Paul Graham",
    loggedAt: "2026-06-11",
    href: "https://www.paulgraham.com/ds.html",
  },
  {
    id: "blog-pg-growth",
    kind: "blog",
    title: "Startup = Growth",
    source: "Paul Graham",
    loggedAt: "2026-06-10",
    href: "https://www.paulgraham.com/growth.html",
  },
  {
    id: "blog-pg-mean",
    kind: "blog",
    title: "Mean People Fail",
    source: "Paul Graham",
    loggedAt: "2026-06-09",
    href: "https://www.paulgraham.com/mean.html",
  },
  {
    id: "blog-pg-cities",
    kind: "blog",
    title: "How to Be Silicon Valley",
    source: "Paul Graham",
    loggedAt: "2026-06-08",
    href: "https://www.paulgraham.com/siliconvalley.html",
  },
  {
    id: "blog-pg-makers",
    kind: "blog",
    title: "Maker's Schedule, Manager's Schedule",
    source: "Paul Graham",
    loggedAt: "2026-06-07",
    href: "https://www.paulgraham.com/makersschedule.html",
  },
];

export function getBookshelfEntries(): BookshelfEntry[] {
  return [...bookshelfEntries].sort(
    (a, b) => +new Date(b.loggedAt) - +new Date(a.loggedAt)
  );
}

export function getFavorites(): BookshelfEntry[] {
  return getBookshelfEntries().filter((e) => e.favorite);
}

export function getRecentBookshelf(limit = 3): BookshelfEntry[] {
  return getBookshelfEntries().slice(0, limit);
}

export function countByKind(entries: BookshelfEntry[] = getBookshelfEntries()) {
  return entries.reduce(
    (acc, e) => {
      acc[e.kind] = (acc[e.kind] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<BookshelfKind, number>>
  );
}
