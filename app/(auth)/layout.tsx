import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-screen justify-center items-center w-full overflow-hidden">
      {children}
    </main>
  );
}
