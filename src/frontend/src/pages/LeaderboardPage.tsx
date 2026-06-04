import { LoginPage } from "@/components/LoginPage";
import { RegisterModal } from "@/components/RegisterModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Trophy } from "lucide-react";

const MEDALS = ["🥇", "🥈", "🥉"];

function LeaderboardContent() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Top performers in the squad
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      {!isLoading && leaderboard && leaderboard.length >= 3 && (
        <div
          className="grid grid-cols-3 gap-3 mb-2"
          data-ocid="leaderboard.podium_section"
        >
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map(
            (student, podiumIdx) => {
              const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
              const _heights = ["h-24", "h-32", "h-20"];
              return (
                <div
                  key={student.id.toString()}
                  className={`flex flex-col items-center justify-end gap-2 bg-card border border-border rounded-xl p-3 ${
                    actualRank === 1 ? "border-accent/40" : ""
                  }`}
                  data-ocid={`leaderboard.podium.${actualRank}`}
                >
                  <span className="text-2xl">{MEDALS[actualRank - 1]}</span>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback
                      className={`text-xs font-bold ${
                        actualRank === 1
                          ? "bg-accent/20 text-accent-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {student.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-semibold text-center truncate w-full">
                    {student.displayName}
                  </p>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {Number(student.totalPoints).toLocaleString()} XP
                  </Badge>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* Full List */}
      <Card className="border-border" data-ocid="leaderboard.list">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[
                "sk-a",
                "sk-b",
                "sk-c",
                "sk-d",
                "sk-e",
                "sk-f",
                "sk-g",
                "sk-h",
              ].map((id) => (
                <Skeleton key={id} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : !leaderboard || leaderboard.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="leaderboard.empty_state"
            >
              <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-sm">No students yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Be the first to join the squad!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {leaderboard.map((student, index) => {
                const isCurrentUser =
                  currentUser?.id.toString() === student.id.toString();
                return (
                  <li
                    key={student.id.toString()}
                    className={`flex items-center gap-3 px-4 py-3 transition-smooth ${
                      isCurrentUser ? "bg-primary/5" : "hover:bg-muted/20"
                    }`}
                    data-ocid={`leaderboard.item.${index + 1}`}
                  >
                    <span className="w-8 text-center text-sm font-bold text-muted-foreground">
                      {index < 3 ? MEDALS[index] : `#${index + 1}`}
                    </span>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {student.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`flex-1 text-sm font-medium truncate min-w-0 flex items-center gap-2 ${
                        isCurrentUser ? "text-primary" : ""
                      }`}
                    >
                      <span className="truncate min-w-0">
                        {student.displayName}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          (You)
                        </span>
                      )}
                      {student.roleLabel === "Developer, Owner" && (
                        <Badge className="shrink-0 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0 h-4 font-semibold">
                          👑 {student.roleLabel}
                        </Badge>
                      )}
                      {student.roleLabel === "Admin" && (
                        <Badge className="shrink-0 bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0 h-4 font-semibold">
                          🛡 Admin
                        </Badge>
                      )}
                    </span>
                    <Badge className="bg-accent/15 text-accent-foreground border-accent/20 text-xs shrink-0">
                      {Number(student.totalPoints).toLocaleString()} XP
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LeaderboardPage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  if (loginStatus !== "success") {
    return <LoginPage />;
  }

  const needsRegistration = !userLoading && currentUser === null;

  return (
    <>
      <LeaderboardContent />
      <RegisterModal open={needsRegistration} />
    </>
  );
}
