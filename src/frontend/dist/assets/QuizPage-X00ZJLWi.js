import { c as createLucideIcon, u as useInternetIdentity, b as useCurrentUser, j as jsxRuntimeExports, v as useActor, w as useQueryClient, r as reactExports, x as useQuery, y as useMutation, S as Skeleton, f as Brain, B as Button, Z as Zap, E as CircleCheckBig, F as CircleX, z as ue, C as createActor } from "./index-DD-CuXzg.js";
import { L as LoginPage, R as RegisterModal, C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DrTK4wh3.js";
import { u as useActiveSubject } from "./useActiveSubject-BVfaky2x.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
function QuizContent() {
  const { actor, isFetching } = useActor(createActor);
  const { data: subject, isLoading: subjectLoading } = useActiveSubject();
  const queryClient = useQueryClient();
  const [selectedAnswers, setSelectedAnswers] = reactExports.useState({});
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [lastAttempt, setLastAttempt] = reactExports.useState(null);
  const subjectId = subject == null ? void 0 : subject.id;
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", subjectId == null ? void 0 : subjectId.toString()],
    queryFn: async () => {
      if (!actor || subjectId === void 0) return null;
      return actor.getQuiz(subjectId);
    },
    enabled: !!actor && !isFetching && subjectId !== void 0
  });
  const { mutateAsync: generateQuiz, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      if (!actor || subjectId === void 0) throw new Error("Not ready");
      return actor.generateQuiz(subjectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quiz", subjectId == null ? void 0 : subjectId.toString()]
      });
      setSelectedAnswers({});
      setSubmitted(false);
      setLastAttempt(null);
    },
    onError: () => ue.error(
      "Failed to generate quiz. Check your Gemini API key in Settings."
    )
  });
  const { mutateAsync: submitAttempt, isPending: isSubmitting } = useMutation({
    mutationFn: async (answers) => {
      if (!actor || !quiz) throw new Error("Not ready");
      return actor.submitQuizAttempt(quiz.id, answers);
    },
    onSuccess: (attempt) => {
      setLastAttempt(attempt);
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: () => ue.error("Failed to submit quiz.")
  });
  const handleSubmit = async () => {
    if (!quiz) return;
    const answers = quiz.questions.map(
      (_, idx) => BigInt(selectedAnswers[idx] ?? 0)
    );
    await submitAttempt(answers);
  };
  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setLastAttempt(null);
  };
  if (subjectLoading || quizLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-3xl space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }, i))
    ] });
  }
  if (!subject) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "container mx-auto px-4 py-16 text-center max-w-xl",
        "data-ocid": "quiz.no_subject_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-2", children: "No Active Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No active subject for quizzes yet." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-3xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-5 h-5 text-secondary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl", children: "Quiz Time!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: subject.title })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => generateQuiz(),
          disabled: isGenerating,
          variant: "outline",
          size: "sm",
          className: "gap-1.5",
          "data-ocid": "quiz.generate_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`
              }
            ),
            isGenerating ? "Generating…" : "New Quiz"
          ]
        }
      )
    ] }),
    submitted && lastAttempt && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: `border-2 ${lastAttempt.isPerfect ? "border-accent bg-accent/5" : Number(lastAttempt.score) >= ((quiz == null ? void 0 : quiz.questions.length) ?? 0) / 2 ? "border-primary bg-primary/5" : "border-border"}`,
        "data-ocid": "quiz.result_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-2", children: lastAttempt.isPerfect ? "🏆" : Number(lastAttempt.score) >= ((quiz == null ? void 0 : quiz.questions.length) ?? 0) / 2 ? "⚡" : "💪" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg", children: lastAttempt.isPerfect ? "Perfect Score!" : `Score: ${Number(lastAttempt.score)}/${(quiz == null ? void 0 : quiz.questions.length) ?? 0}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: lastAttempt.isPerfect ? "Incredible! You aced it!" : `You got ${Number(lastAttempt.score)} out of ${(quiz == null ? void 0 : quiz.questions.length) ?? 0} correct.` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleReset,
              size: "sm",
              variant: "outline",
              className: "mt-3",
              "data-ocid": "quiz.try_again_button",
              children: "Try Again"
            }
          )
        ] })
      }
    ),
    !quiz && !isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 border border-dashed border-border rounded-2xl",
        "data-ocid": "quiz.no_quiz_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg mb-2", children: "No quiz yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: [
            "Generate a quiz for ",
            subject.title,
            " with Apex AI!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => generateQuiz(),
              className: "bg-primary hover:bg-primary/90 gap-2",
              "data-ocid": "quiz.generate_first_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
                " Generate Quiz"
              ]
            }
          )
        ]
      }
    ),
    quiz && !submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "quiz.questions_list", children: [
      quiz.questions.map((question, qIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-border",
          "data-ocid": `quiz.question.${qIdx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
                qIdx + 1,
                "."
              ] }),
              question.questionText
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: question.options.map((option, oIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx })),
                className: `w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-smooth ${selectedAnswers[qIdx] === oIdx ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/40 hover:bg-muted/50"}`,
                "data-ocid": `quiz.option.${qIdx + 1}.${oIdx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold mr-2", children: [
                    String.fromCharCode(65 + oIdx),
                    "."
                  ] }),
                  option.text
                ]
              },
              `q${qIdx}-o${option.text}`
            )) })
          ]
        },
        question.id.toString()
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSubmit,
          disabled: isSubmitting || Object.keys(selectedAnswers).length < quiz.questions.length,
          className: "w-full bg-primary hover:bg-primary/90",
          "data-ocid": "quiz.submit_button",
          children: isSubmitting ? "Submitting…" : "Submit Answers"
        }
      )
    ] }),
    quiz && submitted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "quiz.review_list", children: quiz.questions.map((question, qIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-border",
        "data-ocid": `quiz.review_item.${qIdx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
              qIdx + 1,
              "."
            ] }),
            question.questionText
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: question.options.map((option, oIdx) => {
            const chosen = selectedAnswers[qIdx] === oIdx;
            const correct = option.isCorrect;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `w-full px-4 py-2.5 rounded-lg border text-sm flex items-center gap-2 ${correct ? "border-primary bg-primary/10 text-primary" : chosen && !correct ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground"}`,
                children: [
                  correct ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 shrink-0" }) : chosen ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold mr-1", children: [
                    String.fromCharCode(65 + oIdx),
                    "."
                  ] }),
                  option.text
                ]
              },
              `r${qIdx}-o${option.text}`
            );
          }) })
        ]
      },
      question.id.toString()
    )) })
  ] });
}
function QuizPage() {
  const { loginStatus } = useInternetIdentity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  if (loginStatus !== "success") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {});
  }
  const needsRegistration = !userLoading && currentUser === null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuizContent, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterModal, { open: needsRegistration })
  ] });
}
export {
  QuizPage as default
};
