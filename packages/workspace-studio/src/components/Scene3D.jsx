import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AGENT_3D_LAYOUT, AGENTS } from "../data";

function AgentFigure({ agentId, isBusy, isActive, isFocused, onClick }) {
  const layout = AGENT_3D_LAYOUT[agentId];
  const ref = useRef(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = layout.position[1] + Math.sin(state.clock.elapsedTime * (isBusy ? 5 : 2) + layout.position[0]) * (isBusy ? 0.03 : 0.015);
  });

  return (
    <group ref={ref} position={layout.position} onClick={onClick}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.2, 4, 16]} />
        <meshStandardMaterial color={layout.color} emissive={layout.color} emissiveIntensity={isBusy ? 0.65 : isActive ? 0.22 : 0.08} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>

      {(isActive || isFocused) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
          <ringGeometry args={[0.22, isFocused ? 0.34 : 0.3, 32]} />
          <meshBasicMaterial color={isFocused ? "#ffffff" : layout.color} transparent opacity={0.9} />
        </mesh>
      )}

      {isBusy && (
        <mesh position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      )}

      <Text position={[0, 1.15, 0]} fontSize={0.12} color={isFocused ? "#ffffff" : "#cbd5e1"} anchorX="center" anchorY="middle">
        {AGENTS[agentId].name.split(" ")[0]}
      </Text>
    </group>
  );
}

function Desk({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>
      <mesh position={[-0.4, 0, 0.3]} castShadow>
        <boxGeometry args={[0.25, 0.4, 0.25]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.4, 0, 0.3]} castShadow>
        <boxGeometry args={[0.25, 0.4, 0.25]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

function MovingNode() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-4, 0.25, 1),
          new THREE.Vector3(0, 0.3, -2),
          new THREE.Vector3(4, 0.25, 1),
          new THREE.Vector3(0, 0.3, 4)
        ],
        true
      ),
    []
  );
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime * 0.08) % 1 + 1) % 1;
    ref.current.position.copy(curve.getPointAt(t));
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.16]} />
      <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
}

function World({ activeMembers, busyAgents, focusedAgent, onAgentClick }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[8, 12, 8]} intensity={2.6} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#e8edf4" />
      </mesh>

      <Desk position={[-3, 0, -1]} />
      <Desk position={[0, 0, 2]} />
      <Desk position={[3, 0, -1]} />

      <mesh position={[0, 1.8, -5]} castShadow>
        <boxGeometry args={[7.5, 3.5, 0.2]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0, 1.8, -4.88]}>
        <planeGeometry args={[7.2, 3.2]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {Object.keys(AGENT_3D_LAYOUT).map((agentId) => (
        <AgentFigure
          key={agentId}
          agentId={agentId}
          isBusy={busyAgents.includes(agentId)}
          isActive={activeMembers.includes(agentId)}
          isFocused={focusedAgent === agentId}
          onClick={() => onAgentClick(agentId)}
        />
      ))}

      <MovingNode />

      <Html position={[0, 4.8, 0]} center>
        <div style={{
          padding: "10px 14px",
          borderRadius: "14px",
          color: "#e2e8f0",
          background: "rgba(15,23,42,0.85)",
          border: "1px solid rgba(148,163,184,0.22)",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontSize: "12px",
          boxShadow: "0 18px 40px rgba(15,23,42,0.25)"
        }}>
          <strong style={{ display: "block", marginBottom: 4 }}>3D Scene Sync</strong>
          Active: {activeMembers.length} | Busy: {busyAgents.length} | Focus: {focusedAgent ? AGENTS[focusedAgent].name.split(" ")[0] : "none"}
        </div>
      </Html>

      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.2} />
      </EffectComposer>
    </>
  );
}

export default function Scene3D({ activeMembers = [], busyAgents = [], focusedAgent = null, onAgentClick }) {
  return (
    <div className="scene-shell">
      <Canvas shadows camera={{ position: [7, 7, 9], fov: 45 }}>
        <World activeMembers={activeMembers} busyAgents={busyAgents} focusedAgent={focusedAgent} onAgentClick={onAgentClick} />
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
