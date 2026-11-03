const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\44845d97-28bd-4941-8608-99328775d490';

async function runQA() {
  console.log('Launching Chrome for Phase 04 Mobile Motion Verification...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test across all specified viewports for horizontal overflow
  const viewports = [
    { name: 'iPhone 15 Pro', width: 393, height: 852 },
    { name: 'iPhone 15 Pro Max', width: 430, height: 932 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Narrow 320', width: 320, height: 600 },
    { name: 'Tablet 768', width: 768, height: 1024 },
    { name: 'Desktop 1440', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4173/?nointro', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      return {
        docW,
        clientW,
        hasOverflow: docW > clientW
      };
    });

    console.log(`[Viewport ${vp.name} (${vp.width}px)]: scrollWidth=${overflow.docW}, clientWidth=${overflow.clientW}, overflow=${overflow.hasOverflow ? 'FAIL' : 'PASS (0px)'}`);
  }

  // 1. Detailed Mobile Experience (iPhone 15 Pro: 393x852)
  console.log('\n--- Testing iPhone 15 Pro (393px) Mobile Experience ---');
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('http://localhost:4173/?nointro', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Screenshot Hero Mobile
  await page.screenshot({ path: path.join(artifactDir, 'phase4-iphone15pro-home.png') });
  console.log('Captured phase4-iphone15pro-home.png');

  // Scroll to 3D Archive
  console.log('Scrolling to 3D Archive section...');
  await page.evaluate(() => {
    const el = document.getElementById('archive');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 2000));

  // Check 3D Archive container styles (verify no border, no rigid card)
  const arenaStyles = await page.evaluate(() => {
    const arena = document.querySelector('div[class*="canvasArena"]');
    if (!arena) return null;
    const computed = window.getComputedStyle(arena);
    return {
      border: computed.border,
      background: computed.background,
      boxShadow: computed.boxShadow,
      touchAction: computed.touchAction
    };
  });
  console.log('3D Archive Canvas Arena Styles:', arenaStyles);

  // Screenshot 3D Archive in Normal Mode
  await page.screenshot({ path: path.join(artifactDir, 'phase4-iphone15pro-archive-normal.png') });
  console.log('Captured phase4-iphone15pro-archive-normal.png');

  // Click «ИССЛЕДОВАТЬ 3D-МАТРИЦУ»
  console.log('Clicking Explore Mode button...');
  const exploreBtn = await page.$('button[class*="exploreModeBtn"]');
  if (exploreBtn) {
    await exploreBtn.click();
    await new Promise(r => setTimeout(r, 1200));

    // Verify HUD appeared
    const hudVisible = await page.$eval('div[class*="floatingHud"]', el => !!el).catch(() => false);
    console.log('Is Floating HUD visible in Explore Mode?', hudVisible);

    // Screenshot in Explore Mode
    await page.screenshot({ path: path.join(artifactDir, 'phase4-iphone15pro-archive-explore.png') });
    console.log('Captured phase4-iphone15pro-archive-explore.png');
  }

  // Click on canvas to select an artifact and open the drawer
  console.log('Clicking center/artifact area on canvas to inspect artifact...');
  const canvas = await page.$('div[class*="canvasArena"] canvas');
  if (canvas) {
    const box = await canvas.boundingBox();
    if (box) {
      // Tap slightly off-center where orbiting artifacts travel
      await page.mouse.click(box.x + box.width * 0.35, box.y + box.height * 0.45);
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Screenshot drawer / bottom sheet
  await page.screenshot({ path: path.join(artifactDir, 'phase4-iphone15pro-archive-drawer.png') });
  console.log('Captured phase4-iphone15pro-archive-drawer.png');

  // Scroll to About section (Living timeline)
  console.log('Scrolling to About section...');
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(artifactDir, 'phase4-iphone15pro-about.png') });
  console.log('Captured phase4-iphone15pro-about.png');

  // Test iPhone SE (375px)
  console.log('\n--- Capturing iPhone SE (375px) ---');
  await page.setViewport({ width: 375, height: 667 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'phase4-iphonese-375.png') });
  console.log('Captured phase4-iphonese-375.png');

  // Test Narrow 320px
  console.log('\n--- Capturing Narrow 320px ---');
  await page.setViewport({ width: 320, height: 600 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'phase4-narrow-320.png') });
  console.log('Captured phase4-narrow-320.png');

  // Test Desktop 1440px 3D Archive (No-Box Seamless)
  console.log('\n--- Capturing Desktop 1440px Seamless 3D Archive ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const el = document.getElementById('archive');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: path.join(artifactDir, 'phase4-desktop-archive-nobox.png') });
  console.log('Captured phase4-desktop-archive-nobox.png');

  await browser.close();
  console.log('\n=== Phase 04 Mobile QA Tests Complete! ===');
}

runQA().catch(err => {
  console.error('QA Error:', err);
  process.exit(1);
});
