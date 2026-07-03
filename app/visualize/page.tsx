"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SurveyAnswer, MacaronId } from "@/types/survey";
import { subscribeSurveyAnswers, clearSurveyAnswers } from "@/lib/storage";
import { SAMPLE_ANSWERS } from "@/lib/sampleData";
import { computeSummary } from "@/lib/aggregate";
import SensoryMap from "@/components/SensoryMap";
import ShapeNameList from "@/components/ShapeNameList";
import SummaryPanel from "@/components/SummaryPanel";
import FilterTabs from "@/components/FilterTabs";

type MacaronFilter = "ALL" | MacaronId;

const MACARON_FILTER_OPTIONS: { label: string; value: MacaronFilter }[] = [
  { label: "ALL", value: "ALL" },
  { label: "KAWANISHI-2026", value: "KAWANISHI-2026" },
  { label: "TAKARAZUKA-1887", value: "TAKARAZUKA-1887" },
  { label: "UMEDA-BC4000", value: "UMEDA-BC4000" },
];

type ViewTab = "map" | "list";

export default function VisualizePage() {
  const [allAnswers, setAllAnswers] = useState<SurveyAnswer[]>([]);
  const [isSample, setIsSample] = useState(false);
  const [macaronFilter, setMacaronFilter] = useState<MacaronFilter>("ALL");
  const [activeTab, setActiveTab] = useState<ViewTab>("map");

  useEffect(() => {
    const unsubscribe = subscribeSurveyAnswers((stored) => {
      if (stored.length === 0) {
        setAllAnswers(SAMPLE_ANSWERS);
        setIsSample(true);
      } else {
        setAllAnswers(stored);
        setIsSample(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleReset = () => {
    if (window.confirm("回答データをすべて削除しますか？")) {
      clearSurveyAnswers();
      setAllAnswers(SAMPLE_ANSWERS);
      setIsSample(true);
    }
  };

  const filtered = useMemo(() => {
    if (macaronFilter === "ALL") return allAnswers;
    return allAnswers.filter((a) => a.macaronId === macaronFilter);
  }, [allAnswers, macaronFilter]);

  const summary = useMemo(() => computeSummary(filtered), [filtered]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#E8E3D9]/95 backdrop-blur-sm border-b border-stone-300/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-stone-950 tracking-tight">
              色のないマカロン
            </h1>
            <p className="text-xs text-stone-400">ビジュアライズ</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              評価に戻る
            </Link>
            <button
              onClick={handleReset}
              className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 hover:border-stone-400 px-3 py-1.5 rounded-full transition-all"
            >
              データをリセット
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Sample data notice */}
        {isSample && (
          <div className="bg-stone-100 border border-stone-200 rounded-2xl px-5 py-3 text-sm text-stone-600">
            まだ評価データがないため、サンプルデータを表示しています。
          </div>
        )}

        {/* Macaron filter */}
        <div>
          <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-widest">
            マカロンを絞り込む
          </p>
          <FilterTabs
            options={MACARON_FILTER_OPTIONS}
            selected={macaronFilter}
            onChange={setMacaronFilter}
          />
        </div>

        {/* Summary */}
        <SummaryPanel summary={summary} />

        {/* Tab switcher */}
        <div className="flex gap-1 bg-stone-100 p-1 rounded-2xl w-fit">
          {(
            [
              { label: "感覚マップ", value: "map" as ViewTab },
              { label: "形と名前の一覧", value: "list" as ViewTab },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={[
                "px-5 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                activeTab === tab.value
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-400 hover:text-stone-600",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Map view */}
        {activeTab === "map" && (
          <section>
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-stone-950">感覚マップ</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    X軸：自然的 ← → 都市的　Y軸：遠い ↑ 近い
                  </p>
                </div>
                <span className="text-xs text-stone-400">{filtered.length}件</span>
              </div>
              {filtered.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-16">
                  該当するデータがありません
                </p>
              ) : (
                <SensoryMap answers={filtered} />
              )}
            </div>
          </section>
        )}

        {/* List view */}
        {activeTab === "list" && (
          <section>
            <div className="mb-4">
              <h2 className="text-base font-bold text-stone-950">形と名前の一覧</h2>
              <p className="text-xs text-stone-400 mt-1">
                香りにつけられた名前と、選ばれた形・色を比較できます。
              </p>
            </div>
            <ShapeNameList answers={allAnswers} />
          </section>
        )}
      </main>
    </div>
  );
}
