import Link from "next/link";

import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Button asChild>
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  )
}
export default Page;