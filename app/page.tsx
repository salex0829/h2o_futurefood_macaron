"use client";

import { useState } from "react";
import StartScreen from "@/components/StartScreen";
import SequentialSurveyFlow from "@/components/SequentialSurveyFlow";

type Screen = "start" | "flow";

export default function SurveyPage() {
  const [screen, setScreen] = useState<Screen>("start");

  if (screen === "start") {
    return <StartScreen onStart={() => setScreen("flow")} />;
  }

  return <SequentialSurveyFlow onBack={() => setScreen("start")} />;
}
