"use client";

import { useState } from "react";
import { MacaronId, PartialAnswers } from "@/types/survey";
import { MACARONS } from "@/lib/macarons";
import ColorChoiceGrid from "./ColorChoiceGrid";
import ShapeChoiceGrid from "./ShapeChoiceGrid";
import { INTIMACY_OPTIONS, URBANITY_OPTIONS } from "@/lib/choices";

type CompletedAnswers = {
  sensedColor: { label: string; hex: string };
  sensedShape: { label: string; type: string };
  memoryText: string;
  intimacy: { label: string; value: number };
  urbanity: { label: string; value: number };
  scentName: string;
};

type Props = {
  macaronId: MacaronId;
  macaronIndex: number;
  onComplete: (answers: CompletedAnswers) => void;
  onBack: () => void;
};

const TOTAL_STEPS = 6;

export default function QuestionStep({ macaronId, macaronIndex, onComplete, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [partial, setPartial] = useState<PartialAnswers>({});

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };
  const goPrev = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const canProceed = (): boolean => {
    if (step === 1) return !!partial.sensedColor;
    if (step === 2) return !!partial.sensedShape;
    if (step === 3) return (partial.memoryText ?? "").trim().length > 0;
    if (step === 4) return !!partial.intimacy;
    if (step === 5) return !!partial.urbanity;
    if (step === 6) return (partial.scentName ?? "").trim().length > 0;
    return false;
  };

  const handleFinish = () => {
    const completed: CompletedAnswers = {
      sensedColor: partial.sensedColor!,
      sensedShape: partial.sensedShape!,
      memoryText: partial.memoryText!,
      intimacy: partial.intimacy!,
      urbanity: partial.urbanity!,
      scentName: partial.scentName!,
    };
    onComplete(completed);
  };

  // Overall progress
  const overallCurrent = macaronIndex * TOTAL_STEPS + step;
  const overallTotal = MACARONS.length * TOTAL_STEPS;
  const overallPercent = Math.round((overallCurrent / overallTotal) * 100);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 bg-amber-50/90 backdrop-blur-sm z-10 px-6 pt-6 pb-4 border-b border-stone-100">
        <div className="max-w-2xl mx-auto">
          {/* Nav row */}
          <div className="flex items-start gap-3 mb-3">
            <button
              onClick={goPrev}
              className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm transition-colors shrink-0 mt-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              戻る
            </button>
            <div className="ml-auto text-right">
              <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">
                Macaron {macaronIndex + 1} / {MACARONS.length}
              </p>
              <p className="text-[11px] text-stone-500 font-mono tracking-widest uppercase">
                {macaronId}
              </p>
            </div>
          </div>

          {/* Progress bar + question label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-300 to-violet-300 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <span className="text-xs text-stone-400 font-mono whitespace-nowrap">
              Q {step} / {TOTAL_STEPS}
            </span>
          </div>
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <StepWrapper
              question="食べて香った体験は、どの色に近いですか？"
              hint="味や香りから身体に残った印象に近い色を選んでください。"
            >
              <ColorChoiceGrid
                selected={partial.sensedColor ?? null}
                onSelect={(c) => setPartial({ ...partial, sensedColor: c })}
              />
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper
              question="食べて香った体験は、どの形に近いですか？"
              hint="香りの広がり方、余韻、口の中に残った印象を形として選んでください。"
            >
              <ShapeChoiceGrid
                selected={partial.sensedShape ?? null}
                onSelect={(s) => setPartial({ ...partial, sensedShape: s })}
              />
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper
              question="この香りから、どんな記憶や風景を思い出しましたか？"
              hint="場所、時間帯、人、空気、感情など、自由に書いてください。"
            >
              <textarea
                className="w-full rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-stone-400 resize-none leading-relaxed shadow-sm"
                rows={5}
                placeholder="例：雨上がりの帰り道、祖母の家、地下街を歩いていた夕方、誰かを待っていた時間など"
                value={partial.memoryText ?? ""}
                onChange={(e) =>
                  setPartial({ ...partial, memoryText: e.target.value })
                }
              />
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper
              question="その記憶は、今の自分からどのくらい近く感じますか？"
              hint=""
            >
              <div className="flex flex-col gap-3">
                {INTIMACY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setPartial({ ...partial, intimacy: opt })
                    }
                    className={[
                      "w-full py-4 px-6 rounded-2xl border-2 text-sm font-medium transition-all duration-150 text-left",
                      partial.intimacy?.value === opt.value
                        ? "border-stone-500 bg-stone-50 text-stone-700 shadow-sm"
                        : "border-stone-100 bg-white text-stone-500 hover:border-stone-300",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 5 && (
            <StepWrapper
              question="その香りの印象は、自然的ですか？都市的ですか？"
              hint=""
            >
              <div className="flex justify-between text-xs text-stone-400 mb-3 px-1">
                <span>← 自然的</span>
                <span>都市的 →</span>
              </div>
              <div className="flex flex-col gap-3">
                {URBANITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setPartial({ ...partial, urbanity: opt })
                    }
                    className={[
                      "w-full py-4 px-6 rounded-2xl border-2 text-sm font-medium transition-all duration-150 text-left",
                      partial.urbanity?.value === opt.value
                        ? "border-stone-500 bg-stone-50 text-stone-700 shadow-sm"
                        : "border-stone-100 bg-white text-stone-500 hover:border-stone-300",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 6 && (
            <StepWrapper
              question="最後に、想起された記憶からこの香りに名前をつけてください。"
              hint="場所、時間、感情、記憶の断片をもとに、短いタイトルをつけてください。"
            >
              <input
                type="text"
                className="w-full rounded-2xl border border-stone-200 bg-white p-4 text-base text-stone-700 placeholder-stone-300 focus:outline-none focus:border-stone-400 shadow-sm"
                placeholder="例：雨上がりの帰り道、午後4時の地下街、祖母の庭、眠る駅前"
                value={partial.scentName ?? ""}
                onChange={(e) =>
                  setPartial({ ...partial, scentName: e.target.value })
                }
              />
            </StepWrapper>
          )}

          <div className="mt-10 flex justify-end">
            {step < TOTAL_STEPS ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="bg-stone-700 text-white text-sm font-medium px-10 py-3.5 rounded-full shadow hover:bg-stone-600 active:scale-95 transition-all tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
              >
                次へ
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed()}
                className="bg-rose-400 text-white text-sm font-medium px-10 py-3.5 rounded-full shadow hover:bg-rose-500 active:scale-95 transition-all tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
              >
                記録する
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepWrapper({
  question,
  hint,
  children,
}: {
  question: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-stone-700 mb-2 leading-snug">{question}</h2>
      {hint && <p className="text-sm text-stone-400 mb-6 leading-relaxed">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
