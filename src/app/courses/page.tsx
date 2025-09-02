"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Video, Globe, Zap, Award, Star, Clock } from "lucide-react";
import Link from "next/link";
import { getAllCourses, type Course } from "@/lib/courses";
import AOS from "aos";
import "aos/dist/aos.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
    });
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const coursesData = await getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <section className="bg-[#F0F8FF] pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1d588a] mb-4"
            data-aos="fade-up"
          >
            Explore Our Courses & Boot Camps
          </h1>
          <p
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Learn tech skills live on Zoom with expert mentors and volunteers.
          </p>

          <div
            className="flex flex-col md:flex-row justify-center items-center gap-8 text-base"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              <Video className="h-5 w-5 text-[#1d588a]" />
              <span className="font-semibold text-[#1d588a]">Live on Zoom</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              <Users className="h-5 w-5 text-[#1d588a]" />
              <span className="font-semibold text-[#1d588a]">Expert Mentors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              <BookOpen className="h-5 w-5 text-[#1d588a]" />
              <span className="font-semibold text-[#1d588a]">Hands-on Learning</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-[#1d588a] mb-4">Why Join?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center group" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-br from-[#1d588a]/20 to-[#1d588a]/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-6 w-6 text-[#1d588a]" />
              </div>
              <h3 className="text-base font-semibold text-[#1d588a]">Accessible Learning</h3>
            </div>

            <div className="text-center group" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-gradient-to-br from-[#1d588a]/20 to-[#1d588a]/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-6 w-6 text-[#1d588a]" />
              </div>
              <h3 className="text-base font-semibold text-[#1d588a]">Real Mentorship</h3>
            </div>

            <div className="text-center group" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-gradient-to-br from-[#1d588a]/20 to-[#1d588a]/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-[#1d588a]" />
              </div>
              <h3 className="text-base font-semibold text-[#1d588a]">Practical Skills</h3>
            </div>

            <div className="text-center group" data-aos="fade-up" data-aos-delay="400">
              <div className="bg-gradient-to-br from-[#1d588a]/20 to-[#1d588a]/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-[#1d588a]" />
              </div>
              <h3 className="text-base font-semibold text-[#1d588a]">Community Impact</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-br from-[#1d588a]/5 to-[#1d588a]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-[#1d588a] mb-4">Available Courses & Boot Camps</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Interactive, mentor-led courses designed to build practical skills and empower communities.
            </p>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card
                key={course.id}
                className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 ease-out hover:scale-[1.02] border-0 h-full flex flex-col"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className="bg-[#1d588a]/10 text-[#1d588a] hover:bg-[#1d588a]/20 text-xs px-2 py-1 transition-all duration-300 ease-out">
                      <Video className="h-3 w-3 mr-1" />
                      Live on Zoom
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                      <span>({course.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-[#1d588a] mb-2 line-clamp-2">{course.title}</CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{course.description}</p>
                </CardHeader>

                <CardContent className="space-y-4 flex-grow">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#1d588a]" />
                      <span className="text-sm text-[#1d588a] font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#1d588a]" />
                      <span className="text-sm text-[#1d588a] font-medium">
                        {course.students.toLocaleString()} students
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#1d588a]" />
                      <span className="text-sm text-[#1d588a] font-medium">{course.level}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-[#1d588a]">{course.price}</div>
                      <div className="text-sm text-gray-500 line-through">{course.originalPrice}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {course.schedule.format} • {course.schedule.commitment}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <div className="flex gap-3 w-full">
                    <Link href={`/courses/${course.id}`} className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-sm py-2 rounded-lg hover:scale-[1.02] transition-all duration-300 ease-out bg-transparent border-[#1d588a] text-[#1d588a] hover:bg-[#1d588a] hover:text-white"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/payment?course=${course.id}`} className="flex-1">
                      <Button
                        size="sm"
                        className="w-full text-sm py-2 rounded-lg hover:scale-[1.02] transition-all duration-300 ease-out bg-[#1d588a] hover:bg-[#1d588a]/90"
                      >
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f0f8ff] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#1d588a]" data-aos="fade-up">Transform Your Future Today</h2>
          <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed text-gray-600" data-aos="fade-up" data-aos-delay="200">
            Join thousands of successful graduates who have launched their tech careers with ReEnvision. Start your
            journey today and unlock endless opportunities in technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white text-[#1d588a] hover:bg-gray-100"
            >
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}