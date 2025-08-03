import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import "../globals.css";
import { auth } from "@clerk/nextjs/server";
import { UserProvider } from "@/components/UserProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <html lang="en">
      <body>
        <UserProvider userId={userId}>
          <main className="md:grid md:grid-cols-12 h-screen pattern">
            <div className="md:col-span-2 col-span-12">
              <LeftSidebar />
            </div>
            <div className="md:col-span-8 w-full col-span-12">{children}</div>
            <div className="md:col-span-2 col-span-12">
              <RightSidebar />
            </div>
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
