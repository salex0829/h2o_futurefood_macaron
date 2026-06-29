"use client";

import { useMemo } from "react";
import { SENSED_COLORS, COLOR_CATEGORIES } from "@/lib/choices";

type Props = {
  selected: { label: string; hex: string } | null;
  onSelect: (color: { label: string; hex: string }) => void;
};

/** Compute relative luminance (0–1) */
function luminance(hex: string): number {
  const v = parseInt(hex.replace("#", ""), 16);
  const r = ((v >> 16) & 0xff) / 255;
  const g = ((v >> 8) & 0xff) / 255;
  const b = (v & 0xff) / 255;
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function textColor(hex: string) {
  return luminance(hex) > 0.35 ? "#1c1917" : "#fafaf9";
}
function textColorMuted(hex: string) {
  return luminance(hex) > 0.35 ? "rgba(28,25,23,0.45)" : "rgba(250,250,249,0.55)";
}

export default function ColorChoiceGrid({ selected, onSelect }: Props) {
  const groups = useMemo(
    () =>
      COLOR_CATEGORIES.map((cat) => ({
        category: cat,
        colors: SENSED_COLORS.filter((c) => c.category === cat),
      })),
    []
  );

  return (
    <div className="space-y-8">
      {/* Selected color banner */}
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: selected?.hex ?? "#F3F0EA",
          minHeight: 72,
        }}
      >
        <div className="px-5 py-4 flex items-center gap-4">
          {selected ? (
            <>
              <div className="flex-1">
                <p
                  className="text-xl font-bold leading-none tracking-tight"
                  style={{ color: textColor(selected.hex) }}
                >
                  {selected.label}
                </p>
                <p
                  className="text-xs font-mono mt-1.5 tracking-widest"
                  style={{ color: textColorMuted(selected.hex) }}
                >
                  {selected.hex}
                </p>
              </div>
              <div
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  border: `2px solid ${textColorMuted(selected.hex)}`,
                }}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke={textColor(selected.hex)}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-400">色を選んでください</p>
          )}
        </div>
      </div>

      {/* Color cards grouped by category */}
      {groups.map(({ category, colors }) => (
        <div key={category}>
          {/* Section label */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-medium text-stone-400 tracking-widest uppercase">
              {category}
            </span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          {/* Grid of color cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {colors.map((color) => {
              const isSelected = selected?.label === color.label;
              const fg = textColor(color.hex);
              const fgMuted = textColorMuted(color.hex);

              return (
                <button
                  key={color.label}
                  onClick={() => onSelect({ label: color.label, hex: color.hex })}
                  className="group relative rounded-xl overflow-hidden text-left transition-all duration-200 focus:outline-none"
                  style={{
                    transform: isSelected ? "scale(1.03)" : "scale(1)",
                    boxShadow: isSelected
                      ? `0 0 0 3px white, 0 0 0 5px ${fg === "#1c1917" ? "#78716c" : "#d6d3d1"}, 0 8px 24px rgba(0,0,0,0.14)`
                      : "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Color face */}
                  <div
                    className="w-full"
                    style={{
                      backgroundColor: color.hex,
                      paddingBottom: "68%",
                      position: "relative",
                    }}
                  >
                    {/* Hover shimmer on light colors */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
                      }}
                    />
                  </div>

                  {/* Text strip */}
                  <div
                    className="px-2.5 py-2"
                    style={{ backgroundColor: color.hex }}
                  >
                    {/* Thin divider line */}
                    <div
                      className="w-full mb-1.5"
                      style={{
                        height: 1,
                        backgroundColor: fgMuted,
                      }}
                    />
                    <p
                      className="text-[13px] font-bold leading-snug tracking-tight"
                      style={{ color: fg }}
                    >
                      {color.label}
                    </p>
                    <p
                      className="text-[10px] font-mono mt-0.5 tracking-widest"
                      style={{ color: fgMuted }}
                    >
                      {color.hex}
                    </p>
                    {color.hint && (
                      <p
                        className="text-[10px] mt-0.5 leading-tight"
                        style={{ color: fgMuted }}
                      >
                        {color.hint}
                      </p>
                    )}
                  </div>

                  {/* Selected overlay ring */}
                  {isSelected && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: fg }}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke={color.hex}
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 7l3.5 3.5L12 3" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-stone-300 text-right pb-2">{SENSED_COLORS.length}色</p>
    </div>
  );
}
