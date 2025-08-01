"use client";
import { useState, useEffect, useMemo } from "react";
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
  Check,
} from "lucide-react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

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
  {
    id: 5,
    name: "Tech Partners Inc",
    image: "/images/home/partner5.png?height=80&width=120",
  },
  {
    id: 6,
    name: "Digital Solutions",
    image: "/images/home/partner6.png?height=80&width=120",
  },
];

const IMPACT_ITEMS = [
  {
    icon: <Users className="h-12 w-12 text-[#0C0C0C] mx-auto" />,
    value: "150+",
    title: "Active Contributors",
    description: "Passionate individuals bridging the digital divide.",
  },
  {
    icon: <Link2 className="h-12 w-12 text-[#0C0C0C] mx-auto" />,
    value: "250+",
    title: "Hours of Content",
    description: "Dedicated service making real impact.",
  },
  {
    icon: <User className="h-12 w-12 text-[#0C0C0C] mx-auto" />,
    value: "20",
    title: "Global Partnerships",
    description: "Collaborating to expand our outreach.",
  },
  {
    icon: <Book className="h-12 w-12 text-[#0C0C0C] mx-auto" />,
    value: "50+",
    title: "Educational Programs",
    description: "Empowering learners of all ages.",
  },
  {
    icon: <Laptop className="h-12 w-12 text-[#0C0C0C] mx-auto" />,
    value: "1000+",
    title: "Devices Donated",
    description: "Technology access for underserved communities.",
  },
  {
    icon: <Handshake className="h-12 w-12 text-[#0C0C0C] mx-auto" />,
    value: "30+",
    title: "Community Events",
    description: "Bringing people together to learn.",
  },
];

const HEXAGON_CARDS = [
  {
    icon: <Book className="h-8 w-8" />,
    frontText: "Unleash Learning Power",
    backText: "Bridging educational gaps through innovative technology and community partnerships.",
  },
  {
    icon: <Laptop className="h-8 w-8" />,
    frontText: "Bridging the Tech Divide",
    backText: "Offering courses, resources, and technology to underserved communities",
  },
  {
    icon: <Lock className="h-8 w-8" />,
    frontText: "Digital Safety",
    backText: "Teaching online safety and navigation for responsible use.",
  },
  {
    icon: <Handshake className="h-8 w-8" />,
    frontText: "Give and Grow",
    backText: "Join us to volunteer and make an impact in your community.",
  },
];

