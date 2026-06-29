"use client";

import { SurveyAnswer } from "@/types/survey";
import ShapeIcon from "./ShapeIcon";

type Props = {
  answer: SurveyAnswer;
};

const MACARON_ACCENT: Record<string, string> = {
  "KAWANISHI-2026": "bg-emerald-50 text-emerald-600",
  "TAKARAZUKA-1887": "bg-purple-50 text-purple-600",
  "UMEDA-BC4000": "bg-amber-50 text-amber-600",
};

export default function AnswerCard({ answer }: Props) {
  const accentClass = MACARON_ACCENT[answer.macaronId] ?? "bg-stone-100 text-stone-500";
  const isLightColor =
    parseInt(answer.answers.sensedColor.hex.slice(1), 16) > 0xcccccc;

  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-stone-700 leading-snug truncate">
            {answer.answers.scentName}
          </p>
        </div>
        <span
          className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full ${accentClass}`}
        >
          {answer.macaronId}
        </span>
      </div>

      {/* Shape + Color row */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <ShapeIcon
            type={answer.answers.sensedShape.type}
            size={40}
            color={answer.answers.sensedColor.hex === "#FFF8EE" ? "#d6d3d1" : answer.answers.sensedColor.hex}
          />
          <span className="text-xs text-stone-400">{answer.answers.sensedShape.label}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-10 h-10 rounded-full border shadow-sm"
            style={{
              backgroundColor: answer.answers.sensedColor.hex,
              borderColor: isLightColor ? "#e7e5e4" : answer.answers.sensedColor.hex,
            }}
          />
          <span className="text-xs text-stone-400">{answer.answers.sensedColor.label}</span>
        </div>
        <div className="flex-1 ml-2">
          <div className="flex gap-1 mb-1 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
              {answer.answers.urbanity.label}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
              記憶：{answer.answers.intimacy.label}
            </span>
          </div>
        </div>
      </div>

      {/* Memory text */}
      <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 border-t border-stone-50 pt-3">
        {answer.answers.memoryText}
      </p>
    </div>
  );
}
