// SILICIUM — 3D Archive Spatial Universe (Occult Relic Monoliths & Cinematic Orbit Matrix)
import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { RELEASES } from '../data/config'
import { audioEngine } from '../services/audioEngine'

// Texture Cache for 60 FPS Mobile Performance (zero garbage collection overhead)
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

// Shared Reusable Geometries (Allocated ONCE for maximum 60 FPS performance)
const SHARED_GEOM = {
  slab: new THREE.BoxGeometry(1.35, 1.35, 0.22),
  slabHex: new THREE.CylinderGeometry(0.85, 0.85, 0.22, 6),
  orbitRing: new THREE.TorusGeometry(1.25, 0.016, 12, 40),
  innerRing: new THREE.TorusGeometry(1.08, 0.012, 10, 32),
  cornerBracketV: new THREE.BoxGeometry(0.12, 0.36, 0.26),
  cornerBracketH: new THREE.BoxGeometry(0.36, 0.12, 0.26),
  apexCrystal: new THREE.OctahedronGeometry(0.22, 0),
  targetRing: new THREE.RingGeometry(1.45, 1.52, 40),
  laserBeam: new THREE.CylinderGeometry(0.015, 0.015, 3.2, 8),
}

// Shared Metallic Materials for Obsidian-Chrome Frames
const MAT_OBSIDIAN_FRAME = new THREE.MeshStandardMaterial({
  color: '#141418',
  metalness: 0.95,
  roughness: 0.14,
  emissive: '#08080c',
})

const MAT_CRIMSON_ACCENT = new THREE.MeshStandardMaterial({
  color: '#ff0033',
  emissive: '#dd0022',
  emissiveIntensity: 1.4,
  metalness: 0.85,
  roughness: 0.2,
})

const MAT_ACTIVE_RING = new THREE.MeshBasicMaterial({
  color: '#ff1133',
})

const MAT_IDLE_RING = new THREE.MeshBasicMaterial({
  color: '#444450',
  wireframe: true,
})

const MAT_TARGET_RING = new THREE.MeshBasicMaterial({
  color: '#ff0033',
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.85,
})

const MAT_LASER = new THREE.MeshBasicMaterial({
  color: '#ff0022',
  transparent: true,
  opacity: 0.45,
})

