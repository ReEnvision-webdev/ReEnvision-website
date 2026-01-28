// src/app/page.tsx
"use client";
import { useEffect } from "react";
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
import dynamic from "next/dynamic";

const ParticlesBackground = dynamic(
  () => import("@/components/ParticlesBackground"),
  { ssr: false },
);

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

function IPadWithApps() {
  const apps = [
    {
      icon: <Book className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Unleash Learning",
      description: "Bridging educational gaps through innovative technology",
    },
    {
      icon: <Laptop className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Tech Divide",
      description: "Courses & resources for underserved communities",
    },
    {
      icon: <Lock className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Digital Safety",
      description: "Teaching online safety and navigation",
    },
    {
      icon: <Handshake className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Give and Grow",
      description: "Volunteer to make an impact in your community",
    },
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 md:px-0">
      <div
        className="relative bg-white rounded-[20px] md:rounded-[30px] shadow-2xl overflow-hidden border-[8px] md:border-[14px] border-[#1f639e] flex flex-col"
        style={{ 
          aspectRatio: "4/3",
          maxHeight: "70vh" // Prevents the iPad from being taller than the screen on short viewports
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8 flex flex-col items-center justify-center">
          {/* Home Indicator */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 bg-[#1f639e] rounded-full opacity-50"></div>
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-3 md:gap-6 w-full h-full p-2">
            {apps.map((app, index) => (
              <div
                key={index}
                className="relative group w-full h-full bg-white rounded-lg md:rounded-xl shadow-md flex flex-col items-center justify-center transition-all duration-300 z-10 border border-gray-100 hover:scale-105 hover:shadow-xl animate-float overflow-hidden p-2 md:p-4"
                style={{
                  animationDelay: `${index * 0.4}s`,
                  animationDuration: "3s",
                }}
              >
                <div className="text-[#1f639e] mb-1 md:mb-3">{app.icon}</div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-center text-[#1d588a] mb-1 leading-tight">
                  {app.title}
                </h3>
                <p className="hidden sm:block text-[9px] md:text-xs text-center text-gray-600 px-1 leading-tight">
                  {app.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Camera Lens */}
      <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 bg-[#1f639e] rounded-full opacity-30"></div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(0.5deg); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// --- Edge-to-Edge Infinite Partners Carousel (Seamless & Stable) ---
// --- Edge-to-Edge Infinite Partners Carousel (Seamless & Stable) ---
function PartnersCarousel() {
  // 1. Quadruple the partners to ensure the track is always longer than any screen width
  const repeatedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];
  
  // 2. Adjust duration so it doesn't speed up with more items
  const animationDuration = `${PARTNERS.length * 10}s`; 

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        // Smooth fade on the edges so it doesn't just "cut off"
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <div
        className="flex animate-infinite-scroll"
        style={{ 
          animationDuration,
          width: "max-content" 
        }}
      >
        {repeatedPartners.map((partner, index) => (
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
                priority={index < 10} // Load initial batch immediately
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
          from {
            transform: translateX(0);
          }
          to {
            /* 3. Because we have 4 sets of data, moving -25% takes us 
               exactly to the start of the second set, creating a perfect loop */
            transform: translateX(-25%);
          }
        }
        .animate-infinite-scroll {
          display: flex;
          animation: infinite-scroll linear infinite;
        }
        /* Optional: Pause on hover so people can actually read the names */
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
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
      {/* Hero Section */}
      <section
        className={`${bgColors.hero} relative w-full overflow-hidden`}
        style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
      >
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
              <Link href="/about">
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
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hidden lg:block order-1" data-aos="fade-right">
              <Image
                src="/images/home/empower-through-tech.jpg"
                alt="Empowering Education Through Technology"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
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
      </section>

      {/* Building Global Communities - Converted to direct TSX, Image on Right */}
      <section className={`${bgColors.community} py-16`}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
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
        <div>
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
