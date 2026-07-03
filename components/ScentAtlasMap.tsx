"use client";

import { SurveyAnswer } from "@/types/survey";

// ── Layout constants ─────────────────────────────────────────────────────────
const W  = 900;
const H  = 540;
const ML = 68;        // left margin (Y-axis labels)
const MR = 28;        // right margin
const MT = 38;        // top margin
const MB = 68;        // bottom margin (X-axis labels + legend)
const PW = W - ML - MR;
const PH = H - MT - MB;

// ── Macaron accent colours (for ALL-tab badges) ───────────────────────────────
const MACARON_TAG: Record<string, string> = {
  "UMEDA-BC4000":    "#B05B4A",
  "TAKARAZUKA-1887": "#6A8A5A",
  "KAWANISHI-2026":  "#4A8AA0",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffff;
  return Math.abs(h);
}

function getXY(a: SurveyAnswer): [number, number] {
  const u  = a.answers.urbanity.value;  // 1–5, right=urban
  const im = a.answers.intimacy.value;  // 1–5, top=near

  const nx = (u  - 1) / 4;
  const ny = 1 - (im - 1) / 4;         // inverted: high intimacy → top

  const jx = ((hash(a.participantId + "x") % 10000) / 10000 - 0.5) * 0.1;
  const jy = ((hash(a.id + "y") % 10000) / 10000 - 0.5) * 0.1;

  const px = Math.max(0.06, Math.min(0.94, nx + jx));
  const py = Math.max(0.06, Math.min(0.94, ny + jy));

  return [ML + px * PW, MT + py * PH];
}

