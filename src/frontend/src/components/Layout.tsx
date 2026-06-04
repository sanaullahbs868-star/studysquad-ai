import ApexAIBadge from "@/components/ApexAIBadge";
import { GeminiKeyDialog } from "@/components/GeminiKeyDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  Home,
  LogOut,
  Menu,
  Settings,
  Trophy,
  Vote,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/quiz", label: "Quiz", icon: Brain },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/vote", label: "Vote", icon: Vote },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { loginStatus, login, clear } = useInternetIdentity();
  const { data: currentUser } = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [geminiDialogOpen, setGeminiDialogOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = loginStatus === "success";

  const initials = currentUser?.displayName
    ? currentUser.displayName.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.logo"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-smooth">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              <span className="text-primary">Study</span>
              <span className="text-foreground">Squad</span>
              <span className="text-accent"> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                data-ocid={`nav.${label.toLowerCase()}_link`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  currentPath === to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <Button
                onClick={() => login()}
                size="sm"
                className="bg-primary hover:bg-primary/90"
                data-ocid="nav.login_button"
              >
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-smooth"
                    data-ocid="nav.profile_button"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {currentUser && (
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-xs font-semibold text-foreground leading-none">
                          {currentUser.displayName}
                        </span>
                        <Badge
                          variant="secondary"
                          className="h-4 text-[10px] px-1 mt-0.5 bg-accent/20 text-accent-foreground border-0"
                        >
                          {Number(currentUser.totalPoints).toLocaleString()} XP
                        </Badge>
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {currentUser && (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold">
                          {currentUser.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rank #{Number(currentUser.rank)} ·{" "}
                          {Number(currentUser.totalPoints).toLocaleString()} XP
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => setGeminiDialogOpen(true)}
                    data-ocid="nav.gemini_settings_button"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Gemini Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => clear()}
                    className="text-destructive focus:text-destructive"
                    data-ocid="nav.logout_button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-muted transition-smooth"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="nav.mobile_menu_button"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                data-ocid={`nav.mobile_${label.toLowerCase()}_link`}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth ${
                  currentPath === to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <GeminiKeyDialog
        open={geminiDialogOpen}
        onOpenChange={setGeminiDialogOpen}
      />

      <ApexAIBadge />
    </div>
  );
}
