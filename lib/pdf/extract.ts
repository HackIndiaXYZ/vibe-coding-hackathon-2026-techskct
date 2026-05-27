// @ts-ignore
import pdfParser from 'pdf-parse/lib/pdf-parse.js';

/**
 * Lightweight PDF text extractor for Node.js 20+
 * Does NOT depend on pdfjs-dist or native addons.
 * Uses pdf-parse as primary method and falls back to manual stream parser on error.
 */

export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParser(buffer);
    if (data && data.text && data.text.trim()) {
      return data.text;
    }
  } catch (error) {
    console.error('pdf-parse extraction failed, attempting fallback:', error);
  }
  return extractPdfTextFallback(buffer);
}

function extractPdfTextFallback(buffer: Buffer): string {
  const content = buffer.toString('latin1'); // Use latin1 to preserve byte values
  const textParts: string[] = [];

  // ── Strategy 1: Extract text from BT...ET blocks (PDF text operators) ──────
  const btEtRegex = /BT([\s\S]*?)ET/g;
  let match: RegExpExecArray | null;

  while ((match = btEtRegex.exec(content)) !== null) {
    const block = match[1];

    // Extract strings from Tj / TJ / ' / " operators
    // Parenthesised strings: (Hello World) Tj
    const parenRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*(?:Tj|'|")/g;
    let paren: RegExpExecArray | null;
    while ((paren = parenRegex.exec(block)) !== null) {
      const decoded = decodePdfString(paren[1]);
      if (decoded.trim()) textParts.push(decoded);
    }

    // Array form: [(Hello) 20 (World)] TJ
    const arrayRegex = /\[([^\]]*)\]\s*TJ/g;
    let arr: RegExpExecArray | null;
    while ((arr = arrayRegex.exec(block)) !== null) {
      const items = arr[1].matchAll(/\(([^)\\]*(?:\\.[^)\\]*)*)\)/g);
      for (const item of items) {
        const decoded = decodePdfString(item[1]);
        if (decoded.trim()) textParts.push(decoded);
      }
    }

    // After each BT block, add a newline to separate paragraphs
    textParts.push('\n');
  }

  // ── Strategy 2: Fallback — scan for printable ASCII sequences ────────────
  // This catches PDFs that embed text outside BT/ET (older generators)
  if (textParts.filter(t => t.trim().length > 2).length < 5) {
    const printableRegex = /[\x20-\x7E]{4,}/g;
    let m: RegExpExecArray | null;
    while ((m = printableRegex.exec(content)) !== null) {
      const s = m[0].trim();
      // Skip PDF keywords and binary-looking strings
      if (
        s.length >= 4 &&
        !/^(obj|endobj|stream|endstream|xref|trailer|startxref|%%EOF|BT|ET|Tf|Td|Tm|TD|TJ|Tj|PDF|Type|Font|Page)/.test(s) &&
        !/^\d+[\s\d.]+$/.test(s) // skip pure number sequences
      ) {
        textParts.push(s + ' ');
      }
    }
  }

  // ── Clean up ────────────────────────────────────────────────────────────
  return textParts
    .join(' ')
    .replace(/\s{3,}/g, '\n') // collapse excessive whitespace
    .replace(/([a-z])([A-Z])/g, '$1 $2') // fix run-together words
    .trim();
}

/**
 * Decode PDF escape sequences in parenthesised strings.
 * Handles \\n \\r \\t \\\\ \\( \\) and octal escapes.
 */
function decodePdfString(s: string): string {
  return s
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\(\d{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}
