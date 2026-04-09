"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/queryClient";

let clientQueryClientInstance: ReturnType<typeof createQueryClient> | undefined;

export function QueryProviders({ children }: { children: ReactNode }) {
  if (!clientQueryClientInstance) {
    clientQueryClientInstance = createQueryClient();
  }

  return (
    <QueryClientProvider client={clientQueryClientInstance}>
      {children}
    </QueryClientProvider>
  );
}
