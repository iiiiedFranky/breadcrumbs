import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'

const defaultToolConfig = [
  {
    id: 'hardware',
    label: 'Hardware',
    color: '#c88d4d',
    speed: 1.15,
    drift: [0.34, 0.2, 0.16],
    rotationBias: -0.9,
  },
  {
    id: 'software',
    label: 'Software',
    color: '#7fa37a',
    speed: 1.4,
    drift: [0.28, 0.24, 0.14],
    rotationBias: 0.25,
  },
  {
    id: 'data',
    label: 'Data',
    color: '#d7af89',
    speed: 1.8,
    drift: [0.22, 0.18, 0.12],
    rotationBias: 0.8,
  },
]

const defaultNavItems = [
  { id: 'hardware', label: 'Hardware', href: '#hardware' },
  { id: 'software', label: 'Software', href: '#software' },
  { id: 'data', label: 'Data', href: '#data' },
]

const buildTools = (toolConfig, slotSpacing = 2.7) =>
  toolConfig.map((tool, index) => ({
    ...tool,
    position: [index === 1 ? 0 : (index - 1) * slotSpacing, 0, 0],
  }))

function ToolMesh({ tool, active, onClick, groupRef }) {
  const metal = useMemo(
    () => ({
      hardware: '#c78552',
      software: '#99ae8d',
      data: '#d6b18c',
    }[tool.id]),
    [tool.id],
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const t = clock.getElapsedTime() * tool.speed
    const [dx, dy, dz] = tool.drift
    const x = tool.position[0] + Math.sin(t + tool.position[0]) * dx
    const y = tool.position[1] + Math.cos(t * 1.35 + tool.position[1]) * dy
    const z = tool.position[2] + Math.sin(t * 1.7 + tool.position[2]) * dz

    groupRef.current.position.set(x, y, z)
    groupRef.current.rotation.x = 0.45 + Math.sin(t * 1.2 + tool.position[0]) * 0.12
    groupRef.current.rotation.y = 0.15 + Math.cos(t * 1.25 + tool.position[1]) * 0.14
    groupRef.current.rotation.z =
      tool.rotationBias + Math.sin(t * 1.5 + tool.position[2]) * 0.18
    groupRef.current.scale.setScalar(active ? 1.12 : 1)
  })

  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      {tool.id === 'hardware' && (
        <>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 1.2, 0.24]} />
            <meshStandardMaterial color={metal} metalness={0.9} roughness={0.18} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.08, 0.18]}>
            <boxGeometry args={[1.35, 0.78, 0.12]} />
            <meshStandardMaterial color={'#efe7d8'} metalness={0.35} roughness={0.4} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.48, 0.12, 0.28]}>
            <boxGeometry args={[0.18, 0.18, 0.16]} />
            <meshStandardMaterial color={'#f0d38c'} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.12, 0.28]}>
            <boxGeometry args={[0.18, 0.18, 0.16]} />
            <meshStandardMaterial color={'#f0d38c'} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.48, 0.12, 0.28]}>
            <boxGeometry args={[0.18, 0.18, 0.16]} />
            <meshStandardMaterial color={'#f0d38c'} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.54, -0.46, 0.28]}>
            <boxGeometry args={[0.28, 0.28, 0.16]} />
            <meshStandardMaterial color={'#f0d38c'} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.54, -0.46, 0.28]}>
            <boxGeometry args={[0.28, 0.28, 0.16]} />
            <meshStandardMaterial color={'#f0d38c'} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.16, -0.46, 0.3]}>
            <boxGeometry args={[0.78, 0.14, 0.12]} />
            <meshStandardMaterial color={'#d4b98a'} metalness={0.52} roughness={0.36} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.18, -0.46, 0.3]}>
            <boxGeometry args={[0.78, 0.14, 0.12]} />
            <meshStandardMaterial color={'#d4b98a'} metalness={0.52} roughness={0.36} />
          </mesh>
        </>
      )}

      {tool.id === 'software' && (
        <>
          <mesh castShadow receiveShadow position={[-0.7, 0, 0]}>
            <boxGeometry args={[0.46, 1.7, 0.2]} />
            <meshStandardMaterial color={metal} metalness={0.9} roughness={0.18} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.22, 0.18, 0.12]}>
            <boxGeometry args={[1.72, 1.08, 0.2]} />
            <meshStandardMaterial color={metal} metalness={0.9} roughness={0.18} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.42, 0.26, 0.28]}>
            <boxGeometry args={[1.1, 0.46, 0.08]} />
            <meshStandardMaterial color={'#dfeffc'} metalness={0.3} roughness={0.42} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.38, -0.22, 0.28]}>
            <boxGeometry args={[1.18, 0.24, 0.08]} />
            <meshStandardMaterial color={'#d8efd7'} metalness={0.28} roughness={0.48} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.82, -0.58, 0.28]}>
            <boxGeometry args={[0.42, 0.18, 0.08]} />
            <meshStandardMaterial color={'#f3d9a9'} metalness={0.28} roughness={0.5} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.7, 0.54, 0.22]}>
            <boxGeometry args={[0.22, 0.22, 0.1]} />
            <meshStandardMaterial color={'#f3d9a9'} metalness={0.5} roughness={0.36} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.7, -0.14, 0.22]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color={'#f3d9a9'} metalness={0.5} roughness={0.36} />
          </mesh>
        </>
      )}

      {tool.id === 'data' && (
        <>
          <mesh castShadow receiveShadow position={[0, 1.06, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.26, 18]} />
            <meshStandardMaterial color={metal} metalness={0.96} roughness={0.12} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.96, 0.96, 0.3, 18]} />
            <meshStandardMaterial color={metal} metalness={0.96} roughness={0.12} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
            <cylinderGeometry args={[1.16, 1.16, 0.32, 18]} />
            <meshStandardMaterial color={metal} metalness={0.96} roughness={0.12} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.42, 0]}>
            <cylinderGeometry args={[1.32, 1.32, 0.38, 18]} />
            <meshStandardMaterial color={metal} metalness={0.96} roughness={0.12} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.9, 0]}>
            <cylinderGeometry args={[1.48, 1.48, 0.3, 18]} />
            <meshStandardMaterial color={metal} metalness={0.96} roughness={0.12} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.14, 0.18]}>
            <boxGeometry args={[1.85, 0.12, 0.12]} />
            <meshStandardMaterial color={'#f2ddbb'} metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.72, 0.66, 0.12]}>
            <boxGeometry args={[0.12, 1.52, 0.12]} />
            <meshStandardMaterial color={'#f2ddbb'} metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.72, 0.66, 0.12]}>
            <boxGeometry args={[0.12, 1.52, 0.12]} />
            <meshStandardMaterial color={'#f2ddbb'} metalness={0.55} roughness={0.35} />
          </mesh>
        </>
      )}
    </group>
  )
}

