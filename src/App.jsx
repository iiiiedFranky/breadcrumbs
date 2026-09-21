import { useEffect, useMemo, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const defaultObjects = [
  {
    id: 'silver-a',
    label: 'A',
    colorA: '#f0f3f7',
    colorB: '#8a939d',
    glow: 'rgba(180, 193, 207, 0.75)',
    radius: 86,
    orbitRadius: 150,
    angularVelocity: 0.013,
    baseAngle: 0.6,
    vx: 1.5,
    vy: 1.1,
  },
  {
    id: 'silver-b',
    label: 'B',
    colorA: '#e7edf3',
    colorB: '#636d79',
    glow: 'rgba(207, 219, 233, 0.8)',
    radius: 96,
    orbitRadius: 240,
    angularVelocity: 0.011,
    baseAngle: 2.5,
    vx: 1.9,
    vy: 1.4,
  },
  {
    id: 'silver-c',
    label: 'C',
    colorA: '#f8fafc',
    colorB: '#7d8691',
    glow: 'rgba(200, 210, 221, 0.8)',
    radius: 74,
    orbitRadius: 290,
    angularVelocity: 0.0095,
    baseAngle: 4.2,
    vx: 1.25,
    vy: 1.8,
  },
]

function MetalSphereButton({ sphere, active, onSelect, viewport }) {
  const size = sphere.radius * 2
  return (
    <button
      type="button"
      className={`metal-sphere ${active ? 'is-active' : ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${clamp(sphere.x, 0, viewport.width - size)}px`,
        top: `${clamp(sphere.y, 0, viewport.height - size)}px`,
        '--sphere-color-a': sphere.colorA,
        '--sphere-color-b': sphere.colorB,
        '--sphere-glow': sphere.glow,
      }}
      onClick={() => onSelect(sphere.id)}
      aria-label={`Select ${sphere.label}`}
      aria-pressed={active}
    >
      <span className="metal-label">{sphere.label}</span>
    </button>
  )
}

export function PlasmicSphereCluster({
  spheres = defaultObjects,
  initialActiveId = defaultObjects[0]?.id ?? '',
  className = '',
  onSelect,
}) {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })
  const [activeId, setActiveId] = useState(initialActiveId)
  const [motionSpheres, setMotionSpheres] = useState(() =>
    spheres.map((sphere, index) => ({
      ...sphere,
      x: viewport.width / 2 + Math.cos(sphere.baseAngle + index) * sphere.orbitRadius,
      y: viewport.height / 2 + Math.sin(sphere.baseAngle + index) * sphere.orbitRadius,
    })),
  )
  const frameRef = useRef(0)

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const tick = () => {
      setMotionSpheres((current) => {
        const next = current.map((sphere) => {
          const centerX = viewport.width / 2
          const centerY = viewport.height / 2
          const dx = centerX - sphere.x
          const dy = centerY - sphere.y
          const distance = Math.hypot(dx, dy) || 1
          const tangentX = -dy / distance
          const tangentY = dx / distance
          const orbitPull = 0.18 + sphere.angularVelocity * 18

          let nextX = sphere.x + sphere.vx + tangentX * sphere.angularVelocity * 120 + (dx / distance) * orbitPull
          let nextY = sphere.y + sphere.vy + tangentY * sphere.angularVelocity * 120 + (dy / distance) * orbitPull
          let nextVx = sphere.vx * 0.995
          let nextVy = sphere.vy * 0.995

          const maxX = viewport.width - sphere.radius * 2
          const maxY = viewport.height - sphere.radius * 2

          if (nextX <= 0 || nextX >= maxX) {
            nextVx *= -1
            nextX = clamp(nextX, 0, maxX)
          }

          if (nextY <= 0 || nextY >= maxY) {
            nextVy *= -1
            nextY = clamp(nextY, 0, maxY)
          }

          const angle = Math.atan2(nextY - centerY, nextX - centerX) + sphere.angularVelocity
          const orbitX = centerX + Math.cos(angle) * sphere.orbitRadius
          const orbitY = centerY + Math.sin(angle) * sphere.orbitRadius

          const jitterX = Math.sin(angle * 2.4 + sphere.baseAngle) * 10
          const jitterY = Math.cos(angle * 1.8 + sphere.baseAngle) * 10

          return {
            ...sphere,
            x: clamp(orbitX + jitterX, 0, maxX),
            y: clamp(orbitY + jitterY, 0, maxY),
            vx: nextVx,
            vy: nextVy,
          }
        })

        const minimumGap = 24

        for (let i = 0; i < next.length; i += 1) {
          for (let j = i + 1; j < next.length; j += 1) {
            const a = next[i]
            const b = next[j]
            const dx = b.x - a.x
            const dy = b.y - a.y
            const requiredDistance = a.radius + b.radius + minimumGap
            const distanceSq = dx * dx + dy * dy

            if (distanceSq < requiredDistance * requiredDistance) {
              const distance = Math.sqrt(distanceSq) || 0.0001
              const nx = dx / distance
              const ny = dy / distance
              const overlap = (requiredDistance - distance) / 2

              a.x -= nx * overlap
              a.y -= ny * overlap
              b.x += nx * overlap
              b.y += ny * overlap

              const rvx = b.vx - a.vx
              const rvy = b.vy - a.vy
              const separatingVelocity = rvx * nx + rvy * ny

              if (separatingVelocity < 0) {
                const impulse = -separatingVelocity * 0.7
                a.vx -= impulse * nx
                a.vy -= impulse * ny
                b.vx += impulse * nx
                b.vy += impulse * ny
              }
            }
          }
        }

        return next
      })

      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameRef.current)
  }, [viewport.height, viewport.width])

  const handleSelection = (sphereId) => {
    setActiveId(sphereId)
    onSelect?.(sphereId)
  }

  return (
    <div className={`scene-shell ${className}`.trim()} aria-label="Rotating metallic sphere buttons">
      {motionSpheres.map((sphere) => (
        <MetalSphereButton
          key={sphere.id}
          sphere={sphere}
          active={activeId === sphere.id}
          viewport={viewport}
          onSelect={handleSelection}
        />
      ))}
    </div>
  )
}

export default function App() {
  return (
    <main className="app-shell">
      <div className="ambient-glow" aria-hidden="true" />
      <PlasmicSphereCluster />
    </main>
  )
}
