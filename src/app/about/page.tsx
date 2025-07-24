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
        <div className="flex flex-col min-h-screen items-center py-8">
            {/* Main Header */}
            <h1
                className="text-3xl md:text-4xl font-bold mb-6 text-[#1f639e] mt-8 text-center"
                data-aos="fade-up"
            >
                About Us
            </h1>

            {/* Hero Image - Added Section */}
            <div 
                className="container mx-auto px-4 mb-8 flex justify-center"
                data-aos="fade-up"
                data-aos-delay="50"
            >
                <div className="relative w-full max-w-4xl h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
                    {/* Using fill requires width and height to be set on the parent or passed as props */}
                    {/* Based on your file structure, using about.jpg */}
                    <Image
                      src="/images/about/about.png"
                        alt="ReEnvision Team in Action"
                        fill
                        // width and height props are still required by the component even with fill,
                        // although they might not directly control the rendered size when fill is true.
                        // Common practice is to provide the intrinsic dimensions of the image or dummy values.
                        // However, if your custom Image component strictly enforces width/height without fill,
                        // you might need to set them to match the container or use layout='fill' differently.
                        // Let's try providing width and height matching the container's max dimensions.
                        // If that doesn't work, you might need to adjust your ui/Image component or use next/image directly.
                        width={1200}  // Example width matching max-w-4xl (~1152px) or common large image width
                        height={500}  // Example height matching h-96 (24rem * 16px = 384px), using 500 for buffer
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px" // Match max-w-4xl
                        className="object-cover"
                        priority
                    />
                </div>
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
                    ReEnvision is passionately dedicated to bridging the digital divide by making cutting-edge
                    technology accessible, affordable, and understandable for underserved communities. We believe
                    that everyone deserves the opportunity to participate fully in our increasingly digital world.
                    Through strategic partnerships with local organizations, schools, and businesses, alongside the
                    tireless efforts of our passionate volunteers, we provide essential tools, comprehensive training
                    programs, and valuable resources. Our ultimate goal is to empower individuals with the digital
                    skills and confidence they need, foster creativity and innovation within these communities, and
                    actively promote a more inclusive and equitable society where technology serves as a bridge, not
                    a barrier.
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
                    ReEnvision was founded in 2024 by a group of driven students who recognized the urgent need to
                    address technology inequality. What started as a vision has quickly grown into a committed force
                    for change. Our diverse team is the heart of our organization, comprised of dedicated
                    professionals bringing expertise in technology and education, passionate educators who
                    understand community needs, and enthusiastic volunteers from all walks of life who share our
                    commitment. United by a common goal, we work tirelessly, leveraging our collective skills and
                    perspectives. Together, we strive to not only keep pace with but also thoughtfully harness the
                    power of today's fast-moving technological landscape to create a lasting, positive impact for
                    those who need it most.
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
                    Everything we do at ReEnvision is guided by a core set of principles that reflect our
                    commitment to meaningful and sustainable change:
                </p>
                <ul className="list-disc list-inside text-lg text-gray-600 space-y-2 max-w-2xl mx-auto pl-5">
                    <li className="pl-2">
                        <span className="font-medium">Inclusivity:</span> We actively work to ensure our programs and
                        services are welcoming and accessible to everyone, regardless of background, age, or ability.
                    </li>
                    <li className="pl-2">
                        <span className="font-medium">Empowerment:</span> Our focus is on providing people with the
                        knowledge and tools they need to become self-sufficient and confident in using technology.
                    </li>
                    <li className="pl-2">
                        <span className="font-medium">Collaboration:</span> We believe the best solutions come from
                        working together. We foster strong partnerships and encourage teamwork both within our
                        organization and with the communities we serve.
                    </li>
                    <li className="pl-2">
                        <span className="font-medium">Equity:</span> We are committed to fairness and strive to
                        provide opportunities that help level the playing field in the digital world.
                    </li>
                    <li className="pl-2">
                        <span className="font-medium">Innovation:</span> We embrace creative and forward-thinking
                        approaches to solve challenges and deliver impactful solutions.
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
                                    src="/favicon.png" // Replace with actual image path
                                    width={150}
                                    height={150}
                                    alt="Sharvin Goyal"
                                    className="rounded-full mb-3 border-2 border-[#1f639e]"
                                />
                                <h3 className="text-xl font-semibold text-[#1f639e]">Sharvin Goyal</h3>
                                <p className="text-gray-600 text-center font-medium">President & Founder</p>
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
                                    src="/favicon.png" // Replace with actual image path
                                    width={120}
                                    height={120}
                                    alt="Robert Pierson"
                                    className="rounded-full mb-3 border border-gray-300"
                                />
                                <h3 className="text-lg font-semibold text-[#1f639e]">Robert Pierson</h3>
                                <p className="text-gray-600 text-center font-medium">Head of Operations</p>
                                <p className="text-gray-600 text-sm text-center mt-1 italic">
                                    Ensuring smooth day-to-day functioning and logistics.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col gap-4 items-center p-4 w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="flex flex-col items-center p-0">
                                <Image
                                    src="/images/about/santi.png" // Replace with actual image path
                                    width={120}
                                    height={120}
                                    alt="Santiago Silva"
                                    className="rounded-full mb-3 border border-gray-300"
                                />
                                <h3 className="text-lg font-semibold text-[#1f639e]">Santiago Silva</h3>
                                <p className="text-gray-600 text-center font-medium">Head of Development</p>
                                <p className="text-gray-600 text-sm text-center mt-1 italic">
                                    Driving technical projects and team development.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Team Leads */}
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center items-stretch mx-auto px-4 py-6"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        {/* Web Dev Team Lead - Not Yet Assigned */}
                        <Card className="flex flex-col gap-4 items-center p-4 w-full shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="flex flex-col items-center p-0">
                                <div
                                    className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-3"
                                    aria-label="Placeholder for Web Dev Lead"
                                >
                                    <span className="text-gray-500 text-xs md:text-sm text-center px-1">
                                        Image
                                        <br />
                                        Coming Soon
                                    </span>
                                </div>
                                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                                    Web Dev Team Lead
                                </h3>
                                <p className="text-gray-600 text-center font-medium">(Not Yet Assigned)</p>
                                <p className="text-gray-600 text-xs text-center mt-1 italic">
                                    Building and maintaining our digital presence.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Social Media Team Lead - TBD */}
                        <Card className="flex flex-col gap-4 items-center p-4 w-full shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="flex flex-col items-center p-0">
                                <div
                                    className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-3"
                                    aria-label="Placeholder for Social Media Lead"
                                >
                                    <span className="text-gray-500 text-xs md:text-sm text-center px-1">
                                        Image
                                        <br />
                                        Coming Soon
                                    </span>
                                </div>
                                <h3 className="text-md font-semibold text-[#1f639e] text-center">
                                    Social Media Team Lead
                                </h3>
                                <p className="text-gray-600 text-center font-medium">(To Be Decided)</p>
                                <p className="text-gray-600 text-xs text-center mt-1 italic">
                                    Amplifying our message and engaging our community online.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Outreach */}
                        <Card className="flex flex-col gap-4 items-center p-4 w-full shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="flex flex-col items-center p-0">
                                {/* Assuming Azaan Noman's image might not be available yet, using placeholder */}
                                <div
                                    className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-3"
                                    aria-label="Placeholder for Azaan Noman"
                                >
                                    <span className="text-gray-500 text-xs md:text-sm text-center px-1">
                                        Image
                                        <br />
                                        Coming Soon
                                    </span>
                                </div>
                                {/* If image is available, uncomment the Image component below and comment out the div above */}
                                {/*
                                <Image
                                    src="/path/to/azaan-noman.jpg" // Replace with actual image path
                                    width={100}
                                    height={100}
                                    alt="Azaan Noman"
                                    className="rounded-full mb-3 border border-gray-300"
                                />
                                */}
                                <h3 className="text-md font-semibold text-[#1f639e] text-center">Azaan Noman</h3>
                                <p className="text-gray-600 text-center font-medium">Outreach Lead</p>
                                <p className="text-gray-600 text-xs text-center mt-1 italic">
                                    Connecting with communities and partners.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Finance */}
                        <Card className="flex flex-col gap-4 items-center p-4 w-full shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="flex flex-col items-center p-0">
                                <div
                                    className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-3"
                                    aria-label="Placeholder for Finance Lead"
                                >
                                    <span className="text-gray-500 text-xs md:text-sm text-center px-1">
                                        Image
                                        <br />
                                        Coming Soon
                                    </span>
                                </div>
                                <h3 className="text-md font-semibold text-[#1f639e] text-center">Finance Lead</h3>
                                <p className="text-gray-600 text-center font-medium">(Name TBD)</p>
                                <p className="text-gray-600 text-xs text-center mt-1 italic">
                                    Managing budgets and financial sustainability.
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
