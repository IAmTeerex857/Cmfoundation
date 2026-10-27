// Prepares a book PDF for the online reader: npm run prepare-book -- books/<slug>.pdf
//
// PDF.js checks a book's first and last pages when it opens it. In many exported PDFs (CorelDRAW
// among them) every page's dictionary sits beside that page's images, spread across the whole file,
// so that check downloads most of the book before page 1 appears. Rewriting the file with object
// streams packs those small dictionaries together near the end, and the reader opens the book from a
// few hundred kilobytes. Pages are copied unchanged, so the book looks exactly the same.

import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: npm run prepare-book -- books/<slug>.pdf [more.pdf ...]");
  process.exit(1);
}

for (const file of files) {
  const before = readFileSync(file);
  const doc = await PDFDocument.load(before, { updateMetadata: false });
  const after = await doc.save({ useObjectStreams: true, objectsPerTick: Infinity });
  writeFileSync(file, after);
  console.log(`${file}: ${doc.getPageCount()} pages, ${(before.length / 1e6).toFixed(1)} MB -> ${(after.length / 1e6).toFixed(1)} MB`);
}
