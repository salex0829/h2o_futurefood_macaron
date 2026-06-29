"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  isAnswered: boolean;
  onClick: () => void;
};

const SHELL_COLOR = new THREE.Color("#F8F4EF");
const CREAM_COLOR = new THREE.Color("#EFE8D8");
const SHELL_ANSWERED = new THREE.Color("#C8C4BE");
const CREAM_ANSWERED = new THREE.Color("#B8B4AE");

export default function ThreeMacaronCard({ position, isAnswered, onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  const shellColor = isAnswered ? SHELL_ANSWERED : SHELL_COLOR;
  const creamColor = isAnswered ? CREAM_ANSWERED : CREAM_COLOR;

  // Hover: float up, scale up
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = hovered ? position[1] + 0.18 : position[1];
    const targetScale = hovered ? 1.06 : 1;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      delta * 6
    );
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 6)
    );
    // Auto-rotate only if not answered
    if (!isAnswered) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={isAnswered ? undefined : onClick}
      onPointerEnter={() => !isAnswered && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Top shell — flattened sphere */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.52, 40, 40, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial
          color={shellColor}
          roughness={0.45}
          metalness={0.0}
        />
      </mesh>

      {/* Bottom shell — mirrored */}
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.52, 40, 40, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial
          color={shellColor}
          roughness={0.45}
          metalness={0.0}
        />
      </mesh>

      {/* Cream / ganache layer */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.14, 48]} />
        <meshStandardMaterial
          color={creamColor}
          roughness={0.6}
          metalness={0.0}
        />
      </mesh>

      {/* "Pied" (feet) rings on each shell edge */}
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.5, 0.045, 12, 48]} />
        <meshStandardMaterial color={shellColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[0.5, 0.045, 12, 48]} />
        <meshStandardMaterial color={shellColor} roughness={0.5} />
      </mesh>
    </group>
  );
}
