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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const imageRef = useRef("");

  console.log(user,"user")
  const updateUserImage = useMutation(api.users.updateUserImage);

  const handleUpdate = async () => {
    try {
      await updateUserImage({
        clerkId: user?.id || "",
        newImageUrl: imageRef.current,
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const updateProfileImage = async ({ imageUrl }: { imageUrl: string }) => {
    if (user) {
      try {
        await user.setProfileImage({ file: imageUrl });
        handleUpdate();
        localStorage.removeItem("profileImageUrl");
        imageRef.current = "";
        // Image updated successfully
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (user?.username === null || user?.username === "Anonymous") {
    const imageUrl = localStorage.getItem("profileImageUrl"); // it fix username and imageUrl

    if (imageUrl) {
      imageRef.current = imageUrl;
      updateProfileImage({ imageUrl });
    }
  }

  if (!isLoaded) return <Spinner loading={true} />;
  if (!isSignedIn) return <Spinner loading={true} />;

  return (
    <UserProvider
      userId={user.id}
      userImageUrl={imageRef.current ? imageRef.current : user.imageUrl}
      username={
        user.firstName === "Anonymous" || user.firstName == null
          ? getGmailUsername(user?.emailAddresses[0].emailAddress)
          : user.firstName
      }
    >
      <main className="grid grid-cols-1 lg:grid-cols-12 auto-rows-auto min-h-screen pattern">
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
