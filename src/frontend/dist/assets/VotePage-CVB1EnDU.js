import { c as createLucideIcon, u as useInternetIdentity, b as useCurrentUser, j as jsxRuntimeExports, v as useActor, w as useQueryClient, r as reactExports, x as useQuery, y as useMutation, S as Skeleton, V as Vote, T as Trophy, d as Badge, B as Button, X, I as Input, z as ue, C as createActor } from "./index-DD-CuXzg.js";
import { L as LoginPage, R as RegisterModal, C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DrTK4wh3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
function VoteContent() {
  const { actor, isFetching } = useActor(createActor);
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [newSubjects, setNewSubjects] = reactExports.useState([
    "Biology",
    "Algebra",
    "World History"
  ]);
  const [inputValue, setInputValue] = reactExports.useState("");
  const { data: votingEvent, isLoading } = useQuery({
    queryKey: ["votingEvent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getActiveVotingEvent();
    },
    enabled: !!actor && !isFetching
  });
  const { mutateAsync: createEvent, isPending: isCreating } = useMutation({
    mutationFn: async (subjects) => {
      if (!actor) throw new Error("Not connected");
      return actor.createVotingEvent(subjects);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votingEvent"] });
      ue.success("Voting event created!");
    },
    onError: () => ue.error("Failed to create voting event.")
  });
  const { mutateAsync: castVote, isPending: isVoting } = useMutation({
    mutationFn: async ({
      eventId,
      subject
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.castVote(eventId, subject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votingEvent"] });
      ue.success("Vote cast! 🗳️");
    },
    onError: () => ue.error("Failed to cast vote.")
  });
  const { mutateAsync: lockEvent, isPending: isLocking } = useMutation({
    mutationFn: async (eventId) => {
      if (!actor) throw new Error("Not connected");
      return actor.lockVoting(eventId);
    },
    onSuccess: (winner) => {
      queryClient.invalidateQueries({ queryKey: ["votingEvent"] });
      queryClient.invalidateQueries({ queryKey: ["activeSubject"] });
      if (winner) ue.success(`🏆 Winner: ${winner}`);
    },
    onError: () => ue.error("Failed to lock voting.")
  });
  const isTopper = currentUser && Number(currentUser.rank) <= 3 && Number(currentUser.totalPoints) > 0;
  const canCreateEvent = isTopper;
  const addSubject = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !newSubjects.includes(trimmed)) {
      setNewSubjects((prev) => [...prev, trimmed]);
      setInputValue("");
    }
  };
  const removeSubject = (subject) => {
    setNewSubjects((prev) => prev.filter((s) => s !== subject));
  };
  const totalVotes = votingEvent ? votingEvent.voteCounts.reduce((sum, [, count]) => sum + Number(count), 0) : 0;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-2xl space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-xl" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Vote, { className: "w-5 h-5 text-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl", children: "Subject Voting" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Class toppers vote on the next monthly subject" })
      ] })
    ] }),
    currentUser && !isTopper && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-4 rounded-xl bg-muted/50 border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 text-accent-foreground mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Voting is for class toppers only." }),
        " ",
        "Climb the leaderboard to earn voting rights! Top 3 members can vote."
      ] })
    ] }),
    votingEvent && !votingEvent.isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "vote.active_event_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Active Vote" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/10 text-primary border-primary/20 text-xs", children: [
          totalVotes,
          " vote",
          totalVotes !== 1 ? "s" : ""
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        votingEvent.voteCounts.sort(([, a], [, b]) => Number(b) - Number(a)).map(([subject, count], idx) => {
          const pct = totalVotes > 0 ? Number(count) / totalVotes * 100 : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "space-y-1.5",
              "data-ocid": `vote.subject_item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: subject }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      Number(count),
                      " votes"
                    ] }),
                    isTopper && !votingEvent.hasVoted && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: () => castVote({ eventId: votingEvent.id, subject }),
                        disabled: isVoting,
                        className: "h-6 px-2 text-xs",
                        "data-ocid": `vote.cast_vote_button.${idx + 1}`,
                        children: "Vote"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-primary rounded-full transition-smooth",
                    style: { width: `${pct}%` }
                  }
                ) })
              ]
            },
            subject
          );
        }),
        votingEvent.hasVoted && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-muted-foreground text-center pt-1",
            "data-ocid": "vote.voted_success_state",
            children: "✅ You have voted!"
          }
        ),
        isTopper && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "w-full gap-1.5 mt-2 border-destructive/30 text-destructive hover:bg-destructive/10",
            onClick: () => lockEvent(votingEvent.id),
            disabled: isLocking,
            "data-ocid": "vote.lock_voting_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5" }),
              isLocking ? "Locking…" : "Lock Voting & Set Subject"
            ]
          }
        )
      ] })
    ] }) : (votingEvent == null ? void 0 : votingEvent.isLocked) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border-accent/30 bg-accent/5",
        "data-ocid": "vote.locked_event_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-10 h-10 text-accent-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg", children: "Winner Announced!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "This month's subject is:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "mt-2 bg-accent/20 text-accent-foreground border-accent/30 text-base px-4 py-1", children: [
            "🎓 ",
            votingEvent.winnerSubject ?? "TBD"
          ] })
        ] })
      }
    ) : null,
    canCreateEvent && !votingEvent && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "vote.create_event_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Create Voting Event" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: newSubjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            className: "bg-muted text-foreground border-border gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-smooth",
            onClick: () => removeSubject(s),
            children: [
              s,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
            ]
          },
          s
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Add a subject…",
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSubject();
                }
              },
              className: "flex-1",
              "data-ocid": "vote.add_subject_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: addSubject,
              variant: "outline",
              size: "icon",
              "data-ocid": "vote.add_subject_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => createEvent(newSubjects),
            disabled: isCreating || newSubjects.length < 2,
            className: "w-full bg-primary hover:bg-primary/90",
            "data-ocid": "vote.create_event_button",
            children: isCreating ? "Creating…" : "🗳️ Start Voting"
          }
        )
      ] })
    ] }),
    !votingEvent && !canCreateEvent && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-12 border border-dashed border-border rounded-2xl",
        "data-ocid": "vote.no_event_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Vote, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: "No active vote" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Class toppers will start the next voting event soon." })
        ]
      }
    )
  ] });
}
function VotePage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  if (loginStatus !== "success") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {});
  }
  const needsRegistration = !userLoading && currentUser === null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(VoteContent, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterModal, { open: needsRegistration })
  ] });
}
export {
  VotePage as default
};
