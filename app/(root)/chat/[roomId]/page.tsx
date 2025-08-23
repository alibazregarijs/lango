"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const params = useParams();

  const userSenderId = searchParams.get("userSenderId");
  const userTakerId = searchParams.get("userTakerId");
  const roomId = params.roomId as string;

  console.log(userSenderId, "userSenderId");
  console.log(userTakerId, "userTakerId");

  return <div>Page</div>;
};

export default Page;
