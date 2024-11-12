"use client";

import { useState, useEffect } from "react";
import coreApi from "@/lib/coreApi";


interface UserProfileType {
  id: number;
  email: string;
}


const getUserProfile = async () => {
  const { data } = await coreApi.get<UserProfileType>("/users/profile/");
  return data;
}


const Page = () => {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await getUserProfile();
      setUserProfile(profile);
    };

    fetchUserProfile();
  }, []);

  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {userProfile && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg">Email: {userProfile.email}</p>
        </div>
      )}
    </div>
  );

};
export default Page;