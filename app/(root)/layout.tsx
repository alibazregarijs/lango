"use client";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import "../globals.css";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";
import { UserProvider } from "@/components/UserProvider";
import { getGmailUsername } from "@/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserStatus } from "@/hooks/useUserStatus";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const imageRef = useRef("");
  useUserStatus();

  const updateUserImage = useMutation(api.users.updateUserImage);

  const updateProfileImage = async (imageUrl: string) => {
    if (!user) return;
    try {
      // First update Clerk profile image
      await user.setProfileImage({ file: imageUrl });

      // Then update Convex with the new image URL
      await updateUserImage({
        clerkId: user.id,
        newImageUrl: imageUrl, // Use the actual image URL
      });

      localStorage.removeItem("profileImageUrl");
      imageRef.current = "";
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (user && (user.username === null || user.username === "Anonymous")) {
      const imageUrl = localStorage.getItem("profileImageUrl");
      if (imageUrl) {
        imageRef.current = imageUrl;
        updateProfileImage(imageUrl);
      }
    }
  }, [user]); // Run this effect when user changes

  if (!isLoaded || !isSignedIn) return <Spinner loading={true} />;

  return (
    <UserProvider
      userId={user.id}
      userImageUrl={imageRef.current ? imageRef.current : user.imageUrl}
      username={getGmailUsername(user?.emailAddresses[0].emailAddress)}
    >
      <main className="grid grid-cols-1 lg:grid-cols-12 auto-rows-auto max-h-screen pattern no-scrollbar">
        {/* Left Sidebar */}
        <div className="col-span-1 lg:col-span-1">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="col-span-1 lg:col-span-9">{children}</div>

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
