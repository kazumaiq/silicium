// SILICIUM — Audio Reactive Engine & Web Audio Frequency Analyzer
// Provides authentic Web Audio API AnalyserNode integration with multi-band FFT extraction,
// beat transient detection, and procedural occult sub-bass rhythmic analysis for non-CORS streams.

class AudioEngine {
  constructor() {
    this.ctx = null
    this.analyser = null
    this.sourceNode = null
    this.oscillator = null
    this.gainNode = null
    this.filterNode = null
    this.isPlaying = false
    this.rafId = null
    this.fftSize = 128
    this.dataArray = null
    this.waveArray = null
    this.bpm = 130
    this.lastBeatTime = 0
    this.beatListeners = new Set()
    this.frameListeners = new Set()

    // Smooth frequency levels
    this.smoothedBass = 0
    this.smoothedMid = 0
    this.smoothedTreble = 0
    this.smoothedEnergy = 0

    // Running bass average for transient detection
    this.bassHistory = new Float32Array(20)
    this.historyIndex = 0
  }

  // Initialize Web Audio Context upon user interaction
  init() {
    if (this.ctx) return true

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return false

      this.ctx = new AudioContextClass()
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = this.fftSize
      this.analyser.smoothingTimeConstant = 0.82

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
      this.waveArray = new Uint8Array(this.analyser.frequencyBinCount)

      // Master gain for procedural occult synthesizer (kept subtle/ambient)
      this.gainNode = this.ctx.createGain()
      this.gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime)

      // Lowpass filter for occult 808 sub-harmonics
      this.filterNode = this.ctx.createBiquadFilter()
      this.filterNode.type = 'lowpass'
      this.filterNode.frequency.setValueAtTime(140, this.ctx.currentTime)
      this.filterNode.Q.setValueAtTime(3.5, this.ctx.currentTime)

      this.gainNode.connect(this.filterNode)
      this.filterNode.connect(this.analyser)

      // Connect to destination at very low volume for ambient feedback
      const ambientGain = this.ctx.createGain()
      ambientGain.gain.setValueAtTime(0.02, this.ctx.currentTime)
      this.analyser.connect(ambientGain)
      ambientGain.connect(this.ctx.destination)

