import { v as useActor, x as useQuery, C as createActor } from "./index-DD-CuXzg.js";
function useActiveSubject() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["activeSubject"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getActiveSubject();
    },
    enabled: !!actor && !isFetching
  });
}
export {
  useActiveSubject as u
};
