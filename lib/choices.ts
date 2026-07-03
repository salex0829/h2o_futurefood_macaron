export type ColorChoice = {
  label: string;
  hex: string;
  hint?: string;
  category: string;
};

export type ShapeChoice = {
  label: string;
  type: string;
  category?: "shape" | "onoma";
};

export const COLOR_CATEGORIES = [
  "ホワイト系",
  "グレー系",
  "ブラック系",
  "ベージュ系",
  "ブラウン系",
  "レッド系",
  "ピンク系",
  "オレンジ系",
  "イエロー系",
  "グリーン系",
  "ブルー系",
  "パープル系",
] as const;

export type ColorCategory = (typeof COLOR_CATEGORIES)[number];

export const SENSED_COLORS: ColorChoice[] = [
  // ホワイト系
  { label: "スノーホワイト",   hex: "#FFFFFF",  hint: "白紙の感触",       category: "ホワイト系" },
  { label: "ミルクホワイト",   hex: "#FFF8EE",  hint: "やわらかい",       category: "ホワイト系" },
  { label: "アイボリー",       hex: "#F7F0DF",  hint: "ほんのり甘い",     category: "ホワイト系" },
  { label: "クリーム",         hex: "#F3E7C8",  hint: "なめらかな",       category: "ホワイト系" },

  // グレー系
  { label: "ライトグレー",     hex: "#D8D8D8",  hint: "静かな",           category: "グレー系" },
  { label: "グレージュ",       hex: "#C9BFB3",  hint: "くすんだ",         category: "グレー系" },
  { label: "スレート",         hex: "#708090",  hint: "湿った石",         category: "グレー系" },
  { label: "スモークグレー",   hex: "#8E8E8E",  hint: "霞んだ",           category: "グレー系" },
  { label: "チャコール",       hex: "#4B4B4B",  hint: "煙のような",       category: "グレー系" },

  // ブラック系
  { label: "オフブラック",     hex: "#2A2A2A",  hint: "深い",             category: "ブラック系" },
  { label: "ブラック",         hex: "#111111",  hint: "凝縮した",         category: "ブラック系" },

  // ベージュ系
  { label: "リネン",           hex: "#E2D5C3",  hint: "日干し布",         category: "ベージュ系" },
  { label: "サンドベージュ",   hex: "#D8C3A5",  hint: "乾いた土",         category: "ベージュ系" },
  { label: "オートミール",     hex: "#CBBFA8",  hint: "素朴な",           category: "ベージュ系" },

  // ブラウン系
  { label: "キャメル",         hex: "#C99A62",  hint: "あたたかい",       category: "ブラウン系" },
  { label: "キャラメルブラウン", hex: "#B9835A", hint: "甘く焦げた",      category: "ブラウン系" },
  { label: "テラコッタ",       hex: "#C0714A",  hint: "大地の赤み",       category: "ブラウン系" },
  { label: "カカオブラウン",   hex: "#6F4E37",  hint: "苦い甘み",         category: "ブラウン系" },

  // レッド系
  { label: "クリムゾン",       hex: "#DC143C",  hint: "鮮烈な",           category: "レッド系" },
  { label: "ブリック",         hex: "#B0513B",  hint: "焼けた大地",       category: "レッド系" },
  { label: "ワインレッド",     hex: "#7A263A",  hint: "深く熟した",       category: "レッド系" },

  // ピンク系
  { label: "ペールピンク",     hex: "#F7C8D0",  hint: "やさしい甘み",     category: "ピンク系" },
  { label: "サーモン",         hex: "#FA8072",  hint: "熟れた果実",       category: "ピンク系" },
  { label: "ローズピンク",     hex: "#EFA0B5",  hint: "甘い花の香",       category: "ピンク系" },
  { label: "コーラル",         hex: "#F28C8C",  hint: "南国の空気",       category: "ピンク系" },
  { label: "ラズベリー",       hex: "#C94F7C",  hint: "酸っぱい甘み",     category: "ピンク系" },

  // オレンジ系
  { label: "ピーチ",           hex: "#F7B98B",  hint: "やわらかな実",     category: "オレンジ系" },
  { label: "アプリコット",     hex: "#F4B183",  hint: "熟れた温もり",     category: "オレンジ系" },
  { label: "マンダリン",       hex: "#F39A4A",  hint: "弾ける柑橘",       category: "オレンジ系" },
  { label: "バーントオレンジ", hex: "#C96A3A",  hint: "秋の乾燥",         category: "オレンジ系" },

  // イエロー系
  { label: "レモンイエロー",   hex: "#F8E88B",  hint: "軽やかな",         category: "イエロー系" },
  { label: "バターイエロー",   hex: "#F4D35E",  hint: "やわらかい光",     category: "イエロー系" },
  { label: "ハニー",           hex: "#D9A441",  hint: "濃い甘み",         category: "イエロー系" },
  { label: "マスタード",       hex: "#B88A2E",  hint: "スパイシー",       category: "イエロー系" },

  // グリーン系
  { label: "フロスト",         hex: "#D4EDE1",  hint: "冷たい朝",         category: "グリーン系" },
  { label: "ミントグリーン",   hex: "#BEE8D4",  hint: "みずみずしい",     category: "グリーン系" },
  { label: "セージグリーン",   hex: "#A8BFA3",  hint: "草原の風",         category: "グリーン系" },
  { label: "オリーブ",         hex: "#808000",  hint: "熟成した苦み",     category: "グリーン系" },
  { label: "モスグリーン",     hex: "#7A8F5A",  hint: "深い森",           category: "グリーン系" },
  { label: "フォレストグリーン", hex: "#3F6B4F", hint: "大地の湿気",      category: "グリーン系" },

  // ブルー系
  { label: "アクア",           hex: "#A8E6E1",  hint: "透明な流れ",       category: "ブルー系" },
  { label: "スカイブルー",     hex: "#A7D8F0",  hint: "遠い空",           category: "ブルー系" },
  { label: "ブルーグレー",     hex: "#8FA8B8",  hint: "曇り空",           category: "ブルー系" },
  { label: "セルリアン",       hex: "#4A9CC9",  hint: "深い青",           category: "ブルー系" },
  { label: "インディゴ",       hex: "#4B5D8C",  hint: "夜の深み",         category: "ブルー系" },
  { label: "ディープネイビー", hex: "#1F2A44",  hint: "深海の静寂",       category: "ブルー系" },

  // パープル系
  { label: "ラベンダー",       hex: "#C9B6E4",  hint: "夢のような",       category: "パープル系" },
  { label: "ライラック",       hex: "#BFA2DB",  hint: "甘い香り草",       category: "パープル系" },
  { label: "モーヴ",           hex: "#B58AA5",  hint: "夕暮れの記憶",     category: "パープル系" },
  { label: "プラム",           hex: "#6E4A7E",  hint: "深い甘み",         category: "パープル系" },
  { label: "ディープパープル", hex: "#4A235A",  hint: "神秘的な",         category: "パープル系" },
];

