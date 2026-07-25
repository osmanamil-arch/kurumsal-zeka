import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const pdfLib = require('pdf-parse');

const pdfToText = typeof pdfLib === 'function' ? pdfLib : (pdfLib.default || pdfLib.pdf || Object.values(pdfLib).find(x => typeof x === 'function'));

let dataBuffer = fs.readFileSync('MOHER KİMYA KURUMSAL CHECK UP RAPOR.pdf');
pdfToText(dataBuffer).then(function(data) {
    fs.writeFileSync('pdf_output.txt', data.text);
    console.log("Done");
}).catch(err => {
    console.error("Error reading PDF:", err);
});
