export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-center h-full">
      <div className="h-[80vh] w-2xl p-1 rounded-lg">
        {children}
      </div>
    </main>
  );
}
