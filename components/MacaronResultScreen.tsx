"use client";

import { useState, useEffect } from "react";
import { SurveyAnswer, MacaronId } from "@/types/survey";
import { subscribeSurveyAnswers } from "@/lib/storage";
import { computeSummary } from "@/lib/aggregate";
import SensoryMap from "./SensoryMap";

type Props = {
  macaronId: MacaronId;
  macaronIndex: number;
  totalMacarons: number;
  onNext: () => void;
};

export default function MacaronResultScreen({
  macaronId,
  macaronIndex,
  totalMacarons,
  onNext,
}: Props) {
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const unsubscribe = subscribeSurveyAnswers((all) => {
      setAnswers(all.filter((a) => a.macaronId === macaronId));
    });
    return () => unsubscribe();
  }, [macaronId]);

  const summary = computeSummary(answers);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 border-b border-stone-100">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-mono text-stone-400 tracking-[0.25em] uppercase mb-3">
            Macaron {macaronIndex + 1} / {totalMacarons} — 記録完了
          </p>
          <h1 className="text-2xl font-bold text-stone-950 tracking-tight mb-1">
            {macaronId}
          </h1>
          <p className="text-sm text-stone-400">
            {answers.length}件の記録
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-6 py-5 border-b border-stone-100">
        <div className="max-w-2xl mx-auto flex gap-6 flex-wrap">
          {summary.topColor && (
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full border border-stone-200 shrink-0"
                style={{ backgroundColor: summary.topColor.hex }}
              />
              <span className="text-xs text-stone-500">
                多い色：{summary.topColor.label}
              </span>
            </div>
          )}
          {summary.topShape && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">
                多い形：{summary.topShape.label}
              </span>
            </div>
          )}
          {summary.totalCount > 0 && (
            <>
              <div className="text-xs text-stone-500">
                自然 ↔ 都市：{summary.avgUrbanity.toFixed(1)}
              </div>
              <div className="text-xs text-stone-500">
                記憶の距離：{summary.avgIntimacy.toFixed(1)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {answers.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-12">
              データを読み込み中…
            </p>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
              <p className="text-xs text-stone-400 mb-4">
                X軸：自然的 ← → 都市的　Y軸：遠い ↑ 近い
              </p>
              <SensoryMap answers={answers} />
            </div>
          )}

          <div className="flex justify-end pt-4 pb-8">
            <button
              onClick={onNext}
              className="bg-stone-950 text-white text-sm font-medium px-10 py-3.5 rounded-full shadow hover:bg-stone-800 active:scale-95 transition-all tracking-widest"
            >
              {macaronIndex + 1 < totalMacarons ? "次のマカロンへ" : "完了へ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
