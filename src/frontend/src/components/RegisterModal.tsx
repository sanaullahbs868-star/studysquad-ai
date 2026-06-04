import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useRegisterStudent,
  useRegisterWithPassword,
} from "@/hooks/useCurrentUser";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useState } from "react";

interface RegisterModalProps {
  open: boolean;
}

export function RegisterModal({ open }: RegisterModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const { mutateAsync, isPending } = useRegisterStudent();
  const { mutateAsync: registerWithPassword, isPending: isPendingPw } =
    useRegisterWithPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 30) {
      setError("Name must be 30 characters or less.");
      return;
    }
    setError("");
    if (showAccessCode && accessCode.trim()) {
      const result = await registerWithPassword({
        displayName: trimmed,
        password: accessCode.trim(),
      });
      if (result.__kind__ === "err") {
        setError(result.err || "Invalid access code.");
        return;
      }
    } else {
      await mutateAsync(trimmed);
    }
  };

  const isLoading = isPending || isPendingPw;

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        data-ocid="register.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <DialogTitle className="font-display font-bold text-xl">
              Welcome to StudySquad AI!
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a display name to join your class squad. This is how your
            classmates will see you on the leaderboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </Label>
            <Input
              id="displayName"
              placeholder="e.g. Alex Carter"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (error) setError("");
              }}
              maxLength={30}
              autoFocus
              data-ocid="register.display_name_input"
            />
            {error && (
              <p
                className="text-xs text-destructive"
                data-ocid="register.field_error"
              >
                {error}
              </p>
            )}

            {/* Special access code toggle */}
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
              onClick={() => {
                setShowAccessCode((v) => !v);
                setAccessCode("");
                setError("");
              }}
              data-ocid="register.access_code_toggle"
            >
              {showAccessCode ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              I have a special access code
            </button>

            {showAccessCode && (
              <div
                className="space-y-1"
                data-ocid="register.access_code_section"
              >
                <Label
                  htmlFor="accessCode"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Access Code
                </Label>
                <Input
                  id="accessCode"
                  type="password"
                  placeholder="Enter your access code"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (error) setError("");
                  }}
                  data-ocid="register.access_code_input"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || !displayName.trim()}
              className="w-full bg-primary hover:bg-primary/90"
              data-ocid="register.submit_button"
            >
              {isLoading ? "Joining…" : "🎓 Join the Squad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
