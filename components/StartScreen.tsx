"use client";

type Props = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 px-6 py-16">
      <div className="max-w-xl w-full text-center">
        <div className="mb-6 flex justify-center gap-3">
          {["#F7C8D0", "#BEE8D4", "#C9B6E4"].map((color) => (
            <div
              key={color}
              className="w-10 h-10 rounded-full shadow-sm border border-white"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <h1 className="text-4xl font-bold text-stone-700 tracking-tight mb-3">
          香りの地図室
        </h1>
        <p className="text-base text-stone-500 mb-8 tracking-wide">
          食べて香った体験を、色・形・名前で記録する
        </p>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 text-left mb-10 leading-relaxed">
          <p className="text-stone-600 text-sm leading-8 whitespace-pre-line">
            {`この体験では、マカロンを食べたときに立ち上がる香りの印象を記録します。

正解を当てることや、味を点数化することが目的ではありません。

食べて香った体験から、身体に残った色、形、記憶を選び、最後にその香りに名前をつけてください。`}
          </p>
        </div>

        <button
          onClick={onStart}
          className="bg-stone-700 text-white text-base font-medium px-12 py-4 rounded-full shadow hover:bg-stone-600 active:scale-95 transition-all duration-150 tracking-widest"
        >
          はじめる
        </button>
      </div>
    </div>
  );
}
