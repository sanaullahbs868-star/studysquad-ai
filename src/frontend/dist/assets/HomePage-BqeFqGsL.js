import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, D as Dialog, a as DialogContent, u as useInternetIdentity, b as useCurrentUser, Z as Zap, S as Skeleton, d as Badge, L as Link, e as BookOpen, f as Brain, V as Vote, T as Trophy, A as Avatar, g as AvatarFallback, h as DialogHeader, i as DialogTitle, k as useSetActiveSubject } from "./index-DD-CuXzg.js";
import { L as LoginPage, R as RegisterModal, C as Card, a as CardContent } from "./card-DrTK4wh3.js";
import { u as useActiveSubject } from "./useActiveSubject-BVfaky2x.js";
import { u as useLeaderboard } from "./useLeaderboard-Dcm9SaWk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const ITEM_EMOJIS = { pumpkin: "🎃", sweet: "🍬", star: "⭐" };
const ITEM_COLORS = {
  pumpkin: "rgba(251,146,60,0.9)",
  sweet: "rgba(236,72,153,0.9)",
  star: "rgba(250,204,21,0.9)"
};
const BASKET_WIDTH = 80;
const ITEM_SIZE = 40;
const ARENA_HEIGHT = 400;
function randomItemType() {
  const r = Math.random();
  if (r < 0.05) return "star";
  if (r < 0.5) return "sweet";
  return "pumpkin";
}
function BasketCatchGame({ onInventoryUpdate }) {
  const arenaRef = reactExports.useRef(null);
  const [arenaWidth, setArenaWidth] = reactExports.useState(400);
  const [basketX, setBasketX] = reactExports.useState(160);
  const [items, setItems] = reactExports.useState([]);
  const [xpPopups, setXpPopups] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [running, setRunning] = reactExports.useState(false);
  const [timeLeft, setTimeLeft] = reactExports.useState(30);
  const nextId = reactExports.useRef(0);
  const animRef = reactExports.useRef(0);
  const lastSpawn = reactExports.useRef(0);
  const itemsRef = reactExports.useRef([]);
  const basketXRef = reactExports.useRef(160);
  const runningRef = reactExports.useRef(false);
  const arenaDragStart = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!arenaRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setArenaWidth(w);
      setBasketX(Math.max(0, Math.min(basketXRef.current, w - BASKET_WIDTH)));
    });
    ro.observe(arenaRef.current);
    return () => ro.disconnect();
  }, []);
  const spawnItem = reactExports.useCallback((width) => {
    const id = nextId.current++;
    const item = {
      id,
      type: randomItemType(),
      x: Math.random() * (width - ITEM_SIZE),
      y: -ITEM_SIZE,
      speed: 1.8 + Math.random() * 1.5
    };
    return item;
  }, []);
  const startGame = reactExports.useCallback(() => {
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
  reactExports.useEffect(() => {
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
    }, 1e3);
    return () => clearInterval(interval);
  }, [running]);
  reactExports.useEffect(() => {
    if (!running) return;
    let now = performance.now();
    const loop = (ts) => {
      if (!runningRef.current) return;
      const delta = ts - now;
      now = ts;
      if (ts - lastSpawn.current > 900) {
        lastSpawn.current = ts;
        const newItem = spawnItem(arenaWidth);
        itemsRef.current = [...itemsRef.current, newItem];
      }
      const bx = basketXRef.current;
      const survived = [];
      const caught = [];
      for (const item of itemsRef.current) {
        const ny = item.y + item.speed * delta * 0.05;
        if (ny > ARENA_HEIGHT) continue;
        if (ny + ITEM_SIZE >= ARENA_HEIGHT - 36 && item.x + ITEM_SIZE / 2 >= bx && item.x + ITEM_SIZE / 2 <= bx + BASKET_WIDTH) {
          caught.push({ ...item, y: ny });
        } else {
          survived.push({ ...item, y: ny });
        }
      }
      if (caught.length > 0) {
        for (const item of caught) {
          onInventoryUpdate({
            [item.type === "pumpkin" ? "pumpkins" : item.type === "sweet" ? "sweets" : "stars"]: 1
          });
          const pid = nextId.current++;
          setXpPopups((prev) => [
            ...prev,
            { id: pid, x: item.x, y: ARENA_HEIGHT - 80 }
          ]);
          setTimeout(
            () => setXpPopups((p) => p.filter((x) => x.id !== pid)),
            900
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
  const moveBasket = (dir) => {
    setBasketX((prev) => {
      const next = dir === "left" ? Math.max(0, prev - 32) : Math.min(arenaWidth - BASKET_WIDTH, prev + 32);
      basketXRef.current = next;
      return next;
    });
  };
  const handleArenaPointerDown = (e) => {
    if (!running) return;
    arenaDragStart.current = { x: e.clientX, basketX: basketXRef.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleArenaPointerMove = (e) => {
    if (!arenaDragStart.current || !running) return;
    const dx = e.clientX - arenaDragStart.current.x;
    const next = Math.max(
      0,
      Math.min(arenaWidth - BASKET_WIDTH, arenaDragStart.current.basketX + dx)
    );
    basketXRef.current = next;
    setBasketX(next);
  };
  const handleArenaPointerUp = () => {
    arenaDragStart.current = null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between w-full px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-sm font-bold px-3 py-1 rounded-full",
          style: {
            background: "rgba(168,85,247,0.2)",
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#c084fc"
          },
          children: [
            "⚡ ",
            score,
            " XP"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-sm font-bold px-3 py-1 rounded-full",
          style: {
            background: timeLeft <= 10 ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.15)",
            border: `1px solid ${timeLeft <= 10 ? "rgba(239,68,68,0.5)" : "rgba(34,197,94,0.4)"}`,
            color: timeLeft <= 10 ? "#f87171" : "#86efac"
          },
          children: [
            "⏱ ",
            timeLeft,
            "s"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: arenaRef,
        className: "relative w-full rounded-xl overflow-hidden select-none cursor-grab",
        style: {
          height: ARENA_HEIGHT,
          background: "linear-gradient(180deg, #0a0a1a 0%, #13082a 100%)",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "inset 0 0 40px rgba(88,28,235,0.15)"
        },
        onPointerDown: handleArenaPointerDown,
        onPointerMove: handleArenaPointerMove,
        onPointerUp: handleArenaPointerUp,
        "data-ocid": "basket.game_arena",
        children: [
          !running && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-4 z-20", children: timeLeft === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", style: { color: "#c084fc" }, children: "⏱ Time's up!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-semibold text-foreground", children: [
              "You scored",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#fbbf24" }, children: [
                score,
                " XP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: startGame,
                className: "mt-2",
                style: {
                  background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  border: "none"
                },
                "data-ocid": "basket.play_again_button",
                children: "Play Again"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", style: { color: "#c084fc" }, children: "🧺 Catch the falling treats!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center px-8", children: "Drag the arena or use the buttons below to move your basket. Catch items to earn XP!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: startGame,
                style: {
                  background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  border: "none"
                },
                "data-ocid": "basket.start_button",
                children: "Start Catching!"
              }
            )
          ] }) }),
          items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute text-2xl pointer-events-none",
              style: {
                left: item.x,
                top: item.y,
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: `drop-shadow(0 0 6px ${ITEM_COLORS[item.type]})`
              },
              children: ITEM_EMOJIS[item.type]
            },
            item.id
          )),
          xpPopups.map((popup) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute text-xs font-extrabold pointer-events-none animate-xp-float",
              style: {
                left: popup.x,
                top: popup.y,
                color: "#fbbf24",
                textShadow: "0 0 8px rgba(251,191,36,0.8)",
                animation: "xpFloat 0.9s ease-out forwards"
              },
              children: "+10 XP"
            },
            popup.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-2 text-3xl flex items-center justify-center pointer-events-none",
              style: {
                left: basketX,
                width: BASKET_WIDTH,
                height: 36,
                filter: "drop-shadow(0 0 10px rgba(168,85,247,0.9))",
                transition: "left 0.05s linear"
              },
              children: "🧺"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-10 left-0 right-0",
              style: { height: 1, background: "rgba(168,85,247,0.2)" }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "lg",
          className: "w-14 h-14 text-xl rounded-full border-purple-500/40 hover:bg-purple-500/20",
          onPointerDown: () => {
            if (!running) return;
            const interval = setInterval(() => moveBasket("left"), 80);
            const stop = () => clearInterval(interval);
            window.addEventListener("pointerup", stop, { once: true });
          },
          "data-ocid": "basket.move_left_button",
          "aria-label": "Move basket left",
          children: "◀"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Move Basket" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "lg",
          className: "w-14 h-14 text-xl rounded-full border-purple-500/40 hover:bg-purple-500/20",
          onPointerDown: () => {
            if (!running) return;
            const interval = setInterval(() => moveBasket("right"), 80);
            const stop = () => clearInterval(interval);
            window.addEventListener("pointerup", stop, { once: true });
          },
          "data-ocid": "basket.move_right_button",
          "aria-label": "Move basket right",
          children: "▶"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes xpFloat {
          0%   { opacity: 1; transform: translateY(0) scale(1.2); }
          100% { opacity: 0; transform: translateY(-48px) scale(0.8); }
        }
      ` })
  ] });
}
const ITEMS$1 = [
  { key: "pumpkins", emoji: "🎃", label: "Pumpkins", color: "#fb923c" },
  { key: "sweets", emoji: "🍬", label: "Sweets", color: "#f472b6" },
  { key: "stars", emoji: "⭐", label: "Star Badges", color: "#facc15" }
];
function OfferSelector({
  label,
  inventory,
  offer,
  onChange,
  accentColor
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex-1 rounded-xl p-3 min-w-0",
      style: {
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${accentColor}55`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs font-bold uppercase tracking-widest mb-3 text-center",
            style: { color: accentColor },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ITEMS$1.map(({ key, emoji, label: itemLabel, color }) => {
          const max = inventory[key];
          const qty = offer[key] ?? 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-sm flex items-center gap-1",
                style: { color },
                children: [
                  emoji,
                  " ",
                  itemLabel
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onChange(key, Math.max(0, qty - 1)),
                  className: "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all hover:opacity-80",
                  style: {
                    background: qty > 0 ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)",
                    color: qty > 0 ? "#c084fc" : "#555",
                    border: "1px solid rgba(168,85,247,0.3)"
                  },
                  "aria-label": `Decrease ${itemLabel}`,
                  children: "−"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-6 text-center text-sm font-bold",
                  style: { color: qty > 0 ? "#e2e8f0" : "#4a5568" },
                  children: qty
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onChange(key, Math.min(max, qty + 1)),
                  className: "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all hover:opacity-80",
                  style: {
                    background: qty < max ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)",
                    color: qty < max ? "#c084fc" : "#555",
                    border: "1px solid rgba(168,85,247,0.3)"
                  },
                  "aria-label": `Increase ${itemLabel}`,
                  children: "+"
                }
              )
            ] })
          ] }, key);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mt-3 pt-2",
            style: { borderTop: "1px solid rgba(255,255,255,0.06)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-[10px] text-center",
                style: { color: "rgba(148,163,184,0.6)" },
                children: [
                  "Available:",
                  " ",
                  ITEMS$1.map(({ key, emoji }) => `${emoji} ${inventory[key]}`).join(
                    " · "
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function BasketTradeModal({
  open,
  onClose,
  inventory
}) {
  const [myOffer, setMyOffer] = reactExports.useState({});
  const [friendOffer, setFriendOffer] = reactExports.useState({});
  const [confirmed, setConfirmed] = reactExports.useState(false);
  const updateMyOffer = (key, qty) => {
    setMyOffer((prev) => ({ ...prev, [key]: qty }));
  };
  const updateFriendOffer = (key, qty) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" },
      "aria-label": "Basket Trading",
      "data-ocid": "basket.trade_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-lg rounded-2xl overflow-hidden",
          style: {
            background: "linear-gradient(135deg, #0d0520 0%, #0a0a1a 100%)",
            border: "1px solid rgba(168,85,247,0.5)",
            boxShadow: "0 0 40px rgba(88,28,235,0.4), 0 8px 32px rgba(0,0,0,0.6)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-5 py-4",
                style: { borderBottom: "1px solid rgba(168,85,247,0.2)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🤝" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg", style: { color: "#c084fc" }, children: "Basket Trading" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      className: "w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
                      style: { background: "rgba(255,255,255,0.05)" },
                      "aria-label": "Close trade modal",
                      "data-ocid": "basket.trade_close_button",
                      children: "✕"
                    }
                  )
                ]
              }
            ),
            confirmed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-12 px-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "🎉" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", style: { color: "#4ade80" }, children: "Trade Confirmed!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Items have been swapped into each other's baskets." })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OfferSelector,
                  {
                    label: "Your Offer",
                    inventory,
                    offer: myOffer,
                    onChange: updateMyOffer,
                    accentColor: "#a855f7"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "⇌" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "SWAP" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OfferSelector,
                  {
                    label: "Friend's Offer",
                    inventory: { pumpkins: 99, sweets: 99, stars: 10 },
                    offer: friendOffer,
                    onChange: updateFriendOffer,
                    accentColor: "#ec4899"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[11px] text-center",
                  style: { color: "rgba(148,163,184,0.5)" },
                  children: "Both players must add items before confirming the trade."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  className: "w-full font-bold text-sm py-2.5",
                  disabled: !hasMyItems || !hasFriendItems,
                  onClick: handleConfirm,
                  style: {
                    background: hasMyItems && hasFriendItems ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,0.06)",
                    color: hasMyItems && hasFriendItems ? "#fff" : "#4a5568",
                    border: "none",
                    boxShadow: hasMyItems && hasFriendItems ? "0 0 16px rgba(16,185,129,0.5)" : "none",
                    transition: "all 0.2s ease"
                  },
                  "data-ocid": "basket.trade_confirm_button",
                  children: "✅ Confirm Trade"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
const ITEMS = [
  {
    key: "pumpkins",
    emoji: "🎃",
    label: "Pumpkins",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.5)"
  },
  {
    key: "sweets",
    emoji: "🍬",
    label: "Sweets",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.5)"
  },
  {
    key: "stars",
    emoji: "⭐",
    label: "Star Badges",
    color: "#facc15",
    glow: "rgba(250,204,21,0.5)"
  }
];
function BasketInventoryCard({
  inventory,
  onOpenCatchGame
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [tradeOpen, setTradeOpen] = reactExports.useState(false);
  const total = inventory.pumpkins + inventory.sweets + inventory.stars;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed z-40 select-none",
        style: { bottom: "5rem", right: "1.25rem" },
        "data-ocid": "basket.inventory_card",
        children: [
          expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mb-2 rounded-xl p-3 w-52",
              style: {
                background: "rgba(15,5,30,0.95)",
                border: "1px solid rgba(168,85,247,0.5)",
                boxShadow: "0 0 20px rgba(88,28,235,0.3), 0 4px 16px rgba(0,0,0,0.5)",
                backdropFilter: "blur(12px)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold uppercase tracking-widest mb-2 text-center",
                    style: { color: "#c084fc" },
                    children: "🧺 My Basket"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: ITEMS.map(({ key, emoji, label, color, glow }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between px-2 py-1 rounded-lg",
                    style: {
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${color}33`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-sm", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { filter: `drop-shadow(0 0 4px ${glow})` }, children: emoji }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color }, children: label })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", style: { color }, children: inventory[key] })
                    ]
                  },
                  key
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onOpenCatchGame,
                      className: "flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:opacity-90",
                      style: {
                        background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                        color: "#fff",
                        boxShadow: "0 0 10px rgba(168,85,247,0.4)"
                      },
                      "data-ocid": "basket.catch_game_button",
                      children: "🎮 Catch!"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setTradeOpen(true),
                      className: "flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:opacity-90",
                      style: {
                        background: "linear-gradient(135deg,#10b981,#059669)",
                        color: "#fff",
                        boxShadow: "0 0 10px rgba(16,185,129,0.4)"
                      },
                      "data-ocid": "basket.trade_button",
                      children: "🤝 Trade"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((v) => !v),
              className: "flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95",
              style: {
                background: expanded ? "rgba(88,28,235,0.4)" : "rgba(15,5,30,0.9)",
                border: "1px solid rgba(168,85,247,0.6)",
                boxShadow: expanded ? "0 0 20px rgba(168,85,247,0.6)" : "0 0 12px rgba(168,85,247,0.3)",
                backdropFilter: "blur(12px)"
              },
              "aria-label": expanded ? "Close basket" : "Open basket inventory",
              "data-ocid": "basket.toggle_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🧺" }),
                total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center",
                    style: {
                      background: "linear-gradient(135deg,#a855f7,#ec4899)",
                      color: "#fff",
                      boxShadow: "0 0 8px rgba(168,85,247,0.6)"
                    },
                    children: total > 99 ? "99" : total
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BasketTradeModal,
      {
        open: tradeOpen,
        onClose: () => setTradeOpen(false),
        inventory
      }
    )
  ] });
}
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
  { name: "CYAN", hex: "#06b6d4" }
];
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
  "NITROGEN"
];
const TILE_COLORS = [
  "#a855f7",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#eab308",
  "#ef4444"
];
function pickWcmRound() {
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
  const word = shuffled[0];
  const fontColor = shuffled.find((c) => c.name !== word.name) ?? shuffled[1];
  const pool = [...COLORS].filter((c) => c.name !== fontColor.name).sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [fontColor, ...pool].sort(() => Math.random() - 0.5);
  return { word, fontColor, options };
}
function pickScrambleRound(usedWords) {
  const available = SCRAMBLE_WORDS.filter((w) => !usedWords.has(w));
  const pool = available.length > 0 ? available : SCRAMBLE_WORDS;
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const scrambled = answer.split("").sort(() => Math.random() - 0.5);
  let attempts = 0;
  while (scrambled.join("") === answer && attempts < 20) {
    scrambled.sort(() => Math.random() - 0.5);
    attempts++;
  }
  const tileColors = scrambled.map(
    (_, i) => TILE_COLORS[i % TILE_COLORS.length]
  );
  return { answer, scrambled, tileColors };
}
function timerColor(t, max) {
  const pct = t / max;
  return pct > 0.5 ? "#22c55e" : pct > 0.25 ? "#eab308" : "#ef4444";
}
function GameSelectScreen({
  onPick,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl overflow-hidden",
      style: {
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)",
        boxShadow: "0 0 60px rgba(139,92,246,0.5), 0 20px 60px rgba(0,0,0,0.6)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-5 pb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🧠" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-bold text-lg tracking-wide",
                style: { color: "#a5f3fc" },
                children: "Mind Refresher"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Close",
              onClick: onClose,
              className: "text-white/50 hover:text-white transition-colors text-xl leading-none px-1",
              "data-ocid": "mind_refresher.close_button",
              children: "✕"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-8 pt-4 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm text-center", children: "Pick a game for your brain break! ⚡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onPick("wcm"),
              className: "w-full rounded-xl p-4 flex items-center gap-4 text-left transition-transform active:scale-95 hover:scale-[1.02]",
              style: {
                background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(236,72,153,0.2))",
                border: "2px solid rgba(249,115,22,0.4)",
                boxShadow: "0 4px 20px rgba(249,115,22,0.2)"
              },
              "data-ocid": "mind_refresher.pick_wcm_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl",
                    style: {
                      background: "linear-gradient(135deg,#f97316,#ec4899)",
                      boxShadow: "0 0 14px rgba(249,115,22,0.5)"
                    },
                    children: "🎨"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white text-sm", children: "Word-Color Mixup" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-xs mt-0.5", children: "Read the ink, not the word · 5 rounds · 10s each" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onPick("scramble"),
              className: "w-full rounded-xl p-4 flex items-center gap-4 text-left transition-transform active:scale-95 hover:scale-[1.02]",
              style: {
                background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))",
                border: "2px solid rgba(6,182,212,0.4)",
                boxShadow: "0 4px 20px rgba(6,182,212,0.2)"
              },
              "data-ocid": "mind_refresher.pick_scramble_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl",
                    style: {
                      background: "linear-gradient(135deg,#06b6d4,#a855f7)",
                      boxShadow: "0 0 14px rgba(6,182,212,0.5)"
                    },
                    children: "🔤"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white text-sm", children: "Scramble Cards" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-xs mt-0.5", children: "Unscramble school words · 6 rounds · 20s each" })
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function WordColorMixup({
  onBack,
  onClose
}) {
  const [gameState, setGameState] = reactExports.useState("idle");
  const [round, setRound] = reactExports.useState(null);
  const [roundIndex, setRoundIndex] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState(WCM_TIME_PER_ROUND);
  const [feedback, setFeedback] = reactExports.useState(null);
  const timerRef = reactExports.useRef(null);
  const roundIndexRef = reactExports.useRef(roundIndex);
  roundIndexRef.current = roundIndex;
  const clearTimer = reactExports.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const startRound = reactExports.useCallback(
    (index) => {
      clearTimer();
      setRound(pickWcmRound());
      setRoundIndex(index);
      setTimeLeft(WCM_TIME_PER_ROUND);
      setFeedback(null);
    },
    [clearTimer]
  );
  const advanceRound = reactExports.useCallback(
    (correct) => {
      clearTimer();
      setScore((prev) => correct ? prev + 1 : prev);
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
    [clearTimer, startRound]
  );
  function startGame() {
    setScore(0);
    setGameState("playing");
    startRound(0);
  }
  reactExports.useEffect(() => {
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
    }, 1e3);
    return clearTimer;
  }, [gameState, feedback, clearTimer, advanceRound]);
  const tColor = timerColor(timeLeft, WCM_TIME_PER_ROUND);
  const timerPct = timeLeft / WCM_TIME_PER_ROUND * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl overflow-hidden",
      style: {
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)",
        boxShadow: "0 0 60px rgba(139,92,246,0.5), 0 20px 60px rgba(0,0,0,0.6)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-5 pb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onBack,
                className: "text-white/50 hover:text-white text-lg mr-1 transition-colors",
                "aria-label": "Back to game select",
                children: "←"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🎨" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-bold text-base tracking-wide",
                style: { color: "#a5f3fc" },
                children: "Word-Color Mixup!"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Close",
              onClick: onClose,
              className: "text-white/50 hover:text-white transition-colors text-xl leading-none px-1",
              "data-ocid": "mind_refresher.close_button",
              children: "✕"
            }
          )
        ] }),
        gameState === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 flex flex-col items-center gap-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/80 text-sm leading-relaxed max-w-xs", children: [
            "A color word appears in a",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-yellow-300", children: "different font color" }),
            ". Click the button matching the",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-pink-300", children: "ink color" }),
            " — not the word!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-3 flex-wrap", children: COLORS.slice(0, 4).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-8 h-8 rounded-full border-2 border-white/30",
              style: { background: c.hex }
            },
            c.name
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: startGame,
              className: "px-8 py-3 rounded-xl font-bold text-base text-white transition-transform active:scale-95",
              style: {
                background: "linear-gradient(135deg,#f97316,#ec4899)",
                boxShadow: "0 4px 20px rgba(249,115,22,0.5)"
              },
              "data-ocid": "mind_refresher.start_button",
              children: "🚀 Start Game"
            }
          )
        ] }),
        gameState === "playing" && round && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/60 text-xs font-medium", children: [
              "Round ",
              roundIndex + 1,
              " / ",
              WCM_TOTAL_ROUNDS
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-bold text-sm px-3 py-1 rounded-full",
                style: { background: "rgba(255,255,255,0.1)", color: "#fde68a" },
                children: [
                  "⭐ ",
                  score,
                  " pts"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-3 rounded-full overflow-hidden",
              style: { background: "rgba(255,255,255,0.1)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full transition-all duration-1000",
                  style: {
                    width: `${timerPct}%`,
                    background: tColor,
                    boxShadow: `0 0 8px ${tColor}`
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-white/50 text-xs -mt-2", children: [
            timeLeft,
            "s"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center rounded-xl py-8",
              style: { background: "rgba(255,255,255,0.05)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-black text-5xl tracking-widest select-none",
                  style: {
                    color: round.fontColor.hex,
                    textShadow: `0 0 20px ${round.fontColor.hex}80`
                  },
                  children: round.word.name
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-white/60 text-xs", children: [
            "Click the button matching the",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-cyan-300", children: "font color" })
          ] }),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center font-black text-xl py-1 rounded-xl animate-bounce",
              style: {
                color: feedback === "correct" ? "#4ade80" : "#f87171",
                textShadow: feedback === "correct" ? "0 0 12px #4ade80" : "0 0 12px #f87171"
              },
              children: feedback === "correct" ? "✅ Correct!" : "❌ Oops!"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: round.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: feedback !== null,
              onClick: () => advanceRound(opt.name === round.fontColor.name),
              className: "flex items-center gap-2.5 px-3 py-3 rounded-xl font-bold text-sm text-white transition-transform active:scale-95 disabled:opacity-40",
              style: {
                background: "rgba(255,255,255,0.08)",
                border: `2px solid ${opt.hex}60`,
                boxShadow: `0 2px 10px ${opt.hex}30`
              },
              "data-ocid": `mind_refresher.option.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-5 h-5 rounded-full shrink-0 border-2 border-white/20",
                    style: { background: opt.hex }
                  }
                ),
                opt.name
              ]
            },
            opt.name
          )) })
        ] }),
        gameState === "gameover" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 flex flex-col items-center gap-5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl", children: score >= 4 ? "🏆" : score >= 2 ? "🌟" : "💪" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-black text-3xl text-white", children: [
              score,
              " / ",
              WCM_TOTAL_ROUNDS
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm mt-1", children: score === WCM_TOTAL_ROUNDS ? "Perfect score! You're a color genius! 🎉" : score >= 3 ? "Great job! Color champion! 🎨" : "Nice try! Give it another shot! 💪" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: startGame,
                className: "px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-transform active:scale-95",
                style: {
                  background: "linear-gradient(135deg,#f97316,#ec4899)",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.4)"
                },
                "data-ocid": "mind_refresher.play_again_button",
                children: "🔄 Play Again"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onBack,
                className: "px-6 py-2.5 rounded-xl font-bold text-white/70 text-sm border border-white/20 hover:border-white/40 transition-colors",
                "data-ocid": "mind_refresher.done_button",
                children: "← Games"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ScrambleCards({
  onBack,
  onClose
}) {
  const [gameState, setGameState] = reactExports.useState("idle");
  const [roundIndex, setRoundIndex] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState(SC_TIME_PER_ROUND);
  const [scRound, setScRound] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState([]);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [bonus, setBonus] = reactExports.useState(false);
  const usedWordsRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const timerRef = reactExports.useRef(null);
  const roundIndexRef = reactExports.useRef(roundIndex);
  roundIndexRef.current = roundIndex;
  const timeLeftRef = reactExports.useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const clearTimer = reactExports.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const startRound = reactExports.useCallback(
    (index) => {
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
    [clearTimer]
  );
  const advanceRound = reactExports.useCallback(
    (correct, bonusEarned) => {
      clearTimer();
      const pts = correct ? SC_CORRECT_PTS + (bonusEarned ? SC_BONUS_PTS : 0) : 0;
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
      }, 1e3);
    },
    [clearTimer, startRound]
  );
  function startGame() {
    setScore(0);
    usedWordsRef.current = /* @__PURE__ */ new Set();
    setGameState("playing");
    startRound(0);
  }
  reactExports.useEffect(() => {
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
    }, 1e3);
    return clearTimer;
  }, [gameState, feedback, clearTimer, advanceRound]);
  reactExports.useEffect(() => {
    if (!scRound || feedback !== null || gameState !== "playing") return;
    if (selected.length !== scRound.answer.length) return;
    const attempt = selected.map((i) => scRound.scrambled[i]).join("");
    const correct = attempt === scRound.answer;
    const bonusEarned = correct && timeLeftRef.current >= SC_BONUS_THRESHOLD;
    advanceRound(correct, bonusEarned);
  }, [selected, scRound, feedback, gameState, advanceRound]);
  function handleTileClick(idx) {
    if (feedback !== null) return;
    if (selected.includes(idx)) return;
    setSelected((prev) => [...prev, idx]);
  }
  function handleDeselect(posIdx) {
    if (feedback !== null) return;
    setSelected((prev) => prev.filter((_, i) => i !== posIdx));
  }
  const tColor = timerColor(timeLeft, SC_TIME_PER_ROUND);
  const timerPct = timeLeft / SC_TIME_PER_ROUND * 100;
  const maxScore = SC_TOTAL_ROUNDS * (SC_CORRECT_PTS + SC_BONUS_PTS);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl overflow-hidden",
      style: {
        background: "linear-gradient(135deg, #0c1a2e 0%, #0e2a4a 40%, #1a0a3d 100%)",
        boxShadow: "0 0 60px rgba(6,182,212,0.4), 0 20px 60px rgba(0,0,0,0.7)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-5 pb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onBack,
                className: "text-white/50 hover:text-white text-lg mr-1 transition-colors",
                "aria-label": "Back to game select",
                children: "←"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🔤" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-bold text-base tracking-wide",
                style: { color: "#67e8f9" },
                children: "Scramble Cards!"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Close",
              onClick: onClose,
              className: "text-white/50 hover:text-white transition-colors text-xl leading-none px-1",
              "data-ocid": "scramble.close_button",
              children: "✕"
            }
          )
        ] }),
        gameState === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 flex flex-col items-center gap-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
              style: {
                background: "linear-gradient(135deg,#06b6d4,#a855f7)",
                boxShadow: "0 0 24px rgba(6,182,212,0.6)"
              },
              children: "🔤"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-base", children: "How to play" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/70 text-sm leading-relaxed max-w-xs", children: [
              "A",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan-300 font-bold", children: "school subject word" }),
              " ",
              "appears scrambled. Click letter tiles in the",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-pink-300 font-bold", children: "correct order" }),
              " to unscramble it!"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs", children: "+10 pts per word · +5 bonus if 10s+ remaining" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 justify-center", children: ["A", "L", "G", "E"].map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm",
              style: {
                background: TILE_COLORS[i],
                boxShadow: `0 0 10px ${TILE_COLORS[i]}80`
              },
              children: l
            },
            l
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: startGame,
              className: "px-8 py-3 rounded-xl font-bold text-base text-white transition-transform active:scale-95",
              style: {
                background: "linear-gradient(135deg,#06b6d4,#a855f7)",
                boxShadow: "0 4px 20px rgba(6,182,212,0.5)"
              },
              "data-ocid": "scramble.start_button",
              children: "🚀 Start Scramble!"
            }
          )
        ] }),
        gameState === "playing" && scRound && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-6 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/60 text-xs font-medium", children: [
              "Round ",
              roundIndex + 1,
              " / ",
              SC_TOTAL_ROUNDS
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-bold text-sm px-3 py-1 rounded-full",
                style: { background: "rgba(6,182,212,0.15)", color: "#67e8f9" },
                children: [
                  "⭐ ",
                  score,
                  " pts"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-3 rounded-full overflow-hidden",
              style: { background: "rgba(255,255,255,0.08)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full transition-all duration-1000",
                  style: {
                    width: `${timerPct}%`,
                    background: tColor,
                    boxShadow: `0 0 8px ${tColor}`
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs -mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/40", children: [
              timeLeft,
              "s remaining"
            ] }),
            timeLeft >= SC_BONUS_THRESHOLD && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-300 font-bold animate-pulse", children: "⚡ Bonus zone!" })
          ] }),
          (() => {
            const answerSlots = scRound.answer.split("").map((ch, i) => ({
              slotKey: `${scRound.answer}-slot-${ch}-${i}`,
              pos: i
            }));
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-3 flex flex-col gap-2",
                style: { background: "rgba(255,255,255,0.04)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-xs text-center mb-1", children: "Your answer — click to remove" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center min-h-[44px]", children: answerSlots.map(({ slotKey, pos }) => {
                    const tileIdx = selected[pos];
                    const letter = tileIdx !== void 0 ? scRound.scrambled[tileIdx] : "_";
                    const color = tileIdx !== void 0 ? scRound.tileColors[tileIdx] : "transparent";
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => tileIdx !== void 0 && handleDeselect(pos),
                        className: "w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm transition-transform active:scale-90",
                        style: {
                          background: tileIdx !== void 0 ? color : "rgba(255,255,255,0.06)",
                          border: `2px solid ${tileIdx !== void 0 ? color : "rgba(255,255,255,0.15)"}`,
                          boxShadow: tileIdx !== void 0 ? `0 0 8px ${color}80` : "none"
                        },
                        "data-ocid": `scramble.answer_slot.${pos + 1}`,
                        children: letter
                      },
                      slotKey
                    );
                  }) })
                ]
              }
            );
          })(),
          feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center font-black text-lg py-1 rounded-xl",
              style: {
                color: feedback === "correct" ? "#4ade80" : "#f87171",
                textShadow: feedback === "correct" ? "0 0 12px #4ade80" : "0 0 12px #f87171"
              },
              children: feedback === "correct" ? bonus ? `✅ Correct! +${SC_CORRECT_PTS + SC_BONUS_PTS} pts ⚡ Bonus!` : `✅ Correct! +${SC_CORRECT_PTS} pts` : `❌ Oops! It was ${scRound.answer}`
            }
          ),
          (() => {
            const scrambleTiles = scRound.scrambled.map((ltr, i) => ({
              tileKey: `${scRound.answer}-tile-${ltr}-${i}`,
              idx: i,
              letter: ltr
            }));
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-3",
                style: { background: "rgba(255,255,255,0.04)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-xs text-center mb-2", children: "Tap letters in order" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: scrambleTiles.map(({ tileKey, idx, letter }) => {
                    const used = selected.includes(idx);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        disabled: used || feedback !== null,
                        onClick: () => handleTileClick(idx),
                        className: "w-10 h-10 rounded-lg flex items-center justify-center font-black text-white text-base transition-transform active:scale-90 disabled:opacity-30",
                        style: {
                          background: used ? "rgba(255,255,255,0.05)" : scRound.tileColors[idx],
                          border: `2px solid ${used ? "rgba(255,255,255,0.1)" : `${scRound.tileColors[idx]}90`}`,
                          boxShadow: used ? "none" : `0 0 12px ${scRound.tileColors[idx]}60`,
                          transform: used ? "none" : void 0
                        },
                        "data-ocid": `scramble.tile.${idx + 1}`,
                        children: used ? " " : letter
                      },
                      tileKey
                    );
                  }) })
                ]
              }
            );
          })(),
          selected.length > 0 && feedback === null && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSelected([]),
              className: "text-white/40 hover:text-white/70 text-xs text-center transition-colors",
              "data-ocid": "scramble.clear_button",
              children: "✕ Clear selection"
            }
          )
        ] }),
        gameState === "gameover" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 flex flex-col items-center gap-5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl", children: score >= maxScore * 0.8 ? "🏆" : score >= maxScore * 0.5 ? "🌟" : "💪" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-black text-3xl text-white", children: [
              score,
              " pts"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/50 text-sm", children: [
              "out of ",
              maxScore,
              " possible"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm mt-2", children: score >= maxScore * 0.8 ? "Incredible! Word master! 🧠✨" : score >= maxScore * 0.5 ? "Great unscrambling! 🔤💪" : "Keep practicing! You'll get it! 🚀" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: startGame,
                className: "px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-transform active:scale-95",
                style: {
                  background: "linear-gradient(135deg,#06b6d4,#a855f7)",
                  boxShadow: "0 4px 20px rgba(6,182,212,0.4)"
                },
                "data-ocid": "scramble.play_again_button",
                children: "🔄 Play Again"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onBack,
                className: "px-6 py-2.5 rounded-xl font-bold text-white/70 text-sm border border-white/20 hover:border-white/40 transition-colors",
                "data-ocid": "scramble.done_button",
                children: "← Games"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function WordColorMixupGame({ open, onClose }) {
  const [gamePick, setGamePick] = reactExports.useState("select");
  reactExports.useEffect(() => {
    if (!open) setGamePick("select");
  }, [open]);
  function handlePick(g) {
    setGamePick(g);
  }
  function handleBack() {
    setGamePick("select");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none",
      "data-ocid": "mind_refresher.dialog",
      children: [
        gamePick === "select" && /* @__PURE__ */ jsxRuntimeExports.jsx(GameSelectScreen, { onPick: handlePick, onClose }),
        gamePick === "wcm" && /* @__PURE__ */ jsxRuntimeExports.jsx(WordColorMixup, { onBack: handleBack, onClose }),
        gamePick === "scramble" && /* @__PURE__ */ jsxRuntimeExports.jsx(ScrambleCards, { onBack: handleBack, onClose })
      ]
    }
  ) });
}
function AdminSubjectPanel() {
  const [subjectTitle, setSubjectTitle] = reactExports.useState("");
  const [saved, setSaved] = reactExports.useState(false);
  const { mutateAsync: setActiveSubject, isPending } = useSetActiveSubject();
  const handleSave = async () => {
    const trimmed = subjectTitle.trim();
    if (!trimmed) return;
    const now = BigInt(Date.now()) * BigInt(1e6);
    const oneMonth = BigInt(30) * BigInt(24) * BigInt(3600) * BigInt(1e9);
    await setActiveSubject({
      title: trimmed,
      startDate: now,
      endDate: now + oneMonth
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border bg-muted/30 p-4",
      "data-ocid": "admin.subject_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Subject Management" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              className: "flex-1 min-w-0 rounded-lg bg-background border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50",
              placeholder: "Set active subject title…",
              value: subjectTitle,
              onChange: (e) => {
                setSubjectTitle(e.target.value);
                setSaved(false);
              },
              "data-ocid": "admin.subject_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: handleSave,
              disabled: isPending || !subjectTitle.trim(),
              className: "shrink-0",
              "data-ocid": "admin.subject_save_button",
              children: isPending ? "Saving…" : saved ? "✓ Saved" : "Set Subject"
            }
          )
        ] })
      ]
    }
  );
}
function DashboardHome() {
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: subject, isLoading: subjectLoading } = useActiveSubject();
  const { data: leaderboard, isLoading: lbLoading } = useLeaderboard();
  const [mindRefresherOpen, setMindRefresherOpen] = reactExports.useState(false);
  const [basketGameOpen, setBasketGameOpen] = reactExports.useState(false);
  const [basketInventory, setBasketInventory] = reactExports.useState({
    pumpkins: 0,
    sweets: 0,
    stars: 0
  });
  const handleInventoryUpdate = (delta) => {
    setBasketInventory((prev) => ({
      pumpkins: prev.pumpkins + (delta.pumpkins ?? 0),
      sweets: prev.sweets + (delta.sweets ?? 0),
      stars: prev.stars + (delta.stars ?? 0)
    }));
  };
  const topThree = (leaderboard == null ? void 0 : leaderboard.slice(0, 3)) ?? [];
  const canManage = (currentUser == null ? void 0 : currentUser.roleLabel) === "Developer, Owner" || (currentUser == null ? void 0 : currentUser.roleLabel) === "Admin";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-5xl space-y-8", children: [
    canManage && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSubjectPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "rounded-2xl bg-card border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4",
        "data-ocid": "home.welcome_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            userLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48 mb-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-xl truncate", children: [
              "Welcome back, ",
              (currentUser == null ? void 0 : currentUser.displayName) ?? "Squad Member",
              " 👋"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Ready to level up? Your squad is counting on you." })
          ] }),
          currentUser && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-accent/20 text-accent-foreground border-accent/20 font-semibold shrink-0", children: [
            "🏅 Rank #",
            Number(currentUser.rank),
            " ·",
            " ",
            Number(currentUser.totalPoints).toLocaleString(),
            " XP"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.active_subject_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg mb-3", children: "📚 This Month's Subject" }),
      subjectLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" }) : subject ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-primary/30 bg-card hover:border-primary/60 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-2 bg-primary/10 text-primary border-primary/20 text-xs", children: "Active Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg truncate", children: subject.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: subject.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/learn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "gap-1",
              "data-ocid": "home.go_learn_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5" }),
                " Learn"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/quiz", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "bg-primary hover:bg-primary/90 gap-1",
              "data-ocid": "home.go_quiz_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-3.5 h-3.5" }),
                " Quiz Me"
              ]
            }
          ) })
        ] })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        CardContent,
        {
          className: "p-8 text-center",
          "data-ocid": "home.no_subject_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No active subject yet. Check back after the squad votes!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vote", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "mt-3 gap-1",
                "data-ocid": "home.go_vote_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Vote, { className: "w-3.5 h-3.5" }),
                  " See Voting"
                ]
              }
            ) })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.quick_actions_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg mb-3", children: "⚡ Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
        [
          {
            to: "/learn",
            icon: BookOpen,
            label: "Ask AI",
            color: "bg-primary/10 text-primary",
            ocid: "home.quick_learn_button"
          },
          {
            to: "/quiz",
            icon: Brain,
            label: "Take Quiz",
            color: "bg-secondary/10 text-secondary",
            ocid: "home.quick_quiz_button"
          },
          {
            to: "/leaderboard",
            icon: Trophy,
            label: "Leaderboard",
            color: "bg-accent/10 text-accent-foreground",
            ocid: "home.quick_leaderboard_button"
          },
          {
            to: "/vote",
            icon: Vote,
            label: "Vote Now",
            color: "bg-muted text-foreground",
            ocid: "home.quick_vote_button"
          }
        ].map(({ to, icon: Icon, label, color, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: `w-full rounded-xl p-4 flex flex-col items-center gap-2 border border-border hover:border-primary/40 transition-smooth ${color} bg-card`,
            "data-ocid": ocid,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-10 h-10 rounded-lg ${color} flex items-center justify-center`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: label })
            ]
          }
        ) }, to)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setMindRefresherOpen(true),
            className: "col-span-2 sm:col-span-2 w-full rounded-xl p-4 flex items-center justify-center gap-3 border-2 transition-smooth",
            style: {
              background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.15) 100%)",
              borderColor: "rgba(168,85,247,0.4)"
            },
            "data-ocid": "home.mind_refresher_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                  style: {
                    background: "linear-gradient(135deg,#a855f7,#ec4899)",
                    boxShadow: "0 0 12px rgba(168,85,247,0.5)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "block text-sm font-bold",
                    style: { color: "#c084fc" },
                    children: "Mind Refresher"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "block text-xs",
                    style: { color: "rgba(196,132,252,0.7)" },
                    children: "Word-Color & Scramble → brain break!"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setBasketGameOpen(true),
            className: "col-span-2 sm:col-span-2 w-full rounded-xl p-4 flex items-center justify-center gap-3 border-2 transition-smooth",
            style: {
              background: "linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(250,204,21,0.12) 100%)",
              borderColor: "rgba(251,146,60,0.45)"
            },
            "data-ocid": "home.basket_event_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xl",
                  style: {
                    background: "linear-gradient(135deg,#fb923c,#f59e0b)",
                    boxShadow: "0 0 12px rgba(251,146,60,0.5)"
                  },
                  children: "🧺"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "block text-sm font-bold",
                    style: { color: "#fb923c" },
                    children: "Basket Event"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "block text-xs",
                    style: { color: "rgba(251,146,60,0.7)" },
                    children: "Catch treats & fill your basket!"
                  }
                )
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.leaderboard_preview_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "🏆 Top Squad Members" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/leaderboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "ghost",
            className: "text-primary text-xs",
            "data-ocid": "home.view_leaderboard_button",
            children: "View all"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: lbLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, i)) }) : topThree.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "p-8 text-center",
          "data-ocid": "home.leaderboard_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No squad members yet. Be the first!" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: topThree.map((student, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex items-center gap-3 p-4 hover:bg-muted/30 transition-smooth",
          "data-ocid": `home.leaderboard_item.${index + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center", children: index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-8 h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary text-xs font-bold", children: student.displayName.slice(0, 2).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-medium text-sm min-w-0 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate min-w-0", children: student.displayName }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-accent/20 text-accent-foreground border-accent/20 text-xs shrink-0", children: [
              Number(student.totalPoints).toLocaleString(),
              " XP"
            ] })
          ]
        },
        student.id.toString()
      )) }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WordColorMixupGame,
      {
        open: mindRefresherOpen,
        onClose: () => setMindRefresherOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: basketGameOpen, onOpenChange: (v) => setBasketGameOpen(v), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-lg w-full p-0 overflow-hidden",
        style: {
          background: "linear-gradient(135deg, #0d0520 0%, #0a0a1a 100%)",
          border: "1px solid rgba(168,85,247,0.5)",
          boxShadow: "0 0 40px rgba(88,28,235,0.4)"
        },
        "data-ocid": "basket.catch_game_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogHeader,
            {
              className: "px-5 pt-5 pb-3",
              style: { borderBottom: "1px solid rgba(168,85,247,0.2)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: { color: "#c084fc" }, children: "🧺 Basket Event — Catch & Collect" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BasketCatchGame, { onInventoryUpdate: handleInventoryUpdate }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BasketInventoryCard,
      {
        inventory: basketInventory,
        onOpenCatchGame: () => {
          setBasketGameOpen(true);
        }
      }
    )
  ] });
}
function HomePage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const isAuthenticated = loginStatus === "success";
  const needsRegistration = isAuthenticated && !userLoading && currentUser === null;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardHome, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterModal, { open: needsRegistration })
  ] });
}
export {
  HomePage as default
};
