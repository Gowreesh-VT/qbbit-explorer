import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Polarization } from "@/hooks/useBB84Simulation";

interface PhotonParticleProps {
  position: [number, number, number];
  polarization: Polarization;
  basesMatch: boolean;
  delay: number;
  isActive: boolean;
}

const PhotonParticle = ({ 
  position, 
  polarization, 
  basesMatch, 
  delay,
  isActive 
}: PhotonParticleProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const getColor = () => {
    if (!isActive) return "#444444";
    return basesMatch ? "#22c55e" : "#ef4444"; // green or red
  };

  const getRotation = (): [number, number, number] => {
    switch (polarization) {
      case "vertical":
        return [0, 0, 0];
      case "horizontal":
        return [0, 0, Math.PI / 2];
      case "diagonal":
        return [0, 0, Math.PI / 4];
      case "antidiagonal":
        return [0, 0, -Math.PI / 4];
      default:
        return [0, 0, 0];
    }
  };

  useFrame((state, delta) => {
    timeRef.current += delta;
    
    if (meshRef.current && glowRef.current && timeRef.current > delay) {
      // Pulsing animation
      const scale = 1 + Math.sin(timeRef.current * 3) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
      glowRef.current.scale.set(scale * 1.5, scale * 1.5, scale * 1.5);

      // Rotate based on polarization
      meshRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group position={position} rotation={getRotation()}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={getColor()}
          transparent
          opacity={isActive ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Core photon */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={isActive ? 2 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Polarization indicator - small arrow */}
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={isActive ? 1.5 : 0.3}
        />
      </mesh>
    </group>
  );
};

export default PhotonParticle;
