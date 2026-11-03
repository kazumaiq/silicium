const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\44845d97-28bd-4941-8608-99328775d490';

async function runTest() {
  console.log('Launching Chrome for integration verification...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:4173/?nointro ...');
  await page.goto('http://localhost:4173/?nointro', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Check title
  const title = await page.title();
  console.log('Page Title:', title);

  // 1. Check Hero section & Initial track
  const trackTitle = await page.$eval('h3[class*="compactTrackTitle"]', el => el.textContent.trim()).catch(() => 'NOT FOUND');
  console.log('Hero active track:', trackTitle);

  // Capture Hero Desktop
  await page.screenshot({ path: path.join(artifactDir, 'spotify-qa-desktop-hero.png') });
  console.log('Captured spotify-qa-desktop-hero.png');

  // 2. Scroll down to Discography section
  console.log('Scrolling down to Discography...');
  await page.evaluate(() => {
    const el = document.getElementById('discography');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));

  // Count releases rendered
  const releaseCount = await page.$$eval('article[class*="gridCard"]', els => els.length);
  console.log('Releases rendered in Discography grid:', releaseCount);

  // Extract titles and cover src
  const releases = await page.$$eval('article[class*="gridCard"]', cards => {
    return cards.map(c => {
      const titleEl = c.querySelector('h3[class*="cardTitle"]');
      const imgEl = c.querySelector('img[class*="cardCover"]');
      const yearEl = c.querySelector('span[class*="cardYear"]');
      return {
        title: titleEl ? titleEl.textContent.trim() : '',
        cover: imgEl ? imgEl.src : '',
        year: yearEl ? yearEl.textContent.trim() : ''
      };
    });
  });
  console.log('Rendered Spotify Releases:', JSON.stringify(releases.slice(0, 6), null, 2));

  // Capture Discography Desktop
  await page.screenshot({ path: path.join(artifactDir, 'spotify-qa-desktop-discography.png') });
  console.log('Captured spotify-qa-desktop-discography.png');

  // 3. Click the first card (MY WEED) to open Release Modal
  console.log('Clicking MY WEED card to open Release Modal...');
  const firstCard = await page.$('article[class*="gridCard"]');
  if (firstCard) {
    await firstCard.click();
    await new Promise(r => setTimeout(r, 1200));

    // Capture Release Modal Desktop
    await page.screenshot({ path: path.join(artifactDir, 'spotify-qa-release-modal.png') });
    console.log('Captured spotify-qa-release-modal.png');

    // Test playing track inside modal
    const modalPlayBtn = await page.$('button[class*="trackPlayBtn"]');
    if (modalPlayBtn) {
      console.log('Clicking track play button inside modal...');
      await modalPlayBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    // Close modal
    const closeBtn = await page.$('button[class*="closeBtn"]');
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 800));
    }
  }

  // 4. Test Mobile Viewport (390x844 iPhone 14)
  console.log('Switching to mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1500));

  // Check horizontal overflow on mobile
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile dimensions - scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, overflow: ${scrollWidth > clientWidth ? 'YES' : 'NONE'}`);

  await page.screenshot({ path: path.join(artifactDir, 'spotify-qa-mobile-hero.png') });
  console.log('Captured spotify-qa-mobile-hero.png');

  // Scroll to Discography on mobile
  await page.evaluate(() => {
    const el = document.getElementById('discography');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(artifactDir, 'spotify-qa-mobile-discography.png') });
  console.log('Captured spotify-qa-mobile-discography.png');

  // Check bottom player visibility
  const isBottomPlayerVisible = await page.evaluate(() => {
    const el = document.querySelector('div[class*="playerContainer"]');
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
  });
  console.log('Is bottom player visible on Discography section?', isBottomPlayerVisible);

  await browser.close();
  console.log('Test completed successfully!');
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
