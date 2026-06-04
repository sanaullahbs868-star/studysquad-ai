import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
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
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Key, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GeminiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GeminiKeyDialog({ open, onOpenChange }: GeminiKeyDialogProps) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [keyValue, setKeyValue] = useState("");

  const { data: isConfigured } = useQuery<boolean>({
    queryKey: ["geminiConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isMyGeminiConfigured();
    },
    enabled: !!actor && !isFetching && open,
  });

  const { mutateAsync: saveKey, isPending: isSaving } = useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.setMyGeminiApiKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geminiConfigured"] });
      toast.success("Gemini API key saved!");
      setKeyValue("");
      onOpenChange(false);
    },
    onError: () => toast.error("Failed to save API key."),
  });

  const { mutateAsync: clearKey, isPending: isClearing } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.clearMyGeminiApiKey();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geminiConfigured"] });
      toast.success("API key removed.");
    },
    onError: () => toast.error("Failed to remove API key."),
  });

  useEffect(() => {
    if (!open) setKeyValue("");
  }, [open]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyValue.trim()) {
      toast.error("Please enter a valid API key.");
      return;
    }
    await saveKey(keyValue.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="gemini_key.dialog">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Key className="w-4 h-4 text-secondary" />
            </div>
            <DialogTitle className="font-display font-bold">
              Google Gemini Settings
            </DialogTitle>
          </div>
          <DialogDescription>
            Connect your Google Gemini API key to enable AI-powered Q&amp;A and
            quiz generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Status */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            {isConfigured ? (
              <>
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm">API key is configured</span>
                <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs">
                  Active
                </Badge>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  No API key configured
                </span>
              </>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="gemini-apikey" className="text-sm font-medium">
                {isConfigured ? "Replace API Key" : "Enter API Key"}
              </Label>
              <Input
                id="gemini-apikey"
                type="password"
                placeholder="AIza…"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                data-ocid="gemini_key.input"
              />
              <p className="text-xs text-muted-foreground">
                Get your key at{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  aistudio.google.com
                </a>
              </p>
            </div>
            <DialogFooter className="flex gap-2 flex-row">
              {isConfigured && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => clearKey()}
                  disabled={isClearing}
                  className="gap-1"
                  data-ocid="gemini_key.delete_button"
                >
                  <Trash2 className="w-3 h-3" />
                  {isClearing ? "Removing…" : "Remove"}
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={isSaving || !keyValue.trim()}
                className="flex-1 bg-primary hover:bg-primary/90"
                data-ocid="gemini_key.save_button"
              >
                {isSaving ? "Saving…" : "Save Key"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
