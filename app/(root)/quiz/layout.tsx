export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-center h-full">
      <div className="h-[70vh] w-2xl bg-[#15171C] border p-1 rounded-lg">
        {children}
      </div>
    </main>
  );
}
