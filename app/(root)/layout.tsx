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
  if (!isSignedIn) return <Spinner loading={true} />; // Show spinner while redirecting

  return (
    <UserProvider
      userId={user.id}
      userImageUrl={user.imageUrl}
      username={user.firstName}
    >
      <main className="md:grid md:grid-cols-12 h-full pattern">
        <div className="md:col-span-2 col-span-12">
          <LeftSidebar />
        </div>
        <div className="md:col-span-8 w-full col-span-12">{children}</div>
        <div className="lg:col-span-2 col-span-12">
          <RightSidebar /> 
        </div>
        <div className="col-span-12">
          <Footer />
        </div>
      </main>
    </UserProvider>
  );
}
