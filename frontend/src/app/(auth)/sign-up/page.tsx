"use client";

import { useForm, FormProvider } from 'react-hook-form';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="pl-10"
              />
              <Mail size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="relative mt-4">
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="pl-10"
              />
              <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="relative mt-4">
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="pl-10"
              />
              <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="relative mt-4">
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="pl-10"
              />
              <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </>
        )}

        {/* Step 2 - Health Info */}
        {step === 1 && (
          <>
            <div className="relative">
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="pl-10"
              />
              <Calendar size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="relative mt-4">
              <Input
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Gender"
                className="pl-10"
              />
              <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="relative mt-4">
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height in cm"
                className="pl-10"
              />
              <Calendar size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="relative mt-4">
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kg"
                className="pl-10"
              />
              <Calendar size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </>
        )}

        {/* Step 3 - Dietary Preferences */}
        {step === 2 && (
          <>
            <div className="relative">
              <Input
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                placeholder="Activity Level"
                className="pl-10"
              />
              <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="relative mt-4">
              <Input
                id="dietaryPreferences"
                name="dietaryPreferences"
                value={formData.dietaryPreferences}
                onChange={handleChange}
                placeholder="Dietary Preferences (e.g. vegan, keto)"
                className="pl-10"
              />
              <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="relative mt-4">
              <Input
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Any allergies?"
                className="pl-10"
              />
              <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
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
