import {
  BasketCatchGame,
  type BasketInventory,
} from "@/components/BasketCatchGame";
import { BasketInventoryCard } from "@/components/BasketInventoryCard";
import { LoginPage } from "@/components/LoginPage";
import { RegisterModal } from "@/components/RegisterModal";
import { WordColorMixupGame } from "@/components/WordColorMixupGame";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveSubject } from "@/hooks/useActiveSubject";
import { useCurrentUser, useSetActiveSubject } from "@/hooks/useCurrentUser";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  Save,
  Sparkles,
  Trophy,
  Vote,
  Zap,
} from "lucide-react";
import { useState } from "react";

function AdminSubjectPanel() {
  const [subjectTitle, setSubjectTitle] = useState("");
  const [saved, setSaved] = useState(false);
  const { mutateAsync: setActiveSubject, isPending } = useSetActiveSubject();

  const handleSave = async () => {
    const trimmed = subjectTitle.trim();
    if (!trimmed) return;
    const now = BigInt(Date.now()) * BigInt(1_000_000);
    const oneMonth =
      BigInt(30) * BigInt(24) * BigInt(3_600) * BigInt(1_000_000_000);
    await setActiveSubject({
      title: trimmed,
      startDate: now,
      endDate: now + oneMonth,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section
      className="rounded-xl border border-border bg-muted/30 p-4"
      data-ocid="admin.subject_panel"
    >
      <div className="flex items-center gap-2 mb-3">
        <Save className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Subject Management
        </h3>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 min-w-0 rounded-lg bg-background border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Set active subject title…"
          value={subjectTitle}
          onChange={(e) => {
            setSubjectTitle(e.target.value);
            setSaved(false);
          }}
          data-ocid="admin.subject_input"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isPending || !subjectTitle.trim()}
          className="shrink-0"
          data-ocid="admin.subject_save_button"
        >
          {isPending ? "Saving…" : saved ? "✓ Saved" : "Set Subject"}
        </Button>
      </div>
    </section>
  );
}

function DashboardHome() {
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: subject, isLoading: subjectLoading } = useActiveSubject();
  const { data: leaderboard, isLoading: lbLoading } = useLeaderboard();
  const [mindRefresherOpen, setMindRefresherOpen] = useState(false);
  const [basketGameOpen, setBasketGameOpen] = useState(false);
  const [basketInventory, setBasketInventory] = useState<BasketInventory>({
    pumpkins: 0,
    sweets: 0,
    stars: 0,
  });

  const handleInventoryUpdate = (delta: Partial<BasketInventory>) => {
    setBasketInventory((prev) => ({
      pumpkins: prev.pumpkins + (delta.pumpkins ?? 0),
      sweets: prev.sweets + (delta.sweets ?? 0),
      stars: prev.stars + (delta.stars ?? 0),
    }));
  };

  const topThree = leaderboard?.slice(0, 3) ?? [];
  const canManage =
    currentUser?.roleLabel === "Developer, Owner" ||
    currentUser?.roleLabel === "Admin";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Admin Subject Management Panel */}
      {canManage && <AdminSubjectPanel />}

      {/* Welcome Banner */}
      <section
        className="rounded-2xl bg-card border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        data-ocid="home.welcome_card"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          {userLoading ? (
            <Skeleton className="h-6 w-48 mb-2" />
          ) : (
            <h1 className="font-display font-bold text-xl truncate">
              Welcome back, {currentUser?.displayName ?? "Squad Member"} 👋
            </h1>
          )}
          <p className="text-sm text-muted-foreground">
            Ready to level up? Your squad is counting on you.
          </p>
        </div>
        {currentUser && (
          <Badge className="bg-accent/20 text-accent-foreground border-accent/20 font-semibold shrink-0">
            🏅 Rank #{Number(currentUser.rank)} ·{" "}
            {Number(currentUser.totalPoints).toLocaleString()} XP
          </Badge>
        )}
      </section>

      {/* Active Subject */}
      <section data-ocid="home.active_subject_section">
        <h2 className="font-display font-bold text-lg mb-3">
          📚 This Month's Subject
        </h2>
        {subjectLoading ? (
          <Skeleton className="h-28 w-full rounded-xl" />
        ) : subject ? (
          <Card className="border-primary/30 bg-card hover:border-primary/60 transition-smooth">
            <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 text-xs">
                  Active Subject
                </Badge>
                <h3 className="font-display font-bold text-lg truncate">
                  {subject.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {subject.description}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/learn">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    data-ocid="home.go_learn_button"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Learn
                  </Button>
                </Link>
                <Link to="/quiz">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 gap-1"
                    data-ocid="home.go_quiz_button"
                  >
                    <Brain className="w-3.5 h-3.5" /> Quiz Me
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border">
            <CardContent
              className="p-8 text-center"
              data-ocid="home.no_subject_empty_state"
            >
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No active subject yet. Check back after the squad votes!
              </p>
              <Link to="/vote">
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 gap-1"
                  data-ocid="home.go_vote_button"
                >
                  <Vote className="w-3.5 h-3.5" /> See Voting
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Quick Actions */}
      <section data-ocid="home.quick_actions_section">
        <h2 className="font-display font-bold text-lg mb-3">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              {
                to: "/learn",
                icon: BookOpen,
                label: "Ask AI",
                color: "bg-primary/10 text-primary",
                ocid: "home.quick_learn_button",
              },
              {
                to: "/quiz",
                icon: Brain,
                label: "Take Quiz",
                color: "bg-secondary/10 text-secondary",
                ocid: "home.quick_quiz_button",
              },
              {
                to: "/leaderboard",
                icon: Trophy,
                label: "Leaderboard",
                color: "bg-accent/10 text-accent-foreground",
                ocid: "home.quick_leaderboard_button",
              },
              {
                to: "/vote",
                icon: Vote,
                label: "Vote Now",
                color: "bg-muted text-foreground",
                ocid: "home.quick_vote_button",
              },
            ] as const
          ).map(({ to, icon: Icon, label, color, ocid }) => (
            <Link key={to} to={to}>
              <button
                type="button"
                className={`w-full rounded-xl p-4 flex flex-col items-center gap-2 border border-border hover:border-primary/40 transition-smooth ${color} bg-card`}
                data-ocid={ocid}
              >
                <div
                  className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">{label}</span>
              </button>
            </Link>
          ))}

          {/* Mind Refresher button */}
          <button
            type="button"
            onClick={() => setMindRefresherOpen(true)}
            className="col-span-2 sm:col-span-2 w-full rounded-xl p-4 flex items-center justify-center gap-3 border-2 transition-smooth"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.15) 100%)",
              borderColor: "rgba(168,85,247,0.4)",
            }}
            data-ocid="home.mind_refresher_button"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg,#a855f7,#ec4899)",
                boxShadow: "0 0 12px rgba(168,85,247,0.5)",
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span
                className="block text-sm font-bold"
                style={{ color: "#c084fc" }}
              >
                Mind Refresher
              </span>
              <span
                className="block text-xs"
                style={{ color: "rgba(196,132,252,0.7)" }}
              >
                Word-Color &amp; Scramble &rarr; brain break!
              </span>
            </div>
          </button>

          {/* Basket Event button */}
          <button
            type="button"
            onClick={() => setBasketGameOpen(true)}
            className="col-span-2 sm:col-span-2 w-full rounded-xl p-4 flex items-center justify-center gap-3 border-2 transition-smooth"
            style={{
              background:
                "linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(250,204,21,0.12) 100%)",
              borderColor: "rgba(251,146,60,0.45)",
            }}
            data-ocid="home.basket_event_button"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xl"
              style={{
                background: "linear-gradient(135deg,#fb923c,#f59e0b)",
                boxShadow: "0 0 12px rgba(251,146,60,0.5)",
              }}
            >
              🧺
            </div>
            <div className="text-left">
              <span
                className="block text-sm font-bold"
                style={{ color: "#fb923c" }}
              >
                Basket Event
              </span>
              <span
                className="block text-xs"
                style={{ color: "rgba(251,146,60,0.7)" }}
              >
                Catch treats &amp; fill your basket!
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Top Leaderboard Preview */}
      <section data-ocid="home.leaderboard_preview_section">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg">
            🏆 Top Squad Members
          </h2>
          <Link to="/leaderboard">
            <Button
              size="sm"
              variant="ghost"
              className="text-primary text-xs"
              data-ocid="home.view_leaderboard_button"
            >
              View all
            </Button>
          </Link>
        </div>
        <Card className="border-border">
          <CardContent className="p-0">
            {lbLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : topThree.length === 0 ? (
              <div
                className="p-8 text-center"
                data-ocid="home.leaderboard_empty_state"
              >
                <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No squad members yet. Be the first!
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {topThree.map((student, index) => (
                  <li
                    key={student.id.toString()}
                    className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-smooth"
                    data-ocid={`home.leaderboard_item.${index + 1}`}
                  >
                    <span className="w-6 text-center">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {student.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 font-medium text-sm min-w-0 flex items-center gap-2">
                      <span className="truncate min-w-0">
                        {student.displayName}
                      </span>
                    </span>
                    <Badge className="bg-accent/20 text-accent-foreground border-accent/20 text-xs shrink-0">
                      {Number(student.totalPoints).toLocaleString()} XP
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
      <WordColorMixupGame
        open={mindRefresherOpen}
        onClose={() => setMindRefresherOpen(false)}
      />

      {/* Basket Catch Game Dialog */}
      <Dialog open={basketGameOpen} onOpenChange={(v) => setBasketGameOpen(v)}>
        <DialogContent
          className="max-w-lg w-full p-0 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0d0520 0%, #0a0a1a 100%)",
            border: "1px solid rgba(168,85,247,0.5)",
            boxShadow: "0 0 40px rgba(88,28,235,0.4)",
          }}
          data-ocid="basket.catch_game_dialog"
        >
          <DialogHeader
            className="px-5 pt-5 pb-3"
            style={{ borderBottom: "1px solid rgba(168,85,247,0.2)" }}
          >
            <DialogTitle style={{ color: "#c084fc" }}>
              🧺 Basket Event — Catch &amp; Collect
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <BasketCatchGame onInventoryUpdate={handleInventoryUpdate} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Basket Inventory Card (fixed position) */}
      <BasketInventoryCard
        inventory={basketInventory}
        onOpenCatchGame={() => {
          setBasketGameOpen(true);
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  const isAuthenticated = loginStatus === "success";
  const needsRegistration =
    isAuthenticated && !userLoading && currentUser === null;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <DashboardHome />
      <RegisterModal open={needsRegistration} />
    </>
  );
}
