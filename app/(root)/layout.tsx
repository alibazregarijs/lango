import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="md:grid md:grid-cols-12 h-screen pattern">
          <div className="md:col-span-2 col-span-12">
            <LeftSidebar />
          </div>
          <div className="md:col-span-8  col-span-12">{children}</div>
          <div className="md:col-span-2  col-span-12">
            <RightSidebar />
          </div>
        </main>
      </body>
    </html>
  );
}
