import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface EveAvatarProps {
  isIntercepting: boolean;
}

const EveAvatar = ({ isIntercepting }: EveAvatarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      
      if (isIntercepting) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
        meshRef.current.scale.setScalar(scale);
      }
    }

    if (glowRef.current && isIntercepting) {
      const glowScale = 1.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
      glowRef.current.scale.setScalar(glowScale);
      
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Eve's glow effect when intercepting */}
      {isIntercepting && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Eve's main body */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={isIntercepting ? 1 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Interception warning rings */}
      {isIntercepting && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.55, 32]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
            <ringGeometry args={[0.6, 0.65, 32]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      {/* Eve label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.25}
        color={isIntercepting ? "#ef4444" : "#f87171"}
        anchorX="center"
        anchorY="middle"
      >
        Eve
      </Text>
      
      {isIntercepting && (
        <Text
          position={[0, -1.1, 0]}
          fontSize={0.15}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          INTERCEPTING
        </Text>
      )}
    </group>
  );
};

export default EveAvatar;