
import { BrainCircuit, Users, Rocket, ShieldCheck } from 'lucide-react';

export default function MissionPage() {
  return (
    <div className="flex flex-col min-h-screen items-center pt-[64px] bg-[#f0f8ff]">
      <div className="h-[50vh] flex flex-col items-center justify-center relative about-hero-img">
        <h1 className="text-3xl md:text-6xl font-bold mb-6 text-[#E0E0E0] mt-8 text-center z-1">
          Our Mission
        </h1>
      </div>

      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-[#1f639e] mb-6">To leverage artificial intelligence to empower individuals.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-gray-700 leading-relaxed">
            <div>
              <p className="mb-4">
                At ReEnvision, we believe that artificial intelligence is a transformative technology with the potential to uplift and empower people from all walks of life. Our mission is to harness this power and make it accessible, understandable, and beneficial for everyone, regardless of their background or expertise.
              </p>
              <p>
                We are committed to demystifying AI and providing individuals with the knowledge and tools they need to thrive in an increasingly digital world. We envision a future where AI is not a source of anxiety or inequality, but a catalyst for personal and professional growth.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Through our educational programs, community-driven projects, and accessible resources, we aim to foster a new generation of innovators, thinkers, and leaders. We want to empower individuals to solve real-world problems, create new opportunities, and shape a more equitable and prosperous future for all.
              </p>
              <p>
                Our focus is on practical, hands-on learning that goes beyond theoretical concepts. We want to equip individuals with the skills to not only use AI, but to understand its implications and contribute to its ethical and responsible development.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center text-[#1f639e] mb-8">Our Approach</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <BrainCircuit size={48} className="text-[#1f639e] mb-4" />
                <h4 className="text-xl font-semibold mb-2">Education</h4>
                <p className="text-gray-600">Providing accessible and hands-on AI education for all skill levels.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users size={48} className="text-[#1f639e] mb-4" />
                <h4 className="text-xl font-semibold mb-2">Community</h4>
                <p className="text-gray-600">Building a supportive and collaborative community of learners and innovators.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Rocket size={48} className="text-[#1f639e] mb-4" />
                <h4 className="text-xl font-semibold mb-2">Innovation</h4>
                <p className="text-gray-600">Empowering individuals to create innovative solutions to real-world problems.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck size={48} className="text-[#1f639e] mb-4" />
                <h4 className="text-xl font-semibold mb-2">Ethical Development</h4>
                <p className="text-gray-600">Promoting the responsible and ethical use of artificial intelligence.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
