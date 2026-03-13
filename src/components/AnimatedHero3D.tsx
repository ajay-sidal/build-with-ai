"use client"

import * as React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function RotatingGlobe() {
  const ref = React.useRef<any>(null)
  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.1
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.05
      // subtle mouse parallax
      ref.current.position.x = (mouse.x / 10)
      ref.current.position.y = (mouse.y / 10)
    }
  })
  return (
    <mesh ref={ref} scale={[1.2, 1.2, 1.2]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial metalness={0.4} roughness={0.6} color="#0ea5e9" emissive="#062f4f" emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function AnimatedHero3D({ className = 'h-64 w-full' }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <React.Suspense fallback={null}>
          <RotatingGlobe />
        </React.Suspense>
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  )
}
