
import os
import zipfile
import re
import xml.etree.ElementTree as ET

def extract_text_from_pptx(pptx_path):
    text_content = []
    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            slides = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
            slides.sort(key=lambda x: int(re.search(r'slide(\d+)\.xml', x).group(1)))
            
            for slide_file in slides:
                try:
                    xml_content = z.read(slide_file)
                    root = ET.fromstring(xml_content)
                    slide_text = []
                    for elem in root.iter():
                        if elem.tag.endswith('}t') and elem.text:
                            slide_text.append(elem.text)
                    
                    if slide_text:
                        text_content.append(f"--- Slide {slides.index(slide_file) + 1} ---")
                        text_content.append(" ".join(slide_text))
                        text_content.append("")
                except Exception:
                     pass
    except Exception as e:
        return f"Error: {str(e)}"
    return "\n".join(text_content)

if __name__ == "__main__":
    pptx_path = r"C:\Users\86152\work\2026\tongxy\res\2025同心源工作汇报及2026展望.pptx"
    content = extract_text_from_pptx(pptx_path)
    with open(r"C:\Users\86152\work\2026\tongxy\pptx_content.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("PPTX content saved to pptx_content.txt")
