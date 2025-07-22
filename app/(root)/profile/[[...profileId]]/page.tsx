import React from "react";

const Profile = async ({ params }: { params: { profileId: string } }) => {
  const { profileId } = await params;
  return <div>Profile {profileId}</div>;
};

export default Profile;
