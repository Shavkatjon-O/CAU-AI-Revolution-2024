"use client";

import coreApi from "@/lib/coreApi";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Info,
  Calendar,
  Ruler,
  Dumbbell,
  Target,
  Utensils,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  const getProfileValue = (value: string | number | undefined, fallback: string) => {
    return value ? value : fallback;
  };

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
              <div className="pt-10 flex flex-col items-center">
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-500 p-6 rounded-full">
                  <User className="w-20 h-20" />
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <span className="text-lg">
                    {profile.first_name && profile.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : 'John Doe'}
                  </span>
                  <span className="text-slate-600">{profile.email || 'no-email@example.com'}</span>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col space-y-2">
                <Button className="h-12" variant="outline" asChild>
                  <Link className="border-red-500 text-red-500 hover:bg-red-400 hover:text-white" href="/sign-out">
                    Sign Out
                  </Link>
                </Button>
              </div>

              <div className="pt-4 bg-slate-50 border-t border-t-indigo-200">
                <div className="space-y-4">
                  {[
                    { icon: <Mail className="size-4" />, label: "Email", value: profile.email, fallback: 'no-email@example.com' },
                    { icon: <Info className="size-4" />, label: "First name", value: profile.first_name, fallback: 'John' },
                    { icon: <Info className="size-4" />, label: "Last name", value: profile.last_name, fallback: 'Doe' },
                    { icon: <Calendar className="size-4" />, label: "Age", value: profile.age, fallback: 'N/A' },
                    { icon: <User className="size-4" />, label: "Gender", value: profile.gender, fallback: 'Not specified' },
                    { icon: <Ruler className="size-4" />, label: "Height", value: profile.height, fallback: 'N/A' },
                    { icon: <Dumbbell className="size-4" />, label: "Weight", value: profile.weight, fallback: 'N/A' },
                    { icon: <Target className="size-4" />, label: "Activity level", value: profile.activity_level, fallback: 'Not specified' },
                    { icon: <Target className="size-4" />, label: "Goal", value: profile.goal, fallback: 'Not specified' },
                    { icon: <Utensils className="size-4" />, label: "Dietary preferences", value: profile.dietary_preferences, fallback: 'None' },
                    { icon: <AlertTriangle className="size-4" />, label: "Allergies", value: profile.allergies, fallback: 'None' },
                  ].map(({ icon, label, value, fallback }) => (
                    <div key={label} className="px-6 flex items-center border-b border-b-slate-200 pb-3">
                      <div className="bg-indigo-500 p-2 text-white rounded-full mr-3">
                        {icon}
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-slate-700">{label}</span>
                        <span className="text-slate-700">{getProfileValue(value, fallback)}</span>
                      </div>
                    </div>
                  ))}
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
