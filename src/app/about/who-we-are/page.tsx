
'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { Users, Building, GraduationCap } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function WhoWeArePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center pt-[64px] bg-[#f0f8ff]">
      <div className="h-[50vh] flex flex-col items-center justify-center relative about-hero-img" data-aos="fade-up">
        <h1 className="text-3xl md:text-6xl font-bold mb-6 text-[#E0E0E0] mt-8 text-center z-1">
          Who We Are
        </h1>
      </div>

      <div className="w-full max-w-6xl mx-auto p-8" data-aos="fade-up" data-aos-delay="200">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-lg text-gray-700 leading-relaxed" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-3xl font-bold text-[#1f639e] mb-6">A Passionate and Diverse Team</h2>
              <p className="mb-4">
                ReEnvision was founded in 2024 by a group of driven and forward-thinking students who recognized the growing need to address technology inequality. Our team has since grown to include a diverse group of professionals, educators, and volunteers who are all united by a common goal: to leverage our collective skills and create a lasting, positive impact on society.
              </p>
              <p>
                We are a blend of experienced professionals from the tech and education sectors, passionate educators dedicated to creating accessible learning opportunities, and enthusiastic volunteers who share our vision. This diversity of backgrounds and expertise is our greatest strength, allowing us to approach challenges from multiple perspectives and develop innovative solutions.
              </p>
            </div>
            <div className="flex justify-center" data-aos="fade-up" data-aos-delay="400">
              <Image
                src="/images/about/who-we-are.jpg" // Replaced with a more relevant image
                alt="ReEnvision Team"
                width={500}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="mt-16" data-aos="fade-up" data-aos-delay="500">
            <h3 className="text-2xl font-bold text-center text-[#1f639e] mb-10">What Unites Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="600">
                <Users size={48} className="text-[#1f639e] mb-4" />
                <h4 className="text-xl font-semibold mb-2">Shared Vision</h4>
                <p className="text-gray-600">We are all driven by the belief that technology should be a tool for empowerment and a bridge to a more equitable future.</p>
              </div>
              <div className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="700">
                <Building size={48} className="text-[#1f639e] mb-4" />
                <h4 className="text-xl font-semibold mb-2">Collaborative Spirit</h4>
                <p className="text-gray-600">We foster a culture of collaboration, where every member's contribution is valued and respected.</p>
              </div>
              <div className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="800">
                <GraduationCap size={48} className="text-[#1f639e] mb-4" />
                <h4 className="text-xl font-semibold mb-2">Commitment to Education</h4>
                <p className="text-gray-600">We are dedicated to creating high-quality educational experiences that are accessible, engaging, and impactful.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