// Components
function PartnersCarousel() {
  return (
    <div className="w-full overflow-hidden relative py-8">
      <div className="flex animate-infinite-scroll items-center">
        {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex-shrink-0 px-8 flex flex-col items-center"
          >
            <div className="rounded-lg shadow-sm p-6 h-32 w-48 flex items-center justify-center bg-[#F0F8FF] border border-[#E1F0FA]">
              <Image
                src={partner.image}
                alt={partner.name}
                width={120}
                height={80}
                className="object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-center text-sm font-medium text-[#0C0C0C] mt-2">
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

function ImpactCarousel() {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex space-x-6 px-4">
        {IMPACT_ITEMS.map((item, index) => (
          <Card key={index} className="flex-shrink-0 w-64 p-6 bg-[#F0F8FF] border border-[#E1F0FA]">
            <CardContent className="space-y-4">
              {item.icon}
              <div className="text-4xl font-bold text-[#0C0C0C]">{item.value}</div>
              <div className="font-bold text-lg text-[#0C0C0C]">{item.title}</div>
              <p className="text-[#0C0C0C] text-sm">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HexagonCard({ index, icon, frontText, backText }: {
  index: number;
  icon: React.ReactNode;
  frontText: string;
  backText: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentCard = Math.floor((Date.now() % (HEXAGON_CARDS.length * 1000)) / 1000);
      setIsFlipped(currentCard === index);
    }, 50);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="hexagon-container group cursor-pointer" style={{ perspective: '1000px' }}>
      <div className={`hexagon-card ${isFlipped ? "flipped" : ""}`}>
        <div className="hexagon-face hexagon-front flex flex-col items-center justify-center p-4">
          <div className="text-[#0C0C0C]">{icon}</div>
          <div className="font-bold text-lg text-center text-[#0C0C0C] mt-2">
            {frontText}
          </div>
        </div>
        <div className="hexagon-face hexagon-back flex items-center justify-center p-4">
          <p className="text-[#0C0C0C] text-sm text-center leading-tight">
            {backText}
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .hexagon-container { width: 180px; height: 180px; }
        .hexagon-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
        }
        .hexagon-card.flipped { transform: rotateY(180deg); }
        .group:hover .hexagon-card { transform: rotateY(180deg); }
        .group:hover .hexagon-card.flipped { transform: rotateY(360deg); }
        .hexagon-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          background: #F0F8FF;
          border: 1px solid #E1F0FA;
        }
        .hexagon-back { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-[#F0F8FF] min-h-screen flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0C0C0C] leading-tight">
              Your Gateway To<br />
              <span className="text-[#0C0C0C] font-extrabold">ENDLESS</span><br />
              <span>Opportunities In Technology</span>
            </h1>
            
            <p className="text-[#0C0C0C]/90 text-lg leading-relaxed">
              Join us in connecting volunteers with meaningful opportunities to
              support those in need. Together, we're bridging the digital
              divide and creating equitable access to essential resources.
            </p>
            
            <div className="flex flex-row gap-4">
              <Link href="/courses">
                <Button className="bg-[#E1F0FA] hover:bg-[#E1F0FA]/90 text-[#0C0C0C] px-8 py-3 border border-[#E1F0FA]">
                  Learn More
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" className="border-[#0C0C0C] text-[#0C0C0C] hover:bg-[#E1F0FA]">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
            {HEXAGON_CARDS.map((card, index) => (
              <HexagonCard
                key={index}
                index={index}
                icon={card.icon}
                frontText={card.frontText}
                backText={card.backText}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-[#0C0C0C]" />
      </div>
    </section>
  );
}

function ContentSection({ title, description, image, reverse = false, cta }: {
  title: string;
  description: string[];
  image: string;
  reverse?: boolean;
  cta: { text: string; href: string };
}) {
  return (
    <section className={`py-16 ${reverse ? 'bg-[#F0F8FF]' : 'bg-[#E1F0FA]'}`}>
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#0C0C0C]">{title}</h2>
            
            <div className="lg:hidden">
              <Image
                src={image}
                alt={title}
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            
            {description.map((paragraph, i) => (
              <p key={i} className="text-[#0C0C0C] leading-relaxed">
                {paragraph}
              </p>
            ))}
            
            <Link href={cta.href}>
              <Button className="bg-[#E1F0FA] hover:bg-[#E1F0FA]/90 text-[#0C0C0C] border border-[#E1F0FA]">
                {cta.text}
              </Button>
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <Image
              src={image}
              alt={title}
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
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
    <div className="min-h-screen bg-[#F0F8FF]">
      <HeroSection />
      
      <ContentSection
        title="Empowering Education Through Technology"
        description={[
          "Our platform connects educators, students, and volunteers in a seamless digital environment. We provide cutting-edge tools and resources that make learning accessible, engaging, and effective for everyone, regardless of their background or location.",
          "From interactive courses to mentorship programs, we're building the future of education one connection at a time. Join thousands of learners who have already transformed their lives through our comprehensive educational ecosystem."
        ]}
        image="/images/home/empower-through-tech.jpg"
        cta={{ text: "More About Us", href: "/about" }}
      />
      
      <ContentSection
        title="Building Global Communities"
        description={[
          "Connect with like-minded individuals from around the world who share your passion for learning and growth. Our community-driven approach ensures that every member has access to support, guidance, and opportunities for collaboration.",
          "Whether you're looking to develop new skills, share your expertise, or find mentorship, our global network provides the connections and resources you need to succeed in your educational journey."
        ]}
        image="/images/home/building-communities.jpg"
        reverse
        cta={{ text: "Join Our Discord", href: "https://discord.gg/XWVJadkn" }}
      />
      
      <section className="bg-[#F0F8FF] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-[#0C0C0C] mb-12">
            Our Impact
          </h2>
          <ImpactCarousel />
        </div>
      </section>
      
      <section className="bg-[#E1F0FA] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-[#0C0C0C] mb-8">
            Our Exclusive Partners
          </h2>
          <PartnersCarousel />
        </div>
      </section>
    </div>
  );
}
