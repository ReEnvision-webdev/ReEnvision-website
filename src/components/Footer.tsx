import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1d588a] text-[#F0F8FF] py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-2">
            <Image
              src="/favicon.svg" // Path to your favicon.png
              alt="Logo"
              width={32} // Specify the width (in pixels)
              height={32} // Specify the height (in pixels)
              className="h-10 w-10" // Optional: Add any additional styles
            />
          </div>
          <div className="text-center">
            <p className="text-blue-200">
              © {currentYear} ReEnvision. All rights reserved.
            </p>
          </div>
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-[#F0F8FF] text-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a]"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
