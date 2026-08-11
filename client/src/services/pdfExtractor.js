import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export async function extractPdfText(file) {
  if (!file) {
    throw new Error("No PDF file provided.");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Please upload a PDF file.");
  }

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const content = await page.getTextContent();

    const text = content.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    pages.push({
      page: pageNumber,
      text,
    });
  }

  return {
    pageCount: pdf.numPages,
    pages,
    fullText: pages
      .map((page) => `Page ${page.page}: ${page.text}`)
      .join("\n\n"),
  };
}