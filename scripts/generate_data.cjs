const fs = require('fs');
const XLSX = require('xlsx');

const wb = XLSX.readFile('kurumsallaşma envanterii.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

const questions = [];
for (let i = 3; i < data.length; i++) {
  const row = data[i];
  if (!row || !row[0] || isNaN(parseInt(row[0]))) continue;
  
  questions.push({
    id: parseInt(row[0]),
    category: row[1],
    text: row[2],
    weight: parseInt(row[4]) || 0
  });
}

const dir = 'src/data';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const content = 'export const surveyQuestions = ' + JSON.stringify(questions, null, 2) + ';';
fs.writeFileSync('src/data/surveyData.js', content, 'utf8');
console.log('Successfully generated src/data/surveyData.js with ' + questions.length + ' questions.');
