"use client";

import { useRouter } from "next/navigation";
import { MACARONS } from "@/lib/macarons";
import { MacaronId } from "@/types/survey";
import MacaronCardPanel from "./MacaronCardPanel";

type Props = {
  answeredIds: MacaronId[];
  onSelect: (id: MacaronId) => void;
};

export default function MacaronSelect({ answeredIds, onSelect }: Props) {
  const router = useRouter();
  const allDone = answeredIds.length === MACARONS.length;

  return (
    <div className="min-h-screen bg-[#FDFAF5] flex flex-col items-center pt-14 pb-20 px-5">
      <div className="max-w-3xl w-full">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-xs text-stone-400 tracking-[0.3em] uppercase mb-2">
            Sensory Map
          </p>
          <h2 className="text-2xl font-bold text-stone-700 tracking-tight mb-3">
            マカロンを選んでください
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed">
            1つずつ食べて、香りの体験を記録してください。
          </p>
        </div>

        {/* 3 macaron cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {MACARONS.map((macaron) => (
            <MacaronCardPanel
              key={macaron.id}
              macaron={macaron}
              isAnswered={answeredIds.includes(macaron.id)}
              onClick={() => onSelect(macaron.id)}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {MACARONS.map((m) => (
            <div
              key={m.id}
              className={[
                "h-1.5 rounded-full transition-all duration-500",
                answeredIds.includes(m.id)
                  ? "w-8 bg-stone-400"
                  : "w-4 bg-stone-200",
              ].join(" ")}
            />
          ))}
        </div>

        {/* All done */}
        {allDone ? (
          <div className="text-center">
            <p className="text-stone-500 text-sm mb-5">
              すべての評価が完了しました
            </p>
            <button
              onClick={() => router.push("/visualize")}
              className="bg-stone-700 text-white text-sm font-medium px-10 py-3.5 rounded-full shadow hover:bg-stone-600 active:scale-95 transition-all tracking-widest"
            >
              ビジュアライズを見る
            </button>
          </div>
        ) : (
          <p className="text-center text-xs text-stone-300">
            {3 - answeredIds.length}つ残っています
          </p>
        )}
      </div>
    </div>
  );
}
