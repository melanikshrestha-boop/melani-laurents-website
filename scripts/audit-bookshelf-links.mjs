import fs from "node:fs";

const catalog = JSON.parse(
  fs.readFileSync(new URL("../src/data/bookshelf-catalog.json", import.meta.url)),
);
const books = catalog.filter((entry) => entry.kind === "book");
const failures = [];
const seenAsins = new Map();

for (const book of books) {
  const asin = String(book.asin || "").toUpperCase();
  const href = String(book.href || "");

  if (!/^[A-Z0-9]{10}$/.test(asin)) {
    failures.push(`${book.title}: missing or invalid ASIN`);
    continue;
  }
  if (href !== `https://www.amazon.com/dp/${asin}`) {
    failures.push(`${book.title}: product URL does not match ${asin}`);
  }
  if (seenAsins.has(asin)) {
    failures.push(`${book.title}: duplicate ASIN also used by ${seenAsins.get(asin)}`);
  } else {
    seenAsins.set(asin, book.title);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified ${books.length} direct Amazon product links.`);
