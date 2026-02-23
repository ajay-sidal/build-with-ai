'use client'

import * as React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Sparkles, Sphere, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface MarzAvatarProps {
  isListening?: boolean
  isProcessing?: boolean
  isSpeaking?: boolean
  size?: number
  onClick?: () => void
}

function HumanoidRobot({ isListening, isProcessing, isSpeaking }: { isListening: boolean; isProcessing: boolean; isSpeaking: boolean }) {
  const headRef = React.useRef<THREE.Mesh>(null)
  const bodyRef = React.useRef<THREE.Mesh>(null)
  const timerRef = React.useRef(0)
  
  // Color states
  const idleColor = new THREE.Color('#6366f1') // Indigo
  const listeningColor = new THREE.Color('#ef4444') // Red
  const processingColor = new THREE.Color('#3b82f6') // Blue
  const speakingColor = new THREE.Color('#10b981') // Green
  
  const targetColor = isListening
    ? listeningColor
    : isProcessing
    ? processingColor
    : isSpeaking
    ? speakingColor
    : idleColor

  useFrame((state, delta) => {
    timerRef.current += delta
    
    // Head animation
    if (headRef.current) {
      // Gentle floating head movement
      headRef.current.position.y = Math.sin(timerRef.current * 0.5) * 0.1
      
      // Subtle head rotation
      headRef.current.rotation.y = Math.sin(timerRef.current * 0.3) * 0.1
      headRef.current.rotation.x = Math.sin(timerRef.current * 0.4) * 0.05
      
      // Color transition
      const headMaterial = headRef.current.material as THREE.MeshStandardMaterial
      headMaterial.color.lerp(targetColor, delta * 2)
      headMaterial.emissive.lerp(targetColor, delta * 2)
      
      // Pulse effect based on state
      const time = state.clock.elapsedTime
      if (isListening) {
        headRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.03)
      } else if (isProcessing) {
        headRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02)
      } else if (isSpeaking) {
        headRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.025)
      } else {
        headRef.current.scale.setScalar(1 + Math.sin(time) * 0.01)
      }
    }
    
    // Body animation
    if (bodyRef.current) {
      const bodyMaterial = bodyRef.current.material as THREE.MeshStandardMaterial
      bodyMaterial.color.lerp(targetColor, delta * 2)
      bodyMaterial.emissive.lerp(targetColor, delta * 2)
      
      // Gentle breathing
      bodyRef.current.scale.y = 1 + Math.sin(timerRef.current) * 0.02
    }
  })
  
  return (
    <group>
      {/* Head - Futuristic Robot Design */}
      <mesh ref={headRef} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <MeshTransmissionMaterial
          color={idleColor}
          emissive={idleColor}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
          thickness={0.5}
          backside
        />
      </mesh>
      
      {/* Face Plate - Glowing Visor */}
      <mesh position={[0, 0.65, 0.35]}>
        <boxGeometry args={[0.25, 0.12, 0.05]} />
        <meshStandardMaterial
          color={targetColor}
          emissive={targetColor}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Eyes - Glowing LED */}
      <mesh position={[-0.12, 0.68, 0.38]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0.12, 0.68, 0.38]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      
      {/* Body - Sleek Robot Torso */}
      <mesh ref={bodyRef} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 32]} />
        <MeshTransmissionMaterial
          color={idleColor}
          emissive={idleColor}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          thickness={0.8}
          backside
        />
      </mesh>
      
      {/* Chest Core - Glowing Energy Center */}
      <mesh position={[0, -0.2, 0.3]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color={targetColor}
          emissive={targetColor}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      
      {/* Shoulder Spheres */}
      <mesh position={[-0.4, 0.1, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color={targetColor} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.4, 0.1, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color={targetColor} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Orbiting Particles */}
      <Sparkles
        count={30}
        scale={1.5}
        size={3}
        speed={0.3}
        opacity={0.6}
        color={targetColor}
      />
      
      {/* Background Stars */}
      <Stars radius={50} depth={30} count={3000} factor={3} saturation={0.5} fade speed={0.5} />
    </group>
  )
}

function Scene({ isListening, isProcessing, isSpeaking }: { isListening: boolean; isProcessing: boolean; isSpeaking: boolean }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6366f1" />
      
      {/* Robot Avatar */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.3}
      >
        <HumanoidRobot
          isListening={isListening}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
        />
      </Float>
    </>
  )
}

export default function MarzAvatar({
  isListening = false,
  isProcessing = false,
  isSpeaking = false,
  size = 100,
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
        camera={{ position: [0, 0, 3], fov: 50 }}
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
