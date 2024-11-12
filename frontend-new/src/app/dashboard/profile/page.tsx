"use client";

import coreApi from "@/lib/coreApi";
import { useState, useEffect } from "react";
import { User, Mail, Info, Calendar, Ruler, Dumbbell, Target, Utensils, AlertTriangle } from "lucide-react";

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
};

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
    <div className="pt-16 pb-20 size-full overflow-y-scroll">
      <div className="">
        {isLoaded ? (
          error ? (
            <div className="text-red-500 text-center text-lg">
              <p>Error: {error}</p>
            </div>
          ) : profile ? (
            <>
              <div className="py-12 flex flex-col items-center">
                <div className="bg-indigo-100 text-slate-500 p-6 rounded-full">
                  <User className="w-20 h-20" />
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <span className="text-lg">
                    {profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : 'John Doe'}
                  </span>
                  <span className="text-slate-600">{profile.email}</span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-t-indigo-200">
                <h1 className="text-2xl font-bold mb-4 text-center">Profile Details</h1>
                <div className="space-y-4">
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Mail className="size-5" />
                    </div>
                    <span className="font-semibold">Email:</span>
                    <span className="ml-2">{profile.email}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Info className="size-5"  />
                    </div>
                    <span className="font-semibold">First Name:</span>
                    <span className="ml-2">{profile.first_name}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Info className="size-5"  />
                    </div>
                    <span className="font-semibold">Last Name:</span>
                    <span className="ml-2">{profile.last_name}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Calendar className="size-5"  />
                    </div>
                    <span className="font-semibold">Age:</span>
                    <span className="ml-2">{profile.age}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <User className="size-5"  />
                    </div>
                    <span className="font-semibold">Gender:</span>
                    <span className="ml-2">{profile.gender}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Ruler className="size-5"  />
                    </div>
                    <span className="font-semibold">Height:</span>
                    <span className="ml-2">{profile.height} cm</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Dumbbell className="size-5"  />
                    </div>
                    <span className="font-semibold">Weight:</span>
                    <span className="ml-2">{profile.weight} kg</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Target className="size-5"  />
                    </div>
                    <span className="font-semibold">Activity Level:</span>
                    <span className="ml-2">{profile.activity_level}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Target className="size-5"  />
                    </div>
                    <span className="font-semibold">Goal:</span>
                    <span className="ml-2">{profile.goal}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <Utensils className="size-5"  />
                    </div>
                    <span className="font-semibold">Dietary Preferences:</span>
                    <span className="ml-2">{profile.dietary_preferences}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <div className="bg-indigo-500 p-2 text-white rounded-full mr-4">
                      <AlertTriangle className="size-5"  />
                    </div>
                    <span className="font-semibold">Allergies:</span>
                    <span className="ml-2">{profile.allergies}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-lg text-center">No profile data available.</p>
          )
        ) : (
          <p className="text-lg text-center">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
