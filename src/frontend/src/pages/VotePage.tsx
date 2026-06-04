import { createActor } from "@/backend";
import { LoginPage } from "@/components/LoginPage";
import { RegisterModal } from "@/components/RegisterModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { VotingEventView } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, Plus, Trophy, Vote, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function VoteContent() {
  const { actor, isFetching } = useActor(createActor);
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [newSubjects, setNewSubjects] = useState<string[]>([
    "Biology",
    "Algebra",
    "World History",
  ]);
  const [inputValue, setInputValue] = useState("");

  const { data: votingEvent, isLoading } = useQuery<VotingEventView | null>({
    queryKey: ["votingEvent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getActiveVotingEvent();
    },
    enabled: !!actor && !isFetching,
  });

  const { mutateAsync: createEvent, isPending: isCreating } = useMutation({
    mutationFn: async (subjects: string[]) => {
      if (!actor) throw new Error("Not connected");
      return actor.createVotingEvent(subjects);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votingEvent"] });
      toast.success("Voting event created!");
    },
    onError: () => toast.error("Failed to create voting event."),
  });

  const { mutateAsync: castVote, isPending: isVoting } = useMutation({
    mutationFn: async ({
      eventId,
      subject,
    }: { eventId: bigint; subject: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.castVote(eventId, subject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votingEvent"] });
      toast.success("Vote cast! 🗳️");
    },
    onError: () => toast.error("Failed to cast vote."),
  });

  const { mutateAsync: lockEvent, isPending: isLocking } = useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.lockVoting(eventId);
    },
    onSuccess: (winner) => {
      queryClient.invalidateQueries({ queryKey: ["votingEvent"] });
      queryClient.invalidateQueries({ queryKey: ["activeSubject"] });
      if (winner) toast.success(`🏆 Winner: ${winner}`);
    },
    onError: () => toast.error("Failed to lock voting."),
  });

  // Toppers can vote if rank <= 3
  const isTopper =
    currentUser &&
    Number(currentUser.rank) <= 3 &&
    Number(currentUser.totalPoints) > 0;
  const canCreateEvent = isTopper;

  const addSubject = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !newSubjects.includes(trimmed)) {
      setNewSubjects((prev) => [...prev, trimmed]);
      setInputValue("");
    }
  };

  const removeSubject = (subject: string) => {
    setNewSubjects((prev) => prev.filter((s) => s !== subject));
  };

  const totalVotes = votingEvent
    ? votingEvent.voteCounts.reduce((sum, [, count]) => sum + Number(count), 0)
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <Vote className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl">Subject Voting</h1>
          <p className="text-sm text-muted-foreground">
            Class toppers vote on the next monthly subject
          </p>
        </div>
      </div>

      {/* Topper restriction notice */}
      {currentUser && !isTopper && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-muted/50 border border-border">
          <Trophy className="w-4 h-4 text-accent-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              Voting is for class toppers only.
            </span>{" "}
            Climb the leaderboard to earn voting rights! Top 3 members can vote.
          </p>
        </div>
      )}

      {/* Active Voting Event */}
      {votingEvent && !votingEvent.isLocked ? (
        <Card className="border-border" data-ocid="vote.active_event_card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Active Vote
              </CardTitle>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {votingEvent.voteCounts
              .sort(([, a], [, b]) => Number(b) - Number(a))
              .map(([subject, count], idx) => {
                const pct =
                  totalVotes > 0 ? (Number(count) / totalVotes) * 100 : 0;
                return (
                  <div
                    key={subject}
                    className="space-y-1.5"
                    data-ocid={`vote.subject_item.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {Number(count)} votes
                        </span>
                        {isTopper && !votingEvent.hasVoted && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              castVote({ eventId: votingEvent.id, subject })
                            }
                            disabled={isVoting}
                            className="h-6 px-2 text-xs"
                            data-ocid={`vote.cast_vote_button.${idx + 1}`}
                          >
                            Vote
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-smooth"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}

            {votingEvent.hasVoted && (
              <p
                className="text-xs text-muted-foreground text-center pt-1"
                data-ocid="vote.voted_success_state"
              >
                ✅ You have voted!
              </p>
            )}

            {isTopper && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 mt-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => lockEvent(votingEvent.id)}
                disabled={isLocking}
                data-ocid="vote.lock_voting_button"
              >
                <Lock className="w-3.5 h-3.5" />
                {isLocking ? "Locking…" : "Lock Voting & Set Subject"}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : votingEvent?.isLocked ? (
        <Card
          className="border-accent/30 bg-accent/5"
          data-ocid="vote.locked_event_card"
        >
          <CardContent className="p-6 text-center">
            <Trophy className="w-10 h-10 text-accent-foreground mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg">
              Winner Announced!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              This month's subject is:
            </p>
            <Badge className="mt-2 bg-accent/20 text-accent-foreground border-accent/30 text-base px-4 py-1">
              🎓 {votingEvent.winnerSubject ?? "TBD"}
            </Badge>
          </CardContent>
        </Card>
      ) : null}

      {/* Create New Event (toppers only) */}
      {canCreateEvent && !votingEvent && (
        <Card className="border-border" data-ocid="vote.create_event_card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Create Voting Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {newSubjects.map((s) => (
                <Badge
                  key={s}
                  className="bg-muted text-foreground border-border gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-smooth"
                  onClick={() => removeSubject(s)}
                >
                  {s} <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a subject…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubject();
                  }
                }}
                className="flex-1"
                data-ocid="vote.add_subject_input"
              />
              <Button
                type="button"
                onClick={addSubject}
                variant="outline"
                size="icon"
                data-ocid="vote.add_subject_button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={() => createEvent(newSubjects)}
              disabled={isCreating || newSubjects.length < 2}
              className="w-full bg-primary hover:bg-primary/90"
              data-ocid="vote.create_event_button"
            >
              {isCreating ? "Creating…" : "🗳️ Start Voting"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No event, not a topper */}
      {!votingEvent && !canCreateEvent && (
        <div
          className="text-center py-12 border border-dashed border-border rounded-2xl"
          data-ocid="vote.no_event_empty_state"
        >
          <Vote className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-sm">No active vote</p>
          <p className="text-xs text-muted-foreground mt-1">
            Class toppers will start the next voting event soon.
          </p>
        </div>
      )}
    </div>
  );
}

export default function VotePage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  if (loginStatus !== "success") {
    return <LoginPage />;
  }

  const needsRegistration = !userLoading && currentUser === null;

  return (
    <>
      <VoteContent />
      <RegisterModal open={needsRegistration} />
    </>
  );
}
