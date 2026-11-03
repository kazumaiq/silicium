// SILICIUM — Main 3D Cosmic Scene
// Core visual element: stars, nebula, energy rifts, metallic debris, orbital rings
import React, { useRef, useMemo, useCallback, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../data/store'
import { audioEngine } from '../services/audioEngine'
import { getQualityCounts } from '../hooks/usePerformance'
import styles from './CosmicScene.module.css'

// ─────────────────────────────────────────────────────────────────────
// SHADERS
// ─────────────────────────────────────────────────────────────────────

const starVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Twinkle: sine-based alpha modulation per star
    float twinkle = sin(uTime * 0.8 + aPhase * 6.2831) * 0.3 + 0.7;
    vAlpha = twinkle;

    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 6.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const starFragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    // Soft circular point
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
    gl_FragColor = vec4(0.92, 0.92, 0.96, alpha);
  }
`

const dustVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    // Slow drift motion
    vec3 pos = position;
    pos.x += sin(uTime * 0.05 + aPhase * 3.14) * 0.3;
    pos.y += cos(uTime * 0.04 + aPhase * 2.71) * 0.2;
    pos.z += sin(uTime * 0.03 + aPhase * 1.41) * 0.15;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    vAlpha = 0.15 + sin(uTime * 0.3 + aPhase * 6.28) * 0.1;
    vPhase = aPhase;

    gl_PointSize = aSize * (150.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 4.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const dustFragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vPhase;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;

    // Mix between warm and cool dust
    vec3 warmDust = vec3(0.55, 0.15, 0.1);
    vec3 coolDust = vec3(0.3, 0.3, 0.4);
    vec3 color = mix(coolDust, warmDust, step(0.5, vPhase));

    gl_FragColor = vec4(color, alpha);
  }
`

const emberVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uAudioBass;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    vec3 pos = position;
    // Upward drift wrapping continuously
    float yOffset = uTime * (aSpeed + uAudioBass * 0.9) + aPhase * 40.0;
    pos.y = mod(pos.y + yOffset, 40.0) - 20.0;
    
    // Chaotic turbulence
    pos.x += sin(uTime * 0.7 + aPhase * 6.28) * 0.6;
    pos.z += cos(uTime * 0.5 + aPhase * 4.12) * 0.4;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Heat pulse with bass
    vHeat = sin(uTime * 1.5 + aPhase * 3.14) * 0.5 + 0.5 + uAudioBass * 0.6;
    vAlpha = (0.35 + sin(uTime * 1.2 + aPhase * 5.0) * 0.25 + uAudioBass * 0.45);

    gl_PointSize = (aSize + uAudioBass * 3.0) * (180.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 9.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const emberFragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.05, dist) * vAlpha;

    // Glowing ember gradient: dark red -> bright crimson -> incandescent orange core
    vec3 darkRed = vec3(0.65, 0.02, 0.05);
    vec3 brightCrimson = vec3(1.0, 0.08, 0.12);
    vec3 orangeCore = vec3(1.0, 0.6, 0.25);

    vec3 col = mix(darkRed, brightCrimson, clamp(vHeat, 0.0, 1.0));
    col = mix(col, orangeCore, smoothstep(0.25, 0.0, dist) * vHeat);

    gl_FragColor = vec4(col, alpha);
  }
