// SILICIUM — 3D Vault Spatial Archive (Re-engineered 1:1 Planar Relics & Camera Facing)
import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { RELEASES } from '../data/config'
import { audioEngine } from '../services/audioEngine'

// Texture Cache for 60 FPS Mobile Performance
const textureCache = new Map()
function getCachedTexture(url) {
  if (!url) return null
  if (!textureCache.has(url)) {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(url)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.generateMipmaps = true
    textureCache.set(url, tex)
  }
  return textureCache.get(url)
}

// Shared Geometries (Single GPU Allocation for 60 FPS)
const SHARED = {
  coverPlane: new THREE.PlaneGeometry(1.65, 1.65),
  backPlate: new THREE.BoxGeometry(1.72, 1.72, 0.06),
  cornerClip: new THREE.BoxGeometry(0.08, 0.28, 0.1),
  cornerClipH: new THREE.BoxGeometry(0.28, 0.08, 0.1),
  haloRing: new THREE.RingGeometry(1.22, 1.28, 48),
  targetReticle: new THREE.RingGeometry(1.4, 1.46, 40),
  apexDiamond: new THREE.OctahedronGeometry(0.18, 0),
  orbitLineInner: new THREE.RingGeometry(4.98, 5.02, 64),
  orbitLineMid: new THREE.RingGeometry(6.98, 7.02, 64),
  orbitLineOuter: new THREE.RingGeometry(8.98, 9.02, 64),
}

// Materials
const MAT_OBSIDIAN_PLATE = new THREE.MeshStandardMaterial({
  color: '#080607',
  metalness: 0.95,
  roughness: 0.12,
  emissive: '#040203',
})

const MAT_CHROME_CLIP = new THREE.MeshStandardMaterial({
  color: '#E8E4E6',
  metalness: 0.98,
  roughness: 0.08,
  emissive: '#111012',
})

const MAT_CRIMSON_CLIP = new THREE.MeshStandardMaterial({
  color: '#FF173D',
  emissive: '#A50020',
  emissiveIntensity: 1.8,
  metalness: 0.8,
  roughness: 0.2,
})

const MAT_ORBIT_LINE = new THREE.MeshBasicMaterial({
  color: '#350009',
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.35,
})

const MAT_TARGET_RING = new THREE.MeshBasicMaterial({
  color: '#FF173D',
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.85,
})

