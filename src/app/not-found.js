import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8 text-lg">
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Back to Home
      </Link>
    </div>
  );
}
