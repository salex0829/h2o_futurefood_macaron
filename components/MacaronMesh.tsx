"use client";

import { useRef, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  isAnswered: boolean;
  hoverRef: MutableRefObject<boolean>;
};

// ── Colour palette ──────────────────────────────────────────────
// Unanswered: warm ivory / cream tones
const SHELL_COLOR = "#F4EDE3"; // warm ivory shell
const CREAM_COLOR = "#FFF8F0"; // near-white filling, slightly brighter
const PIE_COLOR   = "#E2D5C3"; // slightly deeper ivory for the pied rim

// Answered (greyed-out, legacy path)
const SHELL_DONE = "#CCCAC5";
const CREAM_DONE = "#B8B4AE";

export default function MacaronMesh({ isAnswered, hoverRef }: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  const shell = isAnswered ? SHELL_DONE : SHELL_COLOR;
  const cream = isAnswered ? CREAM_DONE : CREAM_COLOR;
  const pie   = isAnswered ? SHELL_DONE : PIE_COLOR;

  useFrame((state) => {
    if (!groupRef.current || isAnswered) return;

    const t = state.clock.elapsedTime;

    // Absolute-time rotation — no frame-rate drift
    groupRef.current.rotation.y = t * 0.22;

    // Gentle sine float
    groupRef.current.position.y = Math.sin(t * 1.1) * 0.035;
  });

  // ── Shared material props ────────────────────────────────────
  // meshPhysicalMaterial adds a subtle clearcoat sheen without looking plastic.
  const shellMatProps = {
    roughness: 0.88,
    metalness: 0 as const,
    clearcoat: 0.08,
    clearcoatRoughness: 0.9,
  };

  // ── Geometry notes ───────────────────────────────────────────
  // Top / bottom shells: sphereGeometry with Y-scale [1, 0.38, 1]
  //   radius 0.56 × scaleY 0.38 → dome height ≈ 0.213 units
  //   thetaLength 0.52π opens just past the equator so the rim sits
  //   at local y ≈ –0.013 → world y ≈ 0.087 (shell at pos y=0.10)
  //
  // Cream cylinder: radius 0.52, height 0.14 → top/bottom face at ±0.07
  //
  // Pied torus: at y ≈ ±0.08 (between cream face and shell rim),
  //   tube 0.052 gives a visible raised ring without overwhelming the form.

  return (
    <group ref={groupRef}>

      {/* ── Top shell — flattened dome ─────────────────────── */}
      <mesh
        position={[0, 0.10, 0]}
        scale={[1, 0.38, 1]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.56, 52, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshPhysicalMaterial color={shell} {...shellMatProps} />
      </mesh>

      {/* ── Bottom shell — mirrored ────────────────────────── */}
      <mesh
        position={[0, -0.10, 0]}
        scale={[1, 0.38, 1]}
        rotation={[Math.PI, 0, 0]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.56, 52, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshPhysicalMaterial color={shell} {...shellMatProps} />
      </mesh>

      {/* ── Cream / filling layer ─────────────────────────── */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.52, 0.14, 60]} />
        <meshPhysicalMaterial
          color={cream}
          roughness={0.82}
          metalness={0}
          clearcoat={0.06}
          clearcoatRoughness={0.9}
        />
      </mesh>

      {/* ── Pied — top ring ───────────────────────────────── */}
      {/* Sits at the shell-cream boundary to simulate the macaron foot */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.52, 0.052, 14, 56]} />
        <meshPhysicalMaterial
          color={pie}
          roughness={0.94}
          metalness={0}
        />
      </mesh>

      {/* ── Pied — bottom ring ────────────────────────────── */}
      <mesh position={[0, -0.08, 0]}>
        <torusGeometry args={[0.52, 0.052, 14, 56]} />
        <meshPhysicalMaterial
          color={pie}
          roughness={0.94}
          metalness={0}
        />
      </mesh>

    </group>
  );
}
