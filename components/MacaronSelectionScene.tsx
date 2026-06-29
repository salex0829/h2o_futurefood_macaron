"use client";

import "@/lib/patchThree";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { MacaronId } from "@/types/survey";
import { MACARONS } from "@/lib/macarons";
import ThreeMacaronCard from "./ThreeMacaronCard";

type Props = {
  answeredIds: MacaronId[];
  onSelect: (id: MacaronId) => void;
  isMobile: boolean;
};

// X positions for 3 macarons: desktop side-by-side, mobile stacked
const POSITIONS_DESKTOP: [number, number, number][] = [
  [-2.6, 0, 0],
  [0, 0, 0],
  [2.6, 0, 0],
];
const POSITIONS_MOBILE: [number, number, number][] = [
  [0, 2.6, 0],
  [0, 0, 0],
  [0, -2.6, 0],
];

export default function MacaronSelectionScene({ answeredIds, onSelect, isMobile }: Props) {
  const positions = isMobile ? POSITIONS_MOBILE : POSITIONS_DESKTOP;
  const canvasHeight = isMobile ? 580 : 340;

  return (
    <div style={{ width: "100%", height: canvasHeight }}>
      <Canvas
        camera={{ position: [0, 0, isMobile ? 8 : 7], fov: 42 }}
        shadows="percentage"
        gl={{ antialias: true }}
      >
        {/* Lights */}
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#e8e0d4" />

        {/* Macarons */}
        {MACARONS.map((macaron, i) => (
          <ThreeMacaronCard
            key={macaron.id}
            position={positions[i]}
            isAnswered={answeredIds.includes(macaron.id)}
            onClick={() => onSelect(macaron.id)}
          />
        ))}

        {/* Ground shadow */}
        <ContactShadows
          position={[0, isMobile ? -3.8 : -0.75, 0]}
          opacity={0.18}
          scale={isMobile ? 8 : 12}
          blur={2.5}
          far={4}
        />

        {/* Environment for realistic reflections */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
