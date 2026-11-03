// SILICIUM — 3D Archive Scene (Spatial Orbit Matrix & Cinematic Focus)
import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { RELEASES } from '../data/config'
import { audioEngine } from '../services/audioEngine'

// Динамическая геометрия для каждого уникального артефакта
function ArtifactMesh({ releaseId, hovered, isSelected }) {
  const meshRef = useRef()

  useFrame((_, delta) => {
    if (meshRef.current) {
      const speed = isSelected ? 0.7 : hovered ? 1.4 : 0.35
      meshRef.current.rotation.x += delta * speed * 0.4
      meshRef.current.rotation.y += delta * speed
    }
  })

  const geometry = useMemo(() => {
    switch (releaseId) {
      case 'my-weed':
        return new THREE.OctahedronGeometry(0.9, 0)
      case 'kordeity':
        return new THREE.ConeGeometry(0.8, 1.6, 6)
      case 'broken-wheel-phonk':
        return new THREE.TorusGeometry(0.7, 0.3, 16, 32)
      case 'bless':
        return new THREE.IcosahedronGeometry(0.95, 0)
      case 'gantelya':
        return new THREE.CylinderGeometry(0.6, 0.6, 1.4, 8)
      case 'faith':
        return new THREE.TetrahedronGeometry(1.0, 0)
      case 'where-your-bound':
        return new THREE.TorusKnotGeometry(0.6, 0.2, 48, 8)
      case 'apathy':
        return new THREE.DodecahedronGeometry(0.9, 0)
      case 'blood-flame':
        return new THREE.OctahedronGeometry(1.0, 1)
      case 'domination':
        return new THREE.BoxGeometry(1.1, 1.1, 1.1)
      case 'night-on-that-side':
        return new THREE.IcosahedronGeometry(0.9, 1)
      case 'roku':
        return new THREE.DodecahedronGeometry(0.95, 0)
      default:
        return new THREE.BoxGeometry(0.95, 0.95, 0.95)
    }
  }, [releaseId])

  const color = isSelected ? '#ff1133' : hovered ? '#ff3355' : '#b0b0bc'
  const emissive = isSelected ? '#cc0022' : hovered ? '#880011' : '#141418'
  const emissiveIntensity = isSelected ? 1.6 : hovered ? 1.0 : 0.2

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      scale={isSelected ? 1.35 : hovered ? 1.2 : 0.95}
    >
      <meshStandardMaterial
        color={color}
        metalness={0.92}
        roughness={0.18}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        wireframe={isSelected}
      />
    </mesh>
  )
}

// Центральный Демонический Монолит с маской SILICIUM
function CentralArtifact() {
  const meshRef = useRef()
  const ringRef = useRef()
  const ring2Ref = useRef()
  const texture = useTexture('/images/demon-mask-seamless.png')

  useFrame(({ clock }, delta) => {
    const bass = audioEngine.smoothedBass || 0
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.16
      meshRef.current.scale.setScalar(1 + bass * 0.08)
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.22
      ringRef.current.rotation.y -= delta * 0.14
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z += delta * 0.18
      ring2Ref.current.rotation.x -= delta * 0.1
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Куб-монолит с текстурой маски */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2.0, 2.0, 2.0]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.88}
          roughness={0.2}
          emissive="#330005"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Внешнее энергетическое защитное кольцо */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.9, 0.035, 16, 90]} />
        <meshStandardMaterial
          color="#ff0022"
          emissive="#ff0000"
          emissiveIntensity={1.4}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>

      {/* Внутреннее лазерное кольцо */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.02, 16, 70]} />
        <meshStandardMaterial
          color="#ff3344"
          emissive="#ff0022"
          emissiveIntensity={1.8}
          wireframe
        />
      </mesh>

      <pointLight color="#ff0022" intensity={3.5} distance={10} />
    </group>
  )
}

