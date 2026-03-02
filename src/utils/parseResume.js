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
      const items = content.items;

      if (items.length === 0) {
        pages.push("");
        continue;
      }

      // Use Y-position to detect line breaks
      let result = items[0].str;
      for (let j = 1; j < items.length; j++) {
        const prev = items[j - 1];
        const curr = items[j];
        const prevY = prev.transform[5];
        const currY = curr.transform[5];
        // If Y position changed, it's a new line
        if (Math.abs(currY - prevY) > 2) {
          result += "\n" + curr.str;
        } else {
          result += " " + curr.str;
        }
      }
      pages.push(result);
    }

    return { text: pages.join("\n"), pageCount: pdf.numPages };
  } catch {
    return { text: "", pageCount: 1 };
  }
}
