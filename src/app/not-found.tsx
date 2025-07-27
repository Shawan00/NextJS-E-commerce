import { Metadata } from "next";
import AnimationNotFound from "@/components/animation/404notfound";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 Not Found | FurStore",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AnimationNotFound />
      <strong className="text-2xl font-bold">Page not found</strong>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/" 
        className="bg-accent text-secondary font-medium px-5 py-2 mt-5 rounded-sm hover:shadow-sm"
      >
        Go back to home
      </Link>
    </div>
  )
}