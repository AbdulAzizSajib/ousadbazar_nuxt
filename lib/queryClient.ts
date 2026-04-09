import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
      },
    },
  });
};

let clientQueryClientInstance: QueryClient | undefined;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    // This is being called during SSR
    return createQueryClient();
  }

  // Re-use query client if it already exists
  if (!clientQueryClientInstance) {
    clientQueryClientInstance = createQueryClient();
  }

  return clientQueryClientInstance;
};
