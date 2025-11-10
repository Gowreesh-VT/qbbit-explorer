import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface QuantumChannelProps {
  eveEnabled: boolean;
  photonProgress?: number;
}

const QuantumChannel = ({ eveEnabled, photonProgress = 0 }: QuantumChannelProps) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  // Create curved path for quantum channel
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4, 0, 0),
      new THREE.Vector3(-2, 0.2, 0),
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(2, 0.2, 0),
      new THREE.Vector3(4, 0, 0),
    ]);
  }, []);

  const points = curve.getPoints(100);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    if (pulseRef.current && photonProgress > 0) {
      const position = curve.getPoint(photonProgress);
      pulseRef.current.position.copy(position);
      pulseRef.current.scale.setScalar(0.1 + Math.sin(state.clock.elapsedTime * 5) * 0.05);
    }
  });

  return (
    <group>
      {/* Main quantum channel line */}
      <Line
        points={points}
        color={eveEnabled ? "#ef4444" : "#22d3ee"}
        lineWidth={2}
        transparent
        opacity={0.4}
      />

      {/* Glowing effect */}
      <Line
        points={points}
        color={eveEnabled ? "#ef4444" : "#22d3ee"}
        lineWidth={4}
        transparent
        opacity={0.1}
      />

      {/* Pulse effect */}
      {photonProgress > 0 && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
};

export default QuantumChannel;