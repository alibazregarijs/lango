export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-center h-full">
      <div className="h-[80vh] flex-center p-1 md:w-[80vh] w-[40vh] rounded-lg">
        {children}
      </div>
    </main>
  );
}
