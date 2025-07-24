import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-screen w-full overflow-hidden"> {/* Added overflow-hidden */}
      <div className="absolute size-full">
        <Image 
          src="/images/bg-img.png" 
          alt="background" 
          fill 
          className="size-full object-cover" // Added object-cover
        />
      </div>
      {children}
    </main>
  );
}