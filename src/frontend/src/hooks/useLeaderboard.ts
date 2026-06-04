import { createActor } from "@/backend";
import type { StudentView } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useLeaderboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StudentView[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}
