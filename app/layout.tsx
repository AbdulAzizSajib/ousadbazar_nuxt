import { Metadata } from "next";
import { QueryProviders } from "@/components/QueryProviders";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OusadBazar - Pharma Ecommerce",
    template: "%s",
  },
  description: "Buy medicines online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/ousadbazar/fav.png" />
      </head>
      <body>
        <QueryProviders>
          <ClientLayout>{children}</ClientLayout>
        </QueryProviders>
      </body>
    </html>
  );
}
