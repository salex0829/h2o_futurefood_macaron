"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MACARONS } from "@/lib/macarons";
import { MacaronId, SurveyAnswer } from "@/types/survey";
import { getParticipantId, saveSurveyAnswer } from "@/lib/storage";
import MacaronIntroScreen from "@/components/MacaronIntroScreen";
import QuestionStep from "@/components/QuestionStep";
import MacaronResultScreen from "@/components/MacaronResultScreen";
import CompletionScreen from "@/components/CompletionScreen";

type FlowScreen = "intro" | "survey" | "result" | "complete";

export default function SingleMacaronSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const [flowScreen, setFlowScreen] = useState<FlowScreen>("intro");

  const macaronId = params.macaronId as string;
  const macaron = MACARONS.find((m) => m.id === macaronId);

  if (!macaron) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">マカロンが見つかりません</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-stone-400 underline"
          >
            ホームへ戻る
          </button>
        </div>
      </div>
    );
  }

  const macaronIndex = MACARONS.indexOf(macaron);

  const handleSurveyComplete = (answers: SurveyAnswer["answers"]) => {
    const participantId = getParticipantId();
    saveSurveyAnswer({
      id: crypto.randomUUID(),
      participantId,
      macaronId: macaron.id as MacaronId,
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
        macaronId={macaron.id as MacaronId}
        macaronIndex={macaronIndex}
        totalMacarons={1}
        onNext={() => setFlowScreen("complete")}
      />
    );
  }

  if (flowScreen === "intro") {
    return (
      <MacaronIntroScreen
        macaron={macaron}
        macaronIndex={macaronIndex}
        totalMacarons={1}
        onStart={() => setFlowScreen("survey")}
        onBack={() => router.push("/")}
      />
    );
  }

  return (
    <QuestionStep
      macaronId={macaron.id as MacaronId}
      macaronIndex={macaronIndex}
      onComplete={handleSurveyComplete}
      onBack={() => setFlowScreen("intro")}
    />
  );
}
