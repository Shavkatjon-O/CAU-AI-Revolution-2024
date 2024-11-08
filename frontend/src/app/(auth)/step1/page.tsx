import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

export default function Step1() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-4">Physical Profile</h1>
      <p className="max-w-md text-gray-700 mb-8">
        We use RMR (Resting Metabolic Rate) to estimate your calorie budget, considering height, weight, gender, and age.
      </p>
      <form className="space-y-4 max-w-md w-full">
        <Input aria-label="Height (cm)" placeholder="Enter your height" />
        <Input aria-label="Weight (kgs)" placeholder="Enter your weight" />
        <div className="flex space-x-4">
          <Button variant="outline">Female</Button>
          <Button variant="outline">Male</Button>
        </div>
        <Input aria-label="Age (years)" placeholder="Enter your age" />
      </form>
      <div className="flex space-x-4 mt-8">
        <Link href="/onboarding">
          <Button variant="outline">Previous</Button>
        </Link>
        <Link href="/step2">
          <Button>Next</Button>
        </Link>
      </div>
    </div>
  );
}
