"use client";

import { useState } from "react";
import { SurveyAnswer } from "@/types/survey";
import { MACARONS } from "@/lib/macarons";
import { getParticipantId, saveSurveyAnswer } from "@/lib/storage";
import MacaronIntroScreen from "./MacaronIntroScreen";
import QuestionStep from "./QuestionStep";
import CompletionScreen from "./CompletionScreen";
import WaitingScreen from "./WaitingScreen";
import MacaronResultScreen from "./MacaronResultScreen";

type FlowScreen = "intro" | "survey" | "result" | "waiting" | "complete";

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

    setFlowScreen("result");
  };

  if (flowScreen === "complete") {
    return <CompletionScreen />;
  }

  if (flowScreen === "result") {
    return (
      <MacaronResultScreen
        macaronId={currentMacaron.id}
        macaronIndex={currentMacaronIndex}
        totalMacarons={MACARONS.length}
        onNext={() => {
          if (currentMacaronIndex < MACARONS.length - 1) {
            setFlowScreen("waiting");
          } else {
            setFlowScreen("complete");
          }
        }}
      />
    );
  }

  if (flowScreen === "waiting") {
    return (
      <WaitingScreen
        nextMacaronIndex={currentMacaronIndex + 1}
        totalMacarons={MACARONS.length}
        onReady={() => {
          setCurrentMacaronIndex((i) => i + 1);
          setFlowScreen("intro");
        }}
      />
    );
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
