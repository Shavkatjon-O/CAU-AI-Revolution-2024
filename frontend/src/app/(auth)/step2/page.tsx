import Link from 'next/link';
// import { Button } from '@shadcn/ui';
import { Button } from '@/components/ui/button';

export default function Step2() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-4">Any ingredient allergies?</h1>
      <p className="max-w-md text-gray-700 mb-8">
        To offer the best tailored diet experience, we need to know more about your allergies.
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-md w-full">
        {['Gluten', 'Dairy', 'Egg', 'Soy', 'Peanut', 'Wheat', 'Milk', 'Fish'].map((allergy) => (
          <Button key={allergy} variant="outline" className="w-full">
            {allergy}
          </Button>
        ))}
      </div>
      <div className="flex space-x-4 mt-8">
        <Link href="/step1">
          <Button variant="outline">Previous</Button>
        </Link>
        <Link href="/step3">
          <Button>Next</Button>
        </Link>
      </div>
    </div>
  );
}
