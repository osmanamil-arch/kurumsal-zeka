const xlsx = require('xlsx');
const fs = require('fs');

try {
  const filePath = 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\kobi-panel\\BY MY ÇMA.xlsx';
  const workbook = xlsx.readFile(filePath);
  
  // Read first sheet
  const firstSheetName = workbook.SheetNames[0];
  console.log('First sheet:', firstSheetName);
  
  const sheet = workbook.Sheets[firstSheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  // Print first 4 rows to understand headers
  console.log('--- First 4 Rows (Headers/Questions) ---');
  for (let i = 0; i < Math.min(4, data.length); i++) {
    console.log(`Row ${i}:`, data[i]);
  }
  
  // Also check if there's evaluation logic at the end or in a specific block
  console.log('--- Rows 10-20 ---');
  for (let i = 10; i < Math.min(20, data.length); i++) {
    console.log(`Row ${i}:`, data[i]);
  }

} catch (err) {
  console.error("Error reading excel:", err);
}
