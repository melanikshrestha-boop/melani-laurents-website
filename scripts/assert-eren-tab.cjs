#!/usr/bin/env node
/* Fail the ship if the tab mark is a C / face-crop instead of square Eren. */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function fail(msg) {
  console.error(`EREN: ${msg}`);
  process.exit(1);
}

for (const rel of [
  "src/app/icon.tsx",
  "src/app/apple-icon.tsx",
  "src/app/icon.svg",
  "src/app/apple-icon.svg",
  "src/app/favicon.ico",
  "src/app/icon.png",
  "src/app/apple-icon.png",
]) {
  if (fs.existsSync(path.join(root, rel))) {
    fail(`delete ${rel} — Next file icons inject IconMark / hashed ICO (gold C)`);
  }
}

function icoFrames(buf) {
  if (buf.length < 6) return 0;
  if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) return 0;
  return buf.readUInt16LE(4);
}

const icoPaths = ["public/favicon.ico"];
for (const rel of icoPaths) {
  if (!fs.existsSync(path.join(root, rel))) {
    fail(`missing ${rel}`);
  }
}

for (const rel of icoPaths) {
  const buf = fs.readFileSync(path.join(root, rel));
  if (buf.length < 4000) {
    fail(
      `${rel} is ${buf.length} bytes (C / 32px face-crop). Need full square Eren ICO (>4000, 32+48).`,
    );
  }
  const n = icoFrames(buf);
  if (n < 2) {
    fail(
      `${rel} has ${n} ICO frame(s). Chrome's 16px crop reads as ©. Need 32+48 from full Eren.`,
    );
  }
}

for (const rel of ["public/icon.png", "public/eren-now.png", "public/icon-eren.png"]) {
  const size = fs.statSync(path.join(root, rel)).size;
  if (size < 10000) {
    fail(`${rel} is ${size} bytes — face crop / C. Need full manga square.`);
  }
}

const mustPin = [
  "src/app/layout.tsx",
  "src/app/(site)/layout.tsx",
  "src/app/photography/layout.tsx",
  "src/app/kids-book/layout.tsx",
  "src/app/not-found.tsx",
  "src/app/(site)/bookshelf/page.tsx",
  "src/lib/eren-tab.ts",
  "src/app/manifest.ts",
];
for (const rel of mustPin) {
  const text = fs.readFileSync(path.join(root, rel), "utf8");
  if (!text.includes("erenTabIcons") && !text.includes("EREN_TAB_SRC") && !text.includes("EREN_TAB_DATA_32")) {
    fail(`${rel} does not pin Eren icons — nested metadata can drop a C into the tab`);
  }
  if (
    /eren-hold16|eren-keep15|eren-every18|eren-all\.png|\?v=hold16|\?v=keep15|\?v=forever1|\?v=every18|\?v=all1/.test(
      text,
    )
  ) {
    fail(`${rel} still uses a burned cache-bust`);
  }
}

const tab = fs.readFileSync(path.join(root, "src/lib/eren-tab.ts"), "utf8");
if (!tab.includes("/eren-now.png") || !tab.includes("?v=now1")) {
  fail("src/lib/eren-tab.ts must point at /eren-now.png?v=now1");
}
if (!tab.includes("EREN_TAB_DATA_32") || !tab.includes("data:image/png;base64,iVBOR")) {
  fail("src/lib/eren-tab.ts must inline a PNG data URI of Eren (32px)");
}

const layout = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
if (!layout.includes("EREN_TAB_DATA_32")) {
  fail("src/app/layout.tsx <head> must hard-link the Eren data URI");
}

console.log("Eren intact");
