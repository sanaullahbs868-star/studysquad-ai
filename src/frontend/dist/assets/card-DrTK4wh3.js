import { c as createLucideIcon, u as useInternetIdentity, j as jsxRuntimeExports, d as Badge, Z as Zap, B as Button, f as Brain, T as Trophy, e as BookOpen, r as reactExports, G as useRegisterStudent, H as useRegisterWithPassword, D as Dialog, a as DialogContent, h as DialogHeader, i as DialogTitle, J as DialogDescription, K as Label, I as Input, M as DialogFooter, t as cn } from "./index-DD-CuXzg.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$2);
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
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const features = [
  {
    icon: Brain,
    title: "AI-Powered Q&A",
    desc: "Ask any question about your subject and get instant, accurate answers from Apex AI."
  },
  {
    icon: Zap,
    title: "Smart Quizzes",
    desc: "Auto-generated quizzes tailored to your Grade 9 curriculum for rapid skill-building."
  },
  {
    icon: Trophy,
    title: "Leaderboard & XP",
    desc: "Earn XP for every quiz and climb the class leaderboard to prove you're the top student."
  },
  {
    icon: BookOpen,
    title: "Monthly Subjects",
    desc: "Class toppers vote on the subject each month — everyone learns what matters most."
  },
  {
    icon: Star,
    title: "Achievements",
    desc: "Unlock badges for perfect scores, streaks, and active participation in the squad."
  },
  {
    icon: Users,
    title: "Squad Voting",
    desc: "Top performers decide the learning focus. Build class consensus, shape your curriculum."
  }
];
function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoading = loginStatus === "logging-in";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative flex-1 flex flex-col items-center justify-center px-4 py-16 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-32 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/assets/generated/hero-apex-ai.dim_1200x500.jpg",
            alt: "StudySquad AI platform preview",
            className: "w-full h-48 sm:h-72 object-cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary border-primary/30 text-xs", children: "🎓 Grade 9 · Academic Year 2026" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-extrabold text-4xl sm:text-5xl tracking-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Study" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Squad" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: " AI" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg text-muted-foreground mb-8 leading-relaxed", children: [
          "Your class's AI learning companion. Master subjects, crush quizzes, earn XP, and compete with your squad — powered by",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Apex AI" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "lg",
            onClick: () => login(),
            disabled: isLoading,
            className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-base shadow-lg",
            "data-ocid": "login.sign_in_button",
            children: isLoading ? "Signing in…" : "🚀 Sign In with Internet Identity"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Free & secure. No password needed." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 border-t border-border py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-center mb-10", children: "Everything your squad needs to succeed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: features.map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-smooth group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm mb-1", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: desc })
          ]
        },
        title
      )) })
    ] }) })
  ] });
}
function RegisterModal({ open }) {
  const [displayName, setDisplayName] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [showAccessCode, setShowAccessCode] = reactExports.useState(false);
  const [accessCode, setAccessCode] = reactExports.useState("");
  const { mutateAsync, isPending } = useRegisterStudent();
  const { mutateAsync: registerWithPassword, isPending: isPendingPw } = useRegisterWithPassword();
  const handleSubmit = async (e) => {
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
        password: accessCode.trim()
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-md",
      onPointerDownOutside: (e) => e.preventDefault(),
      "data-ocid": "register.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-xl", children: "Welcome to StudySquad AI!" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-muted-foreground", children: "Choose a display name to join your class squad. This is how your classmates will see you on the leaderboard." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "displayName", className: "text-sm font-medium", children: "Display Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "displayName",
                placeholder: "e.g. Alex Carter",
                value: displayName,
                onChange: (e) => {
                  setDisplayName(e.target.value);
                  if (error) setError("");
                },
                maxLength: 30,
                autoFocus: true,
                "data-ocid": "register.display_name_input"
              }
            ),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "register.field_error",
                children: error
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1",
                onClick: () => {
                  setShowAccessCode((v) => !v);
                  setAccessCode("");
                  setError("");
                },
                "data-ocid": "register.access_code_toggle",
                children: [
                  showAccessCode ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3" }),
                  "I have a special access code"
                ]
              }
            ),
            showAccessCode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "space-y-1",
                "data-ocid": "register.access_code_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "accessCode",
                      className: "text-xs font-medium text-muted-foreground",
                      children: "Access Code"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "accessCode",
                      type: "password",
                      placeholder: "Enter your access code",
                      value: accessCode,
                      onChange: (e) => {
                        setAccessCode(e.target.value);
                        if (error) setError("");
                      },
                      "data-ocid": "register.access_code_input"
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: isLoading || !displayName.trim(),
              className: "w-full bg-primary hover:bg-primary/90",
              "data-ocid": "register.submit_button",
              children: isLoading ? "Joining…" : "🎓 Join the Squad"
            }
          ) })
        ] })
      ]
    }
  ) });
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
export {
  Card as C,
  LoginPage as L,
  RegisterModal as R,
  CardContent as a,
  CardHeader as b,
  CardTitle as c
};
