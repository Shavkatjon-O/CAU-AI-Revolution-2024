import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="size-full flex justify-center items-center">
      <Button asChild>
        <Link href="/sign-out">
          Sign Out
        </Link>
      </Button>
    </div>
  )
}
export default Page;
