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

function checkColor(hex: string) {
  return luminance(hex) > 0.35 ? "#1c1917" : "#fafaf9";
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
    <div className="space-y-6">
      {/* Selected color preview */}
      <div
        className="rounded-2xl transition-all duration-300"
        style={{
          backgroundColor: selected?.hex ?? "#F3F0EA",
          height: 48,
        }}
      >
        {!selected && (
          <div className="h-full flex items-center px-5">
            <p className="text-sm text-stone-400">色を選んでください</p>
          </div>
        )}
      </div>

      {/* Color swatches grouped by category */}
      {groups.map(({ category, colors }) => (
        <div key={category}>
          {/* Thin category divider */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          {/* Grid of swatches */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1.5">
            {colors.map((color) => {
              const isSelected = selected?.label === color.label;
              const fg = checkColor(color.hex);

              return (
                <button
                  key={color.label}
                  onClick={() => onSelect({ label: color.label, hex: color.hex })}
                  className="group relative rounded-lg overflow-hidden transition-all duration-200 focus:outline-none"
                  style={{
                    transform: isSelected ? "scale(1.06)" : "scale(1)",
                    boxShadow: isSelected
                      ? `0 0 0 2px white, 0 0 0 4px ${fg === "#1c1917" ? "#78716c" : "#d6d3d1"}, 0 4px 12px rgba(0,0,0,0.12)`
                      : "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Color swatch */}
                  <div
                    className="w-full"
                    style={{
                      backgroundColor: color.hex,
                      paddingBottom: "100%",
                      position: "relative",
                    }}
                  >
                    {/* Hover shimmer */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                      }}
                    />
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div
                        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: fg }}
                      >
                        <svg
                          className="w-2.5 h-2.5"
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
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
