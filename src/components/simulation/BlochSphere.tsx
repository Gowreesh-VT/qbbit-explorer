import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { Polarization } from "@/hooks/useBB84Simulation";

interface BlochSphereProps {
  polarization: Polarization;
  position?: [number, number, number];
  showMeasurement?: boolean;
  measurementBasis?: "rectilinear" | "diagonal";
}

const BlochSphere = ({ polarization, position = [0, 0, 0], showMeasurement, measurementBasis }: BlochSphereProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Map polarization to Bloch sphere coordinates
  const getStateVector = (pol: Polarization): [number, number, number] => {
    switch (pol) {
      case "vertical":
        return [0, 0, 1]; // |0⟩ - North pole
      case "horizontal":
        return [0, 0, -1]; // |1⟩ - South pole
      case "diagonal":
        return [1, 0, 0]; // |+⟩ - X axis
      case "antidiagonal":
        return [-1, 0, 0]; // |−⟩ - Negative X axis
    }
  };

  const getMeasurementAxis = (basis?: "rectilinear" | "diagonal"): [number, number, number][] => {
    if (!basis) return [];
    if (basis === "rectilinear") {
      return [[0, 0, 1], [0, 0, -1]]; // Z axis
    } else {
      return [[1, 0, 0], [-1, 0, 0]]; // X axis
    }
  };

  const stateVector = getStateVector(polarization);
  const measurementAxes = getMeasurementAxis(measurementBasis);

  return (
    <group ref={groupRef} position={position}>
      {/* Bloch Sphere */}
      <Sphere args={[0.5, 32, 32]}>
        <meshPhongMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Wireframe */}
      <Sphere args={[0.5, 16, 16]}>
        <meshBasicMaterial 
          color="#60a5fa" 
          wireframe 
          transparent 
          opacity={0.3}
        />
      </Sphere>

      {/* Axes */}
      <Line
        points={[[0, 0, -0.6], [0, 0, 0.6]]}
        color="#60a5fa"
        lineWidth={2}
        transparent
        opacity={0.5}
      />
      <Line
        points={[[-0.6, 0, 0], [0.6, 0, 0]]}
        color="#a855f7"
        lineWidth={2}
        transparent
        opacity={0.5}
      />
      <Line
        points={[[0, -0.6, 0], [0, 0.6, 0]]}
        color="#10b981"
        lineWidth={2}
        transparent
        opacity={0.5}
      />

      {/* Axis Labels */}
      <Text position={[0, 0, 0.7]} fontSize={0.1} color="#60a5fa">
        |0⟩
      </Text>
      <Text position={[0, 0, -0.7]} fontSize={0.1} color="#60a5fa">
        |1⟩
      </Text>
      <Text position={[0.7, 0, 0]} fontSize={0.1} color="#a855f7">
        |+⟩
      </Text>
      <Text position={[-0.7, 0, 0]} fontSize={0.1} color="#a855f7">
        |−⟩
      </Text>

      {/* State Vector */}
      <Line
        points={[[0, 0, 0], [stateVector[0] * 0.5, stateVector[1] * 0.5, stateVector[2] * 0.5]]}
        color="#22d3ee"
        lineWidth={3}
      />
      <mesh position={[stateVector[0] * 0.5, stateVector[1] * 0.5, stateVector[2] * 0.5]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
      </mesh>

      {/* Measurement Axes */}
      {showMeasurement && measurementAxes.map((axis, i) => (
        <group key={i}>
          <Line
            points={[[0, 0, 0], [axis[0] * 0.6, axis[1] * 0.6, axis[2] * 0.6]]}
            color="#ef4444"
            lineWidth={2}
            transparent
            opacity={0.7}
            dashed
            dashSize={0.05}
            gapSize={0.03}
          />
        </group>
      ))}
    </group>
  );
};

export default BlochSphere;