import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ConvexClerkProvider from "@/app/providers/ConvexProviderWithClerk";

const manrope = Manrope({ subsets: ["latin"] });

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
        <ConvexClerkProvider>{children}</ConvexClerkProvider>
      </body>
    </html>
  );
}
