import { v as useActor, x as useQuery, C as createActor } from "./index-DD-CuXzg.js";
function useLeaderboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching
  });
}
export {
  useLeaderboard as u
};
