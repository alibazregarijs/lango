import React from "react";

const Page = async ({ params }: { params: Promise<{ roomId: string }> }) => {
  const { roomId } = await params;
  console.log(roomId, "room id");
  return <div>Page</div>;
};

export default Page;
