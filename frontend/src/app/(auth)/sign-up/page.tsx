"use client";

import { useForm, FormProvider } from 'react-hook-form';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Mail, User, Calendar, ArrowRight } from 'lucide-react';

const steps = ['Personal Info', 'Health Info', 'Dietary Preferences'];

const Page = () => {
  const methods = useForm(); // Initialize react-hook-form
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    dietaryPreferences: '',
    allergies: '',
  });

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Handle form submission or final action
      alert('Sign-up complete!');
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{steps[step]}</h2>

        {/* Step 1 - Personal Info */}
        {step === 0 && (
          <>
            <FormControl>
              <div>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                <Mail size={20} />
              </div>
            </FormControl>

            <FormControl className="mt-4">
              <div>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <User size={20} />
              </div>
            </FormControl>

            <FormControl className="mt-4">
              <div>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <User size={20} />
              </div>
            </FormControl>

            <FormControl className="mt-4">
              <div>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                <User size={20} />
              </div>
            </FormControl>
          </>
        )}

        {/* Step 2 - Health Info */}
        {step === 1 && (
          <>
            <FormControl>
              <div>
                <FormLabel htmlFor="age">Age</FormLabel>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                />
                <Calendar size={20} />
              </div>
            </FormControl>

            <FormControl className="mt-4">
              <div>
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <Input
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Gender"
                />
                <User size={20} />
              </div>
            </FormControl>

            <FormControl className="mt-4">
              <div>
                <FormLabel htmlFor="height">Height (cm)</FormLabel>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height in cm"
                />
                <Calendar size={20} />
              </div>
            </FormControl>

            <FormControl className="mt-4">
              <div>
                <FormLabel htmlFor="weight">Weight (kg)</FormLabel>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight in kg"
                />
                <Calendar size={20} />
              </div>
            </FormControl>
          </>
        )}

        {/* Step 3 - Dietary Preferences */}
        {step === 2 && (
          <>
            <FormControl>
              <div>
                <FormLabel htmlFor="activityLevel">Activity Level</FormLabel>
                <Input
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  placeholder="Activity Level"
                />
                <User size={20} />
              </div>
            </FormControl>

            <FormControl className="mt-4">
              <div>
                <FormLabel htmlFor="dietaryPreferences">Dietary Preferences</FormLabel>
                <Input
                  id="dietaryPreferences"
                  name="dietaryPreferences"
                  value={formData.dietaryPreferences}
                  onChange={handleChange}
                  placeholder="Dietary Preferences (e.g. vegan, keto)"
                />
                <User size={20} />
              </div>
            </FormControl>

            <FormControl className="mt-4">
              <div>
                <FormLabel htmlFor="allergies">Allergies</FormLabel>
                <Input
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="Any allergies?"
                />
                <User size={20} />
              </div>
            </FormControl>
          </>
        )}

        {/* Buttons for Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 0}
            className="w-32"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="w-32 bg-custom hover:bg-indigo-800"
          >
            {step === steps.length - 1 ? (
              <>
                Submit
                <ArrowRight size={16} className="ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default Page;
