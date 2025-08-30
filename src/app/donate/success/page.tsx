"use client";

import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DonationSuccess() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <div className="bg-[#F0F8FF] min-h-screen flex items-center justify-center px-4">
      <div
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
        data-aos="fade-up"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-gray-600">
            Your donation has been processed successfully. Thank you for
            supporting our mission to make education accessible to everyone.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block bg-[#1d588a] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#164a73] transition-all duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
