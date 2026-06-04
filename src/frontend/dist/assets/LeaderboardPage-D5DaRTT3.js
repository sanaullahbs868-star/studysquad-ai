import { u as useInternetIdentity, b as useCurrentUser, j as jsxRuntimeExports, T as Trophy, A as Avatar, g as AvatarFallback, d as Badge, S as Skeleton } from "./index-DD-CuXzg.js";
import { L as LoginPage, R as RegisterModal, C as Card, a as CardContent } from "./card-DrTK4wh3.js";
import { u as useLeaderboard } from "./useLeaderboard-Dcm9SaWk.js";
const MEDALS = ["🥇", "🥈", "🥉"];
function LeaderboardContent() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { data: currentUser } = useCurrentUser();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-accent-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl", children: "Leaderboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Top performers in the squad" })
      ] })
    ] }),
    !isLoading && leaderboard && leaderboard.length >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-3 gap-3 mb-2",
        "data-ocid": "leaderboard.podium_section",
        children: [leaderboard[1], leaderboard[0], leaderboard[2]].map(
          (student, podiumIdx) => {
            const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex flex-col items-center justify-end gap-2 bg-card border border-border rounded-xl p-3 ${actualRank === 1 ? "border-accent/40" : ""}`,
                "data-ocid": `leaderboard.podium.${actualRank}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: MEDALS[actualRank - 1] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-10 h-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AvatarFallback,
                    {
                      className: `text-xs font-bold ${actualRank === 1 ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"}`,
                      children: student.displayName.slice(0, 2).toUpperCase()
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-center truncate w-full", children: student.displayName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/10 text-primary border-primary/20 text-xs", children: [
                    Number(student.totalPoints).toLocaleString(),
                    " XP"
                  ] })
                ]
              },
              student.id.toString()
            );
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", "data-ocid": "leaderboard.list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [
      "sk-a",
      "sk-b",
      "sk-c",
      "sk-d",
      "sk-e",
      "sk-f",
      "sk-g",
      "sk-h"
    ].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, id)) }) : !leaderboard || leaderboard.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-12 text-center",
        "data-ocid": "leaderboard.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: "No students yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Be the first to join the squad!" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: leaderboard.map((student, index) => {
      const isCurrentUser = (currentUser == null ? void 0 : currentUser.id.toString()) === student.id.toString();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: `flex items-center gap-3 px-4 py-3 transition-smooth ${isCurrentUser ? "bg-primary/5" : "hover:bg-muted/20"}`,
          "data-ocid": `leaderboard.item.${index + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-sm font-bold text-muted-foreground", children: index < 3 ? MEDALS[index] : `#${index + 1}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-8 h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-xs font-bold", children: student.displayName.slice(0, 2).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `flex-1 text-sm font-medium truncate min-w-0 flex items-center gap-2 ${isCurrentUser ? "text-primary" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate min-w-0", children: student.displayName }),
                  isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: "(You)" }),
                  student.roleLabel === "Developer, Owner" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "shrink-0 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0 h-4 font-semibold", children: [
                    "👑 ",
                    student.roleLabel
                  ] }),
                  student.roleLabel === "Admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "shrink-0 bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0 h-4 font-semibold", children: "🛡 Admin" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-accent/15 text-accent-foreground border-accent/20 text-xs shrink-0", children: [
              Number(student.totalPoints).toLocaleString(),
              " XP"
            ] })
          ]
        },
        student.id.toString()
      );
    }) }) }) })
  ] });
}
function LeaderboardPage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  if (loginStatus !== "success") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {});
  }
  const needsRegistration = !userLoading && currentUser === null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardContent, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterModal, { open: needsRegistration })
  ] });
}
export {
  LeaderboardPage as default
};
