"use client";

import { Summary } from "@/lib/aggregate";
import ShapeIcon from "./ShapeIcon";

type Props = {
  summary: Summary;
};

export default function SummaryPanel({ summary }: Props) {
  const { totalCount, countByMacaron, topColor, topShape, avgUrbanity, avgIntimacy } =
    summary;

  const urbanityLabel = avgUrbanity < 2 ? "自然的" : avgUrbanity > 4 ? "都市的" : "中間";
  const intimacyLabel = avgIntimacy < 2 ? "遠い" : avgIntimacy > 4 ? "近い" : "中間";

  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
      <h3 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-4">
        Summary
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="総回答数" value={`${totalCount}件`} />
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-stone-400 mb-1">マカロン別</p>
          <div className="flex flex-col gap-0.5">
            {(
              [
                ["KAWANISHI-2026", "KW"],
                ["TAKARAZUKA-1887", "TK"],
                ["UMEDA-BC4000", "UM"],
              ] as const
            ).map(([id, abbr]) => (
              <div key={id} className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-mono">{abbr}</span>
                <span className="text-stone-700 font-medium">
                  {countByMacaron[id]}件
                </span>
              </div>
            ))}
          </div>
        </div>

        {topColor && (
          <div>
            <p className="text-xs text-stone-400 mb-1">最多の色</p>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border border-stone-200 shrink-0"
                style={{ backgroundColor: topColor.hex }}
              />
              <div>
                <p className="text-sm font-medium text-stone-700">{topColor.label}</p>
                <p className="text-xs text-stone-400">{topColor.count}回選択</p>
              </div>
            </div>
          </div>
        )}

        {topShape && (
          <div>
            <p className="text-xs text-stone-400 mb-1">最多の形</p>
            <div className="flex items-center gap-2">
              <ShapeIcon type={topShape.type} size={32} color="#a8a29e" />
              <div>
                <p className="text-sm font-medium text-stone-700">{topShape.label}</p>
                <p className="text-xs text-stone-400">{topShape.count}回選択</p>
              </div>
            </div>
          </div>
        )}

        <StatCard
          label="平均 都市度"
          value={`${avgUrbanity.toFixed(1)}`}
          sub={urbanityLabel}
        />
        <StatCard
          label="平均 記憶の近さ"
          value={`${avgIntimacy.toFixed(1)}`}
          sub={intimacyLabel}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-xs text-stone-400 mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-stone-700 leading-none">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  );
}
