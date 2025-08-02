"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Laptop,
  Link2,
  User,
  Users,
  ChevronDown,
  Book,
  Lock,
  Handshake,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

// ... (PartnersCarousel component remains the same)

function IPadWithApps() {
  const apps = [
    {
      icon: <Book className="h-8 w-8" />,
      title: "Unleash Learning",
      description: "Bridging educational gaps through innovative technology",
    },
    {
      icon: <Laptop className="h-8 w-8" />,
      title: "Tech Divide",
      description: "Courses & resources for underserved communities",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Digital Safety",
      description: "Teaching online safety and navigation",
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Give and Grow",
      description: "Volunteer to make an impact in your community",
    }
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* iPad Frame */}
      <div className="relative bg-white rounded-[30px] shadow-2xl overflow-hidden border-[14px] border-gray-800"
        style={{ aspectRatio: '4/3' }}>
        
        {/* Screen Content */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col">
          {/* Home Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-800 rounded-full"></div>
          
          {/* App Grid - Centered */}
          <div className="grid grid-cols-2 grid-rows-2 gap-8 h-full w-full place-items-center p-8">
            {apps.map((app, index) => (
              <div 
                key={index}
                className="w-44 h-44 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center transition-all duration-300 z-10 border border-gray-100 hover:scale-110 hover:shadow-xl"
              >
                <div className="text-[#1f639e] mb-3">{app.icon}</div>
                <h3 className="font-bold text-sm text-center text-[#1d588a] mb-2">{app.title}</h3>
                <p className="text-xs text-center text-gray-600 px-2">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Camera */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full"></div>
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#F0F8FF] relative overflow-hidden container mx-auto px-4 py-32">
        <div className="grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1d588a] leading-tight" data-aos="fade-up">
              Your Gateway To
              <br />
              <span className="text-[#00427A]">
                ENDLESS
              </span>
              <br />
              <span>
                Opportunities In Technology
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed" data-aos="fade-up" data-aos-delay="200">
              Join us in connecting volunteers with meaningful opportunities to
              support those in need. Together, we're bridging the digital
              divide and creating equitable access to essential resources.
            </p>
            <div className="flex flex-row gap-4" data-aos="fade-up" data-aos-delay="400">
              <Link href="#about1">
                <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF] px-7 py-3 text-base">
                  Learn More
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="border-[#1f639e] text-[#1f639e] hover:text-[#0c0c0c] hover:border-[#0c0c0c] px-7 py-3 text-base bg-transparent"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative justify-center hidden lg:flex" data-aos="fade-left" data-aos-delay="600">
            <IPadWithApps />
          </div>
        </div>
        <div className="flex justify-center mt-12 relative z-10" data-aos="fade-up" data-aos-delay="800">
          <ChevronDown className="h-7 w-7 text-[#1d588a] animate-bounce" />
        </div>
      </section>

      {/* Building Global Communities Section - IMAGE ON RIGHT */}
      <section className="bg-[#E1F0FA] py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-[#1d588a]" data-aos="fade-up">
                Building Global Communities
              </h2>
              <div className="lg:hidden" data-aos="fade-up" data-aos-delay="100">
                <Image
                  src="/images/home/building-communities.jpg"
                  alt="Building Global Communities"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <p className="text-gray-600 leading-relaxed" data-aos="fade-up" data-aos-delay="150">
                Connect with like-minded individuals from around the world who share your passion for learning and growth. Our community-driven approach ensures that every member has access to support, guidance, and opportunities for collaboration.
              </p>
              <p className="text-gray-600 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
                Whether you're looking to develop new skills, share your expertise, or find mentorship, our global network provides the connections and resources you need to succeed in your educational journey.
              </p>
              <div data-aos="fade-up" data-aos-delay="300">
                <Link href="https://discord.gg/XWVJadkn">
                  <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF] px-5 py-2 text-base">
                    Join Our Discord
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block" data-aos="fade-left">
              <Image
                src="/images/home/building-communities.jpg"
                alt="Building Global Communities"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Empowering Education Section - IMAGE ON LEFT */}
      <section className="bg-[#F0F8FF] py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hidden lg:block" data-aos="fade-right">
              <Image
                src="/images/home/empower-through-tech.jpg"
                alt="Empowering Education Through Technology"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-[#1d588a]" data-aos="fade-up">
                Empowering Education Through Technology
              </h2>
              <div className="lg:hidden" data-aos="fade-up" data-aos-delay="100">
                <Image
                  src="/images/home/empower-through-tech.jpg"
                  alt="Empowering Education Through Technology"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <p className="text-gray-600 leading-relaxed" data-aos="fade-up" data-aos-delay="150">
                Our platform connects educators, students, and volunteers in a seamless digital environment. We provide cutting-edge tools and resources that make learning accessible, engaging, and effective for everyone, regardless of their background or location.
              </p>
              <p className="text-gray-600 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
                From interactive courses to mentorship programs, we're building the future of education one connection at a time. Join thousands of learners who have already transformed their lives through our comprehensive educational ecosystem.
              </p>
              <div data-aos="fade-up" data-aos-delay="300">
                <Link href="/about">
                  <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF] px-5 py-2 text-base">
                    More About Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ... (rest of the sections remain the same) */}
    </div>
  );
}
