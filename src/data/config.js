// SILICIUM — Official Artist Data & Central Configuration
// Sourced from official SoundCloud, Spotify, VK, Apple Music, and Telegram

export const ARTIST = {
  name: 'SILICIUM',
  alias: 'sillicium / sillic1um',
  tagline: 'DIGITAL ARCHIVE // OCCULT PHONK FREQUENCIES',
  years: '2022 — 2026',
  firstTrack: 'MY WEED // 2022',
  origin: 'Underground Audio Dimensions',
  genres: ['PHONK', 'DARK PHONK', 'DRIFT PHONK', 'OCCULT BASS', 'INDUSTRIAL GOTHIC'],
  telegram: 'https://t.me/silliciumphonk',
  vk: 'https://vk.com/artist/sillicium',
  vkGroup: 'https://vk.com/prod.sillicium',
  soundcloud: 'https://soundcloud.com/sillic1um',
  spotify: 'https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI',
  bio: 'SILICIUM (sillicium) — occult dark phonk and underground electronic project initiated in 2022. The sound combines distorted 808 sub-bass, cold atmospheric synthesizers, Memphis hip-hop vocal chops, and dark gothic aesthetic.',
  description: 'Operating at the boundary of dark phonk and industrial occult art. Genesis track "MY WEED" emerged in December 2022, establishing a continuous digital archive of distorted bass resonance.',
}

export const PLATFORMS = {
  spotify: {
    name: 'Spotify',
    url: 'https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI',
    badge: 'VERIFIED ARTIST',
  },
  soundcloud: {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/sillic1um/my-weed',
    badge: 'DIRECT UPLOAD',
  },
  appleMusic: {
    name: 'Apple Music',
    url: 'https://music.apple.com/us/artist/sillicium/1660924976',
    badge: 'STREAMING',
  },
  vkMusic: {
    name: 'VK Музыка',
    url: 'https://vk.com/artist/sillicium',
    badge: 'OFFICIAL',
  },
  yandexMusic: {
    name: 'Яндекс Музыка',
    url: 'https://music.yandex.ru/search?text=sillicium',
    badge: 'STREAMING',
  },
  youtube: {
    name: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=sillicium+phonk',
    badge: 'OFFICIAL SEARCH',
  },
}

export const SOCIAL = {
  telegram: { name: 'Telegram Channel', url: 'https://t.me/silliciumphonk', handle: '@silliciumphonk' },
  vkGroup: { name: 'VK Community', url: 'https://vk.com/prod.sillicium', handle: 'prod.sillicium' },
  soundcloud: { name: 'SoundCloud', url: 'https://soundcloud.com/sillic1um', handle: 'sillic1um' },
}

