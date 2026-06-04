import { createActor } from "@/backend";
import { LoginPage } from "@/components/LoginPage";
import { RegisterModal } from "@/components/RegisterModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveSubject } from "@/hooks/useActiveSubject";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { QuizAttempt, QuizView } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  CheckCircle,
  RefreshCw,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function QuizContent() {
  const { actor, isFetching } = useActor(createActor);
  const { data: subject, isLoading: subjectLoading } = useActiveSubject();
  const queryClient = useQueryClient();
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  const subjectId = subject?.id;

  const { data: quiz, isLoading: quizLoading } = useQuery<QuizView | null>({
    queryKey: ["quiz", subjectId?.toString()],
    queryFn: async () => {
      if (!actor || subjectId === undefined) return null;
      return actor.getQuiz(subjectId);
    },
    enabled: !!actor && !isFetching && subjectId !== undefined,
  });

  const { mutateAsync: generateQuiz, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      if (!actor || subjectId === undefined) throw new Error("Not ready");
      return actor.generateQuiz(subjectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quiz", subjectId?.toString()],
      });
      setSelectedAnswers({});
      setSubmitted(false);
      setLastAttempt(null);
    },
    onError: () =>
      toast.error(
        "Failed to generate quiz. Check your Gemini API key in Settings.",
      ),
  });

  const { mutateAsync: submitAttempt, isPending: isSubmitting } = useMutation({
    mutationFn: async (answers: bigint[]) => {
      if (!actor || !quiz) throw new Error("Not ready");
      return actor.submitQuizAttempt(quiz.id, answers);
    },
    onSuccess: (attempt) => {
      setLastAttempt(attempt);
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: () => toast.error("Failed to submit quiz."),
  });

  const handleSubmit = async () => {
    if (!quiz) return;
    const answers = quiz.questions.map((_, idx) =>
      BigInt(selectedAnswers[idx] ?? 0),
    );
    await submitAttempt(answers);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setLastAttempt(null);
  };

  if (subjectLoading || quizLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!subject) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center max-w-xl"
        data-ocid="quiz.no_subject_empty_state"
      >
        <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl mb-2">
          No Active Subject
        </h2>
        <p className="text-sm text-muted-foreground">
          No active subject for quizzes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl">Quiz Time!</h1>
            <p className="text-sm text-muted-foreground">{subject.title}</p>
          </div>
        </div>
        <Button
          onClick={() => generateQuiz()}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="gap-1.5"
          data-ocid="quiz.generate_button"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`}
          />
          {isGenerating ? "Generating…" : "New Quiz"}
        </Button>
      </div>

      {/* Result Banner */}
      {submitted && lastAttempt && (
        <Card
          className={`border-2 ${
            lastAttempt.isPerfect
              ? "border-accent bg-accent/5"
              : Number(lastAttempt.score) >= (quiz?.questions.length ?? 0) / 2
                ? "border-primary bg-primary/5"
                : "border-border"
          }`}
          data-ocid="quiz.result_card"
        >
          <CardContent className="p-5 text-center">
            <div className="text-3xl mb-2">
              {lastAttempt.isPerfect
                ? "🏆"
                : Number(lastAttempt.score) >= (quiz?.questions.length ?? 0) / 2
                  ? "⚡"
                  : "💪"}
            </div>
            <h3 className="font-display font-bold text-lg">
              {lastAttempt.isPerfect
                ? "Perfect Score!"
                : `Score: ${Number(lastAttempt.score)}/${quiz?.questions.length ?? 0}`}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {lastAttempt.isPerfect
                ? "Incredible! You aced it!"
                : `You got ${Number(lastAttempt.score)} out of ${quiz?.questions.length ?? 0} correct.`}
            </p>
            <Button
              onClick={handleReset}
              size="sm"
              variant="outline"
              className="mt-3"
              data-ocid="quiz.try_again_button"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No Quiz Yet */}
      {!quiz && !isGenerating && (
        <div
          className="text-center py-16 border border-dashed border-border rounded-2xl"
          data-ocid="quiz.no_quiz_empty_state"
        >
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display font-bold text-lg mb-2">No quiz yet</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Generate a quiz for {subject.title} with Apex AI!
          </p>
          <Button
            onClick={() => generateQuiz()}
            className="bg-primary hover:bg-primary/90 gap-2"
            data-ocid="quiz.generate_first_button"
          >
            <Zap className="w-4 h-4" /> Generate Quiz
          </Button>
        </div>
      )}

      {/* Questions */}
      {quiz && !submitted && (
        <div className="space-y-4" data-ocid="quiz.questions_list">
          {quiz.questions.map((question, qIdx) => (
            <Card
              key={question.id.toString()}
              className="border-border"
              data-ocid={`quiz.question.${qIdx + 1}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex gap-2">
                  <span className="text-primary">{qIdx + 1}.</span>
                  {question.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {question.options.map((option, oIdx) => (
                  <button
                    key={`q${qIdx}-o${option.text}`}
                    type="button"
                    onClick={() =>
                      setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                    }
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-smooth ${
                      selectedAnswers[qIdx] === oIdx
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                    data-ocid={`quiz.option.${qIdx + 1}.${oIdx + 1}`}
                  >
                    <span className="font-bold mr-2">
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    {option.text}
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              Object.keys(selectedAnswers).length < quiz.questions.length
            }
            className="w-full bg-primary hover:bg-primary/90"
            data-ocid="quiz.submit_button"
          >
            {isSubmitting ? "Submitting…" : "Submit Answers"}
          </Button>
        </div>
      )}

      {/* Submitted view — show correct/wrong */}
      {quiz && submitted && (
        <div className="space-y-4" data-ocid="quiz.review_list">
          {quiz.questions.map((question, qIdx) => (
            <Card
              key={question.id.toString()}
              className="border-border"
              data-ocid={`quiz.review_item.${qIdx + 1}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex gap-2">
                  <span className="text-primary">{qIdx + 1}.</span>
                  {question.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {question.options.map((option, oIdx) => {
                  const chosen = selectedAnswers[qIdx] === oIdx;
                  const correct = option.isCorrect;
                  return (
                    <div
                      key={`r${qIdx}-o${option.text}`}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm flex items-center gap-2 ${
                        correct
                          ? "border-primary bg-primary/10 text-primary"
                          : chosen && !correct
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border text-muted-foreground"
                      }`}
                    >
                      {correct ? (
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      ) : chosen ? (
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <span className="w-3.5" />
                      )}
                      <span className="font-bold mr-1">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      {option.text}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  if (loginStatus !== "success") {
    return <LoginPage />;
  }

  const needsRegistration = !userLoading && currentUser === null;

  return (
    <>
      <QuizContent />
      <RegisterModal open={needsRegistration} />
    </>
  );
}
