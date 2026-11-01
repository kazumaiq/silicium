// SILICIUM — Artist Data Configuration
// All data is easily editable from this single file

export const ARTIST = {
  name: 'SILICIUM',
  tagline: 'DIGITAL ARCHIVE',
  years: '2022 — 2026',
  firstTrack: 'MY WEED // 2022',
  telegram: 'https://t.me/silliciumphonk',
  description: '', // To be filled by artist
  bio: '', // To be filled by artist
}

export const PLATFORMS = {
  spotify: { name: 'Spotify', url: '', icon: 'spotify' },
  appleMusic: { name: 'Apple Music', url: '', icon: 'apple' },
  youtube: { name: 'YouTube', url: '', icon: 'youtube' },
  youtubeMusic: { name: 'YouTube Music', url: '', icon: 'youtube-music' },
  vkMusic: { name: 'VK Музыка', url: '', icon: 'vk' },
  yandexMusic: { name: 'Яндекс Музыка', url: '', icon: 'yandex' },
}

export const SOCIAL = {
  telegram: { name: 'Telegram', url: 'https://t.me/silliciumphonk' },
}

export const RELEASES = [
  {
    id: 'my-weed',
    title: 'MY WEED',
    year: 2022,
    type: 'single', // single | ep | album
    genre: 'Phonk',
    cover: '/covers/my-weed.jpg', // placeholder path
    tracks: [
      {
        id: 'my-weed-1',
        title: 'MY WEED',
        duration: '0:00', // To be updated
        audioSrc: '', // To be filled with real audio URL
      }
    ],
    platforms: {
      spotify: '',
      appleMusic: '',
      youtube: '',
      youtubeMusic: '',
      vkMusic: '',
      yandexMusic: '',
    },
    description: '', // To be filled by artist
  },
  // Add more releases here following the same structure:
  // {
  //   id: 'release-slug',
  //   title: 'RELEASE NAME',
  //   year: 2023,
  //   type: 'single',
  //   genre: 'Phonk',
  //   cover: '/covers/release-slug.jpg',
  //   tracks: [...],
  //   platforms: {...},
  //   description: '',
  // },
]

export const TIMELINE = [
  {
    year: 2022,
    events: [
      { title: 'MY WEED', description: 'First release', type: 'release' },
    ]
  },
  // Add more timeline entries:
  // { year: 2023, events: [...] },
  // { year: 2024, events: [...] },
  // { year: 2025, events: [...] },
  // { year: 2026, events: [...] },
]

export const NAV_ITEMS = [
  { id: 'home', label: '01 // HOME', path: '/' },
  { id: 'discography', label: '02 // DISCOGRAPHY', path: '/discography' },
  { id: 'archive', label: '03 // 3D ARCHIVE', path: '/archive' },
  { id: 'about', label: '04 // ABOUT', path: '/about' },
  { id: 'community', label: '05 // COMMUNITY', path: '/community' },
  { id: 'platforms', label: '06 // PLATFORMS', path: '/platforms' },
]
