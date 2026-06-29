"use client";

type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-stone-400 font-medium tracking-widest">
          {current} / {total}
        </span>
        <span className="text-sm text-stone-400">{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-300 to-violet-300 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
