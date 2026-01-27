
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";

const teams = {
  president: {
    name: 'Sharvin Goyal',
    role: 'President & Founder',
    description: 'Leading the vision and strategy of ReEnvision.',
    image: '/images/about/sharvin.jpg',
  },
  heads: [
    {
      name: 'Robert Pierson',
      role: 'Head of Operations',
      description: 'Ensuring smooth day-to-day functioning and logistics.',
      image: '/images/about/robert.jpg',
    },
    {
      name: 'Santiago Silva',
      role: 'Head of Development',
      description: 'Driving technical projects and team development.',
      image: '/images/about/santi.jpg',
    },
  ],
  leads: [
    {
      name: 'Elijah Muse-May',
      role: 'Web Development Lead',
      description: 'Building and maintaining our digital presence.',
      image: null,
    },
    {
      name: 'Abram Acevado',
      role: 'Social Media Manager',
      description: 'Turning our ideas into visuals for the world to see.',
      image: '/images/about/abram.jpg',
    },
    {
      name: 'Azaan Noman',
      role: 'Organizational Relations and Events Lead',
      description: 'Connecting with communities and partners.',
      image: '/images/about/azaan.jpg',
    },
    {
      name: 'Garret Smith',
      role: 'Finance Lead',
      description: 'Managing budgets and financial sustainability.',
      image: '/images/about/garret.jpg',
    },
    {
      name: 'Lily Zhang',
      role: 'Onboarding and Chapter Management Lead',
      description: 'Facilitating new member integration and chapter growth.',
      image: '/images/about/lily.jpg',
    }
  ]
}

export default function TeamsPage() {
  return (
    <div className="flex flex-col min-h-screen items-center pt-[64px] bg-[#f0f8ff]">
      <div className="h-[50vh] flex flex-col items-center justify-center relative about-hero-img">
        <h1 className="text-3xl md:text-6xl font-bold mb-6 text-[#E0E0E0] mt-8 text-center z-1">
          Our Teams
        </h1>
      </div>

      <div className="w-full max-w-6xl mx-auto p-8">
        <section id="teams" className="w-full py-8">
          <div className="container mx-auto px-4">
            <h2
              className="text-2xl md:text-3xl font-semibold mb-8 text-[#1f639e] text-center"
            >
              ReEnvision Officers & Team Leads
            </h2>
            {/* President */}
            <div
              className="flex justify-center items-center mx-auto px-4 py-6"
            >
              <Card className="flex flex-col gap-4 items-center p-4 w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="flex flex-col items-center p-0">
                  <Image
                    src={teams.president.image}
                    width={150}
                    height={150}
                    alt={teams.president.name}
                    className="rounded-full mb-3 border-2 border-[#1f639e]"
                  />
                  <h3 className="text-xl font-semibold text-[#1f639e]">
                    {teams.president.name}
                  </h3>
                  <p className="text-gray-600 text-center font-medium">
                    {teams.president.role}
                  </p>
                  <p className="text-gray-600 text-sm text-center mt-1 italic">
                    {teams.president.description}
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Heads */}
            <div
              className="flex flex-col md:flex-row justify-center items-center gap-8 mx-auto px-4 py-6"
            >
              {teams.heads.map((head, index) => (
                <Card key={index} className="flex flex-col gap-4 items-center p-4 w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="flex flex-col items-center p-0">
                    <Image
                      src={head.image}
                      width={120}
                      height={120}
                      alt={head.name}
                      className="rounded-full mb-3 border border-[#1f639e]"
                    />
                    <h3 className="text-lg font-semibold text-[#1f639e]">
                      {head.name}
                    </h3>
                    <p className="text-gray-600 text-center font-medium">
                      {head.role}
                    </p>
                    <p className="text-gray-600 text-sm text-center mt-1 italic">
                      {head.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Team Leads */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap xl:justify-center gap-6 items-stretch mx-auto px-4 py-6"
            >
              {teams.leads.map((lead, index) => (
                <Card key={index} className={`flex flex-col gap-4 items-center p-4 w-full ${Array.isArray(lead.image) ? 'xl:w-96' : 'xl:w-48'} xl:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300 ${Array.isArray(lead.image) ? 'sm:col-span-2' : ''}`}>
                  <CardContent className="flex flex-col items-center p-0">
                  {Array.isArray(lead.image) ? (
                    <div className="flex justify-center gap-4 mb-4">
                      {lead.image.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          width={112}
                          height={112}
                          alt={lead.name}
                          className="rounded-full border border-[#1f639e] flex-shrink-0"
                        />
                      ))}
                    </div>
                  ) : (
                    <Image
                      src={lead.image}
                      width={112}
                      height={112}
                      alt={lead.name}
                      className="rounded-full mb-3 border border-[#1f639e]"
                    />
                  )}
                    <h3 className="text-md font-semibold text-[#1f639e] text-center">
                      {lead.name}
                    </h3>
                    <p className="text-gray-600 text-center font-medium">
                      {lead.role}
                    </p>
                    <p className="text-gray-600 text-xs text-center mt-1 italic">
                      {lead.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
