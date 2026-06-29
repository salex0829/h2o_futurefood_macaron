"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Macaron } from "@/lib/macarons";

const MacaronScene = dynamic(() => import("./MacaronScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-stone-50 to-amber-50/30 animate-pulse" />
  ),
});

type Props = {
  macaron: Macaron;
  isAnswered: boolean;
  onClick: () => void;
};

export default function MacaronCardPanel({ macaron, isAnswered, onClick }: Props) {
  const hoverRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (isAnswered) return;
    hoverRef.current = true;
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    hoverRef.current = false;
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={isAnswered ? undefined : onClick}
      className={[
        "rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col",
        isAnswered
          ? "opacity-45 border-stone-100 bg-stone-50 cursor-not-allowed"
          : "bg-white border-stone-100 cursor-pointer",
        !isAnswered && isHovered
          ? "-translate-y-1 shadow-xl shadow-stone-200/60"
          : "shadow-sm shadow-stone-100",
      ].join(" ")}
    >
      {/* 3D canvas area */}
      <div
        className="w-full relative"
        style={{ height: 220 }}
      >
        <MacaronScene isAnswered={isAnswered} hoverRef={hoverRef} />

        {/* Answered overlay badge */}
        {isAnswered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-stone-500/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
              評価済み
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-100 mx-4" />

      {/* Card text area */}
      <div className="px-5 py-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-stone-400 mb-1 tracking-widest uppercase">
            {macaron.id}
          </p>
          <p className="text-xs text-stone-500 leading-relaxed">
            {macaron.description}
          </p>
        </div>
        <span
          className={[
            "shrink-0 mt-0.5 text-[10px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap",
            isAnswered
              ? "bg-stone-100 text-stone-400"
              : "bg-rose-50 text-rose-400",
          ].join(" ")}
        >
          {isAnswered ? "評価済み" : "未評価"}
        </span>
      </div>
    </div>
  );
}
