"use client";

import { useState, useMemo } from "react";
import { SurveyAnswer, MacaronId } from "@/types/survey";
import { SENSED_COLORS, SENSED_SHAPES } from "@/lib/choices";
import FilterTabs from "./FilterTabs";
import AnswerCard from "./AnswerCard";

type Props = {
  answers: SurveyAnswer[];
};

type MacaronFilter = "ALL" | MacaronId;
type SortKey = "newest" | "name" | "natural" | "urban" | "near" | "far";

const MACARON_FILTERS: { label: string; value: MacaronFilter }[] = [
  { label: "ALL", value: "ALL" },
  { label: "KAWANISHI-2026", value: "KAWANISHI-2026" },
  { label: "TAKARAZUKA-1887", value: "TAKARAZUKA-1887" },
  { label: "UMEDA-BC4000", value: "UMEDA-BC4000" },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "新しい順", value: "newest" },
  { label: "名前順", value: "name" },
  { label: "自然的な順", value: "natural" },
  { label: "都市的な順", value: "urban" },
  { label: "記憶が近い順", value: "near" },
  { label: "記憶が遠い順", value: "far" },
];

export default function ShapeNameList({ answers }: Props) {
  const [macaronFilter, setMacaronFilter] = useState<MacaronFilter>("ALL");
  const [colorFilter, setColorFilter] = useState<string>("ALL");
  const [shapeFilter, setShapeFilter] = useState<string>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const colorOptions = useMemo(() => {
    const used = new Set(answers.map((a) => a.answers.sensedColor.label));
    return [
      { label: "すべての色", value: "ALL" },
      ...SENSED_COLORS.filter((c) => used.has(c.label)).map((c) => ({
        label: c.label,
        value: c.label,
      })),
    ];
  }, [answers]);

  const shapeOptions = useMemo(() => {
    const used = new Set(answers.map((a) => a.answers.sensedShape.label));
    return [
      { label: "すべての形", value: "ALL" },
      ...SENSED_SHAPES.filter((s) => used.has(s.label)).map((s) => ({
        label: s.label,
        value: s.label,
      })),
    ];
  }, [answers]);

  const filtered = useMemo(() => {
    let result = answers;
    if (macaronFilter !== "ALL") {
      result = result.filter((a) => a.macaronId === macaronFilter);
    }
    if (colorFilter !== "ALL") {
      result = result.filter(
        (a) => a.answers.sensedColor.label === colorFilter
      );
    }
    if (shapeFilter !== "ALL") {
      result = result.filter(
        (a) => a.answers.sensedShape.label === shapeFilter
      );
    }
    return [...result].sort((a, b) => {
      switch (sortKey) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "name":
          return a.answers.scentName.localeCompare(b.answers.scentName, "ja");
        case "natural":
          return a.answers.urbanity.value - b.answers.urbanity.value;
        case "urban":
          return b.answers.urbanity.value - a.answers.urbanity.value;
        case "near":
          return b.answers.intimacy.value - a.answers.intimacy.value;
        case "far":
          return a.answers.intimacy.value - b.answers.intimacy.value;
        default:
          return 0;
      }
    });
  }, [answers, macaronFilter, colorFilter, shapeFilter, sortKey]);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <p className="text-xs text-stone-400 mb-2 font-medium">マカロン</p>
          <FilterTabs
            options={MACARON_FILTERS}
            selected={macaronFilter}
            onChange={setMacaronFilter}
          />
        </div>
        <div>
          <p className="text-xs text-stone-400 mb-2 font-medium">色</p>
          <FilterTabs
            options={colorOptions}
            selected={colorFilter}
            onChange={setColorFilter}
          />
        </div>
        <div>
          <p className="text-xs text-stone-400 mb-2 font-medium">形</p>
          <FilterTabs
            options={shapeOptions}
            selected={shapeFilter}
            onChange={setShapeFilter}
          />
        </div>
        <div>
          <p className="text-xs text-stone-400 mb-2 font-medium">ソート</p>
          <FilterTabs
            options={SORT_OPTIONS}
            selected={sortKey}
            onChange={setSortKey}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone-400 text-sm text-center py-12">
          該当するデータがありません
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>
      )}
    </div>
  );
}
