import { SurveyAnswer, MacaronId } from "@/types/survey";

export type Summary = {
  totalCount: number;
  countByMacaron: Record<MacaronId, number>;
  topColor: { label: string; hex: string; count: number } | null;
  topShape: { label: string; type: string; count: number } | null;
  avgUrbanity: number;
  avgIntimacy: number;
};

export function computeSummary(answers: SurveyAnswer[]): Summary {
  const total = answers.length;

  const countByMacaron: Record<MacaronId, number> = {
    "KAWANISHI-2026": 0,
    "TAKARAZUKA-1887": 0,
    "UMEDA-BC4000": 0,
  };
  for (const a of answers) {
    countByMacaron[a.macaronId] = (countByMacaron[a.macaronId] ?? 0) + 1;
  }

  const colorMap = new Map<string, { label: string; hex: string; count: number }>();
  for (const a of answers) {
    const key = a.answers.sensedColor.label;
    const existing = colorMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(key, { ...a.answers.sensedColor, count: 1 });
    }
  }
  let topColor: Summary["topColor"] = null;
  for (const v of colorMap.values()) {
    if (!topColor || v.count > topColor.count) topColor = v;
  }

  const shapeMap = new Map<string, { label: string; type: string; count: number }>();
  for (const a of answers) {
    const key = a.answers.sensedShape.label;
    const existing = shapeMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      shapeMap.set(key, { ...a.answers.sensedShape, count: 1 });
    }
  }
  let topShape: Summary["topShape"] = null;
  for (const v of shapeMap.values()) {
    if (!topShape || v.count > topShape.count) topShape = v;
  }

  const avgUrbanity =
    total > 0
      ? answers.reduce((sum, a) => sum + a.answers.urbanity.value, 0) / total
      : 0;
  const avgIntimacy =
    total > 0
      ? answers.reduce((sum, a) => sum + a.answers.intimacy.value, 0) / total
      : 0;

  return { totalCount: total, countByMacaron, topColor, topShape, avgUrbanity, avgIntimacy };
}