// Высокодетализированный Оккультный Монолит Релиза с текстурой обложки
function OccultRelicMonolith({ release, isSelected, hovered }) {
  const meshGroupRef = useRef()
  const ringRef = useRef()
  const apexTopRef = useRef()
  const apexBottomRef = useRef()

  const coverTexture = useMemo(() => {
    return getCachedTexture(release.cover || '/images/demon-mask-blended.png')
  }, [release.cover])

  // Материал для лицевой и обратной стороны монолита
  const coverFaceMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.18,
      metalness: 0.22,
      emissive: isSelected ? '#44000a' : hovered ? '#220005' : '#000000',
      emissiveIntensity: isSelected ? 0.8 : hovered ? 0.4 : 0,
    })
  }, [coverTexture, isSelected, hovered])

  // Массив материалов для кубического монолита:
  // 0: right, 1: left, 2: top, 3: bottom, 4: front, 5: back
  const boxMaterials = useMemo(() => {
    return [
      MAT_OBSIDIAN_FRAME,
      MAT_OBSIDIAN_FRAME,
      MAT_OBSIDIAN_FRAME,
      MAT_OBSIDIAN_FRAME,
      coverFaceMat,
      coverFaceMat,
    ]
  }, [coverFaceMat])

  useFrame((_, delta) => {
    const bass = audioEngine.smoothedBass || 0

    if (meshGroupRef.current) {
      const rotSpeed = isSelected ? 0.4 : hovered ? 1.0 : 0.25
      meshGroupRef.current.rotation.y += delta * rotSpeed
      meshGroupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.08
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isSelected ? 1.2 : 0.5)
      ringRef.current.rotation.x += delta * 0.3
      const ringScale = 1 + bass * 0.06
      ringRef.current.scale.set(ringScale, ringScale, ringScale)
    }

    if (apexTopRef.current) {
      apexTopRef.current.rotation.y -= delta * 0.8
      apexTopRef.current.position.y = 1.05 + Math.sin(Date.now() * 0.003) * 0.05 + bass * 0.08
    }

    if (apexBottomRef.current) {
      apexBottomRef.current.rotation.y += delta * 0.8
      apexBottomRef.current.position.y = -1.05 - Math.sin(Date.now() * 0.003) * 0.05 - bass * 0.08
    }
  })

  const scale = isSelected ? 1.35 : hovered ? 1.2 : 0.96

  return (
    <group scale={scale}>
      {/* Вращающееся ядро монолита */}
      <group ref={meshGroupRef}>
        {/* Основной монолит с обложкой на лицевых гранях */}
        <mesh
          geometry={SHARED_GEOM.slab}
          material={boxMaterials}
          castShadow
          receiveShadow
        />

        {/* Угловые кибернетические скобы (Gothic Tech Claws) */}
        {/* Верхний левый */}
        <mesh geometry={SHARED_GEOM.cornerBracketV} material={isSelected ? MAT_CRIMSON_ACCENT : MAT_OBSIDIAN_FRAME} position={[-0.68, 0.54, 0]} />
        <mesh geometry={SHARED_GEOM.cornerBracketH} material={isSelected ? MAT_CRIMSON_ACCENT : MAT_OBSIDIAN_FRAME} position={[-0.54, 0.68, 0]} />
        {/* Верхний правый */}
        <mesh geometry={SHARED_GEOM.cornerBracketV} material={isSelected ? MAT_CRIMSON_ACCENT : MAT_OBSIDIAN_FRAME} position={[0.68, 0.54, 0]} />
        <mesh geometry={SHARED_GEOM.cornerBracketH} material={isSelected ? MAT_CRIMSON_ACCENT : MAT_OBSIDIAN_FRAME} position={[0.54, 0.68, 0]} />
        {/* Нижний левый */}
        <mesh geometry={SHARED_GEOM.cornerBracketV} material={isSelected ? MAT_CRIMSON_ACCENT : MAT_OBSIDIAN_FRAME} position={[-0.68, -0.54, 0]} />
        <mesh geometry={SHARED_GEOM.cornerBracketH} material={isSelected ? MAT_CRIMSON_ACCENT : MAT_OBSIDIAN_FRAME} position={[-0.54, -0.68, 0]} />
        {/* Нижний правый */}
        <mesh geometry={SHARED_GEOM.cornerBracketV} material={isSelected ? MAT_CRIMSON_ACCENT : MAT_OBSIDIAN_FRAME} position={[0.68, -0.54, 0]} />
        <mesh geometry={SHARED_GEOM.cornerBracketH} material={isSelected ? MAT_CRIMSON_ACCENT : MAT_OBSIDIAN_FRAME} position={[0.54, -0.68, 0]} />

        {/* Вершинные парящие оккультные кристаллы */}
        <mesh ref={apexTopRef} geometry={SHARED_GEOM.apexCrystal} material={MAT_CRIMSON_ACCENT} position={[0, 1.05, 0]} />
        <mesh ref={apexBottomRef} geometry={SHARED_GEOM.apexCrystal} material={MAT_CRIMSON_ACCENT} position={[0, -1.05, 0]} />

        {/* Наклонное орбитальное кольцо */}
        <group ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
          <mesh
            geometry={SHARED_GEOM.orbitRing}
            material={isSelected || hovered ? MAT_ACTIVE_RING : MAT_IDLE_RING}
          />
        </group>
      </group>

      {/* Голографический прицел и сканирующий луч при выборе */}
      {isSelected && (
        <group>
          {/* Внешнее сканирующее кольцо */}
          <mesh geometry={SHARED_GEOM.targetRing} material={MAT_TARGET_RING} rotation={[Math.PI / 2, 0, 0]} />
          {/* Вертикальный энергетический лазерный маяк */}
          <mesh geometry={SHARED_GEOM.laserBeam} material={MAT_LASER} />
          {/* Точечное освещение активного артефакта */}
          <pointLight color="#ff0022" intensity={2.4} distance={5} />
        </group>
      )}
    </group>
  )
}

// Центральный Монолит — Оккультный Тотем SILICIUM с демонической маской
function CentralDemonTotem() {
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
      metalness: 0.9,
      roughness: 0.15,
      emissive: '#380008',
      emissiveIntensity: 0.8,
    })
    return [
      MAT_OBSIDIAN_FRAME,
      MAT_OBSIDIAN_FRAME,
      MAT_OBSIDIAN_FRAME,
      MAT_OBSIDIAN_FRAME,
      maskMat,
      maskMat,
    ]
  }, [maskTexture])

  useFrame((_, delta) => {
    const bass = audioEngine.smoothedBass || 0

    if (totemRef.current) {
      totemRef.current.rotation.y += delta * 0.14
      const scale = 1.0 + bass * 0.08
      totemRef.current.scale.set(scale, scale, scale)
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.25
      ring1Ref.current.rotation.y -= delta * 0.18
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z += delta * 0.22
      ring2Ref.current.rotation.x -= delta * 0.15
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.3
      ring3Ref.current.rotation.z -= delta * 0.12
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Главный обсидиановый пилон с маской */}
      <mesh
        ref={totemRef}
        geometry={new THREE.BoxGeometry(2.1, 2.5, 0.45)}
        material={totemMaterials}
        castShadow
      />

      {/* 3 Концентрических гироскопических лазерных кольца */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.1, 0.035, 14, 60]} />
        <meshBasicMaterial color="#ff0022" />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.7, 0.024, 12, 50]} />
        <meshBasicMaterial color="#ff2244" wireframe />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.3, 0.018, 10, 44]} />
        <meshBasicMaterial color="#990015" />
      </mesh>

      {/* Оккультное свечение ядра */}
      <pointLight color="#ff0022" intensity={4.0} distance={12} />
      <pointLight color="#ffffff" intensity={0.8} distance={6} />
    </group>
  )
}

