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
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS styles

// Constants
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

// --- PartnersCarousel from the second snippet ---
function PartnersCarousel() {
  return (
    <div className="w-full overflow-hidden relative py-8">
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
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
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
// --- End of PartnersCarousel component ---

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
      const cycleTime = totalCards * 2000;
      const currentTime = Date.now() % cycleTime;
      const currentCard = Math.floor(currentTime / 2000);
      setIsFlipped(currentCard === index);
    }, 100);
    return () => clearInterval(interval);
  }, [index]);

  const hexagonStyles = {
    container: {
      perspective: '1000px',
      width: '180px',
      height: '180px',
    } as React.CSSProperties,
    card: {
      position: 'relative',
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d' as const,
      transition: 'transform 0.6s ease-in-out',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    } as React.CSSProperties,
    face: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden' as const,
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      background: '#1d588a',
    } as React.CSSProperties,
    back: {
      transform: 'rotateY(180deg)',
      background: '#1d588a',
    } as React.CSSProperties,
    content: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '20px',
    } as React.CSSProperties,
  };

  return (
    <div className="group cursor-pointer" style={hexagonStyles.container}>
      <div style={hexagonStyles.card}>
        <div style={{...hexagonStyles.face}}>
          <div style={hexagonStyles.content}>
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              <div className="text-[#F0F8FF]">{icon}</div>
              <div className="font-bold text-lg text-center text-[#F0F8FF]">
                {frontText}
              </div>
            </div>
          </div>
        </div>
        <div style={{...hexagonStyles.face, ...hexagonStyles.back}}>
          <div style={hexagonStyles.content}>
            <div className="text-[#F0F8FF] text-center space-y-2">
              <div className="text-xs leading-tight">{backText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Modified ContentSection for edge-to-edge and AOS ---
function ContentSection({
  title,
  description,
  image,
  reverse = false,
  cta,
  id,
  edgeToEdge = false, // Add prop for edge-to-edge
}: {
  title: string;
  description: string[];
  image: string;
  reverse?: boolean;
  cta: { text: string; href: string };
  id?: string;
  edgeToEdge?: boolean; // Add prop type
}) {
  // Conditionally apply container class and padding
  const sectionClasses = edgeToEdge
    ? "" // No container padding/margin if edge-to-edge
    : "container mx-auto px-4";

  const contentClasses = edgeToEdge
    ? "px-4" // Add padding inside if edge-to-edge for content
    : "";

  return (
    <section className={`py-16 ${reverse ? 'bg-[#F0F8FF]' : 'bg-[#E1F0FA]'} ${sectionClasses}`} id={id}>
      <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''} ${contentClasses}`}>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-[#1d588a]" data-aos="fade-up"> {/* Add AOS */}
            {title}
          </h2>
          <div className="lg:hidden" data-aos="fade-up" data-aos-delay="100"> {/* Add AOS */}
            <Image
              src={image}
              alt={title}
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          {description.map((paragraph, i) => (
            <p key={i} className="text-gray-600 leading-relaxed" data-aos="fade-up" data-aos-delay={150 + i * 50}> {/* Add AOS */}
              {paragraph}
            </p>
          ))}
          <div data-aos="fade-up" data-aos-delay={300}> {/* Add AOS */}
            <Link href={cta.href}>
              <Button className="bg-[#1f639e] hover:bg-[#00427A] text-[#F0F8FF] px-5 py-2 text-base">
                {cta.text}
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block" data-aos={reverse ? "fade-left" : "fade-right"}> {/* Add AOS */}
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>
    </section>
  );
}
// --- End of modified ContentSection ---

export default function HomePage() {
  useEffect(() => {
    // --- Re-add AOS initialization ---
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    });
    // --- End of AOS initialization ---
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#F0F8FF] container mx-auto px-4 py-32">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
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
            <div className="grid grid-cols-2 gap-6 max-w-md">
              <div>
                <HexagonCard
                  index={0}
                  icon={<Book className="h-8 w-8" />}
                  frontText="Unleash Learning Power"
                  backText="Bridging educational gaps through innovative technology and community partnerships."
                />
              </div>
              <div>
                <HexagonCard
                  index={1}
                  icon={<Laptop className="h-8 w-8" />}
                  frontText="Bridging the Tech Divide"
                  backText="Offering courses, resources, and technology to underserved communities"
                />
              </div>
              <div>
                <HexagonCard
                  index={2}
                  icon={<Lock className="h-8 w-8" />}
                  frontText="Digital Safety"
                  backText="Teaching online safety and navigation for responsible use."
                />
              </div>
              <div>
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
        <div className="flex justify-center mt-12" data-aos="fade-up" data-aos-delay="800">
          <ChevronDown className="h-7 w-7 text-[#1d588a] animate-bounce" />
        </div>
      </section>

      {/* Empowering Education Section - Edge to Edge */}
      <ContentSection
        id="about1"
        title="Empowering Education Through Technology"
        description={[
          "Our platform connects educators, students, and volunteers in a seamless digital environment. We provide cutting-edge tools and resources that make learning accessible, engaging, and effective for everyone, regardless of their background or location.",
          "From interactive courses to mentorship programs, we're building the future of education one connection at a time. Join thousands of learners who have already transformed their lives through our comprehensive educational ecosystem."
        ]}
        image="/images/home/empower-through-tech.jpg?height=400&width=600"
        cta={{ text: "More About Us", href: "/about" }}
        edgeToEdge={true} // Make this section edge-to-edge
      />

      {/* Building Global Communities Section */}
      <ContentSection
        title="Building Global Communities"
        description={[
          "Connect with like-minded individuals from around the world who share your passion for learning and growth. Our community-driven approach ensures that every member has access to support, guidance, and opportunities for collaboration.",
          "Whether you're looking to develop new skills, share your expertise, or find mentorship, our global network provides the connections and resources you need to succeed in your educational journey."
        ]}
        image="/images/home/building-communities.jpg?height=400&width=600"
        reverse
        cta={{ text: "Join Our Discord", href: "https://discord.gg/XWVJadkn" }}
        edgeToEdge={false} // Keep this section with container
      />

      {/* Our Impact Section */}
      <section className="bg-[#E1F0FA] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1d588a] mb-10" data-aos="fade-up">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-7">
            <Card className="text-center p-7 border-gray-200" data-aos="fade-up" data-aos-delay="100">
              <CardContent className="space-y-4">
                <Users className="h-10 w-10 text-[#1f639e] mx-auto" />
                <div className="text-3xl font-bold text-[#1d588a]">150+</div>
                <div className="text-blue-600 font-medium text-base">
                  Active Contributors
                </div>
                <p className="text-gray-600 text-sm">
                  Passionate individuals have joined our mission to bridge the
                  digital divide and make a change.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-7 border-gray-200" data-aos="fade-up" data-aos-delay="200">
              <CardContent className="space-y-4">
                <Link2 className="h-10 w-10 text-[#1f639e] mx-auto" />
                <div className="text-3xl font-bold text-[#1d588a]">250+</div>
                <div className="text-blue-600 font-medium text-base">
                  hours of content
                </div>
                <p className="text-gray-600 text-sm">
                  We've contributed over 250 hours of service to make an
                  impact.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-7 border-gray-200" data-aos="fade-up" data-aos-delay="300">
              <CardContent className="space-y-4">
                <User className="h-10 w-10 text-[#1f639e] mx-auto" />
                <div className="text-3xl font-bold text-[#1d588a]">20</div>
                <div className="text-blue-600 font-medium text-base">
                  Global Partnership
                </div>
                <p className="text-gray-600 text-sm">
                  Collaborating with local clubs and non-profits to expand our
                  outreach.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Exclusive Partners Section */}
      <section className="bg-[#F0F8FF] py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1d588a] mb-6" data-aos="fade-up">
              Our Exclusive Partners
            </h2>
          </div>
          <PartnersCarousel /> {/* Use the PartnersCarousel component from the first code */}
        </div>
      </section>
    </div>
  );
}
