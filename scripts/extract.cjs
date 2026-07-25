const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};
pdfExtract.extract('MOHER KİMYA KURUMSAL CHECK UP RAPOR.pdf', options, (err, data) => {
    if (err) return console.log(err);
    const text = data.pages.map(p => p.content.map(c => c.str).join(' ')).join('\n');
    fs.writeFileSync('pdf_output.txt', text);
    console.log("Done");
});
