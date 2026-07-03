"use client";

type Props = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full text-center">
        <div className="mb-6 flex justify-center gap-3">
          {["#D8D8D8", "#B0B0B0", "#787878"].map((color) => (
            <div
              key={color}
              className="w-10 h-10 rounded-full shadow-sm border border-stone-100"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <h1 className="text-4xl font-bold text-stone-950 tracking-tight mb-3">
          色のないマカロン
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
          className="bg-stone-950 text-white text-base font-medium px-12 py-4 rounded-full shadow hover:bg-stone-800 active:scale-95 transition-all duration-150 tracking-widest"
        >
          はじめる
        </button>
      </div>
    </div>
  );
}
