"use client";

import dynamic from "next/dynamic";
import { Macaron } from "@/lib/macarons";

// ssr: false is mandatory — Three.js / WebGL cannot run on the server.
const MacaronCanvas = dynamic(() => import("./MacaronCanvas"), {
  ssr: false,
  loading: () => (
    <div className="h-[260px] min-h-[260px] w-full rounded-[28px] bg-[#F2EDE4]" />
  ),
});

type Props = {
  macaron: Macaron;
  macaronIndex: number;
  totalMacarons: number;
  onStart: () => void;
};

export default function MacaronIntroScreen({
  macaron,
  macaronIndex,
  totalMacarons,
  onStart,
}: Props) {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        {/* Macaron progress */}
        <p className="text-xs text-stone-400 font-mono tracking-[0.3em] uppercase mb-8">
          Macaron {macaronIndex + 1} / {totalMacarons}
        </p>

        {/* 3D canvas — key forces full unmount/remount when macaron changes */}
        <div className="mb-8">
          <MacaronCanvas key={macaron.id} macaronId={macaron.id} disabled={false} />
        </div>

        {/* Macaron ID */}
        <p className="text-[11px] font-mono text-stone-400 tracking-widest uppercase mb-2">
          {macaron.id}
        </p>

        {/* Description */}
        <p className="text-sm text-stone-500 leading-relaxed mb-10">
          {macaron.description}
        </p>

        {/* Start button */}
        <button
          onClick={onStart}
          className="bg-stone-700 text-white text-sm font-medium px-12 py-3.5 rounded-full shadow hover:bg-stone-600 active:scale-95 transition-all tracking-widest"
        >
          このマカロンを評価する
        </button>
      </div>
    </div>
  );
}
