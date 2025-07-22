import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { HtmlClassManager } from "@/components/HtmlClassManager";

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
        <HtmlClassManager />
        {children}
      </body>
    </html>
  );
}
