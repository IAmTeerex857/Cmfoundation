#!/usr/bin/env node
// Converts a supplied EPUB (Atticus export) into the structured text edition the online reader uses.
//
//   npm run import-book -- <path/to/book.epub> <slug>
//
// Writes books/<slug>/edition.json: every section of the book in reading order (title page,
// copyright, front matter, prologue, parts, chapters, back matter) as clean, minimal HTML. The text
// is the publisher's own; only layout markup (drop caps, wrappers, classes) is removed, and the
// spelling slips listed in CORRECTIONS are put right.
// Re-run the command whenever the Foundation supplies a corrected EPUB.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { inflateRawSync } from "node:zlib";

const [, , epubPath, slug] = process.argv;
if (!epubPath || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: npm run import-book -- <book.epub> <slug>");
  process.exit(1);
}

/* ---------- A minimal ZIP reader (EPUBs are ZIP files) ---------- */

function unzip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("Not a ZIP/EPUB file");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = new Map();
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("Corrupt ZIP directory");
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    const dataStart = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(dataStart, dataStart + size);
    files.set(name, () => (method === 0 ? raw : inflateRawSync(raw)));
    p += 46 + nameLen + extraLen + commentLen;
  }
  return (name) => {
    const get = files.get(name);
    if (!get) throw new Error(`Missing ${name} in EPUB`);
    return get().toString("utf8");
  };
}

/* ---------- Text helpers ---------- */

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : (entities[e] ?? m),
  );
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const text = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const SMALL = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to"]);
const KEEP = new Set(["CMF", "DR", "II", "III", "IV"]);
/** Title-cases text supplied in capitals ("THE WAGES OF SIN" → "The Wages of Sin"); other text is left alone. */
const titleCase = (s) =>
  s !== s.toUpperCase()
    ? s
    : s
        .split(" ")
        .map((w, i) => {
          const bare = w.replace(/[^\p{L}]/gu, "");
          if (KEEP.has(bare)) return bare === "DR" ? w.replace("DR", "Dr") : w;
          const lower = w.toLowerCase();
          if (i > 0 && SMALL.has(lower)) return lower;
          return lower.replace(/\p{L}/u, (c) => c.toUpperCase());
        })
        .join(" ");
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Atticus splits a chapter's first word into a drop-cap span and a "lead word" span. Join them;
 * a lone "A" or "I" followed by a longer word is a word of its own ("I woke", "A criminal"),
 * otherwise the two halves are one word ("It", "And").
 */
function joinDropCap(html) {
  return html.replace(
    /<span[^>]*class="dropcap[^"]*"[^>]*>(.*?)<\/span>\s*<span[^>]*class="lead_word"[^>]*>(.*?)<\/span>/g,
    (_, cap, lead) => {
      const letter = decode(cap).replace(/[“"‘'…\s]/g, "");
      const space = (letter === "A" || letter === "I") && decode(lead).length >= 3 ? " " : "";
      return `${cap}${space}${lead}`;
    },
  );
}

const ALLOWED = new Set(["p", "em", "i", "strong", "b", "h3", "h4", "ul", "ol", "li", "br", "blockquote", "sup", "sub", "a"]);

/** Reduces publisher markup to plain, semantic HTML with no attributes (except safe link targets). */
function clean(html) {
  let out = joinDropCap(html)
    .replace(/<img[^>]*>/g, "")
    .replace(/<h2(\s[^>]*)?>/g, "<h3>")
    .replace(/<\/h2>/g, "</h3>")
    .replace(/<h1(\s[^>]*)?>/g, "<h3>")
    .replace(/<\/h1>/g, "</h3>");
  out = out.replace(/<(\/?)([a-z0-9]+)([^>]*?)(\/?)>/gi, (m, close, tag, attrs) => {
    tag = tag.toLowerCase();
    if (tag === "b") tag = "strong";
    if (tag === "i") tag = "em";
    if (!ALLOWED.has(tag)) return close ? "" : tag === "div" ? "" : "";
    if (close) return `</${tag}>`;
    if (tag === "br") return "<br>";
    if (tag === "a") {
      const href = /href="([^"]+)"/.exec(attrs)?.[1];
      return href && /^(https?:|mailto:)/.test(href) ? `<a href="${href}" rel="noopener" target="_blank">` : "<a>";
    }
    return `<${tag}>`;
  });
  return out
    .replace(/<a>(.*?)<\/a>/g, "$1")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+<\/p>/g, "</p>")
    .trim();
}

const NUMBER_WORDS = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split(" ");

/** "1", "1.", "Chapter 1" or "Chapter one" → 1. */
function chapterNumber(label) {
  const word = label.toLowerCase().replace(/^chapter\s+/, "").replace(/\.$/, "").trim();
  if (!word) return undefined;
  if (/^\d+$/.test(word)) return Number(word);
  const n = NUMBER_WORDS.indexOf(word);
  return n >= 0 ? n + 1 : undefined;
}

/* ---------- Read the book ---------- */

const read = unzip(readFileSync(epubPath));
const container = read("META-INF/container.xml");
const opfPath = /full-path="([^"]+)"/.exec(container)[1];
const base = path.posix.dirname(opfPath);
const opf = read(opfPath);

