"use client";

import { useRouter } from "next/navigation";
import { clearSurveyAnswers } from "@/lib/storage";

export default function CompletionScreen() {
  const router = useRouter();

  const handleReset = () => {
    if (
      window.confirm(
        "すべての評価データを削除して、最初からやり直しますか？"
      )
    ) {
      clearSurveyAnswers();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <p className="text-xs text-stone-400 font-mono tracking-[0.3em] uppercase mb-6">
          Complete
        </p>

        <h1 className="text-2xl font-bold text-stone-700 mb-3 leading-snug">
          すべての評価が完了しました
        </h1>

        <p className="text-sm text-stone-400 leading-relaxed mb-12">
          3つの香りの記録が保存されました
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/visualize")}
            className="bg-stone-700 text-white text-sm font-medium px-12 py-3.5 rounded-full shadow hover:bg-stone-600 active:scale-95 transition-all tracking-widest"
          >
            ビジュアライズを見る
          </button>
          <button
            onClick={handleReset}
            className="text-sm text-stone-400 hover:text-stone-600 border border-stone-200 hover:border-stone-400 px-12 py-3.5 rounded-full transition-all"
          >
            最初からやり直す
          </button>
        </div>
      </div>
    </div>
  );
}
