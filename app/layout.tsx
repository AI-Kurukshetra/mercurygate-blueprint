import type { Metadata } from "next";

import { QueryProvider } from "@/components/providers/query-provider";
import { APP_NAME } from "@/lib/constants";

import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Cloud-based logistics shipment management platform."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