// Отдельный интерактивный релиз-объект на орбите
function OrbitingRelease({
  release,
  index,
  total,
  onSelect,
  isSelected,
  isMobile,
  onPositionUpdate,
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Адаптивный радиус: на смартфонах плотнее, на десктопе просторнее
  const radius = isMobile ? 4.8 : 6.9
  const angle = (index / total) * Math.PI * 2
  const initialX = Math.cos(angle) * radius
  const initialZ = Math.sin(angle) * radius
  const initialY = index % 2 === 0 ? 0.75 : -0.75

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Плавный полет по орбите
      const t = clock.getElapsedTime() * (isSelected ? 0.025 : 0.1) + angle
      groupRef.current.position.x = Math.cos(t) * radius
      groupRef.current.position.z = Math.sin(t) * radius
      groupRef.current.position.y = initialY + Math.sin(t * 1.5) * 0.26

      // Передаем текущую 3D-позицию в общий реестр для плавной слежки камеры
      if (onPositionUpdate) {
        onPositionUpdate(release.id, groupRef.current.position)
      }
    }
  })

  // На смартфонах показываем надпись только для выбранного или наведенного объекта
  const shouldShowLabel = !isMobile || isSelected || hovered

  return (
    <group ref={groupRef} position={[initialX, initialY, initialZ]}>
      {/* 3D Оккультный Монолит Релиза */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          onSelect(release, groupRef.current ? groupRef.current.position : null)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <OccultRelicMonolith
          release={release}
          isSelected={isSelected}
          hovered={hovered}
        />
      </group>

      {/* Компактный киберпанк-маркер подписи */}
      {shouldShowLabel && (
        <Html distanceFactor={isMobile ? 12 : 11} position={[0, 1.45, 0]} center>
          <div
            onClick={(e) => {
              e.stopPropagation()
              onSelect(release, groupRef.current ? groupRef.current.position : null)
            }}
            style={{
              background: hovered || isSelected ? 'rgba(180, 0, 24, 0.95)' : 'rgba(8, 8, 10, 0.88)',
              border: `1px solid ${hovered || isSelected ? '#ff1133' : 'rgba(255, 255, 255, 0.14)'}`,
              borderLeft: `3px solid ${hovered || isSelected ? '#ff0033' : '#666'}`,
              color: '#fff',
              padding: isMobile ? '3px 8px' : '4px 10px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: isMobile ? '9px' : '10px',
              fontWeight: isSelected ? '700' : '500',
              letterSpacing: '0.14em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: hovered || isSelected ? '0 0 18px rgba(255, 0, 34, 0.65)' : 'none',
              userSelect: 'none',
              pointerEvents: 'auto',
            }}
          >
            {release.title} // {release.year}
          </div>
        </Html>
      )}
    </group>
  )
}

// Плавный кинематографичный переход и слежение камеры за выбранным артефактом
function CinematicCameraController({
  targetReleaseId,
  positionsRef,
  controlsRef,
  isMobile,
}) {
  const { camera } = useThree()
  const defaultPos = useMemo(
    () => new THREE.Vector3(0, isMobile ? 5.2 : 4.2, isMobile ? 15.2 : 12.5),
    [isMobile]
  )
  const defaultTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(() => {
    if (!controlsRef.current) return

    const liveTargetPos = targetReleaseId && positionsRef.current
      ? positionsRef.current[targetReleaseId]
      : null

    if (liveTargetPos) {
      // Камера плавно приближается и удерживает фокус на вращающемся объекте
      const desiredCam = new THREE.Vector3(
        liveTargetPos.x * 1.32,
        liveTargetPos.y + (isMobile ? 0.75 : 0.95),
        liveTargetPos.z * 1.32
      )
      camera.position.lerp(desiredCam, 0.05)
      controlsRef.current.target.lerp(liveTargetPos, 0.06)
    } else {
      // Возврат к общему космическому плану
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

  const handleSelect = (rel) => {
    onSelectRelease(rel)
  }

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enabled={exploreMode}
        enableDamping
        dampingFactor={0.07}
        autoRotate={!selectedRelease && !exploreMode}
        autoRotateSpeed={0.25}
        minDistance={3.2}
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

      {/* Освещение Оккультного Пространства */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1.1} color="#ff0022" />

      {/* Центральный Демонический Тотем */}
      <CentralDemonTotem />

      {/* 14 Оккультных Монолитов на Орбитах */}
      {RELEASES.map((rel, idx) => (
        <OrbitingRelease
          key={rel.id}
          release={rel}
          index={idx}
          total={RELEASES.length}
          onSelect={handleSelect}
          isSelected={selectedRelease?.id === rel.id}
          isMobile={isMobile}
          onPositionUpdate={handlePositionUpdate}
        />
      ))}
    </>
  )
}
