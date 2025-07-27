"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ComingSoonPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
    });
  }, []);

  return (
    <div className="bg-[#F0F8FF] pt-30 pb-18 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          data-aos="fade-up"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Section - Mission Statement */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-gray-50 lg:bg-white">
              <div data-aos="fade-right" data-aos-delay="200">
                <h1 className="text-4xl md:text-5xl text-center lg:text-left font-bold text-[#1d588a] mb-4 leading-tight">
                  Coming Soon
                </h1>
                <p className="text-gray-600 text-lg md:text-lg text-center lg:text-left leading-relaxed">
                  We&apos;re working hard to bring you something amazing. Our
                  team is putting the finishing touches on this page to ensure
                  we deliver the best possible experience. Check back soon to
                  see what we&apos;ve been working on!
                </p>
              </div>
            </div>

            {/* Right Section - Placeholder Content */}
            <div className="p-6 sm:p-8 lg:p-12 bg-white flex flex-col items-center justify-center">
              <div data-aos="fade-left" data-aos-delay="400">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-[#1d588a] rounded-full mb-6">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-[#1d588a] mb-4">
                    Something Great is Coming
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We&apos;re preparing something special for you. Stay tuned
                    for updates!
                  </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <p className="text-gray-500 italic">
                    &quot;The best things in life are worth waiting for&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
