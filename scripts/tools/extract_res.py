
import os
import zipfile
import re
import xml.etree.ElementTree as ET

def extract_text_from_pptx(pptx_path):
    text_content = []
    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            # List all slide files
            slides = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
            # Sort slides by number (slide1.xml, slide2.xml, ...)
            slides.sort(key=lambda x: int(re.search(r'slide(\d+)\.xml', x).group(1)))
            
            for slide_file in slides:
                try:
                    xml_content = z.read(slide_file)
                    root = ET.fromstring(xml_content)
                    # Namespace map (might vary, but usually 'a' is main drawingml namespace)
                    # We can just search for all 't' tags regardless of namespace for simplicity
                    # The tag is usually {http://schemas.openxmlformats.org/drawingml/2006/main}t
                    
                    slide_text = []
                    for elem in root.iter():
                        if elem.tag.endswith('}t'):
                            if elem.text:
                                slide_text.append(elem.text)
                    
                    if slide_text:
                        text_content.append(f"--- Slide {slides.index(slide_file) + 1} ---")
                        text_content.append(" ".join(slide_text))
                        text_content.append("")
                except Exception as e:
                    text_content.append(f"Error reading {slide_file}: {str(e)}")
                    
    except Exception as e:
        return f"Error extracting PPTX: {str(e)}"
        
    return "\n".join(text_content)

def extract_text_from_pdf_simple(pdf_path):
    # Fallback method using simple string extraction if no libraries are available
    # This is very basic and won't handle encoding perfectly for complex PDFs
    try:
        with open(pdf_path, 'rb') as f:
            content = f.read()
            # Try to find text streams
            # This is a very rough heuristic
            text = ""
            # Remove binary data
            clean_content = re.sub(b'[\x00-\x08\x0b-\x0c\x0e-\x1f]', b'', content)
            try:
                text = clean_content.decode('utf-8', errors='ignore')
            except:
                pass
            return text[:5000] + "\n...(truncated)..." # Return first 5000 chars
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

if __name__ == "__main__":
    pptx_path = r"C:\Users\86152\work\2026\tongxy\res\2025同心源工作汇报及2026展望.pptx"
    pdf_path = r"C:\Users\86152\work\2026\tongxy\res\同心源关爱异地求医大病儿童家庭社区支持中心.pdf"
    
    print("=== PPTX Content Extraction ===")
    pptx_text = extract_text_from_pptx(pptx_path)
    print(pptx_text[:2000]) # Print first 2000 chars to avoid overflow
    if len(pptx_text) > 2000:
        print("...(remaining content hidden)...")
    
    print("\n\n=== PDF Content Extraction (Attempt) ===")
    pdf_text = extract_text_from_pdf_simple(pdf_path)
    print(pdf_text[:2000])
