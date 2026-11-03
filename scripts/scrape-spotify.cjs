const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function scrapeSpotify() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  console.log('Navigating to Spotify artist page...');
  await page.goto('https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const data = await page.evaluate(() => {
    const artistName = document.querySelector('h1')?.innerText || '';
    
    // Monthly listeners
    const listenersEl = Array.from(document.querySelectorAll('span')).find(s => s.innerText.includes('monthly listeners') || s.innerText.includes('слушателей'));
    const listeners = listenersEl ? listenersEl.innerText : '';

    // Tracks / Popular
    const tracks = [];
    document.querySelectorAll('[data-testid="tracklist-row"]').forEach(row => {
      const title = row.querySelector('[data-encore-id="text"]')?.innerText || '';
      const plays = row.querySelector('[data-encore-id="textSmall"]')?.innerText || '';
      const duration = Array.from(row.querySelectorAll('div')).pop()?.innerText || '';
      const img = row.querySelector('img')?.src || '';
      if (title) {
        tracks.push({ title, plays, duration, img });
      }
    });

    // Discography / Releases
    const releases = [];
    document.querySelectorAll('a[href*="/album/"]').forEach(a => {
      const href = a.href;
      const title = a.innerText.trim();
      const img = a.querySelector('img')?.src || '';
      const parent = a.closest('div');
      const text = parent ? parent.innerText : '';
      releases.push({ href, title, img, text });
    });

    // Also look for schema.org or JSON-LD
    const jsonLd = document.querySelector('script[type="application/ld+json"]')?.innerText;

    return { artistName, listeners, tracks, releases, jsonLd };
  });

  console.log('Result:', JSON.stringify(data, null, 2));
  fs.writeFileSync('C:/Users/user/.gemini/antigravity/scratch/silicium/scripts/spotify-data.json', JSON.stringify(data, null, 2));

  await browser.close();
}

scrapeSpotify().catch(e => {
  console.error('Error scraping:', e);
});