const manifest = new Map();
for (const tag of opf.match(/<item\s[^>]*>/g) ?? []) {
  const id = /\sid="([^"]+)"/.exec(tag)?.[1];
  const href = /\shref="([^"]+)"/.exec(tag)?.[1];
  if (id && href) manifest.set(id, decodeURIComponent(href));
}
const spine = [...opf.matchAll(/<itemref[^>]*idref="([^"]+)"/g)].map((m) => manifest.get(m[1])).filter(Boolean);
const meta = (name) => text(new RegExp(`<dc:${name}[^>]*>([\\s\\S]*?)</dc:${name}>`).exec(opf)?.[1] ?? "");

const FRONT = /^(title page|copyright|dedication|acknowledgements?|foreword|preface|introduction|(the )?cmf (literature|remembrance|remebrance) series)$/i;
const BACK = /^(epilogue|benediction|appendix|books by the author|important note|afterword|conclusion)/i;

const sections = [];
const ids = new Set();
for (const href of spine) {
  if (/(^|\/)toc\.x?html$/i.test(href) || /nav\.x?html$/i.test(href)) continue;
  const xhtml = read(path.posix.join(base, href));
  const body = /<body[^>]*>([\s\S]*)<\/body>/.exec(xhtml)?.[1] ?? "";
  const docTitle = text(/<title>([\s\S]*?)<\/title>/.exec(xhtml)?.[1] ?? "");

  let title = docTitle;
  let subtitle;
  let number;
  let html;

  if (/class="title-card"/.test(body)) {
    // Title page: rebuild it as text.
    const h1 = text(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(body)?.[1] ?? "");
    const h3 = text(/<h3[^>]*>([\s\S]*?)<\/h3>/.exec(body)?.[1] ?? "");
    const h2 = text(/<h2[^>]*>([\s\S]*?)<\/h2>/.exec(body)?.[1] ?? "");
    const publisher = text(/class="publisher-details"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/.exec(body)?.[1] ?? "");
    title = "Title Page";
    html = [
      `<p class="tp-title">${escape(titleCase(h1))}</p>`,
      h3 && `<p class="tp-subtitle">${escape(h3)}</p>`,
      h2 && `<p class="tp-author">${escape(titleCase(h2))}</p>`,
      publisher && `<p class="tp-publisher">${escape(titleCase(publisher))}</p>`,
    ]
      .filter(Boolean)
      .join("");
  } else {
    const card = /<div class="chapter-title-card[^"]*">([\s\S]*?)<\/div>\s*<div class="chapter-body/.exec(body);
    let rest = body;
    if (card) {
      number = chapterNumber(text(/class="chapter-number"[^>]*>([\s\S]*?)<\/div>/.exec(card[1])?.[1] ?? ""));
      title = text(/class="chapter-title"[^>]*>([\s\S]*?)<\/div>/.exec(card[1])?.[1] ?? "") || docTitle;
      subtitle = text(/class="chapter-subtitle"[^>]*>([\s\S]*?)<\/div>/.exec(card[1])?.[1] ?? "") || undefined;
      rest = body.replace(card[0], '<div class="chapter-body');
    } else {
      // Front matter without a title card starts with its heading; drop it (the reader shows the title).
      rest = body.replace(/<h[12][^>]*>[\s\S]*?<\/h[12]>/, "");
    }
    html = clean(rest);
  }

  title = title.replace(/\s+/g, " ").trim();
  const kind = /^part\s/i.test(title)
    ? "part"
    : /^prologue$/i.test(title)
      ? "prologue"
      : number
        ? "chapter"
        : FRONT.test(title)
          ? "front"
          : BACK.test(title)
            ? "back"
            : "front";

  let id = kind === "chapter" ? `chapter-${number}` : kind === "part" ? `part-${slugify(title.replace(/^part\s+/i, ""))}` : slugify(title) || "section";
  while (ids.has(id)) id += "-2";
  ids.add(id);

  const words = text(html).split(" ").filter(Boolean).length;
  sections.push({ id, kind, ...(number ? { number } : {}), title: kind === "part" ? titleCase(title) : title, ...(subtitle ? { subtitle } : {}), words, html });
}

// Where the introductory reading ends (the registration invitation appears after it): the
// Prologue, or the Introduction, or else the Preface.
const introEnd = ["prologue", "introduction", "preface"].map((id) => sections.find((s) => s.id === id || s.title.toLowerCase() === id)).find(Boolean);

const edition = {
  slug,
  source: path.basename(epubPath),
  importedAt: new Date().toISOString().slice(0, 10),
  title: titleCase(meta("title")),
  creator: titleCase(meta("creator")),
  publisher: titleCase(meta("publisher")),
  introEnds: introEnd?.id ?? sections[0].id,
  words: sections.reduce((n, s) => n + s.words, 0),
  sections,
};

// Spelling slips in the supplied files, corrected for the online edition (approved 19 November 2026).
const CORRECTIONS = [
  ["Remebrance", "Remembrance"], // The Wages of Sin, title page
  ["Chriatians", "Christians"], // God's Kind of Leader, chapter 12 title
  ["CHNWOKE", "CHINWOKE"], // False Men and True Christians, contact note
  ["Chnwoke", "Chinwoke"],
];
const json = CORRECTIONS.reduce((s, [wrong, right]) => s.replaceAll(wrong, right), JSON.stringify(edition, null, 1));

const outDir = path.join(process.cwd(), "books", slug);
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, "edition.json"), json + "\n");
console.log(`${slug}: ${sections.length} sections, ${edition.words.toLocaleString()} words, introduction ends at "${edition.introEnds}"`);
for (const s of sections) console.log(`  ${s.kind.padEnd(8)} ${s.id.padEnd(34)} ${s.title}${s.subtitle ? ` | ${s.subtitle}` : ""} (${s.words})`);
