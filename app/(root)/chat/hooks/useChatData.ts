import { useSearchParams, useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";

export const useChatData = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const { userId, userImageUrl } = useUser();

  const userSenderId = searchParams.get("userSenderId");
  const userTakerId = searchParams.get("userTakerId");
  const imageUrl = searchParams.get("imageUrl");
  const roomId = params.roomId as string;

  return {
    userSenderId,
    userTakerId,
    imageUrl,
    roomId,
    userId,
    userImageUrl,
  };
};