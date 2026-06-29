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
        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map((v) => {
          const gx = PAD + ((v - 1) / 4) * (MAP_W - PAD * 2);
          const gy = MAP_H - PAD - ((v - 1) / 4) * (MAP_H - PAD * 2);
          return (
            <g key={v}>
              <line
                x1={gx}
                y1={PAD * 0.5}
                x2={gx}
                y2={MAP_H - PAD * 0.5}
                stroke="#e7e5e4"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <line
                x1={PAD * 0.5}
                y1={gy}
                x2={MAP_W - PAD * 0.5}
                y2={gy}
                stroke="#e7e5e4"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={PAD}
          y1={MAP_H / 2}
          x2={MAP_W - PAD}
          y2={MAP_H / 2}
          stroke="#d6d3d1"
          strokeWidth={1.5}
        />
        <line
          x1={MAP_W / 2}
          y1={PAD}
          x2={MAP_W / 2}
          y2={MAP_H - PAD}
          stroke="#d6d3d1"
          strokeWidth={1.5}
        />

        {/* Axis labels */}
        <text x={PAD} y={MAP_H / 2 - 10} textAnchor="middle" fontSize={11} fill="#a8a29e">自然的</text>
        <text x={MAP_W - PAD} y={MAP_H / 2 - 10} textAnchor="middle" fontSize={11} fill="#a8a29e">都市的</text>
        <text x={MAP_W / 2} y={PAD - 8} textAnchor="middle" fontSize={11} fill="#a8a29e">近い</text>
        <text x={MAP_W / 2} y={MAP_H - PAD + 18} textAnchor="middle" fontSize={11} fill="#a8a29e">遠い</text>

        {/* Data points */}
        {answers.map((answer) => {
          const { x, y } = answerToXY(answer);
          const hex = answer.answers.sensedColor.hex;
          const isLight = parseInt(hex.slice(1), 16) > 0xcccccc;
          return (
            <g
              key={answer.id}
              onMouseEnter={(e) => {
                const svgEl = e.currentTarget.closest("svg");
                if (!svgEl) return;
                const rect = svgEl.getBoundingClientRect();
                setTooltip({
                  answer,
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
              onMouseMove={(e) => {
                const svgEl = e.currentTarget.closest("svg");
                if (!svgEl) return;
                const rect = svgEl.getBoundingClientRect();
                setTooltip((prev) =>
                  prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null
                );
              }}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={x}
                cy={y}
                r={16}
                fill={hex}
                stroke={isLight ? "#d6d3d1" : hex}
                strokeWidth={2}
                opacity={0.88}
              />
              <text
                x={x}
                y={y + 28}
                textAnchor="middle"
                fontSize={9}
                fill="#78716c"
                className="pointer-events-none select-none"
              >
                {answer.answers.scentName.length > 10
                  ? answer.answers.scentName.slice(0, 10) + "…"
                  : answer.answers.scentName}
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
          <p className="font-bold text-sm text-stone-700 mb-1">
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
            <Tag label={tooltip.answer.participantId} mono />
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