`

// ─────────────────────────────────────────────────────────────────────
// STAR FIELD
// ─────────────────────────────────────────────────────────────────────

function StarField({ count }) {
  const meshRef = useRef()
  const materialRef = useRef()

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute in a large sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 15 + Math.random() * 85

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      sizes[i] = 0.5 + Math.random() * 2.5
      phases[i] = Math.random()
    }

    return { positions, sizes, phases }
  }, [count])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={count}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─────────────────────────────────────────────────────────────────────
// COSMIC DUST
// ─────────────────────────────────────────────────────────────────────

function CosmicDust({ count }) {
  const materialRef = useRef()

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40

      sizes[i] = 1.0 + Math.random() * 3.0
      phases[i] = Math.random()
    }

    return { positions, sizes, phases }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={count}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={dustVertexShader}
        fragmentShader={dustFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─────────────────────────────────────────────────────────────────────
// RED ENERGY RIFTS
// ─────────────────────────────────────────────────────────────────────

function SingleRift({ points, width, pulseSpeed, pulseOffset }) {
  const meshRef = useRef()
  const glowRef = useRef()

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
      false,
      'catmullrom',
      0.5
    )
  }, [points])

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, width, 8, false)
  }, [curve, width])

  const glowGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, width * 3, 8, false)
  }, [curve, width])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const bass = audioEngine.smoothedBass || 0
    const pulse = 0.6 + Math.sin(t * pulseSpeed + pulseOffset) * 0.4 + bass * 0.9

    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = pulse * (2.2 + bass * 3.5)
      meshRef.current.material.opacity = Math.min(1.0, 0.7 + pulse * 0.3 + bass * 0.3)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = Math.min(0.85, pulse * 0.16 + bass * 0.4)
    }
  })

  return (
    <group>
      {/* Core rift line */}
      <mesh ref={meshRef} geometry={tubeGeo}>
        <meshStandardMaterial
          color="#DC143C"
          emissive="#FF0000"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} geometry={glowGeo}>
        <meshBasicMaterial
          color="#8B0000"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function RedEnergyRifts({ count }) {
  const riftConfigs = useMemo(() => {
    const configs = [
      {
        points: [
          [-8, 3, -10],
          [-6, 4.5, -12],
          [-3.5, 3.8, -11],
          [-2, 5, -13],
          [0, 4, -12],
        ],
        width: 0.03,
        pulseSpeed: 0.7,
        pulseOffset: 0,
      },
      {
        points: [
          [6, -2, -15],
          [7.5, -0.5, -14],
          [9, -1.5, -16],
          [11, 0, -15],
          [12, -1, -14],
        ],
        width: 0.025,
        pulseSpeed: 0.9,
        pulseOffset: 2.1,
      },
      {
        points: [
          [-4, -5, -8],
          [-2.5, -4, -9],
          [-1, -5.5, -10],
          [0.5, -3.5, -9],
          [2, -5, -11],
        ],
        width: 0.02,
        pulseSpeed: 0.6,
        pulseOffset: 4.2,
      },
      {
        points: [
          [3, 6, -18],
          [4.5, 7, -17],
          [6, 5.5, -19],
          [7, 7.5, -18],
        ],
        width: 0.035,
        pulseSpeed: 0.8,
        pulseOffset: 1.5,
      },
      {
        points: [
          [-10, 0, -20],
          [-8, 1.5, -22],
          [-6.5, -0.5, -21],
          [-5, 1, -23],
          [-3, 0, -22],
        ],
        width: 0.015,
        pulseSpeed: 1.1,
        pulseOffset: 3.3,
      },
    ]

    return configs.slice(0, count)
  }, [count])

  return (
    <group>
      {riftConfigs.map((config, i) => (
        <SingleRift key={i} {...config} />
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────
// METALLIC DEBRIS
// ─────────────────────────────────────────────────────────────────────

function DebrisFragment({ position, rotation, scale, geometryType, speed }) {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    meshRef.current.rotation.x += speed.rx * 0.01
    meshRef.current.rotation.y += speed.ry * 0.01
    meshRef.current.rotation.z += speed.rz * 0.005

    // Gentle floating drift
    meshRef.current.position.y =
      position[1] + Math.sin(t * speed.float + speed.phase) * 0.3
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {geometryType === 'octahedron' ? (
        <octahedronGeometry args={[1, 0]} />
      ) : (
        <icosahedronGeometry args={[1, 0]} />
      )}
      <meshStandardMaterial
        color="#B8B8C0"
        metalness={0.95}
        roughness={0.08}
        envMapIntensity={2.0}
        emissive="#200008"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

function MetallicDebris({ count }) {
  const fragments = useMemo(() => {
    const result = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 5 + Math.random() * 15
      const y = (Math.random() - 0.5) * 12

      result.push({
        position: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius - 10,
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.15 + Math.random() * 0.35,
        geometryType: Math.random() > 0.5 ? 'octahedron' : 'icosahedron',
        speed: {
          rx: (Math.random() - 0.5) * 2,
          ry: (Math.random() - 0.5) * 2,
          rz: (Math.random() - 0.5) * 2,
          float: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
        },
      })
    }
    return result
  }, [count])

  return (
    <group>
      {fragments.map((frag, i) => (
        <DebrisFragment key={i} {...frag} />
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ORBITAL RINGS
// ─────────────────────────────────────────────────────────────────────

function OrbitalRing({ radius, tubeRadius, rotation, speed, tilt }) {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.z += speed * 0.002
  })

  return (
    <mesh ref={meshRef} rotation={tilt}>
      <torusGeometry args={[radius, tubeRadius, 16, 100]} />
      <meshStandardMaterial
        color="#808090"
        metalness={0.85}
        roughness={0.15}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function OrbitalRings({ count }) {
  const ringConfigs = useMemo(() => {
    const configs = [
      {
        radius: 12,
        tubeRadius: 0.02,
        speed: 0.3,
        tilt: [0.3, 0.5, 0],
      },
      {
        radius: 18,
        tubeRadius: 0.015,
        speed: -0.2,
        tilt: [-0.4, 0.2, 0.3],
      },
      {
        radius: 25,
        tubeRadius: 0.025,
        speed: 0.15,
        tilt: [0.6, -0.3, 0.1],
      },
    ]
    return configs.slice(0, count)
  }, [count])

  return (
    <group position={[0, 0, -15]}>
      {ringConfigs.map((config, i) => (
        <OrbitalRing key={i} {...config} />
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────
// NEBULA (Sprite-based volumetric clouds)
// ─────────────────────────────────────────────────────────────────────

function NebulaCloud({ position, color, scale, opacity, rotationSpeed }) {
  const spriteRef = useRef()

  // Generate a soft radial gradient texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, `rgba(${color.join(',')}, 0.6)`)
    gradient.addColorStop(0.4, `rgba(${color.join(',')}, 0.2)`)
    gradient.addColorStop(0.7, `rgba(${color.join(',')}, 0.05)`)
    gradient.addColorStop(1, `rgba(${color.join(',')}, 0)`)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [color])

  useFrame(({ clock }) => {
    if (!spriteRef.current) return
    const t = clock.getElapsedTime()
    // Subtle scale breathing
    const breathe = 1 + Math.sin(t * rotationSpeed + position[0]) * 0.05
    spriteRef.current.scale.setScalar(scale * breathe)
  })

  return (
    <sprite ref={spriteRef} position={position} scale={scale}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
}

function Nebula({ count }) {
  const clouds = useMemo(() => {
    const configs = [
      {
        position: [-8, 2, -25],
        color: [139, 0, 0],
        scale: 20,
        opacity: 0.08,
        rotationSpeed: 0.15,
      },
      {
        position: [10, -3, -30],
        color: [100, 0, 20],
        scale: 25,
        opacity: 0.06,
        rotationSpeed: 0.1,
      },
      {
        position: [0, 5, -35],
        color: [60, 0, 30],
        scale: 30,
        opacity: 0.05,
        rotationSpeed: 0.12,
      },
      {
        position: [-12, -5, -20],
        color: [80, 10, 10],
        scale: 18,
        opacity: 0.07,
        rotationSpeed: 0.18,
      },
      {
        position: [5, 8, -28],
        color: [120, 5, 15],
        scale: 22,
        opacity: 0.05,
        rotationSpeed: 0.08,
      },
      {
        position: [-5, -7, -22],
        color: [40, 5, 20],
        scale: 16,
        opacity: 0.04,
        rotationSpeed: 0.2,
      },
      {
        position: [15, 2, -33],
        color: [90, 0, 10],
        scale: 28,
        opacity: 0.04,
        rotationSpeed: 0.09,
      },
      {
        position: [-3, 0, -18],
        color: [30, 10, 25],
        scale: 14,
        opacity: 0.06,
        rotationSpeed: 0.14,
      },
    ]
    return configs.slice(0, count)
  }, [count])

  return (
    <group>
      {clouds.map((cloud, i) => (
        <NebulaCloud key={i} {...cloud} />
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────
// CAMERA CONTROLLER (parallax + scroll-driven spatial depth)
// ─────────────────────────────────────────────────────────────────────

function CameraController({ reducedMotion }) {
  const mousePosition = useStore((s) => s.mousePosition)
  const { camera } = useThree()
  const scrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / maxScroll))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (reducedMotion) return

    const scroll = scrollRef.current
    const parallaxStrength = 1.2

    // Spatial 3D traversal through cosmic depth on scroll (Continuous Living Universe)
    const targetX = mousePosition.x * parallaxStrength
    const targetY = (mousePosition.y * parallaxStrength * 0.5) - (scroll * 14)
    const targetZ = 8 + Math.sin(scroll * Math.PI) * 4.0

    // Smooth lerp
    camera.position.x += (targetX - camera.position.x) * 0.04
    camera.position.y += (targetY - camera.position.y) * 0.04
    camera.position.z += (targetZ - camera.position.z) * 0.04

    // Subtle look-at offset that pans down through the universe
    camera.lookAt(
      camera.position.x * 0.35,
      camera.position.y - 1.5,
      -12
    )
  })

  return null
}

// ─────────────────────────────────────────────────────────────────────
// CINEMATIC LIGHTING
// ─────────────────────────────────────────────────────────────────────

function CinematicLighting() {
  return (
    <>
      {/* Dim ambient fill */}
      <ambientLight intensity={0.08} color="#1a1a2e" />

      {/* Main white key light from above */}
      <directionalLight
        position={[5, 15, 10]}
        intensity={0.4}
        color="#e8e8f0"
        castShadow={false}
      />

      {/* Red accent lights */}
      <pointLight
        position={[-10, 5, -8]}
        intensity={1.2}
        color="#8B0000"
        distance={30}
        decay={2}
      />
      <pointLight
        position={[8, -3, -12]}
        intensity={0.8}
        color="#DC143C"
        distance={25}
        decay={2}
      />
      <pointLight
        position={[0, -8, -5]}
        intensity={0.5}
        color="#FF0000"
        distance={20}
        decay={2}
      />

      {/* Cool rim light from behind */}
      <directionalLight
        position={[-3, 0, -20]}
        intensity={0.2}
        color="#4040a0"
      />

      {/* Top fill rim */}
      <directionalLight
        position={[0, 10, -15]}
        intensity={0.15}
        color="#c0c0d0"
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// AMBIENT SCENE ROTATION (Reacts dynamically to scroll progress)
// ─────────────────────────────────────────────────────────────────────

function SceneRotator({ children, reducedMotion }) {
  const groupRef = useRef()
  const scrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / maxScroll))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current || reducedMotion) return
    const t = clock.getElapsedTime()
    const scroll = scrollRef.current

    // Ambient drift + scroll-driven 3D rotation
    groupRef.current.rotation.y = Math.sin(t * 0.02) * 0.04 + scroll * 0.35
    groupRef.current.rotation.x = Math.cos(t * 0.015) * 0.02 - scroll * 0.15
  })

  return <group ref={groupRef}>{children}</group>
}

// ─────────────────────────────────────────────────────────────────────
// VOLCANIC ASH & EMBERS (Occult Crimson Drift Particles)
// ─────────────────────────────────────────────────────────────────────

function VolcanicAshEmbers({ count = 220 }) {
  const materialRef = useRef()
  const { positions, sizes, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 4

      sizes[i] = 1.4 + Math.random() * 2.8
      phases[i] = Math.random()
      speeds[i] = 0.5 + Math.random() * 0.9
    }

    return { positions, sizes, phases, speeds }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudioBass: { value: 0 },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
      materialRef.current.uniforms.uAudioBass.value = audioEngine.smoothedBass || 0
    }
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" count={count} array={speeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={emberVertexShader}
        fragmentShader={emberFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─────────────────────────────────────────────────────────────────────
// COSMIC SHOCKWAVE RING (Bass Transient Pulse Wave)
// ─────────────────────────────────────────────────────────────────────

function CosmicShockwaveRing() {
  const meshRef = useRef()
  const ringScale = useRef(1)
  const ringAlpha = useRef(0)

  useEffect(() => {
    return audioEngine.onBeat((beat) => {
      if (beat.type === 'kick') {
        ringScale.current = 1.5
        ringAlpha.current = 0.8
      }
    })
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    if (ringAlpha.current > 0.01) {
      ringScale.current += delta * 14
      ringAlpha.current = Math.max(0, ringAlpha.current - delta * 1.6)
      meshRef.current.scale.set(ringScale.current, ringScale.current, 1)
      meshRef.current.material.opacity = ringAlpha.current
    } else {
      meshRef.current.material.opacity = 0
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -14]} rotation={[0, 0, 0]}>
      <ringGeometry args={[1, 1.25, 64]} />
      <meshBasicMaterial
        color="#ff0033"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─────────────────────────────────────────────────────────────────────
// PULSING POINT LIGHT (Periodic Ambient Flash + Audio Reactive)
// ─────────────────────────────────────────────────────────────────────

function PulsingPointLight() {
  const lightRef = useRef()

  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t = clock.getElapsedTime()
    // Periodic pulse cycle every ~7 seconds
    const pulse = Math.pow(Math.max(0, Math.sin(t * 0.45)), 8) * 1.8
    const bass = audioEngine.smoothedBass || 0
    lightRef.current.intensity = pulse + bass * 1.4
  })

  return (
    <pointLight
      ref={lightRef}
      position={[0, 2, -10]}
      color="#ff0033"
      distance={45}
      decay={2}
      intensity={0}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────
// INNER SCENE (all elements composed together)
// ─────────────────────────────────────────────────────────────────────

function InnerScene() {
  const sceneQuality = useStore((s) => s.sceneQuality)
  const counts = useMemo(() => getQualityCounts(sceneQuality), [sceneQuality])

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return (
    <>
      <CinematicLighting />
      <CameraController reducedMotion={reducedMotion} />

      <SceneRotator reducedMotion={reducedMotion}>
        <StarField count={Math.min(counts.stars, 1000)} />
        <CosmicDust count={Math.min(counts.dust, 250)} />
        <VolcanicAshEmbers count={180} />
        <RedEnergyRifts count={5} />
        <MetallicDebris count={counts.debris} />
        <OrbitalRings count={counts.rings} />
        <Nebula count={counts.nebula} />
        <CosmicShockwaveRing />
        <PulsingPointLight />
      </SceneRotator>

      {/* Fog for depth */}
      <fog attach="fog" args={['#000000', 30, 100]} />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────

export default function CosmicScene() {
  const webglSupported = useStore((s) => s.webglSupported)

  if (!webglSupported) {
    return (
      <div className={styles.fallback} aria-hidden="true">
        <div className={styles.fallbackStars} />
      </div>
    )
  }

  return (
    <div className={styles.sceneContainer} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        flat
      >
        <color attach="background" args={['#000000']} />
        <Suspense fallback={null}>
          <InnerScene />
        </Suspense>
      </Canvas>
      <div className={styles.sceneOverlay} />
    </div>
  )
}
