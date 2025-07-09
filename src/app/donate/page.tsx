"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DonatePage() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000, // Animation duration (in milliseconds)
      easing: "ease-out-cubic", // Animation easing
      once: true, // Whether animation should happen only once
      offset: 50, // Offset (in pixels) from the element's position
      delay: 0, // Global delay
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      {/* Your content goes here */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1d588a] mb-8">
            Your Page Title
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Start building your page content here...
          </p>
        </div>
      </section>
    </div>
  );
}
