import type { BasketInventory } from "@/components/BasketCatchGame";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BasketTradeModalProps {
  open: boolean;
  onClose: () => void;
  inventory: BasketInventory;
}

const ITEMS: {
  key: keyof BasketInventory;
  emoji: string;
  label: string;
  color: string;
}[] = [
  { key: "pumpkins", emoji: "🎃", label: "Pumpkins", color: "#fb923c" },
  { key: "sweets", emoji: "🍬", label: "Sweets", color: "#f472b6" },
  { key: "stars", emoji: "⭐", label: "Star Badges", color: "#facc15" },
];

type TradeOffer = Partial<BasketInventory>;

function OfferSelector({
  label,
  inventory,
  offer,
  onChange,
  accentColor,
}: {
  label: string;
  inventory: BasketInventory;
  offer: TradeOffer;
  onChange: (key: keyof BasketInventory, qty: number) => void;
  accentColor: string;
}) {
  return (
    <div
      className="flex-1 rounded-xl p-3 min-w-0"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${accentColor}55`,
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
        style={{ color: accentColor }}
      >
        {label}
      </p>
      <div className="space-y-2">
        {ITEMS.map(({ key, emoji, label: itemLabel, color }) => {
          const max = inventory[key];
          const qty = offer[key] ?? 0;
          return (
            <div key={key} className="flex items-center justify-between gap-2">
              <span
                className="text-sm flex items-center gap-1"
                style={{ color }}
              >
                {emoji} {itemLabel}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onChange(key, Math.max(0, qty - 1))}
                  className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all hover:opacity-80"
                  style={{
                    background:
                      qty > 0
                        ? "rgba(168,85,247,0.3)"
                        : "rgba(255,255,255,0.05)",
                    color: qty > 0 ? "#c084fc" : "#555",
                    border: "1px solid rgba(168,85,247,0.3)",
                  }}
                  aria-label={`Decrease ${itemLabel}`}
                >
                  −
                </button>
                <span
                  className="w-6 text-center text-sm font-bold"
                  style={{ color: qty > 0 ? "#e2e8f0" : "#4a5568" }}
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onChange(key, Math.min(max, qty + 1))}
                  className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all hover:opacity-80"
                  style={{
                    background:
                      qty < max
                        ? "rgba(168,85,247,0.3)"
                        : "rgba(255,255,255,0.05)",
                    color: qty < max ? "#c084fc" : "#555",
                    border: "1px solid rgba(168,85,247,0.3)",
                  }}
                  aria-label={`Increase ${itemLabel}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="mt-3 pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p
          className="text-[10px] text-center"
          style={{ color: "rgba(148,163,184,0.6)" }}
        >
          Available:{" "}
          {ITEMS.map(({ key, emoji }) => `${emoji} ${inventory[key]}`).join(
            " · ",
          )}
        </p>
      </div>
    </div>
  );
}

export function BasketTradeModal({
  open,
  onClose,
  inventory,
}: BasketTradeModalProps) {
  const [myOffer, setMyOffer] = useState<TradeOffer>({});
  const [friendOffer, setFriendOffer] = useState<TradeOffer>({});
  const [confirmed, setConfirmed] = useState(false);

  const updateMyOffer = (key: keyof BasketInventory, qty: number) => {
    setMyOffer((prev) => ({ ...prev, [key]: qty }));
  };

  const updateFriendOffer = (key: keyof BasketInventory, qty: number) => {
    setFriendOffer((prev) => ({ ...prev, [key]: qty }));
  };

  const hasMyItems = Object.values(myOffer).some((v) => (v ?? 0) > 0);
  const hasFriendItems = Object.values(friendOffer).some((v) => (v ?? 0) > 0);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setMyOffer({});
      setFriendOffer({});
      onClose();
    }, 1800);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      aria-label="Basket Trading"
      data-ocid="basket.trade_dialog"
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d0520 0%, #0a0a1a 100%)",
          border: "1px solid rgba(168,85,247,0.5)",
          boxShadow: "0 0 40px rgba(88,28,235,0.4), 0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(168,85,247,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h2 className="font-bold text-lg" style={{ color: "#c084fc" }}>
              Basket Trading
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}
            aria-label="Close trade modal"
            data-ocid="basket.trade_close_button"
          >
            ✕
          </button>
        </div>

        {confirmed ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-6">
            <span className="text-5xl">🎉</span>
            <p className="text-lg font-bold" style={{ color: "#4ade80" }}>
              Trade Confirmed!
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Items have been swapped into each other's baskets.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Trade panels */}
            <div className="flex gap-3">
              <OfferSelector
                label="Your Offer"
                inventory={inventory}
                offer={myOffer}
                onChange={updateMyOffer}
                accentColor="#a855f7"
              />
              <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                <span className="text-xl">⇌</span>
                <span className="text-[10px] text-muted-foreground">SWAP</span>
              </div>
              <OfferSelector
                label="Friend's Offer"
                inventory={{ pumpkins: 99, sweets: 99, stars: 10 }}
                offer={friendOffer}
                onChange={updateFriendOffer}
                accentColor="#ec4899"
              />
            </div>

            <p
              className="text-[11px] text-center"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              Both players must add items before confirming the trade.
            </p>

            {/* Confirm button */}
            <Button
              type="button"
              className="w-full font-bold text-sm py-2.5"
              disabled={!hasMyItems || !hasFriendItems}
              onClick={handleConfirm}
              style={{
                background:
                  hasMyItems && hasFriendItems
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : "rgba(255,255,255,0.06)",
                color: hasMyItems && hasFriendItems ? "#fff" : "#4a5568",
                border: "none",
                boxShadow:
                  hasMyItems && hasFriendItems
                    ? "0 0 16px rgba(16,185,129,0.5)"
                    : "none",
                transition: "all 0.2s ease",
              }}
              data-ocid="basket.trade_confirm_button"
            >
              ✅ Confirm Trade
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
