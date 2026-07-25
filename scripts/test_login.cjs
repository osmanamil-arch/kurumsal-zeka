const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    consoleLogs.push(`[PAGE_ERROR] ${err.toString()}`);
  });

  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

    console.log('Typing credentials...');
    await page.type('input[type="email"]', 'orhan@anil.com');
    await page.type('input[type="password"]', '123456');

    console.log('Clicking login button...');
    // Find the login button
    await page.click('button[type="submit"]');

    console.log('Waiting for navigation/render...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

    console.log('Taking screenshot...');
    const screenshotPath = path.join('C:\\Users\\User\\.gemini\\antigravity\\brain\\7a90f832-304d-4242-947f-9580429d48ed', 'login_test_screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    console.log('--- CONSOLE LOGS ---');
    consoleLogs.forEach(log => console.log(log));
    console.log('---------------------');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
  }
}

run();
