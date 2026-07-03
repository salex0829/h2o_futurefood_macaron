"use client";

type Props = {
  type: string;
  size?: number;
  color?: string;
};

export default function ShapeIcon({ type, size = 48, color = "#6b7280" }: Props) {
  const s = size;
  const c = s / 2;
  const r = s * 0.38;

  switch (type) {
    /* ── 幾何学 ─────────────────────────────── */
    case "circle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={c} cy={c} r={r} fill={color} />
        </svg>
      );
    case "oval":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <ellipse cx={c} cy={c} rx={r * 1.35} ry={r * 0.65} fill={color} />
        </svg>
      );
    case "triangle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon
            points={`${c},${s * 0.15} ${s * 0.85},${s * 0.82} ${s * 0.15},${s * 0.82}`}
            fill={color}
          />
        </svg>
      );
    case "square":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={s * 0.18} y={s * 0.18} width={s * 0.64} height={s * 0.64} rx={s * 0.05} fill={color} />
        </svg>
      );
    case "hexagon": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
      }).join(" ");
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={pts} fill={color} />
        </svg>
      );
    }
    case "line":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <line x1={s * 0.15} y1={c} x2={s * 0.85} y2={c} stroke={color} strokeWidth={s * 0.1} strokeLinecap="round" />
        </svg>
      );
    case "angle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polyline
            points={`${s * 0.2},${s * 0.75} ${s * 0.2},${s * 0.25} ${s * 0.8},${s * 0.25}`}
            fill="none"
            stroke={color}
            strokeWidth={s * 0.1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "grid":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[0.33, 0.66].map((t) => (
            <g key={t}>
              <line x1={s * t} y1={s * 0.12} x2={s * t} y2={s * 0.88} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
              <line x1={s * 0.12} y1={s * t} x2={s * 0.88} y2={s * t} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
            </g>
          ))}
          <line x1={s * 0.12} y1={s * 0.12} x2={s * 0.12} y2={s * 0.88} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
          <line x1={s * 0.88} y1={s * 0.12} x2={s * 0.88} y2={s * 0.88} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
          <line x1={s * 0.12} y1={s * 0.12} x2={s * 0.88} y2={s * 0.12} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
          <line x1={s * 0.12} y1={s * 0.88} x2={s * 0.88} y2={s * 0.88} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
        </svg>
      );
    case "radiation":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 8;
            return (
              <line
                key={i}
                x1={c + r * 0.28 * Math.cos(a)}
                y1={c + r * 0.28 * Math.sin(a)}
                x2={c + r * 0.9 * Math.cos(a)}
                y2={c + r * 0.9 * Math.sin(a)}
                stroke={color}
                strokeWidth={s * 0.07}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={c} cy={c} r={r * 0.2} fill={color} />
        </svg>
      );
    case "ring":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={s * 0.1} />
        </svg>
      );
    case "star": {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.45;
        return `${c + rr * Math.cos(a)},${c + rr * Math.sin(a)}`;
      }).join(" ");
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={pts} fill={color} />
        </svg>
      );
    }
    case "crystal": {
      const pts = [
        `${c},${s * 0.1}`,
        `${s * 0.78},${s * 0.38}`,
        `${s * 0.62},${s * 0.88}`,
        `${s * 0.38},${s * 0.88}`,
        `${s * 0.22},${s * 0.38}`,
      ].join(" ");
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={pts} fill={color} />
          <line x1={c} y1={s * 0.1} x2={c} y2={s * 0.88} stroke="rgba(255,255,255,0.35)" strokeWidth={s * 0.045} />
        </svg>
      );
    }

    /* ── 有機的 ─────────────────────────────── */
    case "wave":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${s * 0.08},${c} C${s * 0.2},${c - r * 0.7} ${s * 0.35},${c - r * 0.7} ${s * 0.5},${c} C${s * 0.65},${c + r * 0.7} ${s * 0.8},${c + r * 0.7} ${s * 0.92},${c}`}
            fill="none"
            stroke={color}
            strokeWidth={s * 0.1}
            strokeLinecap="round"
          />
        </svg>
      );
    case "drop":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${c},${s * 0.1} C${c},${s * 0.1} ${s * 0.2},${s * 0.4} ${s * 0.2},${s * 0.62} C${s * 0.2},${s * 0.82} ${s * 0.36},${s * 0.9} ${c},${s * 0.9} C${s * 0.64},${s * 0.9} ${s * 0.8},${s * 0.82} ${s * 0.8},${s * 0.62} C${s * 0.8},${s * 0.4} ${c},${s * 0.1} ${c},${s * 0.1}Z`}
            fill={color}
          />
        </svg>
      );
    case "cloud":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={c * 0.75} cy={c * 1.1} r={r * 0.52} fill={color} />
          <circle cx={c} cy={c * 0.82} r={r * 0.65} fill={color} />
          <circle cx={c * 1.3} cy={c * 1.05} r={r * 0.5} fill={color} />
          <rect x={c * 0.25} y={c * 1.05} width={c * 1.5} height={r * 0.55} fill={color} rx={4} />
        </svg>
      );
    case "flower":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const a = (deg * Math.PI) / 180;
            return (
              <ellipse
                key={i}
                cx={c + r * 0.55 * Math.cos(a)}
                cy={c + r * 0.55 * Math.sin(a)}
                rx={r * 0.38}
                ry={r * 0.22}
                transform={`rotate(${deg}, ${c + r * 0.55 * Math.cos(a)}, ${c + r * 0.55 * Math.sin(a)})`}
                fill={color}
                opacity={0.88}
              />
            );
          })}
          <circle cx={c} cy={c} r={r * 0.28} fill={color} />
        </svg>
      );
    case "leaf":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${c},${s * 0.88} C${s * 0.18},${s * 0.65} ${s * 0.15},${s * 0.25} ${c},${s * 0.1} C${s * 0.85},${s * 0.25} ${s * 0.82},${s * 0.65} ${c},${s * 0.88}Z`}
            fill={color}
          />
          <line x1={c} y1={s * 0.15} x2={c} y2={s * 0.85} stroke="rgba(255,255,255,0.3)" strokeWidth={s * 0.045} strokeLinecap="round" />
        </svg>
      );
    case "spiral":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${c},${c} C${c + r * 0.5},${c - r * 0.5} ${c + r},${c} ${c + r * 0.7},${c + r * 0.7} C${c},${c + r * 1.15} ${c - r * 0.95},${c + r * 0.1} ${c - r * 0.4},${c - r * 0.75}`}
            fill="none"
            stroke={color}
            strokeWidth={s * 0.09}
            strokeLinecap="round"
          />
        </svg>
      );
    case "grain":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[
            [0.3, 0.28], [0.62, 0.22], [0.78, 0.52], [0.52, 0.66],
            [0.22, 0.6], [0.55, 0.42], [0.38, 0.78],
          ].map(([x, y], i) => (
            <circle key={i} cx={s * x} cy={s * y} r={s * 0.07} fill={color} />
          ))}
        </svg>
      );
    case "bubble":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[
            [0.5, 0.5, 0.32], [0.28, 0.35, 0.16], [0.72, 0.32, 0.14], [0.3, 0.66, 0.12], [0.7, 0.65, 0.1],
          ].map(([x, y, rr], i) => (
            <circle key={i} cx={s * x} cy={s * y} r={s * rr} fill="none" stroke={color} strokeWidth={s * 0.06} />
          ))}
        </svg>
      );
    case "smoke":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${c},${s * 0.85} C${c - r * 0.5},${s * 0.65} ${c + r * 0.6},${s * 0.5} ${c},${s * 0.35} C${c - r * 0.5},${s * 0.2} ${c + r * 0.3},${s * 0.1} ${c},${s * 0.08}`}
            fill="none"
            stroke={color}
            strokeWidth={s * 0.11}
            strokeLinecap="round"
            opacity={0.7}
          />
        </svg>
      );
    case "blur":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <filter id={`blur-${s}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={s * 0.06} />
            </filter>
          </defs>
          <circle cx={c} cy={c} r={r * 1.05} fill={color} filter={`url(#blur-${s})`} />
        </svg>
      );
    case "fragment":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon
            points={`${s * 0.5},${s * 0.14} ${s * 0.8},${s * 0.36} ${s * 0.72},${s * 0.76} ${s * 0.33},${s * 0.84} ${s * 0.16},${s * 0.55} ${s * 0.26},${s * 0.28}`}
            fill={color}
          />
        </svg>
      );
    case "layer":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[0.28, 0.44, 0.6, 0.76].map((y, i) => (
            <rect
              key={i}
              x={s * 0.15}
              y={s * y - s * 0.05}
              width={s * 0.7}
              height={s * 0.08}
              rx={s * 0.04}
              fill={color}
              opacity={1 - i * 0.15}
            />
          ))}
        </svg>
      );
    case "feather":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${c},${s * 0.88} C${s * 0.55},${s * 0.55} ${s * 0.85},${s * 0.3} ${s * 0.78},${s * 0.15} C${s * 0.6},${s * 0.12} ${s * 0.35},${s * 0.35} ${c},${s * 0.88}Z`}
            fill={color}
            opacity={0.9}
          />
          <line x1={c} y1={s * 0.88} x2={s * 0.76} y2={s * 0.16} stroke="rgba(255,255,255,0.3)" strokeWidth={s * 0.04} strokeLinecap="round" />
        </svg>
      );
    case "thread":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${s * 0.15},${s * 0.8} Q${s * 0.4},${s * 0.2} ${c},${s * 0.5} Q${s * 0.6},${s * 0.78} ${s * 0.85},${s * 0.22}`}
            fill="none"
            stroke={color}
            strokeWidth={s * 0.07}
            strokeLinecap="round"
          />
        </svg>
      );
    case "stain":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <ellipse cx={c * 0.95} cy={c * 1.05} rx={r * 1.1} ry={r * 0.72} fill={color} opacity={0.7} />
          <ellipse cx={c * 1.1} cy={c * 0.9} rx={r * 0.7} ry={r * 0.5} fill={color} opacity={0.5} transform={`rotate(-20,${c * 1.1},${c * 0.9})`} />
        </svg>
      );
    case "undulation":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[0, 0.2, 0.4].map((offset, i) => (
            <path
              key={i}
              d={`M${s * 0.06},${c + s * offset - s * 0.2} C${s * 0.25},${c + s * offset - s * 0.35} ${s * 0.5},${c + s * offset - s * 0.05} ${s * 0.75},${c + s * offset - s * 0.3} C${s * 0.88},${c + s * offset - s * 0.4} ${s * 0.92},${c + s * offset - s * 0.2} ${s * 0.94},${c + s * offset - s * 0.2}`}
              fill="none"
              stroke={color}
              strokeWidth={s * 0.07}
              strokeLinecap="round"
              opacity={1 - i * 0.25}
            />
          ))}
        </svg>
      );
    case "mist":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <filter id={`mist-${s}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={s * 0.045} />
            </filter>
          </defs>
          {[0.32, 0.5, 0.68].map((y, i) => (
            <ellipse
              key={i}
              cx={c}
              cy={s * y}
              rx={r * (1.1 - i * 0.12)}
              ry={r * 0.18}
              fill={color}
              opacity={0.45 - i * 0.08}
              filter={`url(#mist-${s})`}
            />
          ))}
        </svg>
      );

    /* ── オノマトペ専用（形グリッドとは異なるアイコン）──── */
    case "onoma-fuwafuwa":
      // 横並びの2つの柔らかい楕円（綿のような浮遊感）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <ellipse cx={c - r * 0.42} cy={c} rx={r * 0.42} ry={r * 0.35} fill={color} opacity={0.75} />
          <ellipse cx={c + r * 0.42} cy={c} rx={r * 0.42} ry={r * 0.35} fill={color} opacity={0.6} />
        </svg>
      );
    case "onoma-jinwari":
      // 中心点＋2つの薄い同心円（ゆっくり広がる温もり）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={c} cy={c} r={r * 0.18} fill={color} />
          <circle cx={c} cy={c} r={r * 0.52} fill="none" stroke={color} strokeWidth={s * 0.06} opacity={0.6} />
          <circle cx={c} cy={c} r={r * 0.88} fill="none" stroke={color} strokeWidth={s * 0.04} opacity={0.3} />
        </svg>
      );
    case "onoma-suutto": {
      // 横向き彗星（左が太く右へ先細り）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${s * 0.1},${c - s * 0.11} Q${s * 0.55},${c - s * 0.03} ${s * 0.9},${c} Q${s * 0.55},${c + s * 0.03} ${s * 0.1},${c + s * 0.11}Z`}
            fill={color}
          />
        </svg>
      );
    }
    case "onoma-punto": {
      // 4尖頭の星（針のような鋭さ）
      const pts4 = Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * i) / 4 - Math.PI / 2;
        const rr = i % 2 === 0 ? r * 0.92 : r * 0.18;
        return `${c + rr * Math.cos(a)},${c + rr * Math.sin(a)}`;
      }).join(" ");
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={pts4} fill={color} />
        </svg>
      );
    }
    case "onoma-mowatto":
      // 3つの重なり合う円の塊（密な圧迫感）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={c - r * 0.32} cy={c + r * 0.15} r={r * 0.55} fill={color} opacity={0.75} />
          <circle cx={c + r * 0.32} cy={c + r * 0.15} r={r * 0.55} fill={color} opacity={0.75} />
          <circle cx={c} cy={c - r * 0.22} r={r * 0.52} fill={color} opacity={0.85} />
        </svg>
      );
    case "onoma-piritto":
      // 鋭いジグザグ（W字形のとがった波）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polyline
            points={`${s * 0.1},${c - r * 0.5} ${s * 0.32},${c + r * 0.5} ${s * 0.54},${c - r * 0.5} ${s * 0.76},${c + r * 0.5} ${s * 0.9},${c - r * 0.5}`}
            fill="none"
            stroke={color}
            strokeWidth={s * 0.1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "onoma-torotto":
      // 上が広く下が細まるとろみ形（粘性のある垂れ）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${c - r * 0.55},${s * 0.28} Q${c - r * 0.55},${s * 0.12} ${c},${s * 0.12} Q${c + r * 0.55},${s * 0.12} ${c + r * 0.55},${s * 0.28} L${c + r * 0.25},${s * 0.72} Q${c},${s * 0.9} ${c - r * 0.25},${s * 0.72} Z`}
            fill={color}
          />
        </svg>
      );
    case "onoma-sarasara":
      // 4本の斜めの平行線（砂・絹のような流れ）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[0.22, 0.38, 0.54, 0.7].map((t, i) => (
            <line key={i}
              x1={s * t - s * 0.14} y1={s * 0.12}
              x2={s * t + s * 0.14} y2={s * 0.88}
              stroke={color} strokeWidth={s * 0.07} strokeLinecap="round"
              opacity={1 - i * 0.15}
            />
          ))}
        </svg>
      );
    case "onoma-honnori":
      // 大きな薄いリング＋小さな中心点（かすかな印象）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={c} cy={c} r={r * 0.92} fill="none" stroke={color} strokeWidth={s * 0.05} opacity={0.4} />
          <circle cx={c} cy={c} r={r * 0.12} fill={color} opacity={0.55} />
        </svg>
      );
    case "onoma-gutto":
      // 向き合う2つの三角形（挟み込む力）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon
            points={`${s * 0.12},${s * 0.2} ${s * 0.12},${s * 0.8} ${s * 0.44},${c}`}
            fill={color} opacity={0.85}
          />
          <polygon
            points={`${s * 0.88},${s * 0.2} ${s * 0.88},${s * 0.8} ${s * 0.56},${c}`}
            fill={color} opacity={0.85}
          />
        </svg>
      );
    case "onoma-shimijimi":
      // 幅広の平らな楕円2重（じわじわ染み広がる）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <ellipse cx={c} cy={c} rx={r * 1.08} ry={r * 0.3} fill={color} opacity={0.7} />
          <ellipse cx={c} cy={c} rx={r * 0.65} ry={r * 0.18} fill={color} opacity={0.5} />
        </svg>
      );
    case "onoma-futto":
      // 上に小さな円＋縦線（ふっと立ち上る息）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={c} cy={s * 0.28} r={r * 0.22} fill={color} />
          <line x1={c} y1={s * 0.38} x2={c} y2={s * 0.82} stroke={color} strokeWidth={s * 0.08} strokeLinecap="round" />
        </svg>
      );
    case "onoma-mutto":
      // 3本の縦向き波線（むっと立ちこめる蒸気）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[0.28, 0.5, 0.72].map((x, i) => (
            <path key={i}
              d={`M${s * x},${s * 0.82} C${s * x + s * 0.08},${s * 0.65} ${s * x - s * 0.08},${s * 0.48} ${s * x},${s * 0.32} C${s * x + s * 0.08},${s * 0.18} ${s * x - s * 0.08},${s * 0.12} ${s * x},${s * 0.1}`}
              fill="none"
              stroke={color}
              strokeWidth={s * 0.08}
              strokeLinecap="round"
              opacity={0.8 - i * 0.1}
            />
          ))}
        </svg>
      );
    case "onoma-kyutto":
      // 砂時計形（上下の三角が中心で接する）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon
            points={`${s * 0.15},${s * 0.12} ${s * 0.85},${s * 0.12} ${c},${c}`}
            fill={color} opacity={0.85}
          />
          <polygon
            points={`${s * 0.15},${s * 0.88} ${s * 0.85},${s * 0.88} ${c},${c}`}
            fill={color} opacity={0.85}
          />
        </svg>
      );
    case "onoma-yurayura":
      // 対になる2本のS曲線（ゆらゆら揺れる動き）
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={`M${s * 0.12},${s * 0.72} C${s * 0.12},${s * 0.5} ${s * 0.5},${s * 0.5} ${s * 0.5},${s * 0.3} C${s * 0.5},${s * 0.12} ${s * 0.82},${s * 0.12} ${s * 0.88},${s * 0.3}`}
            fill="none" stroke={color} strokeWidth={s * 0.09} strokeLinecap="round" opacity={0.85}
          />
          <path
            d={`M${s * 0.12},${s * 0.7} C${s * 0.18},${s * 0.88} ${s * 0.5},${s * 0.88} ${s * 0.5},${s * 0.68} C${s * 0.5},${s * 0.5} ${s * 0.82},${s * 0.5} ${s * 0.88},${s * 0.7}`}
            fill="none" stroke={color} strokeWidth={s * 0.09} strokeLinecap="round" opacity={0.55}
          />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={c} cy={c} r={r} fill={color} />
        </svg>
      );
  }
}
