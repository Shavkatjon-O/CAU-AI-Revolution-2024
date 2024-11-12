"use client";

import { useState, useEffect } from "react";
import coreApi from "@/lib/coreApi";
import { Button } from "@/components/ui/button";

interface UserProfileType {
  id: number;
  email: string;
}

const getUserProfile = async () => {
  const { data } = await coreApi.get<UserProfileType>("/users/profile/");
  return data;
};

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
    <div className="flex flex-col items-center justify-center h-full overflow-y-scroll px-4">
      <div className="w-full max-w-xl p-8 bg-white rounded-xl">
        <h1 className="text-3xl font-semibold text-start text-custom mb-6">Profile</h1>

        {userProfile ? (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text- font-medium text-gray-800">Email: {userProfile.email}</p>
            </div>

            {/* Additional User Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-700">User Information</h2>
              <ul className="mt-2 text-gray-600">
                <li><strong>Account Created:</strong> January 1, 2023</li>
                <li><strong>Status:</strong> Active</li>
                <li><strong>Meal Preferences:</strong> Vegetarian, Low-Carb</li>
                <li><strong>Dietary Goals:</strong> Maintain weight, Increase energy</li>
                <li><strong>Fitness Level:</strong> Intermediate</li>
                <li><strong>Preferred Meal Types:</strong> Quick & Easy, High-Protein, Gluten-Free</li>
              </ul>
            </div>

            {/* Action Buttons using ShadCN */}
            <div className="flex flex-col items-center space-y-4 mt-8">
              <Button className="w-full bg-custom rounded-lg hover:bg-indigo-700 h-12 transition duration-200">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full h-12 border-red-500 border-2 text-red-500 hover:bg-red-100">
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600">Loading your profile...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
