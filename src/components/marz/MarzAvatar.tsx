'use client'

import * as React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface MarzAvatarProps {
  isListening?: boolean
  isProcessing?: boolean
  isSpeaking?: boolean
  size?: number
  onClick?: () => void
}

function AvatarCore({ isListening, isProcessing, isSpeaking }: { isListening: boolean; isProcessing: boolean; isSpeaking: boolean }) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  const glowRef = React.useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = React.useState(false)
  
  // Color states
  const idleColor = new THREE.Color('#6366f1') // Indigo
  const listeningColor = new THREE.Color('#ef4444') // Red
  const processingColor = new THREE.Color('#3b82f6') // Blue
  const speakingColor = new THREE.Color('#10b981') // Green
  
  // Determine current color based on state
  const targetColor = isListening
    ? listeningColor
    : isProcessing
    ? processingColor
    : isSpeaking
    ? speakingColor
    : idleColor
  
  // Animate color transition
  useFrame((state, delta) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      // Smooth color transition
      material.color.lerp(targetColor, delta * 2)
      
      // Subtle rotation
      meshRef.current.rotation.y += delta * 0.2
      meshRef.current.rotation.x += delta * 0.1
      
      // Pulse effect based on state
      const time = state.clock.elapsedTime
      if (isListening) {
        // Fast pulse when listening
        meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.05)
      } else if (isProcessing) {
        // Medium pulse when processing
        meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.03)
      } else if (isSpeaking) {
        // Wave-like pulse when speaking
        meshRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.04)
      } else {
        // Gentle breathing when idle
        meshRef.current.scale.setScalar(1 + Math.sin(time) * 0.02)
      }
    }
    
    if (glowRef.current && glowRef.current.material) {
      // Glow intensity based on state
      const baseGlow = hovered ? 1.5 : 1.0
      const stateGlow = isListening || isProcessing || isSpeaking ? 1.3 : 1.0
      glowRef.current.scale.setScalar(baseGlow * stateGlow)
      const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial
      glowMaterial.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })
  
  return (
    <group>
      {/* Core sphere - the main avatar */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={idleColor}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={idleColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Outer glow layer */}
      <mesh ref={glowRef} scale={1.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={targetColor}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Orbiting particles */}
      <Sparkles
        count={50}
        scale={2.5}
        size={2}
        speed={0.4}
        opacity={0.5}
        color={targetColor}
      />
    </group>
  )
}

function Scene({ isListening, isProcessing, isSpeaking }: { isListening: boolean; isProcessing: boolean; isSpeaking: boolean }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Avatar core */}
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <AvatarCore
          isListening={isListening}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
        />
      </Float>
      
      {/* Camera controls - disabled for avatar (no user interaction needed) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
    </>
  )
}

export default function MarzAvatar({
  isListening = false,
  isProcessing = false,
  isSpeaking = false,
  size = 80,
  onClick,
}: MarzAvatarProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
      title={
        isListening
          ? 'Listening...'
          : isProcessing
          ? 'Processing...'
          : isSpeaking
          ? 'Speaking...'
          : 'Click to chat with MARZ'
      }
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="!bg-transparent"
      >
        <Scene
          isListening={isListening}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
        />
      </Canvas>
      
      {/* State indicator text */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 whitespace-nowrap">
        {isListening ? 'Listening' : isProcessing ? 'Thinking' : isSpeaking ? 'Speaking' : 'MARZ'}
      </div>
    </div>
  )
}
