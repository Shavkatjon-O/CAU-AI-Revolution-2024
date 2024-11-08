import Link from 'next/link';
// import { Button } from '@shadcn/ui';
import { Button } from '@/components/ui/button';

export default function Step4() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-4">Do you follow any specific diets?</h1>
      <div className="grid grid-cols-2 gap-4 max-w-md w-full">
        {['None', 'Vegan', 'Paleo', 'Diabetes', 'Vegetarian', 'Atkins', 'Intermittent Fasting', 'Gluten-free', 'Low carb'].map((diet) => (
          <Button key={diet} variant="outline" className="w-full">
            {diet}
          </Button>
        ))}
      </div>
      <div className="flex space-x-4 mt-8">
        <Link href="/step3">
          <Button variant="outline">Previous</Button>
        </Link>
        <Link href="/step5">
          <Button>Next</Button>
        </Link>
      </div>
    </div>
  );
}
