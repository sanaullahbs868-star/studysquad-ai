import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Word-Color Mixup constants ───────────────────────────────────────────────
const WCM_TOTAL_ROUNDS = 5;
const WCM_TIME_PER_ROUND = 10;

const COLORS = [
  { name: "RED", hex: "#ef4444" },
  { name: "BLUE", hex: "#3b82f6" },
  { name: "GREEN", hex: "#22c55e" },
  { name: "YELLOW", hex: "#eab308" },
  { name: "PURPLE", hex: "#a855f7" },
  { name: "ORANGE", hex: "#f97316" },
  { name: "PINK", hex: "#ec4899" },
  { name: "CYAN", hex: "#06b6d4" },
];

// ─── Scramble Cards constants ─────────────────────────────────────────────────
const SC_TOTAL_ROUNDS = 6;
const SC_TIME_PER_ROUND = 20;
const SC_BONUS_THRESHOLD = 10;
const SC_CORRECT_PTS = 10;
const SC_BONUS_PTS = 5;

const SCRAMBLE_WORDS = [
  "ALGEBRA",
  "GEOMETRY",
  "PHYSICS",
  "HISTORY",
  "BIOLOGY",
  "EQUATION",
  "TRIANGLE",
  "FRACTION",
  "VELOCITY",
  "NITROGEN",
];

// Tile accent colors for scramble letter tiles
const TILE_COLORS = [
  "#a855f7",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#eab308",
  "#ef4444",
];

type GamePick = "select" | "wcm" | "scramble";
type GameState = "idle" | "playing" | "gameover";

// ─── WCM types ────────────────────────────────────────────────────────────────
interface WcmRound {
  word: (typeof COLORS)[number];
  fontColor: (typeof COLORS)[number];
  options: (typeof COLORS)[number][];
}

function pickWcmRound(): WcmRound {
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
  const word = shuffled[0];
  const fontColor = shuffled.find((c) => c.name !== word.name) ?? shuffled[1];
  const pool = [...COLORS]
    .filter((c) => c.name !== fontColor.name)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [fontColor, ...pool].sort(() => Math.random() - 0.5);
  return { word, fontColor, options };
}

// ─── Scramble types ───────────────────────────────────────────────────────────
interface ScrambleRound {
  answer: string;
  scrambled: string[];
  tileColors: string[];
}

function pickScrambleRound(usedWords: Set<string>): ScrambleRound {
  const available = SCRAMBLE_WORDS.filter((w) => !usedWords.has(w));
  const pool = available.length > 0 ? available : SCRAMBLE_WORDS;
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const scrambled = answer.split("").sort(() => Math.random() - 0.5);
  // Ensure it's actually scrambled (not same order)
  let attempts = 0;
  while (scrambled.join("") === answer && attempts < 20) {
    scrambled.sort(() => Math.random() - 0.5);
    attempts++;
  }
  const tileColors = scrambled.map(
    (_, i) => TILE_COLORS[i % TILE_COLORS.length],
  );
  return { answer, scrambled, tileColors };
}

function timerColor(t: number, max: number) {
  const pct = t / max;
  return pct > 0.5 ? "#22c55e" : pct > 0.25 ? "#eab308" : "#ef4444";
}

interface Props {
  open: boolean;
  onClose: () => void;
}

