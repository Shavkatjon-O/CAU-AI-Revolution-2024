"use client";

import Image from 'next/image';
import { useForm, FormProvider } from 'react-hook-form';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, User, Calendar, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    goal: '',
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className='px-4'>
      <FormProvider {...methods}>
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-3xl shadow-2xl border">
          <div className='flex items-center justify-center pb-6 font-semibold text-custom'>
            <span className='text-3xl'>SafeBite</span>
          </div>

          <Image src="/img/sign-up-image.svg" alt="Image" width={256} height={256} className="mx-auto w-full mb-6 shadow-md rounded-3xl" />

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
                  className="pl-10 h-12 focus:border-custom"
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
                  className="pl-10 h-12 focus:border-custom"
                />
                <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <div className="relative mt-4">
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="pl-10 h-12 focus:border-custom"
                />
                <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <div className="relative mt-4">
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="pl-10 h-12 focus:border-custom"
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
                  className="pl-10 h-12 focus:border-custom"
                />
                <Calendar size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <div className="relative mt-4">
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger className="pl-10 h-12 focus:border-custom">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                  className="pl-10 h-12 focus:border-custom"
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
                  className="pl-10 h-12 focus:border-custom"
                />
                <Calendar size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <div className="relative mt-4">
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => handleSelectChange('activityLevel', value)}
                >
                  <SelectTrigger className="pl-10 h-12 focus:border-custom">
                    <SelectValue placeholder="Activity Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedentary">Sedentary</SelectItem>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Very Active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
                <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </>
          )}

          {/* Step 3 - Dietary Preferences */}
          {step === 2 && (
            <>
              <div className="relative">
                <Select
                  value={formData.goal}
                  onValueChange={(value) => handleSelectChange('goal', value)}
                >
                  <SelectTrigger className="pl-10 h-12 focus:border-custom">
                    <SelectValue placeholder="Select Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                    <SelectItem value="Maintain">Maintain</SelectItem>
                  </SelectContent>
                </Select>
                <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <div className="relative mt-4">
                <Input
                  id="dietaryPreferences"
                  name="dietaryPreferences"
                  value={formData.dietaryPreferences}
                  onChange={handleChange}
                  placeholder="Dietary Preferences (e.g., vegan, keto)"
                  className="pl-10 h-12 focus:border-custom"
                />
                <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <div className="relative mt-4">
                <Input
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="Allergies (if any)"
                  className="pl-10 h-12 focus:border-custom"
                />
                <User size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </>
          )}

          <div className="mt-6 flex justify-between">
            {step > 0 && (
              <Button variant="secondary" onClick={handlePrevious} className="h-12">
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="h-12 bg-custom hover:bg-indigo-700">
              {step < steps.length - 1 ? 'Next' : 'Finish'}
              {step < steps.length - 1 && <ArrowRight className="ml-2" />}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default Page;
