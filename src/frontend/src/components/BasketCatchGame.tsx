import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

export interface BasketInventory {
  pumpkins: number;
  sweets: number;
  stars: number;
}

interface FallingItem {
  id: number;
  type: "pumpkin" | "sweet" | "star";
  x: number;
  y: number;
  speed: number;
}

interface XpPopup {
  id: number;
  x: number;
  y: number;
}

const ITEM_EMOJIS = { pumpkin: "🎃", sweet: "🍬", star: "⭐" };
const ITEM_COLORS = {
  pumpkin: "rgba(251,146,60,0.9)",
  sweet: "rgba(236,72,153,0.9)",
  star: "rgba(250,204,21,0.9)",
};
const BASKET_WIDTH = 80;
const ITEM_SIZE = 40;
const ARENA_HEIGHT = 400;

function randomItemType(): FallingItem["type"] {
  const r = Math.random();
  if (r < 0.05) return "star";
  if (r < 0.5) return "sweet";
  return "pumpkin";
}

interface BasketCatchGameProps {
  onInventoryUpdate: (delta: Partial<BasketInventory>) => void;
}

export function BasketCatchGame({ onInventoryUpdate }: BasketCatchGameProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [arenaWidth, setArenaWidth] = useState(400);
  const [basketX, setBasketX] = useState(160);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [xpPopups, setXpPopups] = useState<XpPopup[]>([]);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const nextId = useRef(0);
  const animRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const itemsRef = useRef<FallingItem[]>([]);
  const basketXRef = useRef(160);
  const runningRef = useRef(false);
  const arenaDragStart = useRef<{ x: number; basketX: number } | null>(null);

  useEffect(() => {
    if (!arenaRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setArenaWidth(w);
      setBasketX(Math.max(0, Math.min(basketXRef.current, w - BASKET_WIDTH)));
    });
    ro.observe(arenaRef.current);
    return () => ro.disconnect();
  }, []);

  const spawnItem = useCallback((width: number) => {
    const id = nextId.current++;
    const item: FallingItem = {
      id,
      type: randomItemType(),
      x: Math.random() * (width - ITEM_SIZE),
      y: -ITEM_SIZE,
      speed: 1.8 + Math.random() * 1.5,
    };
    return item;
  }, []);

  const startGame = useCallback(() => {
    itemsRef.current = [];
    setItems([]);
    setXpPopups([]);
    setScore(0);
    setTimeLeft(30);
    setBasketX(Math.max(0, (arenaWidth - BASKET_WIDTH) / 2));
    basketXRef.current = Math.max(0, (arenaWidth - BASKET_WIDTH) / 2);
    runningRef.current = true;
    setRunning(true);
    lastSpawn.current = 0;
  }, [arenaWidth]);

  // Timer countdown
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          runningRef.current = false;
          setRunning(false);
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Animation loop
  useEffect(() => {
    if (!running) return;
    let now = performance.now();

    const loop = (ts: number) => {
      if (!runningRef.current) return;
      const delta = ts - now;
      now = ts;

      // Spawn
      if (ts - lastSpawn.current > 900) {
        lastSpawn.current = ts;
        const newItem = spawnItem(arenaWidth);
        itemsRef.current = [...itemsRef.current, newItem];
      }

      const bx = basketXRef.current;
      const survived: FallingItem[] = [];
      const caught: FallingItem[] = [];

      for (const item of itemsRef.current) {
        const ny = item.y + item.speed * delta * 0.05;
        if (ny > ARENA_HEIGHT) continue; // missed
        // Collision check
        if (
          ny + ITEM_SIZE >= ARENA_HEIGHT - 36 &&
          item.x + ITEM_SIZE / 2 >= bx &&
          item.x + ITEM_SIZE / 2 <= bx + BASKET_WIDTH
        ) {
          caught.push({ ...item, y: ny });
        } else {
          survived.push({ ...item, y: ny });
        }
      }

      if (caught.length > 0) {
        for (const item of caught) {
          onInventoryUpdate({
            [item.type === "pumpkin"
              ? "pumpkins"
              : item.type === "sweet"
                ? "sweets"
                : "stars"]: 1,
          });
          const pid = nextId.current++;
          setXpPopups((prev) => [
            ...prev,
            { id: pid, x: item.x, y: ARENA_HEIGHT - 80 },
          ]);
          setTimeout(
            () => setXpPopups((p) => p.filter((x) => x.id !== pid)),
            900,
          );
        }
        setScore((s) => s + caught.length * 10);
      }

      itemsRef.current = survived;
      setItems([...survived]);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, arenaWidth, spawnItem, onInventoryUpdate]);

  const moveBasket = (dir: "left" | "right") => {
    setBasketX((prev) => {
      const next =
        dir === "left"
          ? Math.max(0, prev - 32)
          : Math.min(arenaWidth - BASKET_WIDTH, prev + 32);
      basketXRef.current = next;
      return next;
    });
  };

  // Mouse / touch drag
  const handleArenaPointerDown = (e: React.PointerEvent) => {
    if (!running) return;
    arenaDragStart.current = { x: e.clientX, basketX: basketXRef.current };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleArenaPointerMove = (e: React.PointerEvent) => {
    if (!arenaDragStart.current || !running) return;
    const dx = e.clientX - arenaDragStart.current.x;
    const next = Math.max(
      0,
      Math.min(arenaWidth - BASKET_WIDTH, arenaDragStart.current.basketX + dx),
    );
    basketXRef.current = next;
    setBasketX(next);
  };

  const handleArenaPointerUp = () => {
    arenaDragStart.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* HUD */}
      <div className="flex items-center justify-between w-full px-2">
        <div
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{
            background: "rgba(168,85,247,0.2)",
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#c084fc",
          }}
        >
          ⚡ {score} XP
        </div>
        <div
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{
            background:
              timeLeft <= 10 ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.15)",
            border: `1px solid ${timeLeft <= 10 ? "rgba(239,68,68,0.5)" : "rgba(34,197,94,0.4)"}`,
            color: timeLeft <= 10 ? "#f87171" : "#86efac",
          }}
        >
          ⏱ {timeLeft}s
        </div>
      </div>

      {/* Arena */}
      <div
        ref={arenaRef}
        className="relative w-full rounded-xl overflow-hidden select-none cursor-grab"
        style={{
          height: ARENA_HEIGHT,
          background: "linear-gradient(180deg, #0a0a1a 0%, #13082a 100%)",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "inset 0 0 40px rgba(88,28,235,0.15)",
        }}
        onPointerDown={handleArenaPointerDown}
        onPointerMove={handleArenaPointerMove}
        onPointerUp={handleArenaPointerUp}
        data-ocid="basket.game_arena"
      >
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
            {timeLeft === 0 ? (
              <>
                <p className="text-2xl font-bold" style={{ color: "#c084fc" }}>
                  ⏱ Time's up!
                </p>
                <p className="text-lg font-semibold text-foreground">
                  You scored{" "}
                  <span style={{ color: "#fbbf24" }}>{score} XP</span>
                </p>
                <Button
                  type="button"
                  onClick={startGame}
                  className="mt-2"
                  style={{
                    background: "linear-gradient(135deg,#a855f7,#ec4899)",
                    border: "none",
                  }}
                  data-ocid="basket.play_again_button"
                >
                  Play Again
                </Button>
              </>
            ) : (
              <>
                <p className="text-xl font-bold" style={{ color: "#c084fc" }}>
                  🧺 Catch the falling treats!
                </p>
                <p className="text-sm text-muted-foreground text-center px-8">
                  Drag the arena or use the buttons below to move your basket.
                  Catch items to earn XP!
                </p>
                <Button
                  type="button"
                  onClick={startGame}
                  style={{
                    background: "linear-gradient(135deg,#a855f7,#ec4899)",
                    border: "none",
                  }}
                  data-ocid="basket.start_button"
                >
                  Start Catching!
                </Button>
              </>
            )}
          </div>
        )}

        {/* Falling items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: item.x,
              top: item.y,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: `drop-shadow(0 0 6px ${ITEM_COLORS[item.type]})`,
            }}
          >
            {ITEM_EMOJIS[item.type]}
          </div>
        ))}

        {/* XP popups */}
        {xpPopups.map((popup) => (
          <div
            key={popup.id}
            className="absolute text-xs font-extrabold pointer-events-none animate-xp-float"
            style={{
              left: popup.x,
              top: popup.y,
              color: "#fbbf24",
              textShadow: "0 0 8px rgba(251,191,36,0.8)",
              animation: "xpFloat 0.9s ease-out forwards",
            }}
          >
            +10 XP
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute bottom-2 text-3xl flex items-center justify-center pointer-events-none"
          style={{
            left: basketX,
            width: BASKET_WIDTH,
            height: 36,
            filter: "drop-shadow(0 0 10px rgba(168,85,247,0.9))",
            transition: "left 0.05s linear",
          }}
        >
          🧺
        </div>

        {/* Ground line */}
        <div
          className="absolute bottom-10 left-0 right-0"
          style={{ height: 1, background: "rgba(168,85,247,0.2)" }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-14 h-14 text-xl rounded-full border-purple-500/40 hover:bg-purple-500/20"
          onPointerDown={() => {
            if (!running) return;
            const interval = setInterval(() => moveBasket("left"), 80);
            const stop = () => clearInterval(interval);
            window.addEventListener("pointerup", stop, { once: true });
          }}
          data-ocid="basket.move_left_button"
          aria-label="Move basket left"
        >
          ◀
        </Button>
        <span className="text-xs text-muted-foreground">Move Basket</span>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-14 h-14 text-xl rounded-full border-purple-500/40 hover:bg-purple-500/20"
          onPointerDown={() => {
            if (!running) return;
            const interval = setInterval(() => moveBasket("right"), 80);
            const stop = () => clearInterval(interval);
            window.addEventListener("pointerup", stop, { once: true });
          }}
          data-ocid="basket.move_right_button"
          aria-label="Move basket right"
        >
          ▶
        </Button>
      </div>

      <style>{`
        @keyframes xpFloat {
          0%   { opacity: 1; transform: translateY(0) scale(1.2); }
          100% { opacity: 0; transform: translateY(-48px) scale(0.8); }
        }
      `}</style>
    </div>
  );
}