function ToolGroup({ tool, active, onClick }) {
  const groupRef = useRef(null)

  return <ToolMesh tool={tool} active={active} onClick={onClick} groupRef={groupRef} />
}

function LampLight({ tool, active, hovered, color }) {
  const lightRef = useRef(null)
  const glowRef = useRef(null)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const surge = hovered ? 1 + Math.sin(time * 80 + tool.position[0]) * 0.8 + Math.sin(time * 160 + tool.position[0]) * 0.4 : 0
    const flicker = hovered
      ? 0.7 + Math.sin(time * 42 + tool.position[0]) * 0.9 + Math.sin(time * 120 + tool.position[0]) * 0.6
      : 0.6 + Math.sin(time * 10 + tool.position[0]) * 0.12
    const intensity = (active || hovered ? 14 : 8) + flicker * 4 + surge * 4

    if (lightRef.current) {
      lightRef.current.intensity = intensity
    }

    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = hovered ? 4.2 : active ? 2.5 : 1.8
    }
  })

  return (
    <group position={[tool.position[0], 3.2, -2.95]}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.95, 0.18, 0.42]} />
        <meshStandardMaterial color="#dfe8f2" metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh ref={glowRef} position={[0, -0.12, 0.02]}>
        <boxGeometry args={[0.7, 0.08, 0.28]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={8} distance={9} decay={2} position={[0, -0.15, 0.2]} />
    </group>
  )
}

