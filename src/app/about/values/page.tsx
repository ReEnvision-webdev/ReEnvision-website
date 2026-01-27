
import { Handshake, Lightbulb, Users, GraduationCap, Heart, Rocket } from 'lucide-react';

const values = [
  {
    icon: <Handshake size={48} className="text-[#1f639e] mb-4" />,
    title: 'Collaboration',
    description: 'We believe in the power of working together to achieve common goals. We foster a collaborative environment where everyone feels valued and empowered.',
  },
  {
    icon: <Lightbulb size={48} className="text-[#1f639e] mb-4" />,
    title: 'Innovation',
    description: 'We are committed to exploring new ideas and technologies to create innovative solutions that address real-world challenges.',
  },
  {
    icon: <Users size={48} className="text-[#1f639e] mb-4" />,
    title: 'Community',
    description: 'We strive to build a strong and inclusive community where individuals can connect, learn, and grow together.',
  },
  {
    icon: <GraduationCap size={48} className="text-[#1f639e] mb-4" />,
    title: 'Education',
    description: 'We are dedicated to providing accessible and high-quality education to empower individuals with the skills they need to succeed.',
  },
  {
    icon: <Heart size={48} className="text-[#1f639e] mb-4" />,
    title: 'Empathy',
    description: 'We approach our work with empathy and a deep understanding of the communities we serve.',
  },
  {
    icon: <Rocket size={48} className="text-[#1f639e] mb-4" />,
    title: 'Impact',
    description: 'We are focused on creating a lasting and positive impact on society through our work.',
  },
];

export default function ValuesPage() {
  return (
    <div className="flex flex-col min-h-screen items-center pt-[64px] bg-[#f0f8ff]">
      <div className="h-[50vh] flex flex-col items-center justify-center relative about-hero-img">
        <h1 className="text-3xl md:text-6xl font-bold mb-6 text-[#E0E0E0] mt-8 text-center z-1">
          Our Values
        </h1>
      </div>

      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-center text-lg text-gray-700 leading-relaxed mb-12">
            At ReEnvision, our values are the bedrock of our organization. They guide our decisions, shape our culture, and inspire us to continuously strive for excellence. We are committed to upholding these principles in everything we do, ensuring that our actions align with our mission to empower individuals through artificial intelligence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                {value.icon}
                <h3 className="text-2xl font-semibold text-[#1f639e] mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
