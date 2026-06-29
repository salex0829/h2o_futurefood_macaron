"use client";

import { useState } from "react";
import { SurveyAnswer } from "@/types/survey";
import { MACARONS } from "@/lib/macarons";
import { getParticipantId, saveSurveyAnswer } from "@/lib/storage";
import MacaronIntroScreen from "./MacaronIntroScreen";
import QuestionStep from "./QuestionStep";
import CompletionScreen from "./CompletionScreen";

type FlowScreen = "intro" | "survey" | "complete";

export default function SequentialSurveyFlow() {
  const [flowScreen, setFlowScreen] = useState<FlowScreen>("intro");
  const [currentMacaronIndex, setCurrentMacaronIndex] = useState(0);

  const currentMacaron = MACARONS[currentMacaronIndex];

  const handleSurveyComplete = (answers: SurveyAnswer["answers"]) => {
    const participantId = getParticipantId();
    saveSurveyAnswer({
      id: crypto.randomUUID(),
      participantId,
      macaronId: currentMacaron.id,
      createdAt: new Date().toISOString(),
      answers,
    });

    if (currentMacaronIndex < MACARONS.length - 1) {
      setCurrentMacaronIndex((i) => i + 1);
      setFlowScreen("intro");
    } else {
      setFlowScreen("complete");
    }
  };

  if (flowScreen === "complete") {
    return <CompletionScreen />;
  }

  if (flowScreen === "intro") {
    return (
      <MacaronIntroScreen
        macaron={currentMacaron}
        macaronIndex={currentMacaronIndex}
        totalMacarons={MACARONS.length}
        onStart={() => setFlowScreen("survey")}
      />
    );
  }

  return (
    <QuestionStep
      macaronId={currentMacaron.id}
      macaronIndex={currentMacaronIndex}
      onComplete={handleSurveyComplete}
      onBack={() => setFlowScreen("intro")}
    />
  );
}
