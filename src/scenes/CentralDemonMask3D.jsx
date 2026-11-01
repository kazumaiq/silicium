// SILICIUM — Central Demon Mask 3D & Energy Rings (Three.js / React Three Fiber)
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../data/store'

function DemonMaskMesh() {
  const meshRef = useRef()
  const maskTexture = useTexture('/images/demon-mask.jpg')

  // Плавный наклон за мышью
  const mouse = useStore((s) => s.mousePosition)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const targetRotX = (mouse.y || 0) * 0.25
    const targetRotY = (mouse.x || 0) * 0.35
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.06)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.06)
    
    // Дыхание маски
    const s = 1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.02
    meshRef.current.scale.set(s, s, s)
  })

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* 3D Плоскость маски с затемнением по краям и металлическим шейдингом */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[4.2, 4.2, 32, 32]} />
        <meshStandardMaterial
          map={maskTexture}
          roughness={0.25}
          metalness={0.85}
          emissive="#1a0003"
          emissiveIntensity={0.4}
          transparent
          opacity={0.96}
        />
      </mesh>

      {/* Заднее свечение / ореол маски */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[5.2, 5.2]} />
        <meshBasicMaterial
          color="#ff0022"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function ThinEnergyRings() {
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()

  useFrame((_, delta) => {
    if (ring1.current) {
      ring1.current.rotation.z += delta * 0.3
      ring1.current.rotation.x += delta * 0.1
    }
    if (ring2.current) {
      ring2.current.rotation.z -= delta * 0.25
      ring2.current.rotation.y += delta * 0.15
    }
    if (ring3.current) {
      ring3.current.rotation.x -= delta * 0.2
      ring3.current.rotation.y -= delta * 0.25
    }
  })

  return (
    <group position={[0, 0, 0.2]}>
      {/* Кольцо 1 — близкое */}
      <mesh ref={ring1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 120]} />
        <meshBasicMaterial
          color="#ff0022"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Кольцо 2 — среднее под углом */}
      <mesh ref={ring2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[3.4, 0.012, 16, 140]} />
        <meshBasicMaterial
          color="#ff1a3c"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Кольцо 3 — широкое внешнее */}
      <mesh ref={ring3} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
        <torusGeometry args={[4.1, 0.018, 16, 160]} />
        <meshBasicMaterial
          color="#8b0000"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Парящие металлические осколки вокруг маски
function OrbitingFragments({ count = 12 }) {
  const groupRef = useRef()

  const fragments = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = 3.6 + (Math.random() - 0.5) * 1.5
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * 2,
        scale: Math.random() * 0.18 + 0.08,
        rotSpeed: (Math.random() - 0.5) * 1.5,
      }
    })
  }, [count])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.08
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += delta * fragments[i].rotSpeed
        child.rotation.y += delta * fragments[i].rotSpeed
      })
    }
  })

  return (
    <group ref={groupRef}>
      {fragments.map((f, i) => (
        <mesh key={i} position={[f.x, f.y, f.z]} scale={f.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#d8d8d8"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function CentralDemonMask3D() {
  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={2.5} color="#ff0022" distance={8} />
      <pointLight position={[-4, 2, 1]} intensity={1.5} color="#ffffff" distance={10} />

      <DemonMaskMesh />
      <ThinEnergyRings />
      <OrbitingFragments />
    </group>
  )
}
