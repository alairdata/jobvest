import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract all text from a PDF file.
 * @param {File} file - a File object (from <input type="file">)
 * @returns {Promise<{text: string, pageCount: number}>} full text content and page count
 */
export async function parseResume(file) {
  try {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      pages.push(strings.join(" "));
    }

    return { text: pages.join("\n"), pageCount: pdf.numPages };
  } catch {
    return { text: "", pageCount: 1 };
  }
}
