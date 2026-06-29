export type MacaronId = "KAWANISHI-2026" | "TAKARAZUKA-1887" | "UMEDA-BC4000";

export type SurveyAnswer = {
  id: string;
  participantId: string;
  macaronId: MacaronId;
  createdAt: string;
  answers: {
    sensedColor: {
      label: string;
      hex: string;
    };
    sensedShape: {
      label: string;
      type: string;
    };
    memoryText: string;
    intimacy: {
      label: string;
      value: number;
    };
    urbanity: {
      label: string;
      value: number;
    };
    scentName: string;
  };
};

export type PartialAnswers = Partial<SurveyAnswer["answers"]>;
