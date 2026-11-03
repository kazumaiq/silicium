const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\44845d97-28bd-4941-8608-99328775d490';

async function runVisualQA() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test 1: Desktop Home (1440x900)
  console.log('Testing 1: Desktop Home...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173?nointro', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3-desktop-home.png') });

  // Test 2: Mobile Home First Screen (iPhone 15 Pro: 393x852)
  console.log('Testing 2: Mobile Home first screen...');
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4173?nointro', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3-mobile-home-1.png') });

  // Test 3: Mobile Home Scrolled
  console.log('Testing 3: Mobile Home scrolled...');
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3-mobile-home-scrolled.png') });

  // Test 4: Desktop Discography
  console.log('Testing 4: Desktop Discography...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const el = document.getElementById('discography');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3-desktop-discography.png') });

  // Test 5: Mobile Discography
  console.log('Testing 5: Mobile Discography...');
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const el = document.getElementById('discography');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3-mobile-discography.png') });

  // Test 6: Desktop 3D Archive
  console.log('Testing 6: Desktop 3D Archive...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const el = document.getElementById('archive');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3-desktop-archive.png') });

  // Test 7: Mobile 3D Archive
  console.log('Testing 7: Mobile 3D Archive...');
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const el = document.getElementById('archive');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3-mobile-archive.png') });

  // Test 8: Section Transition (between Discography and 3D Archive)
  console.log('Testing 8: Section Transition...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const archiveEl = document.getElementById('archive');
    if (archiveEl) {
      window.scrollTo({ top: archiveEl.offsetTop - 300, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3-section-transition.png') });

  // Multi-viewport Overflow Verification
  const viewports = [320, 360, 375, 390, 430, 768, 1024, 1440];
  console.log('\n--- MULTI-VIEWPORT OVERFLOW AUDIT ---');
  for (const w of viewports) {
    await page.setViewport({ width: w, height: 800, isMobile: w <= 768, hasTouch: w <= 768 });
    await page.goto('http://localhost:4173?nointro', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    const audit = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    console.log(`Viewport ${w}px: scrollWidth=${audit.scrollWidth}, hasOverflow=${audit.hasOverflow}`);
    if (audit.hasOverflow) {
      console.error(`FAILED OVERFLOW AUDIT AT ${w}px!`);
    }
  }

  await browser.close();
  console.log('\nAll Visual QA screenshots captured successfully!');
}

runVisualQA().catch(e => {
  console.error(e);
  process.exit(1);
});
