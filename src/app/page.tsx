"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

interface Partner {
  id: number;
  name: string;
  image: string;
}

function PartnersCarousel() {
  const [position, setPosition] = useState<number>(0);
  
  // Memoize the partners array to prevent recreation on every render
  const partners = useMemo<Partner[]>(
    () => [
      {
        id: 1,
        name: "International Research Olympiad",
        image: "/images/home/iro.png?height=80&width=120",
      },
      {
        id: 2,
        name: "OTHS Ai Club",
        image: "/images/home/othsai.png?height=80&width=120",
      },
      {
        id: 3,
        name: "NEOLabs Enterprise",
        image: "/images/home/nle.png?height=80&width=120",
      },
      {
        id: 4,
        name: "Pearedco",
        image: "/images/home/pearedco.png?height=80&width=120",
      },
      {
        id: 5,
        name: "PromotePort",
        image: "/images/home/pport.png?height=80&width=120",
      },
    ],
    []
  );

  // Create extended partners array with unique keys
  const extendedPartners = useMemo(() => [
    ...partners.map(p => ({ ...p, id: p.id + '-1' })),
    ...partners.map(p => ({ ...p, id: p.id + '-2' }))
  ], [partners]);

  useEffect(() => {
    const SCROLL_SPEED = 50; // Milliseconds between updates
    const SCROLL_AMOUNT = 0.30; // Percentage to move per update
    const RESET_THRESHOLD = -100; // When to reset position

    let lastTime = 0;
    let animationFrameId: number | undefined;

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;

      const delta = currentTime - lastTime;

      if (delta > SCROLL_SPEED) {
        setPosition(prev => 
          prev <= RESET_THRESHOLD ? 0 : prev - SCROLL_AMOUNT
        );
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-linear"
        style={{ transform: `translateX(${position}%)` }}
      >
        <div className="flex gap-4 md:gap-8">
          {extendedPartners.map(partner => (
            <div
              key={partner.id}
              className="w-[240px] md:w-[280px] flex-shrink-0 rounded-lg shadow-md p-4 h-50 flex items-center justify-center bg-white"
            >
              <Image
                src={partner.image}
                alt={partner.name}
                width={120}
                height={80}
                className="object-contain"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hexagon Card Component with Sequential Flip Animation
interface HexagonCardProps {
  index: number;
  icon: React.ReactNode;
  frontText: string;
  backText: string;
}

function HexagonCard({ index, icon, frontText, backText }: HexagonCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalCards = 4;
      const cycleTime = totalCards * 2000; // 2 seconds per card
      const currentTime = Date.now() % cycleTime;
      const currentCard = Math.floor(currentTime / 2000);

      setIsFlipped(currentCard === index);
    }, 100); // Check every 100ms for smooth transitions

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="hexagon-container group cursor-pointer">
      <div className={`hexagon-card ${isFlipped ? "flipped" : ""}`}>
        <div className="hexagon-face hexagon-front">
          <div className="hexagon-content">
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              {/* Icon */}
              <div className="text-[#F0F8FF]">{icon}</div>
              {/* Front Text */}
              <div className="font-bold text-xl text-center text-[#F0F8FF]">
                {frontText}
              </div>
            </div>
          </div>
        </div>
        <div className="hexagon-face hexagon-back">
          <div className="hexagon-content">
            <div className="text-[#F0F8FF] text-center space-y-2">
              <div className="text-sm leading-tight">{backText}</div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hexagon-container {
          perspective: 1000px;
          width: 250px;
          height: 250px;
        }
        .hexagon-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
        }
        .hexagon-card.flipped {
          transform: rotateY(180deg);
        }
        .group:hover .hexagon-card {
          transform: rotateY(180deg);
        }
        .group:hover .hexagon-card.flipped {
          transform: rotateY(360deg);
        }
        .hexagon-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
          );
          background: #1d588a;
        }
        .hexagon-back {
          transform: rotateY(180deg);
          background: #1d588a;
        }
        .hexagon-content {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 24px;
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000, // Animation duration (in milliseconds)
      easing: "ease-out-cubic", // Animation easing
      once: true, // Whether animation should happen only once
      offset: 50, // Offset (in pixels) from the elements position
      delay: 0, // Global delay
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <section className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#F0F8FF]">
        <div className="container h-full flex flex-col justify-center px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1
              className="text-4xl lg:text-5xl font-bold text-[#1d588a] leading-tight"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay="100"
            >
              Your Gateway To
              <br />
              <span
                className="text-[#00427A]"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="300"
              >
                ENDLESS
              </span>
              <br />
              <span
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="500"
              >
                Tech Learning Opportunities 
              </span>
            </h1>
            <p
              className="text-gray-600 text-lg leading-relaxed"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="700"
            >
              Join us in connecting volunteers with meaningful opportunities to
              support those in need. Together, we&apos;re bridging the digital
              divide and creating equitable access to essential resources.
            </p>
            <div
              className="flex flex-row gap-4"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="900"
            >
              <Link href="#about1">
                <Button
                  className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF] px-8 py-3 w-fit transform hover:scale-105 transition-all duration-300"
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay="1100"
                >
                  Learn More
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="border-[#1f639e] text-[#1f639e] hover:text-[#0c0c0c] hover:border-[#0c0c0c] px-8 py-3 bg-transparent w-fit transform hover:scale-105 transition-all duration-300"
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay="1300"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div
            className="relative justify-center hidden lg:flex"
            data-aos="fade-left"
            data-aos-duration="1200"
            data-aos-delay="600"
          >
            <div className="grid grid-cols-2 gap-6 max-w-lg">
              <div
                data-aos="flip-left"
                data-aos-duration="800"
                data-aos-delay="1000"
              >
                <HexagonCard
                  index={0}
                  icon={<Book className="h-8 w-8" />}
                  frontText="Unleash Learning Power"
                  backText="Bridging educational gaps through innovative technology and community partnerships."
                />
              </div>
              <div
                data-aos="flip-left"
                data-aos-duration="800"
                data-aos-delay="1200"
              >
                <HexagonCard
                  index={1}
                  icon={<Laptop className="h-8 w-8" />}
                  frontText="Bridging the Tech Divide"
                  backText="Offering courses, resources, and technology to underdeserved communities"
                />
              </div>
              <div
                data-aos="flip-left"
                data-aos-duration="800"
                data-aos-delay="1400"
              >
                <HexagonCard
                  index={2}
                  icon={<Lock className="h-8 w-8" />}
                  frontText="Digital Safety"
                  backText="Teaching online safety and navigation for responsible use."
                />
              </div>
              <div
                data-aos="flip-left"
                data-aos-duration="800"
                data-aos-delay="1600"
              >
                <HexagonCard
                  index={3}
                  icon={<Handshake className="h-8 w-8" />}
                  frontText="Give and Grow"
                  backText="Join us to volunteer and make an impact in your community."
                />
              </div>
            </div>
            </div>
          </div>
          <div
            className="flex justify-center absolute bottom-8 left-0 right-0"
            data-aos="bounce-in"
            data-aos-duration="1000"
            data-aos-delay="1800"
          >
            <ChevronDown className="h-8 w-8 text-[#1d588a] animate-bounce" />
          </div>
        </div>
      </section>

      <section
        className="container mx-auto px-4 py-16"
        id="about1"
        data-aos="fade-up"
      >
        <div
          className="grid lg:grid-cols-2 gap-12 items-center"
          data-aos="fade-up"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#1d588a]">
              Empowering Education Through Technology
            </h2>
            <div className="lg:hidden flex justify-center">
              <Image
                src="/images/home/empower-through-tech.jpg?height=150&width=250"
                alt="Students learning with technology"
                width={250}
                height={150}
                className="rounded-lg shadow-lg"
              />
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our platform connects educators, students, and volunteers in a
              seamless digital environment. We provide cutting-edge tools and
              resources that make learning accessible, engaging, and effective
              for everyone, regardless of their background or location.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From interactive courses to mentorship programs, we&apos;re
              building the future of education one connection at a time. Join
              thousands of learners who have already transformed their lives
              through our comprehensive educational ecosystem.
            </p>
            <Link href="/about">
              <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF]">
                More About Us
              </Button>
            </Link>
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="/images/home/empower-through-tech.jpg?height=400&width=600"
              alt="Students learning with technology"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
        <div className="container mx-auto px-4 py-16" data-aos="fade-up">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative lg:order-1 hidden lg:block">
              <Image
                src="/images/home/building-communities.jpg?height=400&width=600"
                alt="Global community collaboration"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6 lg:order-2">
              <h2 className="text-3xl font-bold text-[#1d588a]">
                Building Global Communities
              </h2>
              <div className="lg:hidden flex justify-center">
                <Image
                  src="/images/home/building-communities.jpg?height=150&width=250"
                  alt="Global community collaboration"
                  width={250}
                  height={150}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Connect with like-minded individuals from around the world who
                share your passion for learning and growth. Our community-driven
                approach ensures that every member has access to support,
                guidance, and opportunities for collaboration.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you&apos;re looking to develop new skills, share your
                expertise, or find mentorship, our global network provides the
                connections and resources you need to succeed in your
                educational journey.
              </p>
              <Link href="https://discord.gg/AgyFnhHved">
                <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF]">
                  Join Our Discord
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16" data-aos="zoom-in">
        <h2 className="text-4xl font-bold text-center text-[#1d588a] mb-12">
          Our Impact
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-8 border-gray-200">
            <CardContent className="space-y-4">
              <Users className="h-12 w-12 text-[#1f639e] mx-auto" />
              <div className="text-3xl font-bold text-[#1d588a]">150+</div>
              <div className="text-blue-600 font-medium">
                Active Contributors
              </div>
              <p className="text-gray-600 text-sm">
                Passionate individuals have joined our mission to bridge the
                digital divide and make a change.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center p-8 border-gray-200">
            <CardContent className="space-y-4">
              <Link2 className="h-12 w-12 text-[#1f639e] mx-auto" />
              <div className="text-3xl font-bold text-[#1d588a]">250+</div>
              <div className="text-blue-600 font-medium">hours of content</div>
              <p className="text-gray-600 text-sm">
                We&apos;ve contributed over 250 hours of service to make an
                impact.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center p-8 border-gray-200">
            <CardContent className="space-y-4">
              <User className="h-12 w-12 text-[#1f639e] mx-auto" />
              <div className="text-3xl font-bold text-[#1d588a]">20</div>
              <div className="text-blue-600 font-medium">
                Global Partnership
              </div>
              <p className="text-gray-600 text-sm">
                Collaborating with local clubs and non-profits to expand our
                outreach.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section data-aos="zoom-in">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1d588a] italic mb-8">
              Our Exclusive Partners
            </h2>
          </div>
          <PartnersCarousel />
        </div>
      </section>
    </div>
  );
}
