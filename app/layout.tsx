import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ConvexClerkProvider from "@/app/providers/ConvexProviderWithClerk";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Lango",
  description: "Improve your language skills with Lango",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider />
        <ConvexClerkProvider>
          {children}
          <Toaster />
        </ConvexClerkProvider>
      </body>
    </html>
  );
}
