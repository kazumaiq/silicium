// SILICIUM — 3D Archive Scene (Interactive Spatial Release Matrix & Cinematic Focus)
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
      const speed = isSelected ? 0.8 : hovered ? 1.4 : 0.4
      meshRef.current.rotation.x += delta * speed * 0.5
      meshRef.current.rotation.y += delta * speed
    }
  })

  // Различные формы цифровых артефактов
  const geometry = useMemo(() => {
    switch (releaseId) {
      case 'my-weed':
        return new THREE.OctahedronGeometry(1.0, 0)
      case 'kordeity':
        return new THREE.ConeGeometry(0.9, 1.8, 6)
      case 'broken-wheel-phonk':
        return new THREE.TorusGeometry(0.8, 0.35, 16, 32)
      case 'devil-night':
        return new THREE.IcosahedronGeometry(1.05, 0)
      case 'roku':
        return new THREE.DodecahedronGeometry(1.0, 0)
      default:
        return new THREE.BoxGeometry(1.2, 1.2, 1.2)
    }
  }, [releaseId])

  const color = isSelected ? '#ff1133' : hovered ? '#ff3355' : '#b8b8c2'
  const emissive = isSelected ? '#cc0022' : hovered ? '#880011' : '#141418'
  const emissiveIntensity = isSelected ? 1.4 : hovered ? 0.9 : 0.2

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      scale={isSelected ? 1.4 : hovered ? 1.25 : 1.0}
    >
      <meshStandardMaterial
        color={color}
        metalness={0.92}
        roughness={0.15}
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
      meshRef.current.rotation.y += delta * 0.18
      meshRef.current.scale.setScalar(1 + bass * 0.08)
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.25
      ringRef.current.rotation.y -= delta * 0.15
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z += delta * 0.2
      ring2Ref.current.rotation.x -= delta * 0.12
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Куб-монолит с текстурой маски */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2.3, 2.3, 2.3]} />
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
        <torusGeometry args={[3.4, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#ff0022"
          emissive="#ff0000"
          emissiveIntensity={1.4}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>

      {/* Внутреннее перпендикулярное лазерное кольцо */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.9, 0.02, 16, 80]} />
        <meshStandardMaterial
          color="#ff3344"
          emissive="#ff0022"
          emissiveIntensity={1.8}
          wireframe
        />
      </mesh>

      <pointLight color="#ff0022" intensity={4} distance={12} />
    </group>
  )
}

// Отдельный интерактивный релиз-объект на орбите
function OrbitingRelease({ release, index, total, onSelect, isSelected }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Вычисляем орбитальную позицию
  const angle = (index / total) * Math.PI * 2
  const radius = 6.8
  const initialX = Math.cos(angle) * radius
  const initialZ = Math.sin(angle) * radius
  const initialY = (index % 2 === 0 ? 1 : -1) * 0.9

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Плавное вращение орбиты, замедляется при выборе
      const t = clock.getElapsedTime() * (isSelected ? 0.04 : 0.14) + angle
      groupRef.current.position.x = Math.cos(t) * radius
      groupRef.current.position.z = Math.sin(t) * radius
      groupRef.current.position.y = initialY + Math.sin(t * 1.8) * 0.35
    }
  })

  return (
    <group ref={groupRef} position={[initialX, initialY, initialZ]}>
      {/* 3D Геометрия артефакта */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          onSelect(release, groupRef.current.position)
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
            <ringGeometry args={[1.6, 1.68, 48]} />
            <meshBasicMaterial color="#ff0022" side={THREE.DoubleSide} />
          </mesh>
          <pointLight color="#ff0033" intensity={2.5} distance={5} />
        </group>
      )}

      {/* Ободок энергии вокруг артефакта */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.02, 16, 60]} />
        <meshBasicMaterial
          color={hovered || isSelected ? '#ff0033' : '#444444'}
          wireframe
        />
      </mesh>

      {/* Всплывающий HTML-маркер */}
      <Html distanceFactor={11} position={[0, 1.5, 0]} center>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onSelect(release, groupRef.current ? groupRef.current.position : null)
          }}
          style={{
            background: hovered || isSelected ? 'rgba(160, 0, 20, 0.95)' : 'rgba(8, 8, 8, 0.88)',
            border: `1px solid ${hovered || isSelected ? '#ff1133' : 'rgba(255, 255, 255, 0.15)'}`,
            borderLeft: `3px solid ${hovered || isSelected ? '#ff0033' : '#666'}`,
            color: '#fff',
            padding: '4px 10px',
            fontFamily: 'Courier New, monospace',
            fontSize: '10px',
            fontWeight: isSelected ? 'bold' : 'normal',
            letterSpacing: '0.18em',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: hovered || isSelected ? '0 0 16px rgba(255, 0, 34, 0.7)' : 'none',
            userSelect: 'none',
          }}
        >
          {release.title} // {release.year}
        </div>
      </Html>
    </group>
  )
}

// Плавный кинематографичный переход камеры к выбранному артефакту
function CinematicCameraController({ targetReleasePos, controlsRef }) {
  const { camera } = useThree()
  const defaultPos = useMemo(() => new THREE.Vector3(0, 4.5, 12), [])
  const defaultTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(() => {
    if (!controlsRef.current) return

    if (targetReleasePos) {
      // Камера приближается к объекту с кинематографичным смещением
      const desiredCam = new THREE.Vector3(
        targetReleasePos.x * 1.35,
        targetReleasePos.y + 1.2,
        targetReleasePos.z * 1.35
      )
      camera.position.lerp(desiredCam, 0.05)
      controlsRef.current.target.lerp(targetReleasePos, 0.06)
    } else {
      // Возврат к общему космическому плану
      camera.position.lerp(defaultPos, 0.035)
      controlsRef.current.target.lerp(defaultTarget, 0.04)
    }
    controlsRef.current.update()
  })

  return null
}

// Фоновые звёзды архива
function ArchiveStars({ count = 1600 }) {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 85
      pos[i * 3 + 1] = (Math.random() - 0.5) * 85
      pos[i * 3 + 2] = (Math.random() - 0.5) * 85
    }
    return pos
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        color="#ffffff"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  )
}

export default function ArchiveScene({ selectedRelease, onSelectRelease }) {
  const controlsRef = useRef()
  const [targetPos, setTargetPos] = useState(null)

  const isTouchDevice = useMemo(() => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const handleSelect = (rel, pos) => {
    onSelectRelease(rel)
    if (pos) {
      setTargetPos(pos.clone())
    }
  }

  // Сброс фокуса камеры при отмене выбора
  useEffect(() => {
    if (!selectedRelease) {
      setTargetPos(null)
    }
  }, [selectedRelease])

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        autoRotate={!selectedRelease}
        autoRotateSpeed={0.25}
        minDistance={3.5}
        maxDistance={24}
        enablePan={false}
        enableZoom={!isTouchDevice}
      />

      <CinematicCameraController
        targetReleasePos={targetPos}
        controlsRef={controlsRef}
      />

      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={0.8} color="#ff0022" />

      <ArchiveStars />
      <CentralArtifact />

      {RELEASES.map((rel, idx) => (
        <OrbitingRelease
          key={rel.id}
          release={rel}
          index={idx}
          total={RELEASES.length}
          onSelect={handleSelect}
          isSelected={selectedRelease?.id === rel.id}
        />
      ))}
    </>
  )
}