// ── Shape renderer ────────────────────────────────────────────────────────────
function ShapeEl({ type, s }: { type: string; s: number }) {
  switch (type) {
    case "circle":   return <circle r={s} />;
    case "oval":     return <ellipse rx={s * 1.55} ry={s * 0.64} />;
    case "square":   return <rect x={-s} y={-s} width={s * 2} height={s * 2} />;
    case "triangle": {
      const h2 = s * 0.87, h3 = s * 0.5;
      return <polygon points={`0,${-s} ${h2},${h3} ${-h2},${h3}`} />;
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
      return <circle r={s} fill="none" strokeWidth={s * 0.28} />;
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
        <path d={`M ${-s * 0.2},${s * 0.45} C ${-s * 0.2},${s * 0.7} ${s * 0.2},${s * 0.7} ${s * 0.2},${s * 0.45}
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
        const [px, py] = [s * 0.55 * Math.cos(a), s * 0.55 * Math.sin(a)];
        const [tx, ty] = [s * 0.3 * Math.cos(na), s * 0.3 * Math.sin(na)];
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
      return <path d={d} fill="none" strokeWidth={Math.max(1.5, s * 0.11)} strokeLinecap="round" />;
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
                strokeWidth={Math.max(1.5, s * 0.1)} strokeLinecap="round" />
            );
          })}
        </>
      );
    }
    case "grid":
      return (
        <>
          {([-s * 0.5, 0, s * 0.5] as number[]).flatMap((v, i) => [
            <line key={`v${i}`} x1={v} y1={-s} x2={v} y2={s} strokeWidth={Math.max(1, s * 0.09)} />,
            <line key={`h${i}`} x1={-s} y1={v} x2={s} y2={v} strokeWidth={Math.max(1, s * 0.09)} />,
          ])}
        </>
      );
    case "grain":
      return (
        <>
          {Array.from({ length: 13 }, (_, i) => {
            const a = i * 2.1;
            const r = s * (0.22 + (i % 4) * 0.2);
            return <circle key={i} cx={r * Math.cos(a)} cy={r * Math.sin(a)} r={Math.max(1.5, s * 0.13)} />;
          })}
        </>
      );
    case "bubble":
      return <circle r={s} fill="none" strokeWidth={Math.max(1.5, s * 0.13)} />;
    case "fragment":
      return (
        <>
          <rect x={-s * 0.7} y={-s * 0.7} width={s * 0.5} height={s * 0.28} transform="rotate(22)" />
          <rect x={s * 0.1}  y={-s * 0.55} width={s * 0.6} height={s * 0.22} transform="rotate(-12)" />
          <rect x={-s * 0.35} y={s * 0.28} width={s * 0.5} height={s * 0.24} transform="rotate(42)" />
          <circle cx={s * 0.5} cy={s * 0.45} r={s * 0.19} />
        </>
      );
    case "layer":
      return (
        <>
          <rect x={-s * 1.2}  y={-s * 0.68} width={s * 2.4}  height={s * 0.26} rx={s * 0.06} />
          <rect x={-s * 0.95} y={-s * 0.28} width={s * 1.9}  height={s * 0.26} rx={s * 0.06} />
          <rect x={-s * 1.28} y={s * 0.12}  width={s * 2.56} height={s * 0.26} rx={s * 0.06} />
          <rect x={-s * 0.85} y={s * 0.52}  width={s * 1.7}  height={s * 0.26} rx={s * 0.06} />
        </>
      );
    case "angle":
      return (
        <path d={`M ${-s * 0.9},${-s * 0.5} L ${-s * 0.9},${s * 0.5} L ${s * 0.9},${s * 0.5}`}
          fill="none" strokeWidth={Math.max(2, s * 0.18)} strokeLinecap="round" strokeLinejoin="round" />
      );
    case "line":
      return <rect x={-s * 1.3} y={-s * 0.11} width={s * 2.6} height={s * 0.22} rx={s * 0.1} />;
    case "thread":
      return (
        <path d={`M ${-s * 1.4},${s * 0.2} Q ${-s * 0.7},${-s * 0.5} 0,0 Q ${s * 0.7},${s * 0.5} ${s * 1.4},${-s * 0.2}`}
          fill="none" strokeWidth={Math.max(1.5, s * 0.1)} strokeLinecap="round" />
      );
    case "stain":
      return (
        <path d={`M ${s * 0.1},${-s * 0.9} C ${s * 0.7},${-s * 0.55} ${s * 1.1},${-s * 0.1} ${s * 0.9},${s * 0.42}
                  C ${s * 0.62},${s * 0.9} ${-s * 0.05},${s} ${-s * 0.6},${s * 0.7}
                  C ${-s},${s * 0.35} ${-s * 0.9},${-s * 0.22} ${-s * 0.5},${-s * 0.65}
                  C ${-s * 0.1},${-s * 0.98} ${s * 0.1},${-s * 0.9} ${s * 0.1},${-s * 0.9} Z`} />
      );
    case "undulation":
      return (
        <path d={`M ${-s * 1.2},${s * 0.25} Q ${-s * 0.6},${-s * 0.65} 0,${s * 0.1}
                  Q ${s * 0.6},${s * 0.75} ${s * 1.2},${-s * 0.05}
                  L ${s * 1.2},${s * 0.45} Q ${s * 0.6},${s * 1.1} 0,${s * 0.5}
                  Q ${-s * 0.6},${-s * 0.05} ${-s * 1.2},${s * 0.65} Z`} />
      );
    case "mist":  return <ellipse rx={s * 1.6}  ry={s * 0.82} />;
    case "smoke": return <ellipse rx={s * 0.72} ry={s * 1.12} />;
    case "blur":
    default:      return <circle r={s} />;
  }
}

// ── Main component ────────────────────────────────────────────────────────────
type Props = {
  answers: SurveyAnswer[];
  activeTab: string;
};

export default function ScentAtlasMap({ answers, activeTab }: Props) {
  const isAll = activeTab === "ALL";

  // Grid line positions (25%, 50%, 75%)
  const gridT = [0.25, 0.5, 0.75];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Scent Atlas Map"
    >
      <defs>
        {/* Atmospheric halo — very large, soft */}
        <filter id="atm" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        {/* Main shape — moderate blur */}
        <filter id="mid" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* Clip to plot area */}
        <clipPath id="plot-clip">
          <rect x={ML} y={MT} width={PW} height={PH} />
        </clipPath>
      </defs>

      {/* ── Paper background ─────────────────────────────────────────────── */}
      <rect width={W} height={H} fill="#FDFCF8" />

      {/* ── Plot border ──────────────────────────────────────────────────── */}
      <rect x={ML} y={MT} width={PW} height={PH} fill="none" stroke="#E2DAD0" strokeWidth={1} />

      {/* Corner crosshair marks */}
      {([[ML, MT], [ML + PW, MT], [ML, MT + PH], [ML + PW, MT + PH]] as [number, number][]).map(
        ([cx, cy], i) => (
          <g key={i} stroke="#C8BFB2" strokeWidth={1}>
            <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} />
            <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} />
          </g>
        )
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      {gridT.map((t, i) => (
        <g key={i} stroke="#EAE3D8" strokeWidth={1} strokeDasharray="3 4">
          <line x1={ML + t * PW} y1={MT}      x2={ML + t * PW} y2={MT + PH} />
          <line x1={ML}          y1={MT + t * PH} x2={ML + PW}    y2={MT + t * PH} />
        </g>
      ))}
      {/* Centre lines — slightly more visible */}
      <line x1={ML + PW * 0.5} y1={MT}      x2={ML + PW * 0.5} y2={MT + PH} stroke="#D8D0C6" strokeWidth={1} />
      <line x1={ML}             y1={MT + PH * 0.5} x2={ML + PW}    y2={MT + PH * 0.5} stroke="#D8D0C6" strokeWidth={1} />

      {/* ── Axis tick numbers ────────────────────────────────────────────── */}
      {[1, 2, 3, 4, 5].map((v) => {
        const nx = (v - 1) / 4;
        const ny = 1 - (v - 1) / 4;
        return (
          <g key={v} fontFamily="monospace" fontSize={8} fill="#BDB5AB">
            {/* X-axis tick */}
            <line x1={ML + nx * PW} y1={MT + PH} x2={ML + nx * PW} y2={MT + PH + 5} stroke="#C8C0B8" strokeWidth={1} />
            <text x={ML + nx * PW} y={MT + PH + 14} textAnchor="middle">{v}</text>
            {/* Y-axis tick */}
            <line x1={ML - 5} y1={MT + ny * PH} x2={ML} y2={MT + ny * PH} stroke="#C8C0B8" strokeWidth={1} />
            <text x={ML - 10} y={MT + ny * PH} textAnchor="end" dominantBaseline="middle">{v}</text>
          </g>
        );
      })}

      {/* ── Axis labels ──────────────────────────────────────────────────── */}
      {/* X — bottom */}
      <text x={ML}           y={MT + PH + 32} fontSize={8.5} fontFamily="monospace" fill="#A89E92" textAnchor="start">自然的</text>
      <text x={ML + PW * 0.5} y={MT + PH + 32} fontSize={8.5} fontFamily="monospace" fill="#A89E92" textAnchor="middle">URBANITY</text>
      <text x={ML + PW}      y={MT + PH + 32} fontSize={8.5} fontFamily="monospace" fill="#A89E92" textAnchor="end">都市的</text>
      {/* Y — left (rotated) */}
      <text
        x={-(MT + PH * 0.5)} y={18}
        fontSize={8.5} fontFamily="monospace" fill="#A89E92" textAnchor="middle"
        transform="rotate(-90)"
      >
        INTIMACY
      </text>
      <text x={ML - 10} y={MT + 4}      fontSize={8.5} fontFamily="monospace" fill="#A89E92" textAnchor="end">近い</text>
      <text x={ML - 10} y={MT + PH + 4} fontSize={8.5} fontFamily="monospace" fill="#A89E92" textAnchor="end">遠い</text>

      {/* ── Metadata corners ─────────────────────────────────────────────── */}
      <text x={ML + 4}      y={MT - 10} fontSize={8} fontFamily="monospace" fill="#C8C0B8">n={answers.length}</text>
      <text x={ML + PW - 4} y={MT - 10} fontSize={8} fontFamily="monospace" fill="#C8C0B8" textAnchor="end">
        {isAll ? "ALL MACARONS" : activeTab}
      </text>

      {/* ── Shape blobs (clipped to plot area) ───────────────────────────── */}
      <g clipPath="url(#plot-clip)">
        {answers.map((answer, i) => {
          const [x, y] = getXY(answer);
          const color  = answer.answers.sensedColor.hex;
          const type   = answer.answers.sensedShape.type;
          const name   = answer.answers.scentName;
          const num    = String(i + 1).padStart(2, "0");
          const tag    = MACARON_TAG[answer.macaronId];

          return (
            <g key={answer.id} transform={`translate(${x},${y})`}>
              <title>{`${num}. ${name} — ${answer.answers.sensedColor.label} / ${answer.answers.sensedShape.label}`}</title>

              {/* Atmospheric halo */}
              <g fill={color} stroke={color} opacity={0.22} filter="url(#atm)">
                <ShapeEl type={type} s={34} />
              </g>

              {/* Main shape */}
              <g fill={color} stroke={color} opacity={0.6} filter="url(#mid)">
                <ShapeEl type={type} s={20} />
              </g>

              {/* Crosshair at exact position */}
              <line x1={-6} y1={0} x2={6} y2={0} stroke={color} strokeWidth={0.8} opacity={0.65} />
              <line x1={0} y1={-6} x2={0} y2={6} stroke={color} strokeWidth={0.8} opacity={0.65} />

              {/* Centre dot */}
              <circle r={2.5} fill={color} opacity={0.88} />

              {/* Macaron badge (ALL tab only) */}
              {isAll && (
                <circle r={3.5} cx={16} cy={-28} fill={tag} opacity={0.85} />
              )}
            </g>
          );
        })}
      </g>

      {/* ── Number + name labels (above clip, so text is always readable) ── */}
      {answers.map((answer, i) => {
        const [x, y] = getXY(answer);
        const color  = answer.answers.sensedColor.hex;
        const name   = answer.answers.scentName;
        const num    = String(i + 1).padStart(2, "0");

        // Keep label inside SVG bounds
        const lx = Math.max(ML + 8, Math.min(ML + PW - 8, x));
        const ly = y - 32;

        return (
          <g key={`lbl-${answer.id}`}>
            {/* Connector line from label to dot */}
            <line x1={lx} y1={ly + 4} x2={x} y2={y - 4} stroke={color} strokeWidth={0.6} opacity={0.4} strokeDasharray="2 2" />

            {/* Number */}
            <text
              x={lx} y={ly}
              fontSize={9} fontFamily="monospace" fontWeight="600"
              fill="#5A5450" textAnchor="middle"
            >
              {num}
            </text>

            {/* Scent name */}
            <text
              x={lx} y={ly - 11}
              fontSize={7.5} fontFamily="sans-serif"
              fill="#8B857F" textAnchor="middle"
              style={{ pointerEvents: "none" }}
            >
              {name.length > 9 ? name.slice(0, 9) + "…" : name}
            </text>
          </g>
        );
      })}

      {/* ── Legend (ALL tab) ─────────────────────────────────────────────── */}
      {isAll && (
        <g transform={`translate(${ML}, ${MT + PH + 48})`}>
          {Object.entries(MACARON_TAG).map(([id, col], i) => (
            <g key={id} transform={`translate(${i * 260}, 0)`}>
              <circle r={4} fill={col} opacity={0.85} />
              <text x={10} y={4} fontSize={8} fontFamily="monospace" fill="#8B857F">{id}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
