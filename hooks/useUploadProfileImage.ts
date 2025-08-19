import React from "react";
import { useUser } from "@clerk/nextjs";
const useUploadProfileImage = ({imageUrl}: {imageUrl: string}) => {
    const { isSignedIn, user, isLoaded } = useUser();

  return {};
};

export default useUploadProfileImage;
