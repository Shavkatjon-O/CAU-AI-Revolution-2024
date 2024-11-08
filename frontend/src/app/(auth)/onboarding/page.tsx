import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Onboarding() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
      <h1 className="text-3xl font-semibold mb-4">Enjoy your meal time</h1>
      <p className="max-w-md text-gray-700 mb-8">
        Just relax and not overthink what to eat. We provide personalized meal plans, tailored to your needs.
      </p>
      <Link href="/step1">
        <Button>Next</Button>
      </Link>
    </div>
  );
}
