// SILICIUM — Global State Management (Zustand)
import { create } from 'zustand'
import { RELEASES } from './config'

const initialRelease = RELEASES[0] || null
const initialTrack = initialRelease?.tracks?.[0] || null

export const useStore = create((set, get) => ({
  // Loading state
  isLoading: true,
  loadingProgress: 0,
  introComplete: false,
  setLoading: (isLoading) => set({ isLoading }),
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  setIntroComplete: (introComplete) => set({ introComplete }),

  // Navigation
  currentSection: 'home',
  menuOpen: false,
  setCurrentSection: (currentSection) => set({ currentSection }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),

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
  cursorType: 'default',
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
