import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { BookOpen, Brain, Star, Trophy, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Q&A",
    desc: "Ask any question about your subject and get instant, accurate answers from Apex AI.",
  },
  {
    icon: Zap,
    title: "Smart Quizzes",
    desc: "Auto-generated quizzes tailored to your Grade 9 curriculum for rapid skill-building.",
  },
  {
    icon: Trophy,
    title: "Leaderboard & XP",
    desc: "Earn XP for every quiz and climb the class leaderboard to prove you're the top student.",
  },
  {
    icon: BookOpen,
    title: "Monthly Subjects",
    desc: "Class toppers vote on the subject each month — everyone learns what matters most.",
  },
  {
    icon: Star,
    title: "Achievements",
    desc: "Unlock badges for perfect scores, streaks, and active participation in the squad.",
  },
  {
    icon: Users,
    title: "Squad Voting",
    desc: "Top performers decide the learning focus. Build class consensus, shape your curriculum.",
  },
];

export function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoading = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        {/* Hero image */}
        <div className="relative mb-10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl border border-border">
          <img
            src="/assets/generated/hero-apex-ai.dim_1200x500.jpg"
            alt="StudySquad AI platform preview"
            className="w-full h-48 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              🎓 Grade 9 · Academic Year 2026
            </Badge>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-2xl relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
              <span className="text-primary">Study</span>
              <span className="text-foreground">Squad</span>
              <span className="text-accent"> AI</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Your class's AI learning companion. Master subjects, crush quizzes,
            earn XP, and compete with your squad — powered by{" "}
            <span className="text-primary font-semibold">Apex AI</span>.
          </p>

          <Button
            size="lg"
            onClick={() => login()}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-base shadow-lg"
            data-ocid="login.sign_in_button"
          >
            {isLoading ? "Signing in…" : "🚀 Sign In with Internet Identity"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Free & secure. No password needed.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 border-t border-border py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display font-bold text-2xl text-center mb-10">
            Everything your squad needs to succeed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-smooth group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-smooth">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-sm mb-1">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
