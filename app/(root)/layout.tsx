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
        <main className="grid grid-cols-12 h-screen pattern">
          <div className="col-span-2 ">
            <LeftSidebar />
          </div>
          <div className="col-span-8">{children}</div>
          <div className="col-span-2 b ">
            <RightSidebar />
          </div>
        </main>
      </body>
    </html>
  );
}
