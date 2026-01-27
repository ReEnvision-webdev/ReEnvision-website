
'use client';
import { useEffect } from 'react';
import { Globe, Target, Users, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center pt-[64px] bg-[#f0f8ff]">
      <div className="h-[50vh] flex flex-col items-center justify-center relative about-hero-img" data-aos="fade-up">
        <h1 className="text-3xl md:text-6xl font-bold mb-6 text-[#E0E0E0] mt-8 text-center z-1">
          About ReEnvision
        </h1>
      </div>

      <div className="w-full max-w-6xl mx-auto p-8" data-aos="fade-up" data-aos-delay="200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/about/mission">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:bg-gray-100 transition-colors">
              <Target size={48} className="text-[#1f639e] mb-4" />
              <h2 className="text-2xl font-semibold text-[#1f639e]">Our Mission</h2>
              <p className="text-gray-600 mt-2">To leverage artificial intelligence to empower individuals.</p>
            </div>
          </Link>

          <Link href="/about/who-we-are">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:bg-gray-100 transition-colors">
              <Users size={48} className="text-[#1f639e] mb-4" />
              <h2 className="text-2xl font-semibold text-[#1f639e]">Who We Are</h2>
              <p className="text-gray-600 mt-2">Meet the passionate team behind ReEnvision.</p>
            </div>
          </Link>

          <Link href="/about/values">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:bg-gray-100 transition-colors">
              <HeartHandshake size={48} className="text-[#1f639e] mb-4" />
              <h2 className="text-2xl font-semibold text-[#1f639e]">Our Values</h2>
              <p className="text-gray-600 mt-2">The core principles that guide our work.</p>
            </div>
          </Link>

          <Link href="/about/teams">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:bg-gray-100 transition-colors">
              <Globe size={48} className="text-[#1f639e] mb-4" />
              <h2 className="text-2xl font-semibold text-[#1f639e]">Our Teams</h2>
              <p className="text-gray-600 mt-2">Discover the teams that make up ReEnvision.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
