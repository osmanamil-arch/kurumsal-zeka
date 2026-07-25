import sys
import PyPDF2

try:
    reader = PyPDF2.PdfReader('MOHER KİMYA KURUMSAL CHECK UP RAPOR.pdf')
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    with open('pdf_output.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Done")
except Exception as e:
    print("Error:", str(e))