// ─── Game Selection Screen ────────────────────────────────────────────────────
function GameSelectScreen({
  onPick,
  onClose,
}: {
  onPick: (g: "wcm" | "scramble") => void;
  onClose: () => void;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)",
        boxShadow: "0 0 60px rgba(139,92,246,0.5), 0 20px 60px rgba(0,0,0,0.6)",
      }}
    >
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span
            className="font-bold text-lg tracking-wide"
            style={{ color: "#a5f3fc" }}
          >
            Mind Refresher
          </span>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors text-xl leading-none px-1"
          data-ocid="mind_refresher.close_button"
        >
          ✕
        </button>
      </div>
      <div className="px-6 pb-8 pt-4 flex flex-col gap-4">
        <p className="text-white/70 text-sm text-center">
          Pick a game for your brain break! ⚡
        </p>
        {/* Word-Color Mixup card */}
        <button
          type="button"
          onClick={() => onPick("wcm")}
          className="w-full rounded-xl p-4 flex items-center gap-4 text-left transition-transform active:scale-95 hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(236,72,153,0.2))",
            border: "2px solid rgba(249,115,22,0.4)",
            boxShadow: "0 4px 20px rgba(249,115,22,0.2)",
          }}
          data-ocid="mind_refresher.pick_wcm_button"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
            style={{
              background: "linear-gradient(135deg,#f97316,#ec4899)",
              boxShadow: "0 0 14px rgba(249,115,22,0.5)",
            }}
          >
            🎨
          </div>
          <div>
            <p className="font-bold text-white text-sm">Word-Color Mixup</p>
            <p className="text-white/60 text-xs mt-0.5">
              Read the ink, not the word · 5 rounds · 10s each
            </p>
          </div>
        </button>
        {/* Scramble Cards card */}
        <button
          type="button"
          onClick={() => onPick("scramble")}
          className="w-full rounded-xl p-4 flex items-center gap-4 text-left transition-transform active:scale-95 hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))",
            border: "2px solid rgba(6,182,212,0.4)",
            boxShadow: "0 4px 20px rgba(6,182,212,0.2)",
          }}
          data-ocid="mind_refresher.pick_scramble_button"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
            style={{
              background: "linear-gradient(135deg,#06b6d4,#a855f7)",
              boxShadow: "0 0 14px rgba(6,182,212,0.5)",
            }}
          >
            🔤
          </div>
          <div>
            <p className="font-bold text-white text-sm">Scramble Cards</p>
            <p className="text-white/60 text-xs mt-0.5">
              Unscramble school words · 6 rounds · 20s each
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Word-Color Mixup Game ────────────────────────────────────────────────────
function WordColorMixup({
  onBack,
  onClose,
}: { onBack: () => void; onClose: () => void }) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [round, setRound] = useState<WcmRound | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(WCM_TIME_PER_ROUND);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundIndexRef = useRef(roundIndex);
  roundIndexRef.current = roundIndex;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRound = useCallback(
    (index: number) => {
      clearTimer();
      setRound(pickWcmRound());
      setRoundIndex(index);
      setTimeLeft(WCM_TIME_PER_ROUND);
      setFeedback(null);
    },
    [clearTimer],
  );

  const advanceRound = useCallback(
    (correct: boolean) => {
      clearTimer();
      setScore((prev) => (correct ? prev + 1 : prev));
      setFeedback(correct ? "correct" : "wrong");
      setTimeout(() => {
        const next = roundIndexRef.current + 1;
        if (next >= WCM_TOTAL_ROUNDS) {
          setGameState("gameover");
          setFeedback(null);
        } else {
          startRound(next);
        }
      }, 700);
    },
    [clearTimer, startRound],
  );

  function startGame() {
    setScore(0);
    setGameState("playing");
    startRound(0);
  }

  useEffect(() => {
    if (gameState !== "playing" || feedback !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          advanceRound(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [gameState, feedback, clearTimer, advanceRound]);

  const tColor = timerColor(timeLeft, WCM_TIME_PER_ROUND);
  const timerPct = (timeLeft / WCM_TIME_PER_ROUND) * 100;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)",
        boxShadow: "0 0 60px rgba(139,92,246,0.5), 0 20px 60px rgba(0,0,0,0.6)",
      }}
    >
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="text-white/50 hover:text-white text-lg mr-1 transition-colors"
            aria-label="Back to game select"
          >
            ←
          </button>
          <span className="text-xl">🎨</span>
          <span
            className="font-bold text-base tracking-wide"
            style={{ color: "#a5f3fc" }}
          >
            Word-Color Mixup!
          </span>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors text-xl leading-none px-1"
          data-ocid="mind_refresher.close_button"
        >
          ✕
        </button>
      </div>

      {/* Idle */}
      {gameState === "idle" && (
        <div className="px-6 py-8 flex flex-col items-center gap-6 text-center">
          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
            A color word appears in a{" "}
            <span className="font-bold text-yellow-300">
              different font color
            </span>
            . Click the button matching the{" "}
            <span className="font-bold text-pink-300">ink color</span> — not the
            word!
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {COLORS.slice(0, 4).map((c) => (
              <div
                key={c.name}
                className="w-8 h-8 rounded-full border-2 border-white/30"
                style={{ background: c.hex }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-xl font-bold text-base text-white transition-transform active:scale-95"
            style={{
              background: "linear-gradient(135deg,#f97316,#ec4899)",
              boxShadow: "0 4px 20px rgba(249,115,22,0.5)",
            }}
            data-ocid="mind_refresher.start_button"
          >
            🚀 Start Game
          </button>
        </div>
      )}

      {/* Playing */}
      {gameState === "playing" && round && (
        <div className="px-6 pb-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-xs font-medium">
              Round {roundIndex + 1} / {WCM_TOTAL_ROUNDS}
            </span>
            <span
              className="font-bold text-sm px-3 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fde68a" }}
            >
              ⭐ {score} pts
            </span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${timerPct}%`,
                background: tColor,
                boxShadow: `0 0 8px ${tColor}`,
              }}
            />
          </div>
          <div className="text-center text-white/50 text-xs -mt-2">
            {timeLeft}s
          </div>
          <div
            className="flex items-center justify-center rounded-xl py-8"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span
              className="font-black text-5xl tracking-widest select-none"
              style={{
                color: round.fontColor.hex,
                textShadow: `0 0 20px ${round.fontColor.hex}80`,
              }}
            >
              {round.word.name}
            </span>
          </div>
          <p className="text-center text-white/60 text-xs">
            Click the button matching the{" "}
            <span className="font-bold text-cyan-300">font color</span>
          </p>
          {feedback && (
            <div
              className="text-center font-black text-xl py-1 rounded-xl animate-bounce"
              style={{
                color: feedback === "correct" ? "#4ade80" : "#f87171",
                textShadow:
                  feedback === "correct"
                    ? "0 0 12px #4ade80"
                    : "0 0 12px #f87171",
              }}
            >
              {feedback === "correct" ? "✅ Correct!" : "❌ Oops!"}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {round.options.map((opt, i) => (
              <button
                key={opt.name}
                type="button"
                disabled={feedback !== null}
                onClick={() => advanceRound(opt.name === round.fontColor.name)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl font-bold text-sm text-white transition-transform active:scale-95 disabled:opacity-40"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `2px solid ${opt.hex}60`,
                  boxShadow: `0 2px 10px ${opt.hex}30`,
                }}
                data-ocid={`mind_refresher.option.${i + 1}`}
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 border-2 border-white/20"
                  style={{ background: opt.hex }}
                />
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameState === "gameover" && (
        <div className="px-6 py-8 flex flex-col items-center gap-5 text-center">
          <div className="text-5xl">
            {score >= 4 ? "🏆" : score >= 2 ? "🌟" : "💪"}
          </div>
          <div>
            <p className="font-black text-3xl text-white">
              {score} / {WCM_TOTAL_ROUNDS}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {score === WCM_TOTAL_ROUNDS
                ? "Perfect score! You're a color genius! 🎉"
                : score >= 3
                  ? "Great job! Color champion! 🎨"
                  : "Nice try! Give it another shot! 💪"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-transform active:scale-95"
              style={{
                background: "linear-gradient(135deg,#f97316,#ec4899)",
                boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
              }}
              data-ocid="mind_refresher.play_again_button"
            >
              🔄 Play Again
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl font-bold text-white/70 text-sm border border-white/20 hover:border-white/40 transition-colors"
              data-ocid="mind_refresher.done_button"
            >
              ← Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Scramble Cards Game ──────────────────────────────────────────────────────
function ScrambleCards({
  onBack,
  onClose,
}: { onBack: () => void; onClose: () => void }) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SC_TIME_PER_ROUND);
  const [scRound, setScRound] = useState<ScrambleRound | null>(null);
  const [selected, setSelected] = useState<number[]>([]); // indices into scrambled array
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [bonus, setBonus] = useState(false);
  const usedWordsRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundIndexRef = useRef(roundIndex);
  roundIndexRef.current = roundIndex;
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRound = useCallback(
    (index: number) => {
      clearTimer();
      const r = pickScrambleRound(usedWordsRef.current);
      usedWordsRef.current.add(r.answer);
      setScRound(r);
      setRoundIndex(index);
      setTimeLeft(SC_TIME_PER_ROUND);
      setSelected([]);
      setFeedback(null);
      setBonus(false);
    },
    [clearTimer],
  );

  const advanceRound = useCallback(
    (correct: boolean, bonusEarned: boolean) => {
      clearTimer();
      const pts = correct
        ? SC_CORRECT_PTS + (bonusEarned ? SC_BONUS_PTS : 0)
        : 0;
      setScore((prev) => prev + pts);
      setFeedback(correct ? "correct" : "wrong");
      setBonus(bonusEarned);
      setTimeout(() => {
        const next = roundIndexRef.current + 1;
        if (next >= SC_TOTAL_ROUNDS) {
          setGameState("gameover");
          setFeedback(null);
        } else {
          startRound(next);
        }
      }, 1000);
    },
    [clearTimer, startRound],
  );

  function startGame() {
    setScore(0);
    usedWordsRef.current = new Set();
    setGameState("playing");
    startRound(0);
  }

  // Countdown timer
  useEffect(() => {
    if (gameState !== "playing" || feedback !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          advanceRound(false, false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [gameState, feedback, clearTimer, advanceRound]);

  // Check answer when all letters selected
  useEffect(() => {
    if (!scRound || feedback !== null || gameState !== "playing") return;
    if (selected.length !== scRound.answer.length) return;
    const attempt = selected.map((i) => scRound.scrambled[i]).join("");
    const correct = attempt === scRound.answer;
    const bonusEarned = correct && timeLeftRef.current >= SC_BONUS_THRESHOLD;
    advanceRound(correct, bonusEarned);
  }, [selected, scRound, feedback, gameState, advanceRound]);

  function handleTileClick(idx: number) {
    if (feedback !== null) return;
    if (selected.includes(idx)) return;
    setSelected((prev) => [...prev, idx]);
  }

  function handleDeselect(posIdx: number) {
    if (feedback !== null) return;
    setSelected((prev) => prev.filter((_, i) => i !== posIdx));
  }

  const tColor = timerColor(timeLeft, SC_TIME_PER_ROUND);
  const timerPct = (timeLeft / SC_TIME_PER_ROUND) * 100;

  const maxScore = SC_TOTAL_ROUNDS * (SC_CORRECT_PTS + SC_BONUS_PTS);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0c1a2e 0%, #0e2a4a 40%, #1a0a3d 100%)",
        boxShadow: "0 0 60px rgba(6,182,212,0.4), 0 20px 60px rgba(0,0,0,0.7)",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="text-white/50 hover:text-white text-lg mr-1 transition-colors"
            aria-label="Back to game select"
          >
            ←
          </button>
          <span className="text-xl">🔤</span>
          <span
            className="font-bold text-base tracking-wide"
            style={{ color: "#67e8f9" }}
          >
            Scramble Cards!
          </span>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors text-xl leading-none px-1"
          data-ocid="scramble.close_button"
        >
          ✕
        </button>
      </div>

      {/* Idle */}
      {gameState === "idle" && (
        <div className="px-6 py-8 flex flex-col items-center gap-6 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: "linear-gradient(135deg,#06b6d4,#a855f7)",
              boxShadow: "0 0 24px rgba(6,182,212,0.6)",
            }}
          >
            🔤
          </div>
          <div className="space-y-2">
            <p className="text-white font-bold text-base">How to play</p>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              A{" "}
              <span className="text-cyan-300 font-bold">
                school subject word
              </span>{" "}
              appears scrambled. Click letter tiles in the{" "}
              <span className="text-pink-300 font-bold">correct order</span> to
              unscramble it!
            </p>
            <p className="text-white/50 text-xs">
              +10 pts per word · +5 bonus if 10s+ remaining
            </p>
          </div>
          {/* Preview tiles */}
          <div className="flex gap-2 justify-center">
            {["A", "L", "G", "E"].map((l, i) => (
              <div
                key={l}
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm"
                style={{
                  background: TILE_COLORS[i],
                  boxShadow: `0 0 10px ${TILE_COLORS[i]}80`,
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3 rounded-xl font-bold text-base text-white transition-transform active:scale-95"
            style={{
              background: "linear-gradient(135deg,#06b6d4,#a855f7)",
              boxShadow: "0 4px 20px rgba(6,182,212,0.5)",
            }}
            data-ocid="scramble.start_button"
          >
            🚀 Start Scramble!
          </button>
        </div>
      )}

      {/* Playing */}
      {gameState === "playing" && scRound && (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {/* Stats row */}
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-xs font-medium">
              Round {roundIndex + 1} / {SC_TOTAL_ROUNDS}
            </span>
            <span
              className="font-bold text-sm px-3 py-1 rounded-full"
              style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9" }}
            >
              ⭐ {score} pts
            </span>
          </div>

          {/* Timer bar */}
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${timerPct}%`,
                background: tColor,
                boxShadow: `0 0 8px ${tColor}`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs -mt-1">
            <span className="text-white/40">{timeLeft}s remaining</span>
            {timeLeft >= SC_BONUS_THRESHOLD && (
              <span className="text-yellow-300 font-bold animate-pulse">
                ⚡ Bonus zone!
              </span>
            )}
          </div>

          {/* Answer slots */}
          {(() => {
            const answerSlots = scRound.answer.split("").map((ch, i) => ({
              slotKey: `${scRound.answer}-slot-${ch}-${i}`,
              pos: i,
            }));
            return (
              <div
                className="rounded-xl p-3 flex flex-col gap-2"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <p className="text-white/40 text-xs text-center mb-1">
                  Your answer — click to remove
                </p>
                <div className="flex flex-wrap gap-2 justify-center min-h-[44px]">
                  {answerSlots.map(({ slotKey, pos }) => {
                    const tileIdx = selected[pos];
                    const letter =
                      tileIdx !== undefined ? scRound.scrambled[tileIdx] : "_";
                    const color =
                      tileIdx !== undefined
                        ? scRound.tileColors[tileIdx]
                        : "transparent";
                    return (
                      <button
                        key={slotKey}
                        type="button"
                        onClick={() =>
                          tileIdx !== undefined && handleDeselect(pos)
                        }
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm transition-transform active:scale-90"
                        style={{
                          background:
                            tileIdx !== undefined
                              ? color
                              : "rgba(255,255,255,0.06)",
                          border: `2px solid ${
                            tileIdx !== undefined
                              ? color
                              : "rgba(255,255,255,0.15)"
                          }`,
                          boxShadow:
                            tileIdx !== undefined
                              ? `0 0 8px ${color}80`
                              : "none",
                        }}
                        data-ocid={`scramble.answer_slot.${pos + 1}`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Feedback */}
          {feedback && (
            <div
              className="text-center font-black text-lg py-1 rounded-xl"
              style={{
                color: feedback === "correct" ? "#4ade80" : "#f87171",
                textShadow:
                  feedback === "correct"
                    ? "0 0 12px #4ade80"
                    : "0 0 12px #f87171",
              }}
            >
              {feedback === "correct"
                ? bonus
                  ? `✅ Correct! +${SC_CORRECT_PTS + SC_BONUS_PTS} pts ⚡ Bonus!`
                  : `✅ Correct! +${SC_CORRECT_PTS} pts`
                : `❌ Oops! It was ${scRound.answer}`}
            </div>
          )}

          {/* Scrambled tiles */}
          {(() => {
            const scrambleTiles = scRound.scrambled.map((ltr, i) => ({
              tileKey: `${scRound.answer}-tile-${ltr}-${i}`,
              idx: i,
              letter: ltr,
            }));
            return (
              <div
                className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <p className="text-white/40 text-xs text-center mb-2">
                  Tap letters in order
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {scrambleTiles.map(({ tileKey, idx, letter }) => {
                    const used = selected.includes(idx);
                    return (
                      <button
                        key={tileKey}
                        type="button"
                        disabled={used || feedback !== null}
                        onClick={() => handleTileClick(idx)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-white text-base transition-transform active:scale-90 disabled:opacity-30"
                        style={{
                          background: used
                            ? "rgba(255,255,255,0.05)"
                            : scRound.tileColors[idx],
                          border: `2px solid ${
                            used
                              ? "rgba(255,255,255,0.1)"
                              : `${scRound.tileColors[idx]}90`
                          }`,
                          boxShadow: used
                            ? "none"
                            : `0 0 12px ${scRound.tileColors[idx]}60`,
                          transform: used ? "none" : undefined,
                        }}
                        data-ocid={`scramble.tile.${idx + 1}`}
                      >
                        {used ? " " : letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Clear button */}
          {selected.length > 0 && feedback === null && (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-white/40 hover:text-white/70 text-xs text-center transition-colors"
              data-ocid="scramble.clear_button"
            >
              ✕ Clear selection
            </button>
          )}
        </div>
      )}

      {/* Game Over */}
      {gameState === "gameover" && (
        <div className="px-6 py-8 flex flex-col items-center gap-5 text-center">
          <div className="text-5xl">
            {score >= maxScore * 0.8
              ? "🏆"
              : score >= maxScore * 0.5
                ? "🌟"
                : "💪"}
          </div>
          <div>
            <p className="font-black text-3xl text-white">{score} pts</p>
            <p className="text-white/50 text-sm">out of {maxScore} possible</p>
            <p className="text-white/60 text-sm mt-2">
              {score >= maxScore * 0.8
                ? "Incredible! Word master! 🧠✨"
                : score >= maxScore * 0.5
                  ? "Great unscrambling! 🔤💪"
                  : "Keep practicing! You'll get it! 🚀"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-transform active:scale-95"
              style={{
                background: "linear-gradient(135deg,#06b6d4,#a855f7)",
                boxShadow: "0 4px 20px rgba(6,182,212,0.4)",
              }}
              data-ocid="scramble.play_again_button"
            >
              🔄 Play Again
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl font-bold text-white/70 text-sm border border-white/20 hover:border-white/40 transition-colors"
              data-ocid="scramble.done_button"
            >
              ← Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export function WordColorMixupGame({ open, onClose }: Props) {
  const [gamePick, setGamePick] = useState<GamePick>("select");

  // Reset to selection screen when dialog closes
  useEffect(() => {
    if (!open) setGamePick("select");
  }, [open]);

  function handlePick(g: "wcm" | "scramble") {
    setGamePick(g);
  }

  function handleBack() {
    setGamePick("select");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none"
        data-ocid="mind_refresher.dialog"
      >
        {gamePick === "select" && (
          <GameSelectScreen onPick={handlePick} onClose={onClose} />
        )}
        {gamePick === "wcm" && (
          <WordColorMixup onBack={handleBack} onClose={onClose} />
        )}
        {gamePick === "scramble" && (
          <ScrambleCards onBack={handleBack} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
