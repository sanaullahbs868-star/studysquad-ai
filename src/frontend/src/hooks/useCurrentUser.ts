import { createActor } from "@/backend";
import type { StudentView } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCurrentUser() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StudentView | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerStudent(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useUpdateDisplayName() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMyDisplayName(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
export function useRegisterWithPassword() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      displayName,
      password,
    }: {
      displayName: string;
      password: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerWithPassword(displayName, password);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      }
    },
  });
}

export function useSetActiveSubject() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      startDate,
      endDate,
    }: {
      title: string;
      startDate: bigint;
      endDate: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setActiveSubject(title, startDate, endDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeSubject"] });
    },
  });
}
