import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import EveAvatar from "./EveAvatar";

interface ChannelVisualizationProps {
  eveEnabled: boolean;
  photonCount: number;
}

const TravelingPhoton = ({ 
  delay, 
  curve, 
  eveEnabled 
}: { 
  delay: number; 
  curve: THREE.CatmullRomCurve3;
  eveEnabled: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);
  const [isIntercepted, setIsIntercepted] = useState(false);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime - delay;
    if (elapsed > 0 && progress < 1) {
      const newProgress = Math.min(progress + delta * 0.15, 1);
      setProgress(newProgress);

      if (meshRef.current) {
        const position = curve.getPoint(newProgress);
        meshRef.current.position.copy(position);

        // Check if Eve intercepts (at midpoint)
        if (eveEnabled && newProgress > 0.48 && newProgress < 0.52 && !isIntercepted) {
          setIsIntercepted(true);
        }
      }
    }
  });

  if (progress === 0) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={isIntercepted ? "#ef4444" : "#22d3ee"}
        emissive={isIntercepted ? "#ef4444" : "#22d3ee"}
        emissiveIntensity={isIntercepted ? 1.5 : 1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const ChannelVisualizationScene = ({ eveEnabled, photonCount }: ChannelVisualizationProps) => {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4, 0, 0),
    new THREE.Vector3(-2, 0.2, 0),
    new THREE.Vector3(0, 0.3, 0),
    new THREE.Vector3(2, 0.2, 0),
    new THREE.Vector3(4, 0, 0),
  ]);

  const points = curve.getPoints(100);

  return (
    <>
      <color attach="background" args={["#0a0a1a"]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[-5, 5, 5]} intensity={1} color="#60a5fa" />
      <pointLight position={[5, 5, 5]} intensity={1} color="#a855f7" />
      
      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Alice (sender) */}
      <group position={[-4, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
        </mesh>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.3}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          Alice
        </Text>
      </group>

      {/* Bob (receiver) */}
      <group position={[4, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
        </mesh>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.3}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
        >
          Bob
        </Text>
      </group>

      {/* Quantum Channel */}
      <Line
        points={points}
        color={eveEnabled ? "#ef4444" : "#22d3ee"}
        lineWidth={2}
        transparent
        opacity={0.4}
      />
      <Line
        points={points}
        color={eveEnabled ? "#ef4444" : "#22d3ee"}
        lineWidth={4}
        transparent
        opacity={0.1}
      />

      {/* Eve Avatar */}
      {eveEnabled && <EveAvatar isIntercepting={true} />}

      {/* Traveling photons */}
      {Array.from({ length: Math.min(photonCount, 20) }).map((_, i) => (
        <TravelingPhoton
          key={i}
          delay={i * 0.5}
          curve={curve}
          eveEnabled={eveEnabled}
        />
      ))}

      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={15}
      />
    </>
  );
};

const ChannelVisualization = ({ eveEnabled, photonCount }: ChannelVisualizationProps) => {
  return (
    <div className="w-full h-[600px] bg-background rounded-lg overflow-hidden border border-border">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ChannelVisualizationScene eveEnabled={eveEnabled} photonCount={photonCount} />
      </Canvas>
    </div>
  );
};

export default ChannelVisualization;
