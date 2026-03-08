'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Line, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// --- Agent Components ---

function SittingAgent({ position, rotation = [0, 0, 0], color = "#64748b" }: { position: [number, number, number], rotation?: [number, number, number], color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Typing animation (bobbing)
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5 + position[0]) * 0.02;
      // Looking around slightly
      groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[2]) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Chair */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.2, 4, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
    </group>
  );
}

function StandingAgent({ position, rotation = [0, 0, 0], color = "#64748b" }: { position: [number, number, number], rotation?: [number, number, number], color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Shifting weight animation
      groupRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime + position[2]) * 0.05;
      groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.4, 4, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
    </group>
  );
}

function MovingAgent({ curve, color = "#3b82f6", speed = 0.5, offset = 0 }: { curve: THREE.CatmullRomCurve3, color?: string, speed?: number, offset?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current && curve) {
      const t = ((state.clock.elapsedTime * speed + offset) % 10) / 10;
      const pos = curve.getPointAt(t);
      ref.current.position.copy(pos);
      // Add a little floating bounce
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 10 + offset) * 0.05;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.15]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
}

// --- Environment Components ---

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
    </mesh>
  );
}

function Desk({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Table top */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#d4a373" roughness={0.6} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.9, 0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.9, 0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Monitors */}
      <mesh position={[-0.4, 0.8, -0.2]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.4, 0.8, -0.2]} rotation={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Agents */}
      <SittingAgent position={[-0.4, 0, 0.3]} rotation={[0, Math.PI, 0]} color="#3b82f6" />
      <SittingAgent position={[0.4, 0, 0.3]} rotation={[0, Math.PI, 0]} color="#10b981" />
    </group>
  );
}

function DeskCluster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Desk position={[0, 0, 1]} />
      <Desk position={[0, 0, -1]} rotation={[0, Math.PI, 0]} />
      <Desk position={[2.2, 0, 1]} />
      <Desk position={[2.2, 0, -1]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}

function GlassRoom({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Floor area */}
      <mesh position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 1.5, 3]} castShadow>
        <boxGeometry args={[6, 4, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.5, -3]} castShadow>
        <boxGeometry args={[6, 4, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </mesh>
      <mesh position={[3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[6, 4, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </mesh>
      <mesh position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[6, 4, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </mesh>
      {/* Frames */}
      <mesh position={[0, 3.5, 3]}>
        <boxGeometry args={[6, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 3.5, -3]}>
        <boxGeometry args={[6, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[3, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-3, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Meeting Table */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Agents in meeting */}
      <SittingAgent position={[0, 0, 1]} rotation={[0, Math.PI, 0]} color="#8b5cf6" />
      <SittingAgent position={[0, 0, -1]} rotation={[0, 0, 0]} color="#f59e0b" />
      <SittingAgent position={[1, 0, 0]} rotation={[0, -Math.PI/2, 0]} color="#ef4444" />
      <SittingAgent position={[-1, 0, 0]} rotation={[0, Math.PI/2, 0]} color="#3b82f6" />
    </group>
  );
}

function CommandWall({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[8, 4, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 2, 0.26]}>
        <planeGeometry args={[7.6, 3.6]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Glowing data on screen */}
      <mesh position={[-2, 2.5, 0.27]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[1, 1.5, 0.27]}>
        <planeGeometry args={[4, 1.5]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      
      {/* Agents looking at wall */}
      <StandingAgent position={[-2, 0, 2]} rotation={[0, Math.PI, 0]} color="#f59e0b" />
      <StandingAgent position={[1, 0, 2.5]} rotation={[0, Math.PI * 0.9, 0]} color="#8b5cf6" />
    </group>
  );
}

function GlowingNode({ position, color = "#3b82f6", active = false }: { position: [number, number, number], color?: string, active?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current && active) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 2 : 0.5} toneMapped={false} />
    </mesh>
  );
}

function WorkflowPath({ points, color = "#3b82f6" }: { points: [number, number, number][], color?: string }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), [points]);
  
  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={3}
        dashed={false}
      />
      {/* Add some nodes along the path */}
      {points.map((p, i) => (
        <GlowingNode key={i} position={p} color={color} active={i % 2 === 0} />
      ))}
      
      {/* Moving Agents (Data Packets / Task Runners) */}
      <MovingAgent curve={curve} color={color} speed={0.5} offset={0} />
      <MovingAgent curve={curve} color={color} speed={0.5} offset={3} />
      <MovingAgent curve={curve} color={color} speed={0.5} offset={7} />
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      <Floor />
      
      {/* Desks */}
      <DeskCluster position={[-8, 0, -5]} />
      <DeskCluster position={[-8, 0, 2]} />
      <DeskCluster position={[-8, 0, 9]} />
      
      <DeskCluster position={[2, 0, 8]} />
      <DeskCluster position={[8, 0, 8]} />
      
      {/* Central Command Wall */}
      <CommandWall position={[0, 0, 0]} />
      
      {/* Glass Room */}
      <GlassRoom position={[12, 0, -6]} />
      
      {/* Labels */}
      <Text position={[-8, 0.1, -2]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.5} color="#64748b" anchorX="center" anchorY="middle">
        1. ENGINEERING
      </Text>
      <Text position={[5, 0.1, 5]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.5} color="#64748b" anchorX="center" anchorY="middle">
        2. OPERATIONS
      </Text>
      <Text position={[12, 0.1, -1]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.5} color="#64748b" anchorX="center" anchorY="middle">
        3. EXECUTIVE
      </Text>

      {/* Glowing Workflow Paths */}
      <WorkflowPath 
        points={[
          [-8, 0.2, -5],
          [-4, 0.2, -5],
          [-2, 0.2, -2],
          [0, 0.2, 0]
        ]} 
        color="#3b82f6" 
      />
      <WorkflowPath 
        points={[
          [-8, 0.2, 9],
          [-4, 0.2, 9],
          [-2, 0.2, 5],
          [0, 0.2, 2]
        ]} 
        color="#10b981" 
      />
      <WorkflowPath 
        points={[
          [8, 0.2, 8],
          [8, 0.2, 4],
          [4, 0.2, 2],
          [2, 0.2, 0]
        ]} 
        color="#8b5cf6" 
      />
      <WorkflowPath 
        points={[
          [12, 0.2, -6],
          [8, 0.2, -6],
          [4, 0.2, -2],
          [2, 0.2, 0]
        ]} 
        color="#f59e0b" 
      />
      
      {/* Data flow particles (simplified as extra nodes) */}
      <GlowingNode position={[-6, 0.2, -5]} color="#3b82f6" active />
      <GlowingNode position={[-3, 0.2, -3.5]} color="#3b82f6" active />
      <GlowingNode position={[6, 0.2, 6]} color="#8b5cf6" active />
      <GlowingNode position={[10, 0.2, -6]} color="#f59e0b" active />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <OrthographicCamera makeDefault position={[20, 20, 20]} zoom={40} near={-100} far={100} />
      <OrbitControls 
        enableRotate={false} 
        enableZoom={true} 
        enablePan={true} 
        minZoom={20} 
        maxZoom={100}
        target={[0, 0, 0]}
      />
      
      <SceneContent />
      
      <EffectComposer>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
}