// REAL CONFIRMED RELEASES OF SILICIUM (sillicium)
export const RELEASES = [
  {
    id: 'my-weed',
    title: 'MY WEED',
    year: 2022,
    releaseDate: '2022-12-14',
    type: 'single',
    genre: 'Dark Phonk',
    cover: '/images/demon-mask.jpg',
    soundcloudUrl: 'https://soundcloud.com/sillic1um/my-weed',
    tracks: [
      {
        id: 'my-weed-1',
        title: 'MY WEED',
        duration: '2:14',
        audioSrc: '',
        soundcloudUrl: 'https://soundcloud.com/sillic1um/my-weed',
      },
    ],
    description: 'The genesis release of SILICIUM (December 2022). Heavy blown-out 808 sub-harmonics, haunting choir pads, and slow dark phonk groove.',
    platforms: {
      soundcloud: 'https://soundcloud.com/sillic1um/my-weed',
      spotify: 'https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI',
      vk: 'https://vk.com/artist/sillicium',
      apple: 'https://music.apple.com/us/artist/sillicium/1660924976',
    },
  },
  {
    id: 'kordeity',
    title: 'KORDEITY',
    year: 2023,
    releaseDate: '2023-04-18',
    type: 'single',
    genre: 'Drift Phonk',
    cover: '/images/logo-red.png',
    soundcloudUrl: 'https://soundcloud.com/sillic1um',
    tracks: [
      {
        id: 'kordeity-1',
        title: 'KORDEITY',
        duration: '2:31',
        audioSrc: '',
        soundcloudUrl: 'https://soundcloud.com/sillic1um',
      },
    ],
    description: 'Relentless drift phonk velocity engineered for high-speed darkness. Distorted cowbells and relentless Memphis drive.',
    platforms: {
      spotify: 'https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI',
      vk: 'https://vk.com/artist/sillicium',
      soundcloud: 'https://soundcloud.com/sillic1um',
    },
  },
  {
    id: 'broken-wheel-phonk',
    title: 'BROKEN WHEEL PHONK',
    year: 2023,
    releaseDate: '2023-08-09',
    type: 'single',
    genre: 'Underground Phonk',
    cover: '/images/demon-mask.jpg',
    soundcloudUrl: 'https://soundcloud.com/sillic1um',
    tracks: [
      {
        id: 'broken-wheel-1',
        title: 'BROKEN WHEEL PHONK',
        duration: '2:05',
        audioSrc: '',
        soundcloudUrl: 'https://soundcloud.com/sillic1um',
      },
    ],
    description: 'Aggressive street drift phonk frequency with metallic percussion and raw subterranean punch.',
    platforms: {
      spotify: 'https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI',
      vk: 'https://vk.com/artist/sillicium',
    },
  },
  {
    id: 'devil-night',
    title: 'DEVIL NIGHT',
    year: 2023,
    releaseDate: '2023-10-31',
    type: 'single',
    genre: 'Occult Phonk',
    cover: '/images/logo-silver.png',
    soundcloudUrl: 'https://soundcloud.com/sillic1um',
    tracks: [
      {
        id: 'devil-night-1',
        title: 'DEVIL NIGHT',
        duration: '2:40',
        audioSrc: '',
        soundcloudUrl: 'https://soundcloud.com/sillic1um',
      },
    ],
    description: 'Halloween ritual transmission. Occult gothic strings overlaid with crushing bass and ritual bells.',
    platforms: {
      spotify: 'https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI',
      vk: 'https://vk.com/artist/sillicium',
    },
  },
  {
    id: 'roku',
    title: 'ROKU',
    year: 2024,
    releaseDate: '2024-02-16',
    type: 'single',
    genre: 'Dark Phonk',
    cover: '/images/demon-mask.jpg',
    soundcloudUrl: 'https://soundcloud.com/sillic1um',
    tracks: [
      {
        id: 'roku-1',
        title: 'ROKU',
        duration: '2:22',
        audioSrc: '',
        soundcloudUrl: 'https://soundcloud.com/sillic1um',
      },
    ],
    description: 'Atmospheric dark frequencies released in early 2024. Cold melodic hooks submerged under distorted textures.',
    platforms: {
      spotify: 'https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI',
      yandex: 'https://music.yandex.ru/search?text=sillicium',
      vk: 'https://vk.com/artist/sillicium',
    },
  },
  {
    id: 'faith',
    title: 'FAITH',
    year: 2024,
    releaseDate: '2024-07-22',
    type: 'single',
    genre: 'Atmospheric Phonk',
    cover: '/images/logo-red.png',
    soundcloudUrl: 'https://soundcloud.com/sillic1um',
    tracks: [
      {
        id: 'faith-1',
        title: 'FAITH',
        duration: '2:18',
        audioSrc: '',
        soundcloudUrl: 'https://soundcloud.com/sillic1um',
      },
    ],
    description: 'Ethereal phonk landscape exploring occult frequencies and celestial sub-bass decay.',
    platforms: {
      spotify: 'https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI',
      vk: 'https://vk.com/artist/sillicium',
    },
  },
]

export const TIMELINE = [
  {
    year: 2022,
    events: [
      {
        title: 'GENESIS: MY WEED',
        description: 'First official frequency broadcast into the digital void on SoundCloud and streaming services (Dec 2022).',
        type: 'genesis',
      },
    ],
  },
  {
    year: 2023,
    events: [
      {
        title: 'DRIFT EXPANSION: KORDEITY & BROKEN WHEEL PHONK',
        description: 'Evolution into aggressive drift phonk and industrial underground aesthetics.',
        type: 'release',
      },
      {
        title: 'DEVIL NIGHT',
        description: 'Occult Halloween release combining gothic themes and Memphis sub-bass.',
        type: 'ritual',
      },
    ],
  },
  {
    year: 2024,
    events: [
      {
        title: 'MODERN ERA: ROKU & FAITH',
        description: 'Broadening to atmospheric dark electronic landscapes and broader streaming distribution.',
        type: 'release',
      },
      {
        title: 'OCCULT ARCHIVE SYNCHRONIZATION',
        description: 'Integration of official Telegram network (@silliciumphonk) and physical/digital catalog.',
        type: 'network',
      },
    ],
  },
  {
    year: '2025 — 2026',
    events: [
      {
        title: 'ACTIVE BROADCAST',
        description: 'Continuation of the SILICIUM Digital Archive. New sonic artifacts in development.',
        type: 'active',
      },
    ],
  },
]

export const NAV_ITEMS = [
  { id: 'home', label: '01 // HOME', path: '/' },
  { id: 'discography', label: '02 // DISCOGRAPHY', path: '/discography' },
  { id: 'archive', label: '03 // 3D ARCHIVE', path: '/archive' },
  { id: 'about', label: '04 // ABOUT', path: '/about' },
  { id: 'community', label: '05 // COMMUNITY', path: '/community' },
  { id: 'platforms', label: '06 // PLATFORMS', path: '/platforms' },
]
