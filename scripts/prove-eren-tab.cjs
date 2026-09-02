#!/usr/bin/env node
/**
 * Prove every public route ships square Eren in HTML — not a cream C.
 * Usage: node scripts/prove-eren-tab.cjs [baseUrl]
 * Default base: http://127.0.0.1:3001
 */
const http = require("http");
const https = require("https");

const base = (process.argv[2] || "http://127.0.0.1:3001").replace(/\/$/, "");
const routes = [
  "/",
  "/bookshelf",
  "/blog",
  "/projects",
  "/photography",
  "/photography/poem",
  "/contact",
  "/daily",
  "/research",
];

function fail(msg) {
  console.error(`EREN PROVE: ${msg}`);
  process.exit(1);
}

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      { headers: { "user-agent": "eren-prove" } },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({
            status: res.statusCode || 0,
            type: String(res.headers["content-type"] || ""),
            body: Buffer.concat(chunks),
          });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(20000, () => {
      req.destroy(new Error("timeout " + url));
    });
  });
}

(async () => {
  for (const route of routes) {
    const url = base + route;
    const res = await get(url);
    if (res.status >= 400) fail(`${url} status ${res.status}`);
    const html = res.body.toString("utf8");
    if (!html.includes("data:image/png;base64,iVBOR")) {
      fail(`${url} HTML has no inline Eren PNG data URI — Chrome can keep a C`);
    }
    if (!html.includes("/eren-now.png")) {
      fail(`${url} HTML missing /eren-now.png`);
    }
    if (/icon\.tsx|apple-icon\.tsx|\?favicon\.[^"']+\.ico/.test(html)) {
      fail(`${url} HTML still has a Next hashed ICO / icon.tsx (cream C)`);
    }
    console.log("ok html", route);
  }

  const ico = await get(base + "/favicon.ico");
  if (ico.status >= 400) fail("/favicon.ico status " + ico.status);
  if (!ico.type.includes("png") && ico.body[0] !== 0x89) {
    /* rewrite serves PNG; raw ICO starts 00 00 01 00 */
    const isIco =
      ico.body.length >= 6 && ico.body.readUInt16LE(0) === 0 && ico.body.readUInt16LE(2) === 1;
    if (isIco && ico.body.length < 4000) {
      fail("/favicon.ico is a tiny ICO (C / face crop)");
    }
  }
  if (ico.body.length < 4000) fail("/favicon.ico too small: " + ico.body.length);
  console.log("ok favicon.ico", ico.body.length, ico.type);

  const png = await get(base + "/eren-now.png?v=now1");
  if (png.status >= 400) fail("/eren-now.png status " + png.status);
  if (png.body.length < 10000) fail("/eren-now.png too small: " + png.body.length);
  if (png.body[0] !== 0x89 || png.body[1] !== 0x50) fail("/eren-now.png is not a PNG");
  console.log("ok eren-now.png", png.body.length);

  console.log("Eren proved on", base);
})().catch((err) => {
  fail(String(err && err.message ? err.message : err));
});
