// Shared helpers for file-based tools (client only)
import JSZip from "jszip";

export const fmtSize = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(2)} MB`);
export const baseName = (name: string) => name.replace(/\.[^.]+$/, "");

export function downloadBlob(blob: Blob | Uint8Array, filename: string) {
  const b = blob instanceof Blob ? blob : new Blob([blob as BlobPart]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export async function downloadZip(files: { name: string; data: Blob | Uint8Array }[], zipName: string) {
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.name, f.data));
  downloadBlob(await zip.generateAsync({ type: "blob" }), zipName);
}

/** "1-3, 5, 8-10" -> [0,1,2,4,7,8,9] (zero-based, clamped) */
export function parsePageRanges(input: string, total: number): number[] {
  const out = new Set<number>();
  for (const part of input.split(/[,\s]+/).filter(Boolean)) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const a = Math.max(1, +m[1]), b = Math.min(total, m[2] ? +m[2] : a);
    for (let i = a; i <= b; i++) out.add(i - 1);
  }
  return [...out].sort((x, y) => x - y);
}

export async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

/** Render each page of a PDF to a canvas -> Blob (image). */
export async function renderPdfPages(data: ArrayBuffer, opts: { scale?: number; type?: "image/png" | "image/jpeg"; quality?: number; pages?: number[]; onProgress?: (done: number, total: number) => void } = {}) {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages = opts.pages ?? Array.from({ length: doc.numPages }, (_, i) => i);
  const out: { blob: Blob; width: number; height: number }[] = [];
  for (let i = 0; i < pages.length; i++) {
    const page = await doc.getPage(pages[i] + 1);
    const viewport = page.getViewport({ scale: opts.scale ?? 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width; canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), opts.type ?? "image/png", opts.quality));
    out.push({ blob, width: canvas.width, height: canvas.height });
    opts.onProgress?.(i + 1, pages.length);
  }
  return { images: out, numPages: doc.numPages };
}

export async function pdfPageCount(data: ArrayBuffer) {
  const { PDFDocument } = await import("pdf-lib");
  return (await PDFDocument.load(data, { ignoreEncryption: true })).getPageCount();
}
