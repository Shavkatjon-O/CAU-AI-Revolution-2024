"use client"

import coreApi from "@/lib/coreApi";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface ProfileType {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activity_level: string;
  goal: string;
  dietary_preferences: string;
  allergies: string;
}

const getProfile = async () => {
  const response = await coreApi.get("/users/profile/");
  return response.data;
}

const Page = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setIsLoaded(true);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoaded(true);
      });
  }, []);

  return (
    <div className="pt-16 pb-20 size-full">
      <div className="">
        {
          isLoaded ? (
          profile ? (
            <>
              <div className="py-12 flex flex-col items-center">
                <div className="bg-indigo-100 text-slate-500 p-6 rounded-full">
                  <User className="w-20 h-20" />
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <span className="text-lg">John Doe</span>
                  <span className="text-slate-600">{profile.email}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-100">
                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                <p className="text-lg mb-2">Email: {profile.email}</p>
                <p className="text-lg mb-2">First Name: {profile.first_name}</p>
                <p className="text-lg mb-2">Last Name: {profile.last_name}</p>
                <p className="text-lg mb-2">Age: {profile.age}</p>
                <p className="text-lg mb-2">Gender: {profile.gender}</p>
                <p className="text-lg mb-2">Height: {profile.height}</p>
                <p className="text-lg mb-2">Weight: {profile.weight}</p>
                <p className="text-lg mb-2">Activity Level: {profile.activity_level}</p>
                <p className="text-lg mb-2">Goal: {profile.goal}</p>
                <p className="text-lg mb-2">Dietary Preferences: {profile.dietary_preferences}</p>
                <p className="text-lg mb-2">Allergies: {profile.allergies}</p>
              </div>
            </>
          ) : (
            <p className="text-lg">No profile data available.</p>
          )
        ) : (
          <p className="text-lg">Loading...</p>
        )
        }
      </div>
    </div>
  )
}
export default Page;
