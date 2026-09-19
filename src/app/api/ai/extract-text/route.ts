import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { hasFeatureAccess } from "@/lib/entitlements";
import AdmZip from "adm-zip";
import PDFParser from "pdf2json";

export const maxDuration = 60; // Allow more time for OCR

export async function POST(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    // Enforce Pro plan
    if (!(await hasFeatureAccess(dbUser as any, "PRO"))) {
      return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    // Handle DOCX
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
      extractedText = extractTextFromDocx(buffer);
    }
    // Handle PDF (Using pdf2json to avoid Turbopack canvas issues)
    else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      extractedText = await extractTextFromPdf(buffer);
    }
    // Handle Images (Using Gemini 2.5 Flash)
    else if (file.type.startsWith("image/")) {
      extractedText = await extractTextFromImage(buffer, file.type);
    } 
    else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json({ error: "No text could be extracted" }, { status: 400 });
    }

    // Wrap paragraphs in <p> tags for the editor
    const formattedHtml = extractedText
      .split(/\n\s*\n/)
      .filter(p => p.trim())
      .map(p => `<p>${p.trim().replace(/\n/g, "<br/>")}</p>`)
      .join("");

    return NextResponse.json({ text: formattedHtml }, { status: 200 });

  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Extract Text Error:", error);
    return NextResponse.json(
      { error: `Failed to extract text: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}

async function extractTextFromImage(buffer: Buffer, mimeType: string): Promise<string> {
  const prompt = `Extract all handwritten or printed text from this image exactly as written. Preserve formatting, paragraphs, and punctuation as closely as possible. Do not include any other commentary. Just return the text.`;
  
  const keys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY
  ].filter(Boolean) as string[];

  if (keys.length === 0) throw new Error("Missing Gemini keys");
  
  const base64Image = buffer.toString("base64");
  let lastError = null;

  for (const key of keys) {
    try {
      console.log(`[ExtractText] Trying Gemini 2.5 Flash with key ${key.substring(0, 8)}...`);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${err}`);
      }

      const data = await response.json();
      const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (extractedText) return extractedText;
      
    } catch (error: any) {
      console.warn(`[ExtractText] Gemini key failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All vision AI providers failed.");
}

function extractTextFromDocx(buffer: Buffer): string {
  try {
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    const documentEntry = zipEntries.find((entry: any) => entry.entryName === "word/document.xml");
    
    if (!documentEntry) {
      throw new Error("Invalid DOCX file format");
    }
    
    const xml = documentEntry.getData().toString("utf8");
    // Quick regex to extract text between <w:t> tags
    const matches = xml.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g);
    if (!matches) return "";
    
    let text = matches.map((m: string) => m.replace(/<[^>]+>/g, '')).join('');
    
    // Attempt to preserve some paragraph breaks by replacing <w:p> ends with newlines
    const pMatches = xml.split(/<\/w:p>/);
    text = pMatches.map((p: string) => {
      const tMatches = p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g);
      if (!tMatches) return "";
      return tMatches.map((m: string) => m.replace(/<[^>]+>/g, '')).join('');
    }).filter(Boolean).join('\n\n');
    
    return text;
  } catch (err) {
    console.error("DOCX parse error:", err);
    throw new Error("Failed to parse DOCX file");
  }
}

function extractTextFromPdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true as any);
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
}
