"use client";

import { MacaronId } from "@/types/survey";

const CREAM_COLORS: Record<MacaronId, string> = {
  "UMEDA-BC4000":    "#7A263A",
  "TAKARAZUKA-1887": "#FFF8F0",
  "KAWANISHI-2026":  "#8B5E3C",
};

type MacaronModelProps = {
  macaronId?: MacaronId;
  disabled?: boolean;
};

export default function MacaronModel({ macaronId, disabled = false }: MacaronModelProps) {
  const shellColor = disabled ? "#CFCFCF" : "#E9DED0";
  const creamColor = disabled
    ? "#BDBDBD"
    : (macaronId ? CREAM_COLORS[macaronId] : "#FFF8F0");
  const pieColor   = disabled ? "#BDBDBD" : "#DCCBBA";

  return (
    <group position={[0, 0, 0]} scale={[1.25, 1.25, 1.25]}>
      {/* 上シェル */}
      <mesh position={[0, 0.24, 0]} scale={[1.35, 0.34, 1.35]}>
        <sphereGeometry args={[0.75, 64, 32]} />
        <meshStandardMaterial color={shellColor} roughness={0.85} metalness={0} />
      </mesh>

      {/* 上ピエ */}
      <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.055, 12, 96]} />
        <meshStandardMaterial color={pieColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* クリーム層 */}
      <mesh position={[0, 0, 0]} scale={[1.08, 0.16, 1.08]}>
        <cylinderGeometry args={[0.72, 0.72, 0.28, 96]} />
        <meshStandardMaterial color={creamColor} roughness={0.75} metalness={0} />
      </mesh>

      {/* 下ピエ */}
      <mesh position={[0, -0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.055, 12, 96]} />
        <meshStandardMaterial color={pieColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* 下シェル */}
      <mesh position={[0, -0.24, 0]} scale={[1.35, 0.34, 1.35]}>
        <sphereGeometry args={[0.75, 64, 32]} />
        <meshStandardMaterial color={shellColor} roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
}
