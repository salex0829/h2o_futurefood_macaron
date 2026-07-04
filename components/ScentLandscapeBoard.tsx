"use client";

import { useState, useMemo } from "react";
import { SurveyAnswer } from "@/types/survey";
import { getLayoutPositions } from "@/lib/landscapeLayout";

// ── Canvas dimensions ────────────────────────────────────────────────────────
const W = 820;
const H = 480;

// ── Watercolor shape renderer ─────────────────────────────────────────────────
// Each shape renders as an SVG primitive; the caller layers multiple copies
// at different scales and blur levels to create the watercolor effect.
function ShapeEl({ type, s }: { type: string; s: number }) {
  switch (type) {
    case "circle":   return <circle r={s} />;
    case "oval":     return <ellipse rx={s * 1.55} ry={s * 0.64} />;
    case "square":   return <rect x={-s} y={-s} width={s * 2} height={s * 2} />;
    case "triangle": {
      const h = s * 0.87, h2 = s * 0.5;
      return <polygon points={`0,${-s} ${h},${h2} ${-h},${h2}`} />;
    }
    case "hexagon": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return `${s * Math.cos(a)},${s * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} />;
    }
    case "star": {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? s : s * 0.42;
        return `${r * Math.cos(a)},${r * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} />;
    }
    case "crystal":
      return <polygon points={`0,${-s} ${s * 0.56},0 0,${s} ${-s * 0.56},0`} />;
    case "ring":
      return <circle r={s} fill="none" strokeWidth={s * 0.3} />;
    case "drop":
      return (
        <path d={`M 0,${-s} C ${s * 0.75},${-s * 0.4} ${s * 0.75},${s * 0.35} 0,${s * 0.6}
                  C ${-s * 0.75},${s * 0.35} ${-s * 0.75},${-s * 0.4} 0,${-s} Z`} />
      );
    case "wave":
      return (
        <path d={`M ${-s * 1.4},${s * 0.2} Q ${-s * 0.7},${-s * 0.7} 0,${s * 0.1}
                  Q ${s * 0.7},${s * 0.8} ${s * 1.4},${s * 0.1}
                  L ${s * 1.4},${s * 0.55} Q ${s * 0.7},${s * 1.2} 0,${s * 0.55}
                  Q ${-s * 0.7},${-s * 0.1} ${-s * 1.4},${s * 0.55} Z`} />
      );
    case "cloud":
      return (
        <path d={`M ${-s * 0.2},${s * 0.45}
                  C ${-s * 0.2},${s * 0.7} ${s * 0.2},${s * 0.7} ${s * 0.2},${s * 0.45}
                  C ${s * 0.55},${s * 0.5} ${s * 0.85},${s * 0.15} ${s * 0.6},${-s * 0.15}
                  C ${s * 0.75},${-s * 0.6} ${s * 0.25},${-s * 0.75} 0,${-s * 0.45}
                  C ${-s * 0.2},${-s * 0.8} ${-s * 0.85},${-s * 0.65} ${-s * 0.65},${-s * 0.15}
                  C ${-s},${-s * 0.05} ${-s},${s * 0.5} ${-s * 0.2},${s * 0.45} Z`} />
      );
    case "leaf":
      return (
        <path d={`M 0,${-s} C ${s * 0.85},${-s * 0.3} ${s * 0.85},${s * 0.3} 0,${s}
                  C ${-s * 0.85},${s * 0.3} ${-s * 0.85},${-s * 0.3} 0,${-s} Z`} />
      );
    case "flower": {
      const n = 5;
      const d = Array.from({ length: n }, (_, i) => {
        const a  = (i * 2 * Math.PI) / n - Math.PI / 2;
        const na = ((i + 0.5) * 2 * Math.PI) / n - Math.PI / 2;
        const [px, py] = [s * 0.55 * Math.cos(a),  s * 0.55 * Math.sin(a)];
        const [tx, ty] = [s * 0.3  * Math.cos(na), s * 0.3  * Math.sin(na)];
        return `M 0,0 C ${tx},${ty} ${px},${py} ${px * 1.85},${py * 1.85} C ${px},${py} ${-tx},${-ty} 0,0`;
      }).join(" ");
      return <path d={d} />;
    }
    case "feather":
      return (
        <path d={`M 0,${-s} C ${s * 0.45},${-s * 0.5} ${s * 0.55},${s * 0.2} 0,${s}
                  C ${-s * 0.15},${s * 0.1} ${-s * 0.08},${-s * 0.6} 0,${-s} Z`} />
      );
    case "spiral": {
      const steps = 60, turns = 2.2;
      const d = Array.from({ length: steps + 1 }, (_, i) => {
        const t = i / steps;
        const a = t * turns * 2 * Math.PI - Math.PI / 2;
        const r = t * s;
        return `${i === 0 ? "M" : "L"} ${r * Math.cos(a)},${r * Math.sin(a)}`;
      }).join(" ");
      return <path d={d} fill="none" strokeWidth={Math.max(2, s * 0.12)} strokeLinecap="round" />;
    }
    case "radiation": {
      const n = 8;
      return (
        <>
          {Array.from({ length: n }, (_, i) => {
            const a = (i * 2 * Math.PI) / n;
            return (
              <line key={i}
                x1={s * 0.18 * Math.cos(a)} y1={s * 0.18 * Math.sin(a)}
                x2={s * Math.cos(a)}        y2={s * Math.sin(a)}
                strokeWidth={Math.max(2, s * 0.1)} strokeLinecap="round" />
            );
          })}
        </>
      );
    }
    case "grid":
      return (
        <>
          {([-s * 0.5, 0, s * 0.5] as number[]).flatMap((v, i) => [
            <line key={`v${i}`} x1={v} y1={-s} x2={v} y2={s} strokeWidth={Math.max(1.5, s * 0.09)} />,
            <line key={`h${i}`} x1={-s} y1={v} x2={s} y2={v} strokeWidth={Math.max(1.5, s * 0.09)} />,
          ])}
        </>
      );
    case "grain":
      return (
        <>
          {Array.from({ length: 13 }, (_, i) => {
            const a = i * 2.1;
            const r = s * (0.22 + (i % 4) * 0.2);
            return <circle key={i} cx={r * Math.cos(a)} cy={r * Math.sin(a)} r={Math.max(2, s * 0.14)} />;
          })}
        </>
      );
    case "bubble":
      return <circle r={s} fill="none" strokeWidth={Math.max(2, s * 0.14)} />;
    case "fragment":
      return (
        <>
          <rect x={-s * 0.7}  y={-s * 0.7}  width={s * 0.5}  height={s * 0.28} transform="rotate(22)" />
          <rect x={s * 0.1}   y={-s * 0.55}  width={s * 0.6}  height={s * 0.22} transform="rotate(-12)" />
          <rect x={-s * 0.35} y={s * 0.28}   width={s * 0.5}  height={s * 0.24} transform="rotate(42)" />
          <circle cx={s * 0.5} cy={s * 0.45} r={s * 0.19} />
        </>
      );
    case "layer":
      return (
        <>
          <rect x={-s * 1.2}  y={-s * 0.68} width={s * 2.4}  height={s * 0.27} rx={s * 0.06} />
          <rect x={-s * 0.95} y={-s * 0.28} width={s * 1.9}  height={s * 0.27} rx={s * 0.06} />
          <rect x={-s * 1.28} y={s * 0.12}  width={s * 2.56} height={s * 0.27} rx={s * 0.06} />
          <rect x={-s * 0.85} y={s * 0.52}  width={s * 1.7}  height={s * 0.27} rx={s * 0.06} />
        </>
      );
    case "angle":
      return (
        <path d={`M ${-s * 0.9},${-s * 0.5} L ${-s * 0.9},${s * 0.5} L ${s * 0.9},${s * 0.5}`}
          fill="none" strokeWidth={Math.max(2.5, s * 0.19)} strokeLinecap="round" strokeLinejoin="round" />
      );
    case "line":
      return <rect x={-s * 1.3} y={-s * 0.11} width={s * 2.6} height={s * 0.22} rx={s * 0.1} />;
    case "thread":
      return (
        <path d={`M ${-s * 1.4},${s * 0.2} Q ${-s * 0.7},${-s * 0.5} 0,0 Q ${s * 0.7},${s * 0.5} ${s * 1.4},${-s * 0.2}`}
          fill="none" strokeWidth={Math.max(2, s * 0.11)} strokeLinecap="round" />
      );
    case "stain":
      return (
        <path d={`M ${s * 0.1},${-s * 0.9}
                  C ${s * 0.7},${-s * 0.55} ${s * 1.1},${-s * 0.1} ${s * 0.9},${s * 0.42}
                  C ${s * 0.62},${s * 0.9} ${-s * 0.05},${s} ${-s * 0.6},${s * 0.7}
                  C ${-s},${s * 0.35} ${-s * 0.9},${-s * 0.22} ${-s * 0.5},${-s * 0.65}
                  C ${-s * 0.1},${-s * 0.98} ${s * 0.1},${-s * 0.9} ${s * 0.1},${-s * 0.9} Z`} />
      );
    case "undulation":
      return (
        <path d={`M ${-s * 1.2},${s * 0.25}
                  Q ${-s * 0.6},${-s * 0.65} 0,${s * 0.1}
                  Q ${s * 0.6},${s * 0.75} ${s * 1.2},${-s * 0.05}
                  L ${s * 1.2},${s * 0.45}
                  Q ${s * 0.6},${s * 1.1} 0,${s * 0.5}
                  Q ${-s * 0.6},${-s * 0.05} ${-s * 1.2},${s * 0.65} Z`} />
      );
    case "mist":  return <ellipse rx={s * 1.65} ry={s * 0.82} />;
    case "smoke": return <ellipse rx={s * 0.72} ry={s * 1.15} />;
    case "blur":
    default:      return <circle r={s} />;
  }
}

