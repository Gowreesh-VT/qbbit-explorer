import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import PhotonParticle from "./PhotonParticle";
import QuantumChannel from "./QuantumChannel";
import EveAvatar from "./EveAvatar";
import BlochSphere from "./BlochSphere";
import { PhotonData } from "@/hooks/useBB84Simulation";

interface PhotonSceneProps {
  photons: PhotonData[];
  currentPhotonIndex: number;
  eveEnabled?: boolean;
  showBlochSphere?: boolean;
}


const PhotonScene = ({ photons, currentPhotonIndex, eveEnabled = false, showBlochSphere = true }: PhotonSceneProps) => {
  const currentPhoton = currentPhotonIndex >= 0 ? photons[currentPhotonIndex] : null;
  const isEveIntercepting = currentPhoton?.eveIntercepted || false;

  return (
    <div className="w-full h-[600px] bg-background rounded-lg overflow-hidden border border-border">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
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
        <QuantumChannel 
          eveEnabled={eveEnabled} 
          photonProgress={currentPhotonIndex >= 0 ? (currentPhotonIndex / photons.length) : 0}
        />

        {/* Eve Avatar */}
        {eveEnabled && (
          <EveAvatar isIntercepting={isEveIntercepting} />
        )}

        {/* Bloch Sphere - show for current photon */}
        {showBlochSphere && currentPhoton && (
          <BlochSphere
            polarization={currentPhoton.polarization}
            position={[0, -1.5, 0]}
            showMeasurement={true}
            measurementBasis={currentPhoton.bobBasis}
          />
        )}

        {/* Photons */}
        {photons.map((photon, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const x = -2 + col * 1.3;
          const y = 1.5 - row * 0.8;
          
          return (
            <PhotonParticle
              key={photon.id}
              position={[x, y, 0]}
              polarization={photon.polarization}
              basesMatch={photon.basesMatch}
              delay={index * 0.2}
              isActive={index <= currentPhotonIndex}
            />
          );
        })}

        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};

export default PhotonScene;
