"use client";

import { useMemo } from "react";
import { SENSED_SHAPES } from "@/lib/choices";
import ShapeIcon from "./ShapeIcon";

type Props = {
  selected: { label: string; type: string } | null;
  onSelect: (shape: { label: string; type: string }) => void;
};

export default function ShapeChoiceGrid({ selected, onSelect }: Props) {
  const shapes = useMemo(
    () => SENSED_SHAPES.filter((s) => s.category !== "onoma"),
    []
  );
  const onomatopoeia = useMemo(
    () => SENSED_SHAPES.filter((s) => s.category === "onoma"),
    []
  );

  return (
    <div>
      {/* Selected shape info bar */}
      <div className="flex items-center gap-3 mb-5 px-1 min-h-[40px]">
        {selected ? (
          <>
            {!selected.type.startsWith("onoma-") && (
              <ShapeIcon type={selected.type} size={32} color="#78716c" />
            )}
            <p className="text-sm font-medium text-stone-700">{selected.label}</p>
          </>
        ) : (
          <p className="text-sm text-stone-300">形またはオノマトペを選んでください</p>
        )}
      </div>

      {/* Shape gallery */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {shapes.map((shape) => {
          const sel = selected?.type === shape.type;
          return (
            <button
              key={shape.type}
              onClick={() => onSelect(shape)}
              className={[
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all duration-150",
                sel
                  ? "border-stone-500 bg-stone-50 shadow-sm scale-105"
                  : "border-stone-100 bg-white hover:border-stone-300 hover:bg-stone-50",
              ].join(" ")}
            >
              <ShapeIcon
                type={shape.type}
                size={36}
                color={sel ? "#78716c" : "#c4bdb7"}
              />
              <span className="text-[10px] text-stone-500 font-medium leading-none">
                {shape.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Onomatopoeia section */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-medium text-stone-400 tracking-widest uppercase">
            オノマトペ
          </span>
          <div className="flex-1 h-px bg-stone-100" />
        </div>
        <div className="flex flex-wrap gap-2">
          {onomatopoeia.map((item) => {
            const sel = selected?.type === item.type;
            return (
              <button
                key={item.type}
                onClick={() => onSelect(item)}
                className={[
                  "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-150",
                  sel
                    ? "border-stone-500 bg-stone-50 text-stone-700 shadow-sm scale-105"
                    : "border-stone-100 bg-white text-stone-400 hover:border-stone-300 hover:text-stone-600",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-stone-300 mt-4 text-right">
        {shapes.length}種類 + {onomatopoeia.length}オノマトペ
      </p>
    </div>
  );
}