// ── Legend row ────────────────────────────────────────────────────────────────
function LegendRow({
  answer,
  index,
  onClick,
}: {
  answer: SurveyAnswer;
  index: number;
  onClick: () => void;
}) {
  const { sensedColor, sensedShape, scentName } = answer.answers;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-stone-50 transition-colors text-left w-full"
    >
      <span className="text-[10px] font-mono text-stone-300 w-5 flex-shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: sensedColor.hex, opacity: 0.8 }}
      />
      <span className="flex-1 min-w-0">
        <span className="block text-xs text-stone-600 truncate">{scentName}</span>
        <span className="block text-[9px] font-mono text-stone-400 truncate mt-0.5">
          {sensedShape.label}　·　{sensedColor.label}
        </span>
      </span>
      <span className="text-[9px] font-mono text-stone-300 flex-shrink-0 hidden sm:block">
        {answer.participantId}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
type Props = {
  answers: SurveyAnswer[];
  macaronLabel?: string;          // shown as section header in ALL mode
  idPrefix?: string;              // unique prefix for SVG filter IDs
  onSelect: (answer: SurveyAnswer) => void;
  fullscreen?: boolean;           // fill parent container, hide legend
};

export default function ScentLandscapeBoard({
  answers,
  macaronLabel,
  idPrefix = "wc",
  onSelect,
  fullscreen = false,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const hoveredAnswer = answers.find((a) => a.id === hoveredId) ?? null;

  // Compute repulsion-aware positions (re-runs only when answers change)
  const layout = useMemo(() => getLayoutPositions(answers, W, H), [answers]);

  // Unique filter ID helpers (avoid ID collision when multiple boards on page)
  const fxl = `${idPrefix}-xl`;
  const flg = `${idPrefix}-lg`;
  const fmd = `${idPrefix}-md`;
  const fsm = `${idPrefix}-sm`;

  return (
    <div className={fullscreen ? "h-full flex flex-col" : "mb-12"}>
      {/* Section label (ALL mode) */}
      {macaronLabel && !fullscreen && (
        <p className="text-[10px] font-mono text-stone-300 tracking-[0.3em] uppercase mb-3">
          {macaronLabel}
        </p>
      )}

      {/* SVG canvas */}
      <div
        className={fullscreen
          ? "relative flex-1 overflow-hidden"
          : "relative rounded-2xl overflow-hidden border border-stone-100 shadow-sm"}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => {
          setHoveredId(null);
          setMousePos(null);
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={fullscreen ? "100%" : undefined}
          style={{ display: "block" }}
        >
          <defs>
            {/* Atmospheric outer glow */}
            <filter id={fxl} x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="36" />
            </filter>
            {/* Watercolor outer wash */}
            <filter id={flg} x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
            {/* Watercolor inner form */}
            <filter id={fmd} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            {/* Tight core */}
            <filter id={fsm} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          {/* Paper background */}
          <rect width={W} height={H} fill="#FDFCF8" />

          {/* Subtle inner frame — gives the "cut paper" feel without being a chart */}
          <rect
            x={20} y={16} width={W - 40} height={H - 32}
            fill="none" stroke="#EDE8E0" strokeWidth={0.6}
          />

          {/* Axis labels */}
          <text x={32} y={H / 2} textAnchor="start" fontSize={10} fontFamily="monospace" fill="#C8C2BC" style={{ pointerEvents: "none", userSelect: "none" }}>自然的</text>
          <text x={W - 32} y={H / 2} textAnchor="end" fontSize={10} fontFamily="monospace" fill="#C8C2BC" style={{ pointerEvents: "none", userSelect: "none" }}>都市的</text>
          <text x={W / 2} y={28} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#C8C2BC" style={{ pointerEvents: "none", userSelect: "none" }}>近い</text>
          <text x={W / 2} y={H - 18} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#C8C2BC" style={{ pointerEvents: "none", userSelect: "none" }}>遠い</text>

          {/* Shapes */}
          {answers.map((answer, i) => {
            const { x, y }   = layout[answer.id] ?? { x: 0, y: 0 };
            const color       = answer.answers.sensedColor.hex;
            const type        = answer.answers.sensedShape.type;
            const name        = answer.answers.scentName;
            const num         = String(i + 1).padStart(2, "0");
            const isHovered   = hoveredId === answer.id;

            return (
              <g
                key={answer.id}
                transform={`translate(${x},${y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredId(answer.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelect(answer)}
              >
                {/* Layer 1 — atmospheric glow (very soft, wide) */}
                <g
                  fill={color} stroke={color}
                  opacity={isHovered ? 0.16 : 0.10}
                  filter={`url(#${fxl})`}
                >
                  <ShapeEl type={type} s={65} />
                </g>

                {/* Layer 2 — watercolor wash */}
                <g
                  fill={color} stroke={color}
                  opacity={isHovered ? 0.32 : 0.22}
                  filter={`url(#${flg})`}
                >
                  <ShapeEl type={type} s={40} />
                </g>

                {/* Layer 3 — main form */}
                <g
                  fill={color} stroke={color}
                  opacity={isHovered ? 0.55 : 0.42}
                  filter={`url(#${fmd})`}
                >
                  <ShapeEl type={type} s={24} />
                </g>

                {/* Layer 4 — tight core */}
                <g
                  fill={color} stroke={color}
                  opacity={isHovered ? 0.80 : 0.62}
                  filter={`url(#${fsm})`}
                >
                  <ShapeEl type={type} s={14} />
                </g>

                {/* Invisible hit area for consistent hover/click across all shape types */}
                <circle r={44} fill="transparent" />

                {/* Number annotation */}
                <text
                  y={-50}
                  textAnchor="middle"
                  fontSize={8.5}
                  fontFamily="monospace"
                  fontWeight={isHovered ? "700" : "500"}
                  fill={isHovered ? "#5A5450" : "#A09890"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {num}
                </text>

                {/* Scent name */}
                <text
                  y={52}
                  textAnchor="middle"
                  fontSize={7.5}
                  fontFamily="sans-serif"
                  fill={isHovered ? "#6B6560" : "#B5AFA9"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {name.length > 10 ? name.slice(0, 10) + "…" : name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating hover tooltip */}
        {hoveredAnswer && mousePos && (
          <div
            className="fixed z-50 pointer-events-none bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 border border-stone-100 max-w-[200px]"
            style={{ left: mousePos.x + 14, top: mousePos.y - 50 }}
          >
            <p className="text-xs font-semibold text-stone-700 leading-tight mb-1">
              {hoveredAnswer.answers.scentName}
            </p>
            <p className="text-[10px] text-stone-400 leading-snug">
              {hoveredAnswer.answers.sensedColor.label}
              <br />
              {hoveredAnswer.answers.sensedShape.label}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      {!fullscreen && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-0.5">
          {answers.map((answer, i) => (
            <LegendRow
              key={answer.id}
              answer={answer}
              index={i}
              onClick={() => onSelect(answer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
