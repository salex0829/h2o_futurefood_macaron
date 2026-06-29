import { MacaronId, SurveyAnswer } from "@/types/survey";

const STORAGE_KEY = "macaron-sensory-map-answers";
const PARTICIPANT_KEY = "macaron-sensory-map-participant-id";

export function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(PARTICIPANT_KEY);
  if (!id) {
    id = "P-" + crypto.randomUUID().slice(0, 6).toUpperCase();
    localStorage.setItem(PARTICIPANT_KEY, id);
  }
  return id;
}

export function getSurveyAnswers(): SurveyAnswer[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SurveyAnswer[];
  } catch {
    return [];
  }
}

export function saveSurveyAnswer(answer: SurveyAnswer): void {
  if (typeof window === "undefined") return;
  const answers = getSurveyAnswers();
  // Overwrite if same participant + macaron already exists
  const filtered = answers.filter(
    (a) => !(a.participantId === answer.participantId && a.macaronId === answer.macaronId)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...filtered, answer]));
}

export function clearSurveyAnswers(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasAnswered(macaronId: MacaronId): boolean {
  const answers = getSurveyAnswers();
  return answers.some((a) => a.macaronId === macaronId);
}
