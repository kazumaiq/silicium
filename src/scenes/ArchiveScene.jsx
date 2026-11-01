// SILICIUM — 3D Archive Scene (Interactive Spatial Release Matrix)
import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { RELEASES } from '../data/config'

// Центральный Демонический Монолит с маской SILICIUM
function CentralArtifact() {
  const meshRef = useRef()
  const ringRef = useRef()
  const texture = useTexture('/images/demon-mask.jpg')

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.2
      ringRef.current.rotation.y -= delta * 0.1
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Куб-монолит с текстурой маски */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.9}
          roughness={0.2}
          emissive="#220000"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Энергетическое защитное кольцо */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.2, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#ff0022"
          emissive="#ff0000"
          emissiveIntensity={1.2}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      <pointLight color="#ff0022" intensity={3} distance={10} />
    </group>
  )
}

// Отдельный интерактивный релиз-объект на орбите
function OrbitingRelease({ release, index, total, onSelect, isSelected }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Вычисляем орбитальную позицию
  const angle = (index / total) * Math.PI * 2
  const radius = 6.5
  const initialX = Math.cos(angle) * radius
  const initialZ = Math.sin(angle) * radius
  const initialY = (index % 2 === 0 ? 1 : -1) * 0.8

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * 0.15 + angle
      groupRef.current.position.x = Math.cos(t) * radius
      groupRef.current.position.z = Math.sin(t) * radius
      groupRef.current.position.y = initialY + Math.sin(t * 2) * 0.3
      groupRef.current.rotation.y += 0.015
    }
  })

  return (
    <group ref={groupRef} position={[initialX, initialY, initialZ]}>
      {/* 3D Геометрия артефакта */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect(release)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        scale={hovered || isSelected ? 1.35 : 1}
      >
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#ff1133' : '#b0b0b0'}
          metalness={0.95}
          roughness={0.15}
          emissive={hovered || isSelected ? '#aa0011' : '#111111'}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.2}
        />
      </mesh>

      {/* Ободок энергии вокруг артефакта */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.02, 16, 60]} />
        <meshBasicMaterial
          color={hovered || isSelected ? '#ff0033' : '#555555'}
          wireframe
        />
      </mesh>

      {/* Всплывающий HTML-маркер */}
      <Html distanceFactor={12} position={[0, 1.4, 0]} center>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onSelect(release)
          }}
          style={{
            background: hovered || isSelected ? 'rgba(139, 0, 0, 0.9)' : 'rgba(10, 10, 10, 0.85)',
            border: `1px solid ${hovered || isSelected ? '#ff1133' : '#333'}`,
            color: '#fff',
            padding: '4px 8px',
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            letterSpacing: '0.15em',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: hovered ? '0 0 12px rgba(255, 0, 34, 0.6)' : 'none',
          }}
        >
          {release.title} // {release.year}
        </div>
      </Html>
    </group>
  )
}

// Фоновые звёзды архива
function ArchiveStars({ count = 1800 }) {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80
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
        size={0.12}
        color="#ffffff"
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  )
}

export default function ArchiveScene({ selectedRelease, onSelectRelease }) {
  return (
    <>
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.3}
        minDistance={4}
        maxDistance={22}
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
          onSelect={onSelectRelease}
          isSelected={selectedRelease?.id === rel.id}
        />
      ))}
    </>
  )
}
