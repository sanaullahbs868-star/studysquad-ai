import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LearnPage = lazy(() => import("@/pages/LearnPage"));
const QuizPage = lazy(() => import("@/pages/QuizPage"));
const LeaderboardPage = lazy(() => import("@/pages/LeaderboardPage"));
const VotePage = lazy(() => import("@/pages/VotePage"));

function PageLoader() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"].map((id) => (
          <Skeleton key={id} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const learnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn",
  component: LearnPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

const voteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vote",
  component: VotePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  learnRoute,
  quizRoute,
  leaderboardRoute,
  voteRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
