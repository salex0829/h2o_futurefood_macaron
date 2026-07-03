"use client";

import { useState } from "react";
import { SurveyAnswer } from "@/types/survey";
import ShapeIcon from "./ShapeIcon";

type Props = {
  answers: SurveyAnswer[];
};

type TooltipData = {
  answer: SurveyAnswer;
  x: number;
  y: number;
};

const MAP_W = 600;
const MAP_H = 480;
const PAD = 60;

function answerToXY(answer: SurveyAnswer) {
  const u = answer.answers.urbanity.value; // 1-5
  const i = answer.answers.intimacy.value; // 1-5
  // X: 1(自然) → left, 5(都市) → right
  const x = PAD + ((u - 1) / 4) * (MAP_W - PAD * 2);
  // Y: 1(遠い) → bottom, 5(近い) → top
  const y = MAP_H - PAD - ((i - 1) / 4) * (MAP_H - PAD * 2);
  return { x, y };
}

// Watercolor shape renderer — mirrors ScentLandscapeBoard
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

export default function SensoryMap({ answers }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="w-full max-w-2xl mx-auto block"
        style={{ minWidth: 320 }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <filter id="snry-xl" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <filter id="snry-lg" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="snry-md" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="snry-sm" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Paper background */}
        <rect width={MAP_W} height={MAP_H} fill="#FDFCF8" />

        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map((v) => {
          const gx = PAD + ((v - 1) / 4) * (MAP_W - PAD * 2);
          const gy = MAP_H - PAD - ((v - 1) / 4) * (MAP_H - PAD * 2);
          return (
            <g key={v}>
              <line x1={gx} y1={PAD * 0.5} x2={gx} y2={MAP_H - PAD * 0.5}
                stroke="#e7e5e4" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={PAD * 0.5} y1={gy} x2={MAP_W - PAD * 0.5} y2={gy}
                stroke="#e7e5e4" strokeWidth={1} strokeDasharray="4 4" />
            </g>
          );
        })}

        {/* Axes */}
        <line x1={PAD} y1={MAP_H / 2} x2={MAP_W - PAD} y2={MAP_H / 2}
          stroke="#d6d3d1" strokeWidth={1.5} />
        <line x1={MAP_W / 2} y1={PAD} x2={MAP_W / 2} y2={MAP_H - PAD}
          stroke="#d6d3d1" strokeWidth={1.5} />

        {/* Axis labels */}
        <text x={PAD} y={MAP_H / 2 - 10} textAnchor="middle" fontSize={11} fill="#a8a29e">自然的</text>
        <text x={MAP_W - PAD} y={MAP_H / 2 - 10} textAnchor="middle" fontSize={11} fill="#a8a29e">都市的</text>
        <text x={MAP_W / 2} y={PAD - 8} textAnchor="middle" fontSize={11} fill="#a8a29e">近い</text>
        <text x={MAP_W / 2} y={MAP_H - PAD + 18} textAnchor="middle" fontSize={11} fill="#a8a29e">遠い</text>

        {/* Data points — watercolor style */}
        {answers.map((answer) => {
          const { x, y } = answerToXY(answer);
          const color = answer.answers.sensedColor.hex;
          const type  = answer.answers.sensedShape.type;
          const name  = answer.answers.scentName;

          return (
            <g
              key={answer.id}
              transform={`translate(${x},${y})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                const svgEl = e.currentTarget.closest("svg");
                if (!svgEl) return;
                const rect = svgEl.getBoundingClientRect();
                setTooltip({ answer, x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onMouseMove={(e) => {
                const svgEl = e.currentTarget.closest("svg");
                if (!svgEl) return;
                const rect = svgEl.getBoundingClientRect();
                setTooltip((prev) =>
                  prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null
                );
              }}
            >
              {/* Layer 1 — atmospheric glow */}
              <g fill={color} stroke={color} opacity={0.10} filter="url(#snry-xl)">
                <ShapeEl type={type} s={50} />
              </g>
              {/* Layer 2 — watercolor wash */}
              <g fill={color} stroke={color} opacity={0.22} filter="url(#snry-lg)">
                <ShapeEl type={type} s={32} />
              </g>
              {/* Layer 3 — main form */}
              <g fill={color} stroke={color} opacity={0.42} filter="url(#snry-md)">
                <ShapeEl type={type} s={20} />
              </g>
              {/* Layer 4 — tight core */}
              <g fill={color} stroke={color} opacity={0.65} filter="url(#snry-sm)">
                <ShapeEl type={type} s={12} />
              </g>

              {/* Invisible hit area */}
              <circle r={40} fill="transparent" />

              {/* Scent name */}
              <text
                y={48}
                textAnchor="middle"
                fontSize={8}
                fontFamily="sans-serif"
                fill="#B5AFA9"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {name.length > 10 ? name.slice(0, 10) + "…" : name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-white rounded-2xl shadow-xl border border-stone-100 p-4 text-xs text-stone-600 pointer-events-none"
          style={{
            left: Math.min(tooltip.x + 10, 400),
            top: Math.max(tooltip.y - 10, 0),
            maxWidth: 260,
          }}
        >
          <p className="font-bold text-sm text-stone-950 mb-1">
            {tooltip.answer.answers.scentName}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full border border-stone-200 shrink-0"
              style={{ backgroundColor: tooltip.answer.answers.sensedColor.hex }}
            />
            <span>{tooltip.answer.answers.sensedColor.label}</span>
            <span className="mx-1 text-stone-300">|</span>
            <ShapeIcon
              type={tooltip.answer.answers.sensedShape.type}
              size={16}
              color="#a8a29e"
            />
            <span>{tooltip.answer.answers.sensedShape.label}</span>
          </div>
          <p className="text-stone-500 mb-2 leading-relaxed line-clamp-3">
            {tooltip.answer.answers.memoryText}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Tag label={tooltip.answer.answers.urbanity.label} />
            <Tag label={tooltip.answer.answers.intimacy.label} />
            <Tag label={tooltip.answer.macaronId} mono />
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({ label, mono }: { label: string; mono?: boolean }) {
  return (
    <span
      className={[
        "px-2 py-0.5 rounded-full bg-stone-100 text-stone-500",
        mono ? "font-mono text-[10px]" : "text-[10px]",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