// Central Totem with Demon Mask & Occult Gyroscopes
function CentralSpatialTotem() {
  const totemRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  const maskTexture = useMemo(() => {
    return getCachedTexture('/images/demon-mask-seamless.png')
  }, [])

  const totemMaterials = useMemo(() => {
    const maskMat = new THREE.MeshStandardMaterial({
      map: maskTexture,
      metalness: 0.88,
      roughness: 0.18,
      emissive: '#350009',
      emissiveIntensity: 0.65,
    })
    return [
      MAT_OBSIDIAN_PLATE,
      MAT_OBSIDIAN_PLATE,
      MAT_OBSIDIAN_PLATE,
      MAT_OBSIDIAN_PLATE,
      maskMat,
      maskMat,
    ]
  }, [maskTexture])

  useFrame((_, delta) => {
    const bass = audioEngine.smoothedBass || 0
    if (totemRef.current) {
      totemRef.current.rotation.y += delta * 0.12
      const s = 1.0 + bass * 0.08
      totemRef.current.scale.set(s, s, s)
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.2
      ring1Ref.current.rotation.y -= delta * 0.14
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z += delta * 0.18
      ring2Ref.current.rotation.x -= delta * 0.1
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Central Obsidian Pillar */}
      <mesh
        ref={totemRef}
        geometry={new THREE.BoxGeometry(2.0, 2.4, 0.4)}
        material={totemMaterials}
      />

      {/* Tri-Axial Gyroscopic Laser Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.9, 0.025, 12, 60]} />
        <meshBasicMaterial color="#FF173D" />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.018, 12, 50]} />
        <meshBasicMaterial color="#A50020" wireframe />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.1, 0.015, 10, 40]} />
        <meshBasicMaterial color="#350009" />
      </mesh>

      {/* Atmospheric Core Point Lights */}
      <pointLight color="#FF173D" intensity={3.5} distance={11} />
      <pointLight color="#ffffff" intensity={0.6} distance={6} />
    </group>
  )
}

// 1:1 Planar Album Cover Relic (Facing Camera for 100% Readability)
function PlanarCoverRelic({
  release,
  index,
  total,
  onSelect,
  isSelected,
  isAnySelected,
  isMobile,
  onPositionUpdate,
}) {
  const groupRef = useRef()
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  // 3-Tier Multi-Orbit Staggering (Prevents overlap & ensures spatial hierarchy)
  const tier = index % 3
  const tierRadius = isMobile
    ? (tier === 0 ? 3.4 : tier === 1 ? 4.3 : 5.2)
    : (tier === 0 ? 5.2 : tier === 1 ? 7.1 : 9.0)

  const tierY = isMobile
    ? (tier === 0 ? 0.7 : tier === 1 ? -0.5 : 0.2)
    : (tier === 0 ? 0.9 : tier === 1 ? -0.7 : 0.3)

  const angle = (index / total) * Math.PI * 2

  const coverTexture = useMemo(() => {
    return getCachedTexture(release.cover || '/images/demon-mask-blended.png')
  }, [release.cover])

  const coverMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.15,
      metalness: 0.2,
      emissive: isSelected ? '#350009' : hovered ? '#190307' : '#000000',
      emissiveIntensity: isSelected ? 0.8 : hovered ? 0.4 : 0,
    })
  }, [coverTexture, isSelected, hovered])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    // Orbit Movement (Slows down gracefully when selected for stable focus)
    const speed = isSelected ? 0.015 : hovered ? 0.04 : 0.08
    const t = clock.getElapsedTime() * speed + angle

    const targetX = Math.cos(t) * tierRadius
    const targetZ = Math.sin(t) * tierRadius
    const targetY = tierY + Math.sin(t * 1.4) * 0.22

    groupRef.current.position.x = targetX
    groupRef.current.position.z = targetZ
    groupRef.current.position.y = targetY

    // Inform camera controller of real-time position
    if (onPositionUpdate) {
      onPositionUpdate(release.id, groupRef.current.position)
    }

    // CRITICAL: CAMERA-FACING ORIENTATION (Billboarding)
    // Ensures covers are NEVER seen edge-on or unreadable!
    if (meshRef.current) {
      if (isSelected || hovered) {
        // Face camera directly when interacting
        meshRef.current.lookAt(camera.position)
      } else {
        // Gentle tangent orientation with tilt towards camera
        meshRef.current.lookAt(
          camera.position.x * 0.7 + targetX * 0.3,
          camera.position.y * 0.7 + targetY * 0.3,
          camera.position.z * 0.7 + targetZ * 0.3
        )
      }
    }
  })

  // Scale: selected pop forward, non-selected dim slightly if another is selected
  const targetScale = isSelected
    ? (isMobile ? 1.4 : 1.55)
    : hovered
    ? 1.25
    : isAnySelected
    ? 0.85
    : 1.0

  return (
    <group ref={groupRef}>
      <group
        ref={meshRef}
        scale={targetScale}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(release, groupRef.current?.position)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* Front 1:1 Album Artwork Plane */}
        <mesh
          geometry={SHARED.coverPlane}
          material={coverMaterial}
          position={[0, 0, 0.035]}
        />

        {/* Backing Obsidian Metal Plate */}
        <mesh
          geometry={SHARED.backPlate}
          material={MAT_OBSIDIAN_PLATE}
          position={[0, 0, 0]}
        />

        {/* 4 Gothic/Tech Corner Brackets (Framing the Artwork) */}
        <mesh
          geometry={SHARED.cornerClip}
          material={isSelected || hovered ? MAT_CRIMSON_CLIP : MAT_CHROME_CLIP}
          position={[-0.82, 0.7, 0.04]}
        />
        <mesh
          geometry={SHARED.cornerClipH}
          material={isSelected || hovered ? MAT_CRIMSON_CLIP : MAT_CHROME_CLIP}
          position={[-0.7, 0.82, 0.04]}
        />
        <mesh
          geometry={SHARED.cornerClip}
          material={isSelected || hovered ? MAT_CRIMSON_CLIP : MAT_CHROME_CLIP}
          position={[0.82, 0.7, 0.04]}
        />
        <mesh
          geometry={SHARED.cornerClipH}
          material={isSelected || hovered ? MAT_CRIMSON_CLIP : MAT_CHROME_CLIP}
          position={[0.7, 0.82, 0.04]}
        />
        <mesh
          geometry={SHARED.cornerClip}
          material={isSelected || hovered ? MAT_CRIMSON_CLIP : MAT_CHROME_CLIP}
          position={[-0.82, -0.7, 0.04]}
        />
        <mesh
          geometry={SHARED.cornerClipH}
          material={isSelected || hovered ? MAT_CRIMSON_CLIP : MAT_CHROME_CLIP}
          position={[-0.7, -0.82, 0.04]}
        />
        <mesh
          geometry={SHARED.cornerClip}
          material={isSelected || hovered ? MAT_CRIMSON_CLIP : MAT_CHROME_CLIP}
          position={[0.82, -0.7, 0.04]}
        />
        <mesh
          geometry={SHARED.cornerClipH}
          material={isSelected || hovered ? MAT_CRIMSON_CLIP : MAT_CHROME_CLIP}
          position={[0.7, -0.82, 0.04]}
        />

        {/* Selection Reticle & Focus Pulse */}
        {isSelected && (
          <group position={[0, 0, -0.05]}>
            <mesh geometry={SHARED.targetReticle} material={MAT_TARGET_RING} />
            <pointLight color="#FF173D" intensity={2.8} distance={6} />
          </group>
        )}
      </group>

      {/* Floating Tactical Label Badge (Revealed on Hover / Selected) */}
      {(isSelected || hovered) && (
        <Html
          position={[0, isMobile ? 1.45 : 1.65, 0]}
          center
          distanceFactor={isMobile ? 12 : 11}
        >
          <div
            onClick={(e) => {
              e.stopPropagation()
              onSelect(release, groupRef.current?.position)
            }}
            style={{
              background: 'rgba(8, 6, 7, 0.94)',
              border: '1px solid rgba(255, 23, 61, 0.5)',
              borderLeft: '3px solid #FF173D',
              padding: isMobile ? '4px 8px' : '5px 12px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: isMobile ? '9px' : '11px',
              color: '#E8E4E6',
              letterSpacing: '0.14em',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(255, 23, 61, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ color: '#FF173D', marginRight: '6px' }}>▶</span>
            <strong>{release.title}</strong> // {release.year}
          </div>
        </Html>
      )}
    </group>
  )
}

