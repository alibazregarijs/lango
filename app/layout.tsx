import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ConvexClerkProvider from "@/app/providers/ConvexClerkProvider";
import { Toaster } from "@/components/ui/sonner";


const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lango",
  description: "Improve your language skills with Lango",
  authors: [
    { name: "Alibazregarijs", url: "https://github.com/alibazregarijs" },
  ],
  other: {
    copyright: "© 2025 Alibazregarijs",
  },
};

export default async function RootLayout({
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
          <meta name="author" content="alibazregarijs" />
          <meta name="copyright" content="© 2025 alibazregarijs" />
          <Toaster />
        </ConvexClerkProvider>
      </body>
    </html>
  );
}
