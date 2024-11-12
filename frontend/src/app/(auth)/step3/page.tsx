import Link from 'next/link';
// import { Button } from '@shadcn/ui';
import { Button } from '@/components/ui/button';

export default function Step3() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-4">What is your goal?</h1>
      <div className="grid grid-cols-2 gap-4 max-w-md w-full">
        {['Lose fat', 'Maintain weight', 'Build muscle', 'Better overall health'].map((goal) => (
          <Button key={goal} variant="outline" className="w-full">
            {goal}
          </Button>
        ))}
      </div>
      <div className="flex space-x-4 mt-8">
        <Link href="/step2">
          <Button variant="outline">Previous</Button>
        </Link>
        <Link href="/step4">
          <Button>Next</Button>
        </Link>
      </div>
    </div>
  );
}
