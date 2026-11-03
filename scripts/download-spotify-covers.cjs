const fs = require('fs');
const path = require('path');

const albumIds = [
  '3jn0MeQZ1J3YK1KoOtVnyd', // MY WEED
  '2JEQZUsgdb7U5ytFW8zwt3', // KORDEITY
  '3KoSx9969tQ6bpVWi7fFSD', // BROKEN WHEEL PHONK
  '3qs7b47rMX78r13E3G70Kv', // BLESS
  '3d2XFznHSN5UOH3ijbU1Pm', // GANTELYA
  '2mvPhakQ3d9CrXiwwi73iA', // FAITH
  '5rFx4HcJF5HWiTZKGlJaxH', // WHERE YOUR BOUND
  '0BFqYt95gsgQKLqgx0Za5H', // apathy
  '1RMKKvZhtQGrVjTv5RNVFx', // FAINT
  '3QfHZ7RPHui7zAAP62RA3U', // Чудеса
  '19xn3tQAst5EhUDkM1mdBq',
  '0llC0F8BRnSOCM4dVB5WaB',
  '26EafR6U3v4xZWfgfUD4W5',
  '6xZEGzeKE9DC9n6bC4pCIu'
];

async function downloadAlbumData() {
  const results = [];

  for (const id of albumIds) {
    try {
      const url = `https://open.spotify.com/oembed?url=https://open.spotify.com/album/${id}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Failed ${id}: ${res.status}`);
        continue;
      }
      const data = await res.json();
      const title = data.title;
      // Get 640x640 high-res image by replacing 1e02 with b273
      let imgUrl = data.thumbnail_url;
      let highResImgUrl = imgUrl.replace('ab67616d00001e02', 'ab67616d0000b273');

      // Slug for filename
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `album-${id}`;
      const filename = `${slug}.jpg`;
      const filePath = path.join('C:/Users/user/.gemini/antigravity/scratch/silicium/public/covers', filename);

      console.log(`Downloading cover for "${title}" -> ${filename}...`);
      // Download high-res
      let imgRes = await fetch(highResImgUrl);
      if (!imgRes.ok) {
        imgRes = await fetch(imgUrl); // Fallback to 300x300
      }
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      results.push({
        id: slug,
        spotifyId: id,
        title: title,
        cover: `/covers/${filename}`,
        spotifyUrl: `https://open.spotify.com/album/${id}`,
      });
    } catch (e) {
      console.error(`Error on ${id}:`, e.message);
    }
  }

  fs.writeFileSync(
    'C:/Users/user/.gemini/antigravity/scratch/silicium/scripts/spotify-albums-full.json',
    JSON.stringify(results, null, 2)
  );
  console.log(`Successfully fetched ${results.length} official Spotify releases!`);
}

downloadAlbumData();
