// app/about/page.tsx
"use client";
import Image from "@/components/ui/image"; // Assuming this wraps next/image
import { Lightbulb, Group } from "lucide-react"; // Importing icons
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { VALUES } from "./about-values";
import ValueCard from "@/components/ui/ValueCard";
export default function AboutPage() {
  useEffect(() => {
    // Initialize AOS - Matching DonatePage style
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
    });
  }, []);
  return (
    <div className="flex flex-col min-h-screen items-center pt-[64px] bg-[#f0f8ff]">
      {/* Main Header */}
      <div className="h-[75vh] flex flex-col items-center justify-center relative about-hero-img">
        <h1
          className="text-3xl md:text-6xl font-bold mb-6 text-[#E0E0E0] mt-8 text-center z-1"
          data-aos="fade-up"
        >
          About Us
        </h1>
      </div>

      {/* Our Mission Section */}
      <section
        className="w-full px-4 py-8 flex flex-col md:flex-row items-center gap-8 bg-[#F0F8FF]" // Changed to edge-to-edge, added padding, and background color
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="md:w-1/3 flex justify-center">
          <Lightbulb size={80} className="text-[#1f639e]" />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1f639e] text-center md:text-left">
            Our Mission
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-600 leading-relaxed space-y-3">
            <li>
              **Bridging the Digital Divide:** Making technology accessible,
              affordable, and understandable for underserved communities.
            </li>
            <li>
              **Empowering Individuals:** Providing essential tools,
              comprehensive training, and valuable resources.
            </li>
            <li>
              **Fostering Innovation:** Helping communities develop digital
              skills, creativity, and confidence.
            </li>
            <li>
              **Promoting Equity:** Working towards an inclusive society where
              technology is a bridge, not a barrier.
            </li>
          </ul>
          <p className="text-sm text-gray-500 mt-4 text-center md:text-left">
            *Achieved through strategic partnerships and dedicated volunteers.*
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section
        className="w-full px-4 py-8 flex flex-col md:flex-row-reverse items-center gap-8 bg-[#E1F0FA]" // Changed to edge-to-edge, added padding, and background color
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="md:w-1/3 flex justify-center">
          <Group size={80} className="text-[#1f639e]" />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1f639e] text-center md:text-right">
            Who We Are
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-600 leading-relaxed space-y-3 text-center md:text-right">
            <li>
              **Founded in 2024:** By driven students addressing technology
              inequality.
            </li>
            <li>
              **Diverse Team:** Professionals in tech and education, passionate
              educators, and enthusiastic volunteers.
            </li>
            <li>
              **United by a Goal:** Leveraging collective skills to create
              lasting, positive impact.
            </li>
          </ul>
          <p className="text-sm text-gray-500 mt-4 text-center md:text-right">
            *Growing committed force for change.*
          </p>
        </div>
      </section>

      {/* Our Values Section */}
      <section
        className="w-full px-4 py-8 bg-[#F0F8FF]" // Changed to edge-to-edge, added padding, and background color
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1f639e] text-center">
          Our Values
        </h2>
        <p className="text-lg text-gray-600 text-center mb-6 leading-relaxed">
          Everything we do at ReEnvision is guided by a core set of principles
          that reflect our commitment to meaningful and sustainable change:
        </p>
        <div className="grid grid-cols-2 gap-4 lg:[grid-template-columns:repeat(6,minmax(0,1fr))]">
          {VALUES.map((value, idx) => {
            const smallSpan =
              idx === VALUES.length - 1 ? "col-span-2" : "col-span-1";

            const lgSpan = "lg:col-span-2";
            const lgStarts = [
              "lg:col-start-1",
              "lg:col-start-3",
              "lg:col-start-5",
              "lg:col-start-2",
              "lg:col-start-4",
            ];
            const lgStart = lgStarts[idx];

            return (
              <div
                key={value.title}
                className={`${smallSpan} ${lgSpan} ${lgStart}`}
              >
                <ValueCard
                  title={value.title}
                  description={value.description}
                  aosDelay={100 + idx * 50}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Teams Section */}
      <section id="teams" className="w-full py-8 bg-[#E1F0FA]">
        <div className="container mx-auto px-4">
          <h2
            className="text-2xl md:text-3xl font-semibold mb-8 text-[#1f639e] text-center"
            data-aos="fade-up"
          >
            ReEnvision Officers & Team Leads
          </h2>
          {/* President */}
          <div
            className="flex justify-center items-center mx-auto px-4 py-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Card className="flex flex-col gap-4 items-center p-4 w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <Image
                  src="/images/about/sharvin.jpg"
                  width={150}
                  height={150}
                  alt="Sharvin Goyal"
                  className="rounded-full mb-3 border-2 border-[#1f639e]"
                />
                <h3 className="text-xl font-semibold text-[#1f639e]">
                  Sharvin Goyal
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  President & Founder
                </p>
                <p className="text-gray-600 text-sm text-center mt-1 italic">
                  Leading the vision and strategy of ReEnvision.
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Heads */}
          <div
            className="flex flex-col md:flex-row justify-center items-center gap-8 mx-auto px-4 py-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Card className="flex flex-col gap-4 items-center p-4 w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <Image
                  src="/images/about/robert.jpg"
                  width={120}
                  height={120}
                  alt="Robert Pierson"
                  className="rounded-full mb-3 border border-[#1f639e]"
                />
                <h3 className="text-lg font-semibold text-[#1f639e]">
                  Robert Pierson
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  Head of Operations
                </p>
                <p className="text-gray-600 text-sm text-center mt-1 italic">
                  Ensuring smooth day-to-day functioning and logistics.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col gap-4 items-center p-4 w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <Image
                  src="/images/about/santi.jpg"
                  width={120}
                  height={120}
                  alt="Santiago Silva"
                  className="rounded-full mb-3 border border-[#1f639e]"
                />
                <h3 className="text-lg font-semibold text-[#1f639e]">
                  Santiago Silva
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  Head of Development
                </p>
                <p className="text-gray-600 text-sm text-center mt-1 italic">
                  Driving technical projects and team development.
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Team Leads */}
          {/* Using flex layout for better control on xl screens */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap xl:justify-center gap-6 items-stretch mx-auto px-4 py-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            {/* Web Development Lead - Subham Saha */}
            <Card className="flex flex-col gap-4 items-center p-4 w-full xl:w-48 xl:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <Image
                  src="/images/about/subham.jpg"
                  width={112} // md:w-28 = 7*4 = 28, 28*4 = 112
                  height={112}
                  alt="Subham Saha"
                  className="rounded-full mb-3 border border-[#1f639e]"
                />
                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                  Subham Saha
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  Web Development Lead
                </p>
                <p className="text-gray-600 text-xs text-center mt-1 italic">
                  Building and maintaining our digital presence.
                </p>
              </CardContent>
            </Card>
            {/* Content Creation Lead - Abram Acevado & Maegann Yniguez - WIDE CARD */}
            <Card className="flex flex-col gap-4 items-center p-4 w-full xl:w-96 xl:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300 sm:col-span-2">
              <CardContent className="flex flex-col items-center p-0">
                {/* Images for Abram Acevado and Maegann Yniguez */}
                <div className="flex justify-center gap-4 mb-4">
                  <Image
                    src="/images/about/abram.jpg"
                    width={112}
                    height={112}
                    alt="Abram Acevado"
                    className="rounded-full border border-[#1f639e] flex-shrink-0"
                  />
                  <Image
                    src="/images/about/maegann.jpg"
                    width={112}
                    height={112}
                    alt="Maegann Yniguez"
                    className="rounded-full border border-[#1f639e] flex-shrink-0"
                  />
                </div>
                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                  Abram Acevado & Maegann Yniguez
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  Content Creation Leads
                </p>
                <p className="text-gray-600 text-xs text-center mt-1 italic">
                  Turning our ideas into visuals for the world to see.
                </p>
              </CardContent>
            </Card>
            {/* Organizational Relations and Events - Azaan Noman */}
            <Card className="flex flex-col gap-4 items-center p-4 w-full xl:w-48 xl:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <Image
                  src="/images/about/azaan.jpg"
                  width={112}
                  height={112}
                  alt="Azaan Noman"
                  className="rounded-full mb-3 border border-[#1f639e]"
                />
                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                  Azaan Noman
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  Organizational Relations and Events Lead
                </p>
                <p className="text-gray-600 text-xs text-center mt-1 italic">
                  Connecting with communities and partners.
                </p>
              </CardContent>
            </Card>
            {/* Finance - Garret Smith */}
            <Card className="flex flex-col gap-4 items-center p-4 w-full xl:w-48 xl:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <Image
                  src="/images/about/garret.jpg"
                  width={112}
                  height={112}
                  alt="Garret Smith"
                  className="rounded-full mb-3 border border-[#1f639e]"
                />
                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                  Garret Smith
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  Finance Lead
                </p>
                <p className="text-gray-600 text-xs text-center mt-1 italic">
                  Managing budgets and financial sustainability.
                </p>
              </CardContent>
            </Card>
            {/* Graphic Design - Siddhi Jain */}
            <Card className="flex flex-col gap-4 items-center p-4 w-full xl:w-48 xl:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <Image
                  src="/images/about/siddhi.jpg"
                  width={112}
                  height={112}
                  alt="Siddhi Jain"
                  className="rounded-full mb-3 border border-[#1f639e]"
                />
                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                  Siddhi Jain
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  Graphic Design Lead
                </p>
                <p className="text-gray-600 text-xs text-center mt-1 italic">
                  Creating visual identities and designs.
                </p>
              </CardContent>
            </Card>
            {/* Onboarding and Chapter Management - Lily Zhang */}
            <Card className="flex flex-col gap-4 items-center p-4 w-full xl:w-48 xl:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <Image
                  src="/images/about/lily.jpg"
                  width={112}
                  height={112}
                  alt="Lily Zhang"
                  className="rounded-full mb-3 border border-[#1f639e]"
                />
                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                  Lily Zhang
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  Onboarding and Chapter Management Lead
                </p>
                <p className="text-gray-600 text-xs text-center mt-1 italic">
                  Facilitating new member integration and chapter growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Footer Note */}
    </div>
  );
}
