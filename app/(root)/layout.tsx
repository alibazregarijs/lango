"use client";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import "../globals.css";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";
import { UserProvider } from "@/components/UserProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <Spinner loading={true} />;
  if (!isSignedIn) return <Spinner loading={true} />;

  return (
    <UserProvider
      userId={user.id}
      userImageUrl={user.imageUrl}
      username={user.firstName}
    >
      <main className="grid grid-cols-1 lg:grid-cols-12 auto-rows-auto min-h-screen pattern">
        {/* Left Sidebar */}
        <div className="col-span-1 lg:col-span-1">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="col-span-1 lg:col-span-9">
          {children}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 lg:col-span-2">
          <RightSidebar />
        </div>

        {/* Footer */}
        <div className="col-span-1 lg:col-span-12 max-h-6!">
          <Footer />
        </div>
      </main>
    </UserProvider>
  );
}










