import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { MacaronId, SurveyAnswer } from "@/types/survey";

const PARTICIPANT_KEY = "macaron-sensory-map-participant-id";
const COLLECTION      = "survey-answers";

const VALID_MACARON_IDS: MacaronId[] = [
  "UMEDA-BC4000",
  "TAKARAZUKA-1887",
  "KAWANISHI-2026",
];

// ── participantId はデバイスに紐づけるため引き続き localStorage ────────────
export function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(PARTICIPANT_KEY);
  if (!id) {
    id = "P-" + crypto.randomUUID().slice(0, 6).toUpperCase();
    localStorage.setItem(PARTICIPANT_KEY, id);
  }
  return id;
}

// ── Firestore ドキュメント ID: "{participantId}_{macaronId}" ────────────────
// この形式にすることで upsert が setDoc 一発で済み、複合インデックス不要
function surveyDocId(participantId: string, macaronId: MacaronId): string {
  return `${participantId}_${macaronId}`;
}

// ── 書き込み ────────────────────────────────────────────────────────────────
export function saveSurveyAnswer(answer: SurveyAnswer): void {
  const id = surveyDocId(answer.participantId, answer.macaronId);
  setDoc(doc(db, COLLECTION, id), answer).catch(console.error);
}

// ── 一括削除（現在の参加者の回答のみ）───────────────────────────────────────
export function clearSurveyAnswers(): void {
  const participantId = getParticipantId();
  const batch = writeBatch(db);
  for (const macaronId of VALID_MACARON_IDS) {
    batch.delete(doc(db, COLLECTION, surveyDocId(participantId, macaronId)));
  }
  batch.commit().catch(console.error);
}

// ── リアルタイム購読 ─────────────────────────────────────────────────────────
export function subscribeSurveyAnswers(
  callback: (answers: SurveyAnswer[]) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTION),
    (snap) => callback(snap.docs.map((d) => d.data() as SurveyAnswer)),
    (err) => console.error("[subscribeSurveyAnswers]", err),
  );
}

// ── 一度だけ読み込み（必要な場合）───────────────────────────────────────────
export async function getSurveyAnswers(): Promise<SurveyAnswer[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => d.data() as SurveyAnswer);
}

// ── 回答済み確認 ─────────────────────────────────────────────────────────────
export async function hasAnswered(macaronId: MacaronId): Promise<boolean> {
  const participantId = getParticipantId();
  const ref  = doc(db, COLLECTION, surveyDocId(participantId, macaronId));
  const snap = await getDoc(ref);
  return snap.exists();
}