      return true
    } catch (e) {
      console.warn('[SILICIUM AudioEngine] Web Audio context initialization note:', e)
      return false
    }
  }

  // Connect real HTML5 Audio Element if CORS allows
  attachMediaElement(audioElement) {
    if (!this.init() || !audioElement) return

    try {
      if (this.sourceNode) {
        this.sourceNode.disconnect()
      }
      this.sourceNode = this.ctx.createMediaElementSource(audioElement)
      this.sourceNode.connect(this.analyser)
      this.analyser.connect(this.ctx.destination)
    } catch (e) {
      // Element might already be connected or tainted by CORS
    }
  }

  // Start internal procedural 808 occult rhythm pulse for non-CORS audio
  startProceduralRhythm(bpm = 130) {
    this.bpm = bpm
    if (!this.init()) return

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    this.stopProceduralRhythm()

    const stepInterval = (60 / this.bpm) / 4 // 16th notes
    let step = 0

    // Master procedural oscillator for sub-bass resonance
    this.rhythmInterval = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return

      const now = this.ctx.currentTime
      const isKick = step % 8 === 0 || step % 8 === 6
      const isSnare = step % 8 === 4
      const isHiHat = step % 2 === 0

      // Synthesize 808 Sub-bass Kick transient
      if (isKick) {
        const osc = this.ctx.createOscillator()
        const kickGain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(95, now)
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.18)

        kickGain.gain.setValueAtTime(0.85, now)
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)

        osc.connect(kickGain)
        kickGain.connect(this.analyser)

        osc.start(now)
        osc.stop(now + 0.35)

        // Trigger beat listeners
        this.notifyBeat({ type: 'kick', strength: 0.9 })
      } else if (isSnare) {
        // Synthesize snappy occult snare transient
        const osc = this.ctx.createOscillator()
        const snareGain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(180, now)
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.12)

        snareGain.gain.setValueAtTime(0.45, now)
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)

        osc.connect(snareGain)
        snareGain.connect(this.analyser)

        osc.start(now)
        osc.stop(now + 0.18)

        this.notifyBeat({ type: 'snare', strength: 0.6 })
      } else if (isHiHat) {
        // High frequency transient
        const osc = this.ctx.createOscillator()
        const hatGain = this.ctx.createGain()
        osc.type = 'square'
        osc.frequency.setValueAtTime(2400, now)

        hatGain.gain.setValueAtTime(0.18, now)
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

        osc.connect(hatGain)
        hatGain.connect(this.analyser)

        osc.start(now)
        osc.stop(now + 0.05)
      }

      step++
    }, stepInterval * 1000)
  }

  stopProceduralRhythm() {
    if (this.rhythmInterval) {
      clearInterval(this.rhythmInterval)
      this.rhythmInterval = null
    }
  }

  // Playback control
  start(bpm = 130) {
    this.isPlaying = true
    this.init()

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    this.startProceduralRhythm(bpm)
    this.startAnalysisLoop()
  }

  stop() {
    this.isPlaying = false
    this.stopProceduralRhythm()
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    // Smooth reset
    this.smoothedBass = 0
    this.smoothedMid = 0
    this.smoothedTreble = 0
    this.smoothedEnergy = 0
  }

  // Real-time analysis animation loop
  startAnalysisLoop() {
    if (this.rafId) return

    const updateFrame = () => {
      if (!this.isPlaying) return

      let bass = 0
      let mid = 0
      let treble = 0
      let energy = 0

      if (this.analyser) {
        this.analyser.getByteFrequencyData(this.dataArray)
        this.analyser.getByteTimeDomainData(this.waveArray)

        const binCount = this.dataArray.length // 64 bins

        // 1. Sub-bass band (bins 0-8: ~0 to 350Hz)
        let bassSum = 0
        const bassEnd = Math.min(8, binCount)
        for (let i = 0; i < bassEnd; i++) {
          bassSum += this.dataArray[i]
        }
        bass = bassSum / (bassEnd * 255)

        // 2. Mid band (bins 8-28: ~350Hz to 2.5kHz)
        let midSum = 0
        const midEnd = Math.min(28, binCount)
        for (let i = bassEnd; i < midEnd; i++) {
          midSum += this.dataArray[i]
        }
        mid = midSum / ((midEnd - bassEnd) * 255)

        // 3. Treble band (bins 28-64: ~2.5kHz to 10kHz)
        let trebleSum = 0
        for (let i = midEnd; i < binCount; i++) {
          trebleSum += this.dataArray[i]
        }
        treble = trebleSum / ((binCount - midEnd) * 255)

        energy = bass * 0.55 + mid * 0.3 + treble * 0.15
      }

      // Smooth interpolation for fluid cinematic motion
      const lerpFactor = 0.22
      this.smoothedBass += (bass - this.smoothedBass) * lerpFactor
      this.smoothedMid += (mid - this.smoothedMid) * lerpFactor
      this.smoothedTreble += (treble - this.smoothedTreble) * lerpFactor
      this.smoothedEnergy += (energy - this.smoothedEnergy) * lerpFactor

      // Transient beat check
      this.bassHistory[this.historyIndex] = bass
      this.historyIndex = (this.historyIndex + 1) % this.bassHistory.length
      let avgBass = 0
      for (let i = 0; i < this.bassHistory.length; i++) {
        avgBass += this.bassHistory[i]
      }
      avgBass /= this.bassHistory.length

      const isBassHit = bass > avgBass * 1.35 && bass > 0.35

      const frameData = {
        rawFft: this.dataArray,
        waveform: this.waveArray,
        bass: this.smoothedBass,
        mid: this.smoothedMid,
        treble: this.smoothedTreble,
        energy: this.smoothedEnergy,
        isBassHit,
        rawBass: bass,
      }

      // Notify frame listeners
      this.frameListeners.forEach((fn) => fn(frameData))

      this.rafId = requestAnimationFrame(updateFrame)
    }

    this.rafId = requestAnimationFrame(updateFrame)
  }

  // Subscribe to real-time frame data
  onFrame(fn) {
    this.frameListeners.add(fn)
    return () => this.frameListeners.delete(fn)
  }

  // Subscribe to beat transients
  onBeat(fn) {
    this.beatListeners.add(fn)
    return () => this.beatListeners.delete(fn)
  }

  notifyBeat(beatInfo) {
    this.beatListeners.forEach((fn) => fn(beatInfo))
  }
}

export const audioEngine = new AudioEngine()