export function ToolShowcase({
  navItems = defaultNavItems,
  toolConfig = defaultToolConfig,
  slotSpacing = 2.7,
  initialActiveId = defaultToolConfig[0].id,
  backgroundColor = '#050505',
}) {
  const [activeId, setActiveId] = useState(initialActiveId)
  const [hoveredId, setHoveredId] = useState(null)
  const tools = useMemo(() => buildTools(toolConfig, slotSpacing), [toolConfig, slotSpacing])

  return (
    <main className="app-shell" aria-label="Three centered 3D tool buttons">
      <nav className="top-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.id || item.label}
            href={item.href}
            className={`nav-link ${hoveredId === item.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredId(item.id || item.label)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(item.id || item.label)}
            onBlur={() => setHoveredId(null)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="tool-stage">
        <Canvas camera={{ position: [0, 0, 8], fov: 35 }} shadows>
          <color attach="background" args={[backgroundColor]} />
          <ambientLight intensity={1.4} />
          <directionalLight position={[3, 4, 5]} intensity={2.6} color="#ffffff" castShadow />
          <spotLight position={[-4, 5, 4]} intensity={1.8} angle={0.5} penumbra={1} castShadow />

          <mesh position={[0, 0, -4.2]} receiveShadow>
            <boxGeometry args={[20, 12, 0.5]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.15} />
          </mesh>

          {[...Array(12)].map((_, rowIndex) =>
            Array.from({ length: 18 }).map((__, colIndex) => {
              const x = -8 + colIndex * 0.94 + (rowIndex % 2 ? 0.47 : 0)
              const y = -5 + rowIndex * 0.86
              const brickHeight = 0.62 + ((colIndex + rowIndex) % 4) * 0.1 + (rowIndex % 2 ? 0.12 : 0)
              const brickWidth = 0.72 + ((colIndex * 7 + rowIndex * 11) % 5) * 0.13
              const isDark = (rowIndex + colIndex) % 2 === 0

              return (
                <mesh key={`brick-${rowIndex}-${colIndex}`} position={[x, y, -3.92]} castShadow receiveShadow>
                  <boxGeometry args={[brickWidth, brickHeight, 0.22]} />
                  <meshStandardMaterial color={isDark ? '#2c2c2c' : '#232323'} roughness={0.95} metalness={0.12} />
                </mesh>
              )
            }),
          )}

          <mesh position={[0, -0.1, -1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[7.5, 64]} />
            <shadowMaterial opacity={0.26} />
          </mesh>

          {tools.map((tool, index) => {
            const glowColor = ['#ffd1a0', '#d4f1ff', '#ffe0b0'][index] || '#ffd1a0'
            const isHovered = hoveredId === tool.id
            const isActive = activeId === tool.id

            return (
              <LampLight
                key={tool.id}
                tool={tool}
                color={glowColor}
                active={isActive}
                hovered={isHovered}
              />
            )
          })}

          {tools.map((tool) => (
            <ToolGroup
              key={tool.id}
              tool={tool}
              active={activeId === tool.id}
              onClick={() => setActiveId(tool.id)}
            />
          ))}

          <ContactShadows position={[0, -3.2, 0]} opacity={0.5} scale={12} blur={2.4} far={8} />
        </Canvas>
      </div>
    </main>
  )
}

export default function App() {
  return <ToolShowcase />
}
