import { jsPDF } from "jspdf";

const PAGE_W = 612; // letter width in pt
const PAGE_H = 792; // letter height in pt
const MARGIN = 54; // 0.75 inch
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_HEIGHT = 1.35;

/**
 * Generate a resume PDF from Claude's structured JSON response.
 * @param {{ name: string, contact: string, sections: Array }} data
 * @returns {string} blob URL for the generated PDF
 */
export function generateResumePdf(data) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  let y = MARGIN;

  function checkPageBreak(needed) {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function drawText(text, x, fontSize, opts = {}) {
    const { bold, color, maxWidth, align } = {
      bold: false,
      color: "#1a1a1a",
      maxWidth: CONTENT_W,
      align: "left",
      ...opts,
    };

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(color);

    const lines = doc.splitTextToSize(text, maxWidth);
    const lineH = fontSize * LINE_HEIGHT;

    for (const line of lines) {
      checkPageBreak(lineH);
      doc.text(line, x, y, { align });
      y += lineH;
    }

    return lines.length;
  }

  // ── Name ──
  drawText(data.name || "Name", PAGE_W / 2, 18, {
    bold: true,
    align: "center",
    maxWidth: CONTENT_W,
  });

  y += 2;

  // ── Contact line ──
  if (data.contact) {
    drawText(data.contact, PAGE_W / 2, 9, {
      color: "#666666",
      align: "center",
      maxWidth: CONTENT_W,
    });
  }

  y += 4;

  // ── Horizontal rule ──
  doc.setDrawColor("#cccccc");
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 12;

  // ── Sections ──
  for (const section of data.sections || []) {
    checkPageBreak(30);

    // Section header
    drawText(section.title.toUpperCase(), MARGIN, 11, { bold: true });
    y += 2;

    // Thin line under header
    doc.setDrawColor("#e0e0e0");
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 8;

    // Content paragraph (e.g., Summary, Skills)
    if (section.content) {
      drawText(section.content, MARGIN, 10);
      y += 6;
    }

    // Items (e.g., Work Experience entries, Education entries)
    if (section.items) {
      for (const item of section.items) {
        checkPageBreak(24);

        // Item title (e.g., job title, degree)
        if (item.title) {
          drawText(item.title, MARGIN, 10.5, { bold: true });
        }

        // Item subtitle (e.g., company, university)
        if (item.subtitle) {
          drawText(item.subtitle, MARGIN, 9, { color: "#555555" });
          y += 2;
        }

        // Bullets
        if (item.bullets) {
          for (const bullet of item.bullets) {
            checkPageBreak(14);
            const bulletX = MARGIN + 10;
            const bulletW = CONTENT_W - 10;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor("#1a1a1a");

            // Bullet character
            doc.text("\u2022", MARGIN + 2, y);

            // Bullet text
            const lines = doc.splitTextToSize(bullet, bulletW);
            const lineH = 10 * LINE_HEIGHT;

            for (const line of lines) {
              checkPageBreak(lineH);
              doc.text(line, bulletX, y);
              y += lineH;
            }
          }
        }

        y += 6; // spacing between items
      }
    }

    y += 4; // spacing between sections
  }

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}
