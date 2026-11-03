// SILICIUM — Global State Management (Zustand)
import { create } from 'zustand'
import { RELEASES } from './config'

const initialRelease = RELEASES[0] || null
const initialTrack = initialRelease?.tracks?.[0] || null

const hasSkippedIntro = typeof window !== 'undefined' && (
  new URLSearchParams(window.location.search).has('nointro') || 
  sessionStorage.getItem('silicium_intro_seen') === 'true'
)

export const useStore = create((set, get) => ({
  // Loading state
  isLoading: !hasSkippedIntro,
  loadingProgress: hasSkippedIntro ? 100 : 0,
  introComplete: hasSkippedIntro,
  setLoading: (isLoading) => set({ isLoading }),
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  setIntroComplete: (introComplete) => {
    if (typeof window !== 'undefined' && introComplete) {
      sessionStorage.setItem('silicium_intro_seen', 'true')
    }
    set({ introComplete })
  },

  // Navigation
  currentSection: 'home',
  menuOpen: false,
  selectedReleaseModal: null,
  setCurrentSection: (currentSection) => set({ currentSection }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
  setSelectedReleaseModal: (selectedReleaseModal) => set({ selectedReleaseModal }),

  // Player
  isPlaying: false,
  currentTrack: initialTrack,
  currentRelease: initialRelease,
  volume: 0.8,
  progress: 0,
  duration: 0,
  miniPlayer: false,
  audioVisualizerData: new Float32Array(64),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setCurrentRelease: (currentRelease) => set({ currentRelease }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setMiniPlayer: (miniPlayer) => set({ miniPlayer }),
  setAudioVisualizerData: (audioVisualizerData) => set({ audioVisualizerData }),
  
  playTrack: (track, release) => set({ 
    currentTrack: track, 
    currentRelease: release,
    isPlaying: true 
  }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // 3D Scene
  sceneQuality: 'high', // high | medium | low
  webglSupported: true,
  mousePosition: { x: 0, y: 0 },
  setSceneQuality: (sceneQuality) => set({ sceneQuality }),
  setWebglSupported: (webglSupported) => set({ webglSupported }),
  setMousePosition: (mousePosition) => set({ mousePosition }),

  // UI
  language: 'RU', // RU | EN
  cursorType: 'default',
  setLanguage: (language) => set({ language }),
  setCursorType: (cursorType) => set({ cursorType }),

  // Discography filters
  discographyView: 'grid', // grid | list
  discographyFilter: 'all', // all | single | ep | album
  discographyYear: 'all',
  discographySearch: '',
  setDiscographyView: (discographyView) => set({ discographyView }),
  setDiscographyFilter: (discographyFilter) => set({ discographyFilter }),
  setDiscographyYear: (discographyYear) => set({ discographyYear }),
  setDiscographySearch: (discographySearch) => set({ discographySearch }),
}))
