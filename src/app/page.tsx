"use client"

import React, { useState, useEffect } from "react";
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

function PartnersCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const partners = [
    { id: 1, name: "Partner 1", image: "/placeholder.svg?height=80&width=120" },
    { id: 2, name: "Partner 2", image: "/placeholder.svg?height=80&width=120" },
    { id: 3, name: "Partner 3", image: "/placeholder.svg?height=80&width=120" },
    { id: 4, name: "Partner 4", image: "/placeholder.svg?height=80&width=120" },
    { id: 5, name: "Partner 5", image: "/placeholder.svg?height=80&width=120" },
    { id: 6, name: "Partner 6", image: "/placeholder.svg?height=80&width=120" },
  ];

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % Math.ceil(partners.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev =>
        (prev - 1 + Math.ceil(partners.length / 2)) %
        Math.ceil(partners.length / 2),
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(partners.length / 2) }).map(
            (_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {partners
                    .slice(slideIndex * 2, slideIndex * 2 + 2)
                    .map(partner => (
                      <div
                        key={partner.id}
                        className="bg-[#F0F8FF] rounded-lg shadow-md p-6 h-32 flex items-center justify-center"
                      >
                        <img
                          src={partner.image || "/placeholder.svg"}
                          alt={partner.name}
                          width={120}
                          height={80}
                          className="opacity-60"
                        />
                      </div>
                    ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#1f639e] text-[#F0F8FF] p-2 rounded-full hover:bg-[#00427A] transition-colors"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#1f639e] text-[#F0F8FF] p-2 rounded-full hover:bg-[#00427A] transition-colors"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(partners.length / 2) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? "bg-[#1d588a]" : "bg-gray-300"
              }`}
            />
          ),
        )}
      </div>
    </div>
  );
}

// Hexagon Card Component with Sequential Flip Animation
function HexagonCard({
  index,
  icon,
  frontText,
  backText,
}) {
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
      <div className={`hexagon-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="hexagon-face hexagon-front">
          <div className="hexagon-content">
            <div className="text-[#F0F8FF] text-center space-y-2">
              {icon}
              <div className="font-bold text-lg">{frontText}</div>
            </div>
          </div>
        </div>
        <div className="hexagon-face hexagon-back">
          <div className="hexagon-content">
            <div className="text-[#F0F8FF] text-center space-y-2">
              <div className="text-xs leading-tight">{backText}</div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hexagon-container {
          perspective: 1000px;
          width: 140px;
          height: 140px;
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
          padding: 16px;
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1d588a] leading-tight">
              Your Gateway To
              <br />
              <span className="text-[#00427A]">UNLIMITED</span>
              <br />
              Educational Resources
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Join us in connecting volunteers with meaningful opportunities to
              support those in need. Together, we're bridging the digital
              divide and creating equitable access to essential resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF] px-8 py-3">
                Learn More
              </Button>
              <Button
                variant="outline"
                className="border-[#1f639e] text-[#1f639e] hover:text-[#0c0c0c] hover:border-[#0c0c0c] px-8 py-3 bg-transparent"
              >
                Get Started
              </Button>
            </div>
          </div>

          <div className="relative justify-center hidden lg:flex">
            <div className="grid grid-cols-2 gap-6 max-w-lg">
              <HexagonCard
                index={0}
                icon={<Book className="h-8 w-8" />}
                frontText="Unlock Learning Potential"
                backText="Bridging educational gaps through innovative technology and community partnerships."
              />
              <HexagonCard
                index={1}
                icon={<Laptop className="h-8 w-8" />}
                frontText="Bridging the Tech Divide"
                backText="Offering courses, resources, and technology to underdeserved communities"
              />
              <HexagonCard
                index={2}
                icon={<Lock className="h-8 w-8" />}
                frontText="Digital Safety"
                backText="Teaching online safety and navigation for responsible use."
              />
              <HexagonCard
                index={3}
              icon={<Handshake className="h-8 w-8" />}
                frontText="Give and Grow"
                backText="Join us to volunteer and make an impact in your community."
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <ChevronDown className="h-8 w-8 text-[#1d588a] animate-bounce" />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16" id="about">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#1d588a]">
              Empowering Education Through Technology
            </h2>
            <div className="lg:hidden flex justify-center">
              <img
                src="/placeholder.svg?height=150&width=250"
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
              From interactive courses to mentorship programs, we're
              building the future of education one connection at a time. Join
              thousands of learners who have already transformed their lives
              through our comprehensive educational ecosystem.
            </p>
            <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF]">
              Explore Our Platform
            </Button>
          </div>
          <div className="relative hidden lg:block">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Students learning with technology"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative lg:order-1 hidden lg:block">
              <img
                src="/placeholder.svg?height=400&width=600"
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
                <img
                  src="/placeholder.svg?height=150&width=250"
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
                Whether you're looking to develop new skills, share your
                expertise, or find mentorship, our global network provides the
                connections and resources you need to succeed in your
                educational journey.
              </p>
              <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF]">
                Join Our Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
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
                We've contributed over 100 hours of service to make an
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

      <section className="bg-gray-50">
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
