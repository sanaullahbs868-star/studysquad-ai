import type { Principal } from "@icp-sdk/core/principal";

export type UserId = Principal;
export type SubjectId = bigint;
export type QuizId = bigint;
export type QuestionId = bigint;
export type EventId = bigint;
export type Timestamp = bigint;

export interface StudentView {
  id: UserId;
  displayName: string;
  rank: bigint;
  totalPoints: bigint;
  roleLabel: string;
}

export interface SubjectView {
  id: SubjectId;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: QuestionId;
  questionText: string;
  options: QuizOption[];
}

export interface QuizView {
  id: QuizId;
  subjectId: SubjectId;
  questions: QuizQuestion[];
  createdAt: Timestamp;
}

export interface QuizAttempt {
  id: bigint;
  studentId: UserId;
  quizId: QuizId;
  answers: bigint[];
  score: bigint;
  isPerfect: boolean;
  attemptedAt: Timestamp;
}

export interface QnAEntry {
  id: bigint;
  studentId: UserId;
  subjectId: SubjectId;
  question: string;
  answer: string;
  createdAt: Timestamp;
}

export interface VotingEventView {
  id: EventId;
  proposedSubjects: string[];
  voteCounts: [string, bigint][];
  isLocked: boolean;
  hasVoted: boolean;
  winnerSubject?: string;
  createdAt: Timestamp;
}
