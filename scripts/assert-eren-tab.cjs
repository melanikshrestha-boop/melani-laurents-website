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
]) {
  if (fs.existsSync(path.join(root, rel))) {
    fail(`delete ${rel} — Next will generate a cream C`);
  }
}

function icoFrames(buf) {
  if (buf.length < 6) return 0;
  if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) return 0;
  return buf.readUInt16LE(4);
}

if (fs.existsSync(path.join(root, "src/app/favicon.ico"))) {
  fail(
    "delete src/app/favicon.ico — Next hashes it (?favicon.*.ico) and Chrome shows the gold C",
  );
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

for (const rel of ["src/app/icon.png", "public/icon.png"]) {
  const size = fs.statSync(path.join(root, rel)).size;
  if (size < 10000) {
    fail(`${rel} is ${size} bytes — face crop / C. Need full manga square.`);
  }
}

console.log("Eren intact");
