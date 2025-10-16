"use client";
import Spinner from "@/components/Spinner";
import { useUser } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUser();

  if (!user.isLoaded) return <Spinner loading={true} />;
  return (
    <main className="relative h-screen justify-center items-center w-full overflow-hidden">
      {children}
    </main>
  );
}
