import { createActor } from "@/backend";
import { LoginPage } from "@/components/LoginPage";
import { RegisterModal } from "@/components/RegisterModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActiveSubject } from "@/hooks/useActiveSubject";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { QnAEntry } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Brain, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function LearnContent() {
  const { actor, isFetching } = useActor(createActor);
  const { data: subject, isLoading: subjectLoading } = useActiveSubject();
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState("");

  const subjectId = subject?.id;

  const { data: qna, isLoading: qnaLoading } = useQuery<QnAEntry[]>({
    queryKey: ["myQnA", subjectId?.toString()],
    queryFn: async () => {
      if (!actor || subjectId === undefined) return [];
      return actor.getMyQnA(subjectId);
    },
    enabled: !!actor && !isFetching && subjectId !== undefined,
  });

  const { mutateAsync: askQuestion, isPending } = useMutation({
    mutationFn: async (q: string) => {
      if (!actor || subjectId === undefined) throw new Error("Not ready");
      return actor.askQuestion(subjectId, q);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myQnA", subjectId?.toString()],
      });
      setQuestion("");
    },
    onError: () =>
      toast.error(
        "Failed to get an answer. Check your Gemini API key in Settings.",
      ),
  });

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    await askQuestion(trimmed);
  };

  if (subjectLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center max-w-xl"
        data-ocid="learn.no_subject_empty_state"
      >
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl mb-2">
          No Active Subject
        </h2>
        <p className="text-sm text-muted-foreground">
          The squad hasn't picked a subject yet. Check back after voting!
        </p>
      </div>
    );
  }

  const sortedQnA = [...(qna ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl">Ask Apex AI</h1>
          <p className="text-sm text-muted-foreground">
            Subject:{" "}
            <span className="text-foreground font-medium">{subject.title}</span>
          </p>
        </div>
      </div>

      {/* Ask Question Form */}
      <Card className="border-border" data-ocid="learn.ask_card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Ask a Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAsk} className="space-y-3">
            <Textarea
              placeholder={`Ask anything about ${subject.title}…`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="resize-none"
              data-ocid="learn.question_textarea"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending || !question.trim()}
                className="bg-primary hover:bg-primary/90 gap-2"
                data-ocid="learn.ask_submit_button"
              >
                {isPending ? (
                  "Thinking…"
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Ask AI
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Q&A History */}
      <div data-ocid="learn.qna_list">
        <h2 className="font-display font-semibold text-base mb-3">
          My Q&amp;A History ({sortedQnA.length})
        </h2>
        {qnaLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : sortedQnA.length === 0 ? (
          <div
            className="text-center py-10 border border-border rounded-xl"
            data-ocid="learn.qna_empty_state"
          >
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No questions yet. Ask Apex AI something!
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-3 pr-2">
              {sortedQnA.map((entry, index) => (
                <Card
                  key={entry.id.toString()}
                  className="border-border"
                  data-ocid={`learn.qna_item.${index + 1}`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Badge className="mb-1 bg-primary/10 text-primary border-primary/20 text-xs">
                        You asked
                      </Badge>
                      <p className="text-sm font-medium">{entry.question}</p>
                    </div>
                    <div>
                      <Badge className="mb-1 bg-secondary/10 text-secondary border-secondary/20 text-xs">
                        Apex AI
                      </Badge>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {entry.answer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

export default function LearnPage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  if (loginStatus !== "success") {
    return <LoginPage />;
  }

  const needsRegistration = !userLoading && currentUser === null;

  return (
    <>
      <LearnContent />
      <RegisterModal open={needsRegistration} />
    </>
  );
}
