import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1d588a] text-[#F0F8FF] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <p className="text-blue-200">
              &#169; {currentYear} ReEnvision. All rights reserved.
            </p>
          </div>
          <div className="text-center md:text-right">
            <Link href="/contact">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-[#F0F8FF] text-[#F0F8FF] hover:bg-[#F0F8FF] hover:text-[#1d588a]"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