// Cinematic Camera Controller
function CinematicCameraController({
  targetReleaseId,
  positionsRef,
  controlsRef,
  isMobile,
}) {
  const { camera } = useThree()
  const defaultPos = useMemo(
    () => new THREE.Vector3(0, isMobile ? 4.8 : 3.8, isMobile ? 15.8 : 13.0),
    [isMobile]
  )
  const defaultTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(() => {
    if (!controlsRef.current) return

    const liveTargetPos =
      targetReleaseId && positionsRef.current
        ? positionsRef.current[targetReleaseId]
        : null

    if (liveTargetPos) {
      // Focus smoothly on chosen artifact
      const desiredCam = new THREE.Vector3(
        liveTargetPos.x * 1.35,
        liveTargetPos.y + (isMobile ? 0.7 : 0.85),
        liveTargetPos.z * 1.35
      )
      camera.position.lerp(desiredCam, 0.05)
      controlsRef.current.target.lerp(liveTargetPos, 0.06)
    } else {
      // Return to master spatial overview
      camera.position.lerp(defaultPos, 0.04)
      controlsRef.current.target.lerp(defaultTarget, 0.04)
    }
    controlsRef.current.update()
  })

  return null
}

export default function ArchiveScene({
  selectedRelease,
  onSelectRelease,
  exploreMode = false,
  resetTrigger = 0,
}) {
  const controlsRef = useRef()
  const positionsRef = useRef({})

  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  }, [])

  const handlePositionUpdate = (id, pos) => {
    positionsRef.current[id] = pos
  }

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enabled={exploreMode}
        enableDamping
        dampingFactor={0.06}
        autoRotate={!selectedRelease && !exploreMode}
        autoRotateSpeed={0.25}
        minDistance={3.0}
        maxDistance={22}
        enablePan={false}
        enableZoom={exploreMode}
        touchAction="none"
      />

      <CinematicCameraController
        targetReleaseId={selectedRelease?.id}
        positionsRef={positionsRef}
        controlsRef={controlsRef}
        isMobile={isMobile}
      />

      {/* Atmospheric Cinematic Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-10, -8, -10]} intensity={1.2} color="#FF173D" />

      {/* Subtle Orbital Trace Guide Rings */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh geometry={SHARED.orbitLineInner} material={MAT_ORBIT_LINE} />
        <mesh geometry={SHARED.orbitLineMid} material={MAT_ORBIT_LINE} />
        <mesh geometry={SHARED.orbitLineOuter} material={MAT_ORBIT_LINE} />
      </group>

      {/* Central Occult Demon Totem */}
      <CentralSpatialTotem />

      {/* 14 Planar 1:1 Album Artwork Relics */}
      {RELEASES.map((rel, idx) => (
        <PlanarCoverRelic
          key={rel.id}
          release={rel}
          index={idx}
          total={RELEASES.length}
          onSelect={onSelectRelease}
          isSelected={selectedRelease?.id === rel.id}
          isAnySelected={Boolean(selectedRelease)}
          isMobile={isMobile}
          onPositionUpdate={handlePositionUpdate}
        />
      ))}
    </>
  )
}
