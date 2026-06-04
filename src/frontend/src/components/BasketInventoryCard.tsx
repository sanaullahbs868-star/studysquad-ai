import type { BasketInventory } from "@/components/BasketCatchGame";
import { BasketTradeModal } from "@/components/BasketTradeModal";
import { useState } from "react";

interface BasketInventoryCardProps {
  inventory: BasketInventory;
  onOpenCatchGame: () => void;
}

const ITEMS: {
  key: keyof BasketInventory;
  emoji: string;
  label: string;
  color: string;
  glow: string;
}[] = [
  {
    key: "pumpkins",
    emoji: "🎃",
    label: "Pumpkins",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.5)",
  },
  {
    key: "sweets",
    emoji: "🍬",
    label: "Sweets",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.5)",
  },
  {
    key: "stars",
    emoji: "⭐",
    label: "Star Badges",
    color: "#facc15",
    glow: "rgba(250,204,21,0.5)",
  },
];

export function BasketInventoryCard({
  inventory,
  onOpenCatchGame,
}: BasketInventoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);

  const total = inventory.pumpkins + inventory.sweets + inventory.stars;

  return (
    <>
      <div
        className="fixed z-40 select-none"
        style={{ bottom: "5rem", right: "1.25rem" }}
        data-ocid="basket.inventory_card"
      >
        {/* Expanded inventory panel */}
        {expanded && (
          <div
            className="mb-2 rounded-xl p-3 w-52"
            style={{
              background: "rgba(15,5,30,0.95)",
              border: "1px solid rgba(168,85,247,0.5)",
              boxShadow:
                "0 0 20px rgba(88,28,235,0.3), 0 4px 16px rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2 text-center"
              style={{ color: "#c084fc" }}
            >
              🧺 My Basket
            </p>
            <div className="space-y-1.5">
              {ITEMS.map(({ key, emoji, label, color, glow }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-2 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${color}33`,
                  }}
                >
                  <span className="flex items-center gap-1.5 text-sm">
                    <span style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
                      {emoji}
                    </span>
                    <span style={{ color }}>{label}</span>
                  </span>
                  <span className="text-sm font-bold" style={{ color }}>
                    {inventory[key]}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={onOpenCatchGame}
                className="flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                  color: "#fff",
                  boxShadow: "0 0 10px rgba(168,85,247,0.4)",
                }}
                data-ocid="basket.catch_game_button"
              >
                🎮 Catch!
              </button>
              <button
                type="button"
                onClick={() => setTradeOpen(true)}
                className="flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  color: "#fff",
                  boxShadow: "0 0 10px rgba(16,185,129,0.4)",
                }}
                data-ocid="basket.trade_button"
              >
                🤝 Trade
              </button>
            </div>
          </div>
        )}

        {/* Basket icon button */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: expanded ? "rgba(88,28,235,0.4)" : "rgba(15,5,30,0.9)",
            border: "1px solid rgba(168,85,247,0.6)",
            boxShadow: expanded
              ? "0 0 20px rgba(168,85,247,0.6)"
              : "0 0 12px rgba(168,85,247,0.3)",
            backdropFilter: "blur(12px)",
          }}
          aria-label={expanded ? "Close basket" : "Open basket inventory"}
          data-ocid="basket.toggle_button"
        >
          <span className="text-xl">🧺</span>
          {total > 0 && (
            <span
              className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#a855f7,#ec4899)",
                color: "#fff",
                boxShadow: "0 0 8px rgba(168,85,247,0.6)",
              }}
            >
              {total > 99 ? "99" : total}
            </span>
          )}
        </button>
      </div>

      <BasketTradeModal
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
        inventory={inventory}
      />
    </>
  );
}
