import { buildCsrReportSections } from "@/lib/report";
import type { ActionRecommendation, CarbonFootprint, EsgScoreBreakdown, OnboardingData } from "@/lib/types";
import { jsPDF } from "jspdf";

export const runtime = "nodejs";

function drawWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * 16;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    data: OnboardingData;
    carbon: CarbonFootprint;
    score: EsgScoreBreakdown;
    actions: ActionRecommendation[];
  };

  const sections = buildCsrReportSections(body.data, body.carbon, body.score, body.actions);
  const doc = new jsPDF({
    unit: "pt",
    format: "a4"
  });

  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - margin * 2;
  let cursorY = 56;

  doc.setFillColor(5, 12, 21);
  doc.rect(0, 0, pageWidth, 120, "F");
  doc.setTextColor(237, 245, 240);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("EcoSignal Enterprise", margin, cursorY);
  cursorY += 28;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Report CSRD demo per ${body.data.companyName}`, margin, cursorY);
  cursorY += 18;
  doc.text(`Punteggio ESG ${body.score.total}/100 | Emissioni totali ${body.carbon.total.toFixed(2)} tCO2eq`, margin, cursorY);

  cursorY = 150;
  doc.setTextColor(30, 41, 59);

  sections.forEach((section, sectionIndex) => {
    if (cursorY > 720) {
      doc.addPage();
      cursorY = 56;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${sectionIndex + 1}. ${section.title}`, margin, cursorY);
    cursorY += 22;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    section.bullets.forEach((bullet) => {
      cursorY = drawWrappedText(doc, `- ${bullet}`, margin, cursorY, usableWidth);
      cursorY += 8;
    });

    cursorY += 12;
  });

  const pdfArrayBuffer = doc.output("arraybuffer");

  return new Response(Buffer.from(pdfArrayBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ecosignal-csrd-${body.data.companyName.toLowerCase().replaceAll(" ", "-")}.pdf"`
    }
  });
}
