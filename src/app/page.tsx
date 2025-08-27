// src/app/page.tsx
"use client";
import { useEffect } from "react"; // Remove useRef if no longer used locally for particles
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
// --- Import ParticlesBackground dynamically ---
import dynamic from "next/dynamic";
import Popup from "@/components/Popup";

// Dynamically import ParticlesBackground with SSR disabled
// This prevents the component (and particles.js) from running during server-side rendering
const ParticlesBackground = dynamic(
  () => import("@/components/ParticlesBackground"), // Adjust the path if your component is elsewhere
  { ssr: false },
);

// --- Partners Array ---
const PARTNERS = [
  {
    id: 1,
    name: "OTHS Ai Club",
    image: "/images/home/othsai.png?height=80&width=120",
  },
  {
    id: 2,
    name: "NEOLabs Enterprise",
    image: "/images/home/nle.png?height=80&width=120",
  },
  {
    id: 3,
    name: "Pearedco",
    image: "/images/home/pearedco.png?height=80&width=120",
  },
  {
    id: 4,
    name: "PromotePort",
    image: "/images/home/pport.png?height=80&width=120",
  },
];

// --- Floating Water Animation for iPad Apps ---
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
    },
  ];
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className="relative bg-white rounded-[30px] shadow-2xl overflow-hidden border-[14px] border-[#1f639e]"
        style={{ aspectRatio: "4/3" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#1f639e] rounded-full"></div>
          <div className="grid grid-cols-2 grid-rows-2 gap-8 h-full w-full place-items-center p-8">
            {apps.map((app, index) => (
              <div
                key={index}
                className="w-44 h-44 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center transition-all duration-300 z-10 border border-gray-100 hover:scale-110 hover:shadow-xl animate-float"
                style={{
                  animationDelay: `${index * 0.4}s`,
                  animationDuration: "3s",
                }}
              >
                <div className="text-[#1f639e] mb-3">{app.icon}</div>
                <h3 className="font-bold text-sm text-center text-[#1d588a] mb-2">
                  {app.title}
                </h3>
                <p className="text-xs text-center text-gray-600 px-2">
                  {app.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#1f639e] rounded-full"></div>
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// --- Edge-to-Edge Infinite Partners Carousel ---
function PartnersCarousel() {
  return (
    <div className="w-full overflow-hidden py-8">
      <div className="flex animate-infinite-scroll items-center">
        {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex-shrink-0 px-8 flex flex-col items-center"
          >
            <div className="rounded-lg shadow-sm p-6 h-32 w-48 flex items-center justify-center bg-white border border-[#E1F0FA]">
              <Image
                src={partner.image}
                alt={partner.name}
                width={120}
                height={80}
                className="object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-center text-sm font-medium text-[#1d588a] mt-2">
              {partner.name}
            </p>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .animate-infinite-scroll {
          display: flex;
          width: calc(300%);
          animation: infinite-scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

// --- Main HomePage ---
export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    });
  }, []);

  const bgColors = {
    hero: "bg-[#F0F8FF]",
    empower: "bg-[#E1F0FA]",
    community: "bg-[#F0F8FF]",
    impact: "bg-[#E1F0FA]",
    partners: "bg-[#F0F8FF]",
  };

  return (
    <div className="min-h-screen relative">
      <Popup />
      {/* Hero Section */}
      <section
        className={`${bgColors.hero} relative w-full overflow-hidden`}
        style={{ paddingTop: "8rem", paddingBottom: "8rem" }} // py-32 (32 * 0.25rem)
      >
        {/* Use the dynamically imported component */}
        {/* This will only render on the client side, avoiding the window error */}
        <ParticlesBackground />
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <div className="space-y-6">
            <h1
              className="text-4xl lg:text-5xl font-bold text-[#1d588a] leading-tight"
              data-aos="fade-up"
            >
              Your Gateway To
              <br />
              <span className="text-[#00427A]">ENDLESS</span>
              <br />
              <span>Opportunities In Technology</span>
            </h1>
            <p
              className="text-gray-600 text-lg leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Join us in connecting volunteers with meaningful opportunities to
              support those in need. Together, we&apos;re bridging the digital
              divide and creating equitable access to essential resources.
            </p>
            <div
              className="flex flex-row gap-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
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
          <div
            className="relative justify-center hidden lg:flex"
            data-aos="fade-left"
            data-aos-delay="600"
          >
            <IPadWithApps />
          </div>
        </div>
        <div
          className="flex justify-center mt-12 relative z-10"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <ChevronDown className="h-7 w-7 text-[#1d588a] animate-bounce" />
        </div>
      </section>
      {/* Empowering Education - Image on Left, Text on Right */}
      <section className={`${bgColors.empower} py-16`} id="about1">
        {" "}
        {/* 2 */}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Column - Now First */}
            <div className="hidden lg:block order-1" data-aos="fade-right">
              <Image
                src="/images/home/empower-through-tech.jpg"
                alt="Empowering Education Through Technology"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            {/* Text Column - Now Second */}
            <div className="space-y-6 order-2">
              <h2
                className="text-4xl font-bold text-[#1d588a]"
                data-aos="fade-up"
              >
                Empowering Education Through Technology
              </h2>
              <div
                className="lg:hidden"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <Image
                  src="/images/home/empower-through-tech.jpg"
                  alt="Empowering Education Through Technology"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <p
                className="text-gray-600 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay={150}
              >
                Our platform connects educators, students, and volunteers in a
                seamless digital environment. We provide cutting-edge tools and
                resources that make learning accessible, engaging, and effective
                for everyone, regardless of their background or location.
              </p>
              <p
                className="text-gray-600 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                From interactive courses to mentorship programs, we&apos;re
                building the future of education one connection at a time. Join
                thousands of learners who have already transformed their lives
                through our comprehensive educational ecosystem.
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
      </section>{" "}
      {/* Building Global Communities - Converted to direct TSX, Image on Right */}
      <section className={`${bgColors.community} py-16`}>
        {" "}
        {/* 3 */}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
            {" "}
            {/* Image on right using flex-row-reverse */}
            <div className="space-y-6">
              <h2
                className="text-4xl font-bold text-[#1d588a]"
                data-aos="fade-up"
              >
                Building Global Communities
              </h2>
              <div
                className="lg:hidden"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <Image
                  src="/images/home/building-communities.jpg"
                  alt="Building Global Communities"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <p
                className="text-gray-600 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay={150}
              >
                Connect with like-minded individuals from around the world who
                share your passion for learning and growth. Our community-driven
                approach ensures that every member has access to support,
                guidance, and opportunities for collaboration.
              </p>
              <p
                className="text-gray-600 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Whether you&apos;re looking to develop new skills, share your
                expertise, or find mentorship, our global network provides the
                connections and resources you need to succeed in your
                educational journey.
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
              {" "}
              {/* Adjusted AOS direction */}
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
      {/* Our Impact Section */}
      <section className={`${bgColors.impact} py-16`}>
        {" "}
        {/* 4 */}
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center text-[#1d588a] mb-10"
            data-aos="fade-up"
          >
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-7">
            <Card
              className="text-center p-7 border-gray-200"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <CardContent className="space-y-4">
                <Users className="h-10 w-10 text-[#1f639e] mx-auto" />
                <div className="text-3xl font-bold text-[#1d588a]">150+</div>
                <div className="text-[#1d588a] font-medium text-base">
                  Active Contributors
                </div>
                <p className="text-gray-600 text-sm">
                  Passionate individuals have joined our mission to bridge the
                  digital divide.
                </p>
              </CardContent>
            </Card>
            <Card
              className="text-center p-7 border-gray-200"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <CardContent className="space-y-4">
                <Link2 className="h-10 w-10 text-[#1f639e] mx-auto" />
                <div className="text-3xl font-bold text-[#1d588a]">250+</div>
                <div className="text-[#1d588a] font-medium text-base">
                  Hours of Content
                </div>
                <p className="text-gray-600 text-sm">
                  We&apos;ve contributed over 250 hours of service to make an
                  impact.
                </p>
              </CardContent>
            </Card>
            <Card
              className="text-center p-7 border-gray-200"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <CardContent className="space-y-4">
                <User className="h-10 w-10 text-[#1f639e] mx-auto" />
                <div className="text-3xl font-bold text-[#1d588a]">20</div>
                <div className="text-[#1d588a] font-medium text-base">
                  Global Partnerships
                </div>
                <p className="text-gray-600 text-sm">
                  Collaborating with local clubs and non-profits to expand
                  outreach.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Partners Carousel - Edge to Edge */}
      <section className={`${bgColors.partners} py-16`}>
        {" "}
        {/* 5 - Removed negative margins for edge-to-edge */}
        <div>
          {" "}
          {/* Removed px-4 to make content edge-to-edge within the section */}
          <h2
            className="text-3xl font-bold text-center text-[#1d588a] mb-8"
            data-aos="fade-up"
          >
            Our Exclusive Partners
          </h2>
          <PartnersCarousel />
        </div>
      </section>
    </div>
  );
}
