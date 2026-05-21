import fitz  # PyMuPDF
import sys
import json
import argparse
import os

def main():
    parser = argparse.ArgumentParser(description="Extract first page text, metadata, and render cover from PDF")
    parser.add_argument("--file", required=True, help="Path to the PDF file")
    parser.add_argument("--out-cover", required=True, help="Path where the cover image (PNG) should be saved")
    args = parser.parse_args()

    pdf_path = args.file
    out_cover_path = args.out_cover

    try:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        # Open the PDF
        doc = fitz.open(pdf_path)
        if len(doc) == 0:
            raise ValueError("PDF has 0 pages")

        # Load first page and render to image
        # dpi=150 is a good balance between quality and file size for cover thumbnail
        first_page = doc.load_page(0)
        pix = first_page.get_pixmap(dpi=150)
        
        # Ensure output directory exists
        out_dir = os.path.dirname(out_cover_path)
        if out_dir and not os.path.exists(out_dir):
            os.makedirs(out_dir)

        pix.save(out_cover_path)

        # Extract text: look beyond the first page if it is empty/sparse
        text_chunks = []
        max_pages_to_check = min(len(doc), 5)
        
        for page_idx in range(max_pages_to_check):
            page_text = doc.load_page(page_idx).get_text()
            if page_text.strip():
                text_chunks.append(page_text.strip())
            # If we've gathered enough text (e.g. 1500 chars), we can stop
            if sum(len(c) for c in text_chunks) > 1500:
                break
        
        full_text = "\n--- PAGE BREAK ---\n".join(text_chunks)

        # Gather PDF document properties
        meta = doc.metadata or {}
        pdf_metadata = {
            "title": meta.get("title", ""),
            "author": meta.get("author", ""),
            "subject": meta.get("subject", "")
        }

        doc.close()

        # Print JSON response to stdout
        result = {
            "success": True,
            "text": full_text,
            "pdfMetadata": pdf_metadata,
            "error": None
        }
        print(json.dumps(result))

    except Exception as e:
        result = {
            "success": False,
            "text": "",
            "pdfMetadata": {"title": "", "author": "", "subject": ""},
            "error": str(e)
        }
        print(json.dumps(result))
        sys.exit(1)

if __name__ == "__main__":
    main()
