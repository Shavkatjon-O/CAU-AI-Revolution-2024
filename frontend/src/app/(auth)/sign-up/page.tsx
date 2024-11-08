import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Apple } from 'lucide-react';

export default function LoginSignup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6">Login / Sign Up</h1>
      <Button className="w-full max-w-xs mb-4">Sign up with email</Button>
      <Button variant="outline" className="flex items-center justify-center w-full max-w-xs mb-4">
        <Apple className="mr-2" /> Continue with Google
      </Button>
      <Button variant="outline" className="flex items-center justify-center w-full max-w-xs mb-4">
        <Apple className="mr-2" /> Continue with Facebook
      </Button>
      <Button variant="outline" className="flex items-center justify-center w-full max-w-xs mb-4">
        <Apple className="mr-2" /> Continue with Apple
      </Button>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link href="/onboarding" className="text-blue-600 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
