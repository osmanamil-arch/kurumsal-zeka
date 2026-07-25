const xlsx = require('xlsx');
const fs = require('fs');
const workbook = xlsx.readFile('Kurumsal İşlevsellik Ölçeğii.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const questions = [];
const dimensions = new Set();
for (let i = 1; i < data.length; i++) {
  if (!data[i] || !data[i][0]) continue;
  let text = data[i][0].toString().trim();
  text = text.replace(/^\d+[-.]\s*/, '');
  let dimension = data[i][1] ? data[i][1].toString().trim() : 'Genel';
  if (dimension) dimensions.add(dimension);
  
  let isReverse = false;
  const textLower = text.toLowerCase();
  
  if (textLower.includes('değil güçlü olandır') || 
      textLower.includes('suiistimal') || 
      textLower.includes('hayata geçirilmez') || 
      textLower.includes('iki defa yapılır') || 
      textLower.includes('adaletsiz') ||
      textLower.includes('kayırma')) {
    isReverse = true;
  }
  
  questions.push({
    id: `func_${i}`,
    text,
    dimension,
    isReverse
  });
}

const fileContent = `export const defaultFunctionalitySurvey = ${JSON.stringify(questions, null, 2)};\n\nexport const defaultFunctionalityDimensions = ${JSON.stringify(Array.from(dimensions), null, 2)};\n`;

fs.writeFileSync('src/data/functionalitySurvey.js', fileContent);
console.log('Saved src/data/functionalitySurvey.js. Questions:', questions.length, 'Dimensions:', dimensions.size);
