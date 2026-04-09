"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const Hydrate = ({ children, state }: { children: React.ReactNode; state: string }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!state) return;

    try {
      const cachedState = JSON.parse(state);
      queryClient.setDefaultOptions({
        queries: {
          staleTime: 60 * 1000,
        },
      });
      // Restore cache from state
      const { queries } = cachedState;
      queries?.forEach((query: any) => {
        queryClient.setQueryData(query.queryKey, query.state?.data);
      });
    } catch (error) {
      console.error("Failed to hydrate query cache:", error);
    }
  }, [state, queryClient]);

  return children;
};