export const SENSED_SHAPES: ShapeChoice[] = [
  // 幾何学
  { label: "円",       type: "circle"     },
  { label: "楕円",     type: "oval"       },
  { label: "三角",     type: "triangle"   },
  { label: "四角",     type: "square"     },
  { label: "六角",     type: "hexagon"    },
  { label: "線",       type: "line"       },
  { label: "角",       type: "angle"      },
  { label: "格子",     type: "grid"       },
  { label: "放射",     type: "radiation"  },
  { label: "輪",       type: "ring"       },
  { label: "星",       type: "star"       },
  { label: "結晶",     type: "crystal"    },
  // 有機的
  { label: "波",       type: "wave"       },
  { label: "しずく",   type: "drop"       },
  { label: "雲",       type: "cloud"      },
  { label: "花",       type: "flower"     },
  { label: "葉",       type: "leaf"       },
  { label: "渦",       type: "spiral"     },
  { label: "粒",       type: "grain"      },
  { label: "泡",       type: "bubble"     },
  { label: "煙",       type: "smoke"      },
  { label: "にじみ",   type: "blur"       },
  { label: "断片",     type: "fragment"   },
  { label: "層",       type: "layer"      },
  { label: "羽",       type: "feather"    },
  { label: "ひも",     type: "thread"     },
  { label: "しみ",     type: "stain"      },
  { label: "うねり",   type: "undulation" },
  { label: "霧",       type: "mist"       },
  // オノマトペ
  { label: "ふわふわ", type: "onoma-fuwafuwa", category: "onoma" },
  { label: "じんわり", type: "onoma-jinwari",  category: "onoma" },
  { label: "すうっと", type: "onoma-suutto",   category: "onoma" },
  { label: "ぷんと",   type: "onoma-punto",    category: "onoma" },
  { label: "もわっと", type: "onoma-mowatto",  category: "onoma" },
  { label: "ぴりっと", type: "onoma-piritto",  category: "onoma" },
  { label: "とろっと", type: "onoma-torotto",  category: "onoma" },
  { label: "さらさら", type: "onoma-sarasara",  category: "onoma" },
  { label: "ほんのり", type: "onoma-honnori",  category: "onoma" },
  { label: "ぐっと",   type: "onoma-gutto",    category: "onoma" },
  { label: "しみじみ", type: "onoma-shimijimi", category: "onoma" },
  { label: "ふっと",   type: "onoma-futto",    category: "onoma" },
  { label: "むっと",   type: "onoma-mutto",    category: "onoma" },
  { label: "きゅっと", type: "onoma-kyutto",   category: "onoma" },
  { label: "ゆらゆら", type: "onoma-yurayura", category: "onoma" },
];

export const INTIMACY_OPTIONS = [
  { label: "とても遠い",     value: 1 },
  { label: "やや遠い",       value: 2 },
  { label: "どちらでもない", value: 3 },
  { label: "やや近い",       value: 4 },
  { label: "とても近い",     value: 5 },
];

export const URBANITY_OPTIONS = [
  { label: "とても自然的",   value: 1 },
  { label: "やや自然的",     value: 2 },
  { label: "どちらでもない", value: 3 },
  { label: "やや都市的",     value: 4 },
  { label: "とても都市的",   value: 5 },
];
