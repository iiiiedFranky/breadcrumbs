import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'

const defaultToolConfig = [
  {
    id: 'wrench',
    label: 'Wrench',
    color: '#c88d4d',
    speed: 1.15,
    drift: [0.34, 0.2, 0.16],
    rotationBias: -0.9,
  },
  {
    id: 'hammer',
    label: 'Hammer',
    color: '#7fa37a',
    speed: 1.4,
    drift: [0.28, 0.24, 0.14],
    rotationBias: 0.25,
  },
  {
    id: 'screwdriver',
    label: 'Screwdriver',
    color: '#d7af89',
    speed: 1.8,
    drift: [0.22, 0.18, 0.12],
    rotationBias: 0.8,
  },
]

const defaultNavItems = [
  { label: 'Wrench', href: '#wrench' },
  { label: 'Hammer', href: '#hammer' },
  { label: 'Screwdriver', href: '#screwdriver' },
]

const buildTools = (toolConfig, slotSpacing = 2.7) =>
  toolConfig.map((tool, index) => ({
    ...tool,
    position: [index === 1 ? 0 : (index - 1) * slotSpacing, 0, 0],
  }))

function ToolMesh({ tool, active, onClick, groupRef }) {
  const metal = useMemo(
    () => ({
      wrench: '#c78552',
      hammer: '#99ae8d',
      screwdriver: '#d6b18c',
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
      {tool.id === 'wrench' && (
        <>
          <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, 0.7]}>
            <boxGeometry args={[1.1, 0.22, 0.18]} />
            <meshStandardMaterial color={metal} metalness={0.94} roughness={0.18} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.92, 0.18, 0]} rotation={[0, 0, 0.7]}>
            <boxGeometry args={[0.44, 0.5, 0.16]} />
            <meshStandardMaterial color={metal} metalness={0.94} roughness={0.18} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.95, -0.18, 0]} rotation={[0, 0, -0.7]}>
            <boxGeometry args={[0.44, 0.5, 0.16]} />
            <meshStandardMaterial color={metal} metalness={0.94} roughness={0.18} />
          </mesh>
          <mesh castShadow receiveShadow position={[1.2, 0.52, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.32, 0.18, 0.18]} />
            <meshStandardMaterial color={metal} metalness={0.94} roughness={0.18} />
          </mesh>
          <mesh castShadow receiveShadow position={[-1.16, -0.54, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.32, 0.18, 0.18]} />
            <meshStandardMaterial color={metal} metalness={0.94} roughness={0.18} />
          </mesh>
        </>
      )}

      {tool.id === 'hammer' && (
        <>
          <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, 0.12]}>
            <cylinderGeometry args={[0.13, 0.13, 2.05, 16]} />
            <meshStandardMaterial color={'#d6c3a5'} metalness={0.45} roughness={0.4} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.96, 0.2, 0]}>
            <boxGeometry args={[0.8, 0.68, 0.7]} />
            <meshStandardMaterial color={metal} metalness={0.96} roughness={0.22} />
          </mesh>
          <mesh castShadow receiveShadow position={[1.38, 0.2, 0]}>
            <boxGeometry args={[0.42, 0.86, 0.86]} />
            <meshStandardMaterial color={metal} metalness={0.96} roughness={0.2} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.95, 0.2, 0]} rotation={[0, 0, 0.06]}>
            <boxGeometry args={[0.38, 0.25, 0.9]} />
            <meshStandardMaterial color={'#b9d4bd'} metalness={0.8} roughness={0.2} />
          </mesh>
        </>
      )}

      {tool.id === 'screwdriver' && (
        <>
          <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.18, 0.18, 2.2, 18]} />
            <meshStandardMaterial color={'#d5b392'} metalness={0.78} roughness={0.26} />
          </mesh>
          <mesh castShadow receiveShadow position={[1.45, 0, 0]} rotation={[0, 0, 0.12]}>
            <cylinderGeometry args={[0.3, 0.3, 0.9, 20]} />
            <meshStandardMaterial color={'#c4a582'} metalness={0.76} roughness={0.24} />
          </mesh>
          <mesh castShadow receiveShadow position={[2.06, 0, 0]} rotation={[0, 0, 0.08]}>
            <coneGeometry args={[0.18, 0.5, 20]} />
            <meshStandardMaterial color={'#d9c9b3'} metalness={0.86} roughness={0.16} />
          </mesh>
          <mesh castShadow receiveShadow position={[-1.05, 0, 0]}>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            <meshStandardMaterial color={'#9a7b65'} metalness={0.7} roughness={0.34} />
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

export function ToolShowcase({
  navItems = defaultNavItems,
  toolConfig = defaultToolConfig,
  slotSpacing = 2.7,
  initialActiveId = defaultToolConfig[0].id,
  backgroundColor = '#050505',
}) {
  const [activeId, setActiveId] = useState(initialActiveId)
  const tools = useMemo(() => buildTools(toolConfig, slotSpacing), [toolConfig, slotSpacing])

  return (
    <main className="app-shell" aria-label="Three centered 3D tool buttons">
      <nav className="top-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} className="nav-link">
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
