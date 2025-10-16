"use client";
import ChatStateProvider from "@/app/providers/ChatStateProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ChatStateProvider>{children}</ChatStateProvider>;
}


