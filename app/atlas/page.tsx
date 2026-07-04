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
      const realIds = new Set(stored.map((a) => a.macaronId));
      const sampleFill = SAMPLE_ANSWERS.filter((a) => !realIds.has(a.macaronId));
      setAnswers([...stored, ...sampleFill]);
    });
    return () => unsubscribe();
  }, []);

  const displayAnswers: SurveyAnswer[] =
    tab === "ALL" ? answers : answers.filter((a) => a.macaronId === tab);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* ── Compact top bar ───────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center gap-3 px-5 h-12 border-b border-stone-100 bg-white/95 backdrop-blur-sm">
        <Link
          href="/"
          className="text-[10px] font-mono text-stone-400 hover:text-stone-600 tracking-widest transition-colors"
        >
          ← HOME
        </Link>
        <span className="text-stone-200">|</span>
        <span className="text-[10px] font-mono text-stone-600 tracking-widest">
          SCENT LANDSCAPE
        </span>

        <div className="flex items-center gap-1.5 ml-4">
          {TABS.map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                "text-[10px] font-mono px-3 py-1 rounded-full border transition-all tracking-widest",
                tab === id
                  ? "bg-stone-800 text-white border-stone-800"
                  : "bg-white text-stone-500 border-stone-200 hover:border-stone-400",
              ].join(" ")}
            >
              {id}
            </button>
          ))}
        </div>

        <span className="ml-auto text-[10px] font-mono text-stone-300">
          n&nbsp;=&nbsp;{displayAnswers.length}
        </span>
      </header>

      {/* ── Full-screen map ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {displayAnswers.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-stone-300 font-mono text-sm tracking-widest">NO DATA</p>
          </div>
        ) : (
          <ScentLandscapeBoard
            key={tab}
            answers={displayAnswers}
            idPrefix={tab.replace(/[^a-zA-Z0-9]/g, "_")}
            onSelect={setSelected}
            fullscreen
          />
        )}
      </div>

      {/* ── Detail panel (click) ──────────────────────────────────────────── */}
      <ScentDetailPanel answer={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
