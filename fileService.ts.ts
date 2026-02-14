
// @ts-nocheck
// Disabling type check for CDN globals like pdfjsLib and XLSX

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
}

export async function extractTextFromExcel(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = window.XLSX.read(arrayBuffer);
  let fullText = "";

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const json = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    fullText += `Sheet: ${sheetName}\n` + json.map(row => row.join(" ")).join("\n") + "\n";
  });

  return fullText;
}
