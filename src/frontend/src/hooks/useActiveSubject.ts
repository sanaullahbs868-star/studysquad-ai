import { createActor } from "@/backend";
import type { SubjectView } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useActiveSubject() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SubjectView | null>({
    queryKey: ["activeSubject"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getActiveSubject();
    },
    enabled: !!actor && !isFetching,
  });
}
