"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SurveyAnswer } from "@/types/survey";
import { subscribeSurveyAnswers } from "@/lib/storage";
import { SAMPLE_ANSWERS } from "@/lib/sampleData";
import ScentLandscapeBoard from "@/components/ScentLandscapeBoard";
import ScentDetailPanel from "@/components/ScentDetailPanel";

const MACARON_IDS = [
  "UMEDA-BC4000",
  "TAKARAZUKA-1887",
  "KAWANISHI-2026",
] as const;

type ActiveTab = typeof MACARON_IDS[number] | "ALL";

const TABS: ActiveTab[] = [...MACARON_IDS, "ALL"];

export default function AtlasPage() {
  const [tab, setTab]           = useState<ActiveTab>("UMEDA-BC4000");
  const [answers, setAnswers]   = useState<SurveyAnswer[]>([]);
  const [selected, setSelected] = useState<SurveyAnswer | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeSurveyAnswers((stored) => {
      if (stored.length === 0) {
        setAnswers(SAMPLE_ANSWERS);
        return;
      }
      // Per-macaron fallback: macarons with no real answers use sample data
      const realIds = new Set(stored.map((a) => a.macaronId));
      const sampleFill = SAMPLE_ANSWERS.filter((a) => !realIds.has(a.macaronId));
      setAnswers([...stored, ...sampleFill]);
    });
    return () => unsubscribe();
  }, []);

  const displayAnswers: SurveyAnswer[] =
    tab === "ALL" ? answers : answers.filter((a) => a.macaronId === tab);

  return (
    <main className="min-h-screen bg-[#FDFCF8]">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="px-6 pt-10 pb-7 border-b border-stone-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-mono text-stone-300 tracking-[0.25em] uppercase mb-4 flex gap-3">
            <Link href="/" className="hover:text-stone-600 transition-colors">← HOME</Link>
            <span className="text-stone-200">|</span>
            <Link href="/visualize" className="hover:text-stone-600 transition-colors">VISUALIZE</Link>
          </p>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight mb-2">
            Scent Landscape
          </h1>
          <p className="text-sm text-stone-400 leading-relaxed max-w-lg">
            各マカロンに対して記録された色と形を、感覚の風景として可視化したアーカイブ
          </p>
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 flex-wrap">
          {TABS.map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                "text-[11px] font-mono px-4 py-2 rounded-full border transition-all tracking-widest",
                tab === id
                  ? "bg-stone-800 text-white border-stone-800"
                  : "bg-white text-stone-500 border-stone-200 hover:border-stone-400",
              ].join(" ")}
            >
              {id}
            </button>
          ))}
          <span className="ml-auto text-[10px] font-mono text-stone-300">
            n&nbsp;=&nbsp;{displayAnswers.length}
          </span>
        </div>
      </div>

      {/* ── Landscape boards ───────────────────────────────────────────── */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {displayAnswers.length === 0 ? (
            <div className="h-64 flex items-center justify-center border border-stone-100 rounded-2xl">
              <p className="text-stone-300 font-mono text-sm tracking-widest">NO DATA</p>
            </div>
          ) : (
            /* ALL: all answers on one board; individual: filtered answers */
            <ScentLandscapeBoard
              key={tab}
              answers={displayAnswers}
              idPrefix={tab.replace(/[^a-zA-Z0-9]/g, "_")}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>

      {/* ── Detail panel (click) ────────────────────────────────────────── */}
      <ScentDetailPanel answer={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
