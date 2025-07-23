import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConvexClientProvider } from "@/app/providers/ConvexProvider";

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
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