// Отдельный интерактивный релиз-объект на орбите
function OrbitingRelease({ release, index, total, onSelect, isSelected, isMobile }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Адаптивный радиус: на смартфонах сжимаем орбиту, чтобы все 14 артефактов умещались в экран
  const radius = isMobile ? 4.7 : 6.8
  const angle = (index / total) * Math.PI * 2
  const initialX = Math.cos(angle) * radius
  const initialZ = Math.sin(angle) * radius
  const initialY = (index % 2 === 0 ? 0.8 : -0.8)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Плавное вращение орбиты, замедляется при выборе
      const t = clock.getElapsedTime() * (isSelected ? 0.03 : 0.12) + angle
      groupRef.current.position.x = Math.cos(t) * radius
      groupRef.current.position.z = Math.sin(t) * radius
      groupRef.current.position.y = initialY + Math.sin(t * 1.6) * 0.28
    }
  })

  // На смартфонах показываем надпись только для выбранного или наведенного объекта, чтобы не перегружать экран
  const shouldShowLabel = !isMobile || isSelected || hovered

  return (
    <group ref={groupRef} position={[initialX, initialY, initialZ]}>
      {/* 3D Геометрия артефакта */}
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
        <ArtifactMesh
          releaseId={release.id}
          hovered={hovered}
          isSelected={isSelected}
        />
      </group>

      {/* Голографический прицел активного артефакта */}
      {isSelected && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.35, 1.42, 40]} />
            <meshBasicMaterial color="#ff0022" side={THREE.DoubleSide} />
          </mesh>
          <pointLight color="#ff0033" intensity={2.2} distance={4} />
        </group>
      )}

      {/* Ободок энергии вокруг артефакта */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.015, 12, 48]} />
        <meshBasicMaterial
          color={hovered || isSelected ? '#ff0033' : 'rgba(120, 120, 130, 0.4)'}
          wireframe
        />
      </mesh>

      {/* Компактный маркер-подпись */}
      {shouldShowLabel && (
        <Html distanceFactor={isMobile ? 13 : 11} position={[0, 1.35, 0]} center>
          <div
            onClick={(e) => {
              e.stopPropagation()
              onSelect(release, groupRef.current ? groupRef.current.position : null)
            }}
            style={{
              background: hovered || isSelected ? 'rgba(180, 0, 24, 0.95)' : 'rgba(8, 8, 8, 0.85)',
              border: `1px solid ${hovered || isSelected ? '#ff1133' : 'rgba(255, 255, 255, 0.12)'}`,
              borderLeft: `3px solid ${hovered || isSelected ? '#ff0033' : '#777'}`,
              color: '#fff',
              padding: isMobile ? '3px 7px' : '4px 9px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: isMobile ? '9px' : '10px',
              fontWeight: isSelected ? '700' : '400',
              letterSpacing: '0.14em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: hovered || isSelected ? '0 0 16px rgba(255, 0, 34, 0.6)' : 'none',
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

// Плавный кинематографичный переход камеры к выбранному артефакту
function CinematicCameraController({ targetReleasePos, controlsRef, isMobile }) {
  const { camera } = useThree()
  const defaultPos = useMemo(() => new THREE.Vector3(0, isMobile ? 5.2 : 4.2, isMobile ? 15.5 : 12.5), [isMobile])
  const defaultTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(() => {
    if (!controlsRef.current) return

    if (targetReleasePos) {
      // Камера плавно приближается к объекту
      const desiredCam = new THREE.Vector3(
        targetReleasePos.x * 1.3,
        targetReleasePos.y + (isMobile ? 0.9 : 1.1),
        targetReleasePos.z * 1.3
      )
      camera.position.lerp(desiredCam, 0.05)
      controlsRef.current.target.lerp(targetReleasePos, 0.06)
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
  const [targetPos, setTargetPos] = useState(null)

  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  }, [])

  const handleSelect = (rel, pos) => {
    onSelectRelease(rel)
    if (pos) {
      setTargetPos(pos.clone())
    }
  }

  // Сброс положения камеры по триггеру кнопки
  useEffect(() => {
    setTargetPos(null)
  }, [resetTrigger])

  // Сброс фокуса при закрытии инфо-панели
  useEffect(() => {
    if (!selectedRelease) {
      setTargetPos(null)
    }
  }, [selectedRelease])

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
        targetReleasePos={targetPos}
        controlsRef={controlsRef}
        isMobile={isMobile}
      />

      <ambientLight intensity={0.35} />
      <directionalLight position={[10, 15, 10]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={0.9} color="#ff0022" />

      <CentralArtifact />

      {RELEASES.map((rel, idx) => (
        <OrbitingRelease
          key={rel.id}
          release={rel}
          index={idx}
          total={RELEASES.length}
          onSelect={handleSelect}
          isSelected={selectedRelease?.id === rel.id}
          isMobile={isMobile}
        />
      ))}
    </>
  )
}
