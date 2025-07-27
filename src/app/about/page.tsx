// app/about/page.tsx
"use client";
import Image from "@/components/ui/image"; // Assuming this wraps next/image
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
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
        <div className="flex flex-col min-h-screen items-center py-8 pt-[64px]">
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
                className="container mx-auto px-4 py-8 max-w-4xl bg-white rounded-lg shadow-sm"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1f639e] text-center">
                    Our Mission
                </h2>
                <p className="text-lg text-gray-600 text-center leading-relaxed">
                    ReEnvision is passionately dedicated to bridging the digital divide by making
                    cutting-edge technology accessible, affordable, and understandable for
                    underserved communities. We believe that everyone deserves the opportunity to
                    participate fully in our increasingly digital world. Through strategic
                    partnerships with local organizations, schools, and businesses, alongside the
                    tireless efforts of our passionate volunteers, we provide essential tools,
                    comprehensive training programs, and valuable resources. Our ultimate goal is to
                    empower individuals with the digital skills and confidence they need, foster
                    creativity and innovation within these communities, and actively promote a more
                    inclusive and equitable society where technology serves as a bridge, not a
                    barrier.
                </p>
            </section>
            {/* Who We Are Section */}
            <section
                className="container mx-auto px-4 py-8 max-w-4xl bg-white rounded-lg shadow-sm mt-4"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1f639e] text-center">
                    Who We Are
                </h2>
                <p className="text-lg text-gray-600 text-center leading-relaxed">
                    ReEnvision was founded in 2024 by a group of driven students who recognized the
                    urgent need to address technology inequality. What started as a vision has
                    quickly grown into a committed force for change. Our diverse team is the heart
                    of our organization, comprised of dedicated professionals bringing expertise in
                    technology and education, passionate educators who understand community needs,
                    and enthusiastic volunteers from all walks of life who share our commitment.
                    United by a common goal, we work tirelessly, leveraging our collective skills
                    and perspectives. Together, we strive to not only keep pace with but also
                    thoughtfully harness the power of today's fast-moving technological landscape to
                    create a lasting, positive impact for those who need it most.
                </p>
            </section>
            {/* Our Values Section */}
            <section
                className="container mx-auto px-4 py-8 max-w-4xl bg-white rounded-lg shadow-sm mt-4"
                data-aos="fade-up"
                data-aos-delay="300"
            >
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1f639e] text-center">
                    Our Values
                </h2>
                <p className="text-lg text-gray-600 text-center mb-6 leading-relaxed">
                    Everything we do at ReEnvision is guided by a core set of principles that
                    reflect our commitment to meaningful and sustainable change:
                </p>
                <ul className="list-disc list-inside text-lg text-gray-600 space-y-2 max-w-2xl mx-auto pl-5">
                    <li className="pl-2">
                        <span className="font-medium">Inclusivity:</span> We actively work to ensure
                        our programs and services are welcoming and accessible to everyone,
                        regardless of background, age, or ability.
                    </li>
                    <li className="pl-2">
                        <span className="font-medium">Empowerment:</span> Our focus is on providing
                        people with the knowledge and tools they need to become self-sufficient and
                        confident in using technology.
                    </li>
                    <li className="pl-2">
                        <span className="font-medium">Collaboration:</span> We believe the best
                        solutions come from working together. We foster strong partnerships and
                        encourage teamwork both within our organization and with the communities we
                        serve.
                    </li>
                    <li className="pl-2">
                        <span className="font-medium">Equity:</span> We are committed to fairness
                        and strive to provide opportunities that help level the playing field in the
                        digital world.
                    </li>
                    <li className="pl-2">
                        <span className="font-medium">Innovation:</span> We embrace creative and
                        forward-thinking approaches to solve challenges and deliver impactful
                        solutions.
                    </li>
                </ul>
            </section>
            {/* Our Teams Section */}
            <section id="teams" className="w-full py-8 mt-4">
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
                                    src="/favicon.png"
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
                                    src="/favicon.png"
                                    width={120}
                                    height={120}
                                    alt="Robert Pierson"
                                    className="rounded-full mb-3 border border-gray-300"
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
                                    src="/images/about/santi.png"
                                    width={120}
                                    height={120}
                                    alt="Santiago Silva"
                                    className="rounded-full mb-3 border border-gray-300"
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
                                    src="/images/about/subham.png"
                                    width={112} // md:w-28 = 7*4 = 28, 28*4 = 112
                                    height={112}
                                    alt="Subham Saha"
                                    className="rounded-full mb-3 border border-gray-300"
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
                                <div className="flex justify-center gap-4 mb-2">
                                    <Image
                                        src="/images/about/abram.png"
                                        width={96} // md:w-24 = 6*4 = 24, 24*4 = 96
                                        height={96}
                                        alt="Abram Acevado"
                                        className="rounded-full border border-gray-300 flex-shrink-0"
                                    />
                                    <Image
                                        src="/favicon.png"
                                        width={96}
                                        height={96}
                                        alt="Maegann Yniguez"
                                        className="rounded-full border border-gray-300 flex-shrink-0"
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
                                    src="/images/about/azaan.png"
                                    width={112}
                                    height={112}
                                    alt="Azaan Noman"
                                    className="rounded-full mb-3 border border-gray-300"
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
                                    src="/images/about/garret.png"
                                    width={112}
                                    height={112}
                                    alt="Garret Smith"
                                    className="rounded-full mb-3 border border-gray-300"
                                />
                                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                                    Garret Smith
                                </h3>
                                <p className="text-gray-600 text-center font-medium">Finance Lead</p>
                                <p className="text-gray-600 text-xs text-center mt-1 italic">
                                    Managing budgets and financial sustainability.
                                </p>
                            </CardContent>
                        </Card>
                        {/* Graphic Design - Siddhi Jain */}
                        <Card className="flex flex-col gap-4 items-center p-4 w-full xl:w-48 xl:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="flex flex-col items-center p-0">
                                <Image
                                    src="/favicon.png"
                                    width={112}
                                    height={112}
                                    alt="Siddhi Jain"
                                    className="rounded-full mb-3 border border-gray-300"
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
                                    src="/favicon.png"
                                    width={112}
                                    height={112}
                                    alt="Lily Zhang"
                                    className="rounded-full mb-3 border border-gray-300"
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
