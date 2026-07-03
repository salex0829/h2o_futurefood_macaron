"use client";

type Props = {
  nextMacaronIndex: number;
  totalMacarons: number;
  onReady: () => void;
  onBack: () => void;
};

export default function WaitingScreen({
  nextMacaronIndex,
  totalMacarons,
  onReady,
  onBack,
}: Props) {
  return (
    <div className="min-h-screen flex flex-col px-6 py-10">
      <div className="max-w-sm w-full mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm transition-colors mb-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          戻る
        </button>

        <div className="text-center">
          <p className="text-xs text-stone-400 font-mono tracking-[0.3em] uppercase mb-8">
            {nextMacaronIndex} / {totalMacarons} 完了
          </p>

          <div className="mb-10 flex justify-center gap-2">
            {Array.from({ length: totalMacarons }, (_, i) => (
              <div
                key={i}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  i < nextMacaronIndex
                    ? "bg-stone-950 w-8"
                    : "bg-stone-200 w-4",
                ].join(" ")}
              />
            ))}
          </div>

          <h1 className="text-2xl font-bold text-stone-950 mb-4 leading-snug">
            次のマカロンまで
            <br />
            お待ちください
          </h1>

          <p className="text-sm text-stone-400 leading-relaxed mb-16">
            準備ができましたら、スタッフが次に進みます。
          </p>

          <button
            onClick={onReady}
            className="bg-stone-950 text-white text-sm font-medium px-12 py-3.5 rounded-full shadow hover:bg-stone-800 active:scale-95 transition-all tracking-widest"
          >
            次のマカロンへ
          </button>
        </div>
      </div>
    </div>
  );
}
