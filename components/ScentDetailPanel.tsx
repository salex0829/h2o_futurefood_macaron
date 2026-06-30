"use client";

import { SurveyAnswer } from "@/types/survey";
import { useEffect } from "react";

type Props = {
  answer: SurveyAnswer | null;
  onClose: () => void;
};

export default function ScentDetailPanel({ answer, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    if (!answer) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answer, onClose]);

  if (!answer) return null;

  const { sensedColor, sensedShape, scentName, memoryText, intimacy, urbanity } = answer.answers;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/10 backdrop-blur-[2px]"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative bg-[#FDFCF8] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md mx-0 sm:mx-6 px-8 pt-8 pb-10 border border-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-stone-300 hover:text-stone-500 transition-colors text-xl leading-none"
          aria-label="閉じる"
        >
          ×
        </button>

        {/* Macaron ID */}
        <p className="text-[9px] font-mono text-stone-300 tracking-[0.3em] uppercase mb-5">
          {answer.macaronId}
        </p>

        {/* Color swatch + scent name */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 mt-0.5"
            style={{ backgroundColor: sensedColor.hex, opacity: 0.78 }}
          />
          <div>
            <h2 className="text-lg font-bold text-stone-800 leading-tight mb-1">{scentName}</h2>
            <p className="text-xs text-stone-400">
              {sensedColor.label}　·　{sensedShape.label}
            </p>
          </div>
        </div>

        {/* Memory text */}
        {memoryText && (
          <p className="text-sm text-stone-500 leading-relaxed italic mb-6 pl-4 border-l-2 border-stone-100">
            {memoryText}
          </p>
        )}

        {/* Detail grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] font-mono text-stone-300 tracking-widest uppercase mb-1">親密度</p>
            <p className="text-xs text-stone-500">{intimacy.label}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono text-stone-300 tracking-widest uppercase mb-1">都市性</p>
            <p className="text-xs text-stone-500">{urbanity.label}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[9px] font-mono text-stone-300 tracking-widest uppercase mb-1">参加者 ID</p>
            <p className="text-xs font-mono text-stone-400">{answer.participantId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
