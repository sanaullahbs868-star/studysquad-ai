import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VotingEventView {
    id: EventId;
    winnerSubject?: string;
    proposedSubjects: Array<string>;
    createdAt: Timestamp;
    voteCounts: Array<[string, bigint]>;
    isLocked: boolean;
    hasVoted: boolean;
}
export type Timestamp = bigint;
export interface StudentView {
    id: UserId;
    displayName: string;
    rank: bigint;
    roleLabel: string;
    totalPoints: bigint;
}
export type EventId = bigint;
export interface QuizQuestion {
    id: QuestionId;
    questionText: string;
    options: Array<QuizOption>;
}
export type QuestionId = bigint;
export interface QuizView {
    id: QuizId;
    createdAt: Timestamp;
    subjectId: SubjectId;
    questions: Array<QuizQuestion>;
}
export type UserId = Principal;
export interface SubjectView {
    id: SubjectId;
    title: string;
    endDate: Timestamp;
    description: string;
    startDate: Timestamp;
}
export interface QuizAttempt {
    id: bigint;
    studentId: UserId;
    answers: Array<bigint>;
    score: bigint;
    isPerfect: boolean;
    attemptedAt: Timestamp;
    quizId: QuizId;
}
export interface QnAEntry {
    id: bigint;
    studentId: UserId;
    question: string;
    createdAt: Timestamp;
    answer: string;
    subjectId: SubjectId;
}
export interface QuizOption {
    text: string;
    isCorrect: boolean;
}
export type SubjectId = bigint;
export type QuizId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    askQuestion(subjectId: SubjectId, question: string): Promise<QnAEntry>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    castVote(eventId: EventId, subject: string): Promise<void>;
    clearMyGeminiApiKey(): Promise<void>;
    createVotingEvent(proposedSubjects: Array<string>): Promise<VotingEventView>;
    generateQuiz(subjectId: SubjectId): Promise<QuizView>;
    getActiveSubject(): Promise<SubjectView | null>;
    getActiveVotingEvent(): Promise<VotingEventView | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<StudentView>>;
    getMyProfile(): Promise<StudentView | null>;
    getMyQnA(subjectId: SubjectId): Promise<Array<QnAEntry>>;
    getMyQuizAttempts(): Promise<Array<QuizAttempt>>;
    getMyRank(): Promise<bigint>;
    getQuiz(subjectId: SubjectId): Promise<QuizView | null>;
    getRoleInfo(id: Principal): Promise<{
        displayName: string;
        isAdmin: boolean;
        isOwner: boolean;
    }>;
    getStudentProfile(id: UserId): Promise<StudentView | null>;
    isCallerAdmin(): Promise<boolean>;
    isMyGeminiConfigured(): Promise<boolean>;
    lockVoting(eventId: EventId): Promise<string | null>;
    registerStudent(displayName: string): Promise<StudentView>;
    registerWithPassword(displayName: string, password: string): Promise<{
        __kind__: "ok";
        ok: StudentView;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setActiveSubject(title: string, startDate: Timestamp, endDate: Timestamp): Promise<SubjectView>;
    setMyGeminiApiKey(key: string): Promise<void>;
    submitQuizAttempt(quizId: QuizId, answers: Array<bigint>): Promise<QuizAttempt>;
    updateMyDisplayName(name: string): Promise<void>;
}
