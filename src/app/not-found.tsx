// pages/404.tsx
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-[#F0F8FF] flex flex-col items-center justify-center text-center">
      {/* Hero Section for 404 Page */}
      <section className="space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1d588a] leading-tight">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF] px-8 py-3">
              Go Back Home
            </Button>
          </Link>
        </div>
      </section>


    </div>
  );
}
