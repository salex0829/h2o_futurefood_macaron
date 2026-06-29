import { MacaronId } from "@/types/survey";

export type Macaron = {
  id: MacaronId;
  label: string;
  description: string;
};

export const MACARON_SEQUENCE = [
  "UMEDA-BC4000",
  "TAKARAZUKA-1887",
  "KAWANISHI-2026",
] as const;

export const MACARONS: Macaron[] = [
  {
    id: "UMEDA-BC4000",
    label: "UMEDA-BC4000",
    description: "都市の密度、地下、人工物の熱を含む香り",
  },
  {
    id: "TAKARAZUKA-1887",
    label: "TAKARAZUKA-1887",
    description: "庭園、余白、記憶の奥行きを感じる香り",
  },
  {
    id: "KAWANISHI-2026",
    label: "KAWANISHI-2026",
    description: "水辺、土壌、生活の気配が重なる香り",
  },
];
