"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Video, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import MarkdownRenderer from "@/components/markdown-renderer";
import { createPayPalPayment } from "@/app/actions/create-paypal-payment";

// Define the Course type based on your database schema
interface Course {
  id: string;
  course_name: string;
  courses_image: string | null;
  course_description: string;
  course_price: string; // Drizzle returns numeric as string
}

// Define the type for PayPal links
interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/courses", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const result = await response.json();
        setCourses(result.data || []); // Ensure data is an array
      } catch (error) {
        console.error("Failed to load courses:", error);
        setCourses([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (course: Course) => {
    try {
      const payment = await createPayPalPayment(
        course.course_name,
        course.course_price,
        "USD",
        `${window.location.origin}/payment/success`,
        `${window.location.origin}/courses`
      );
      const approvalLink = payment.links.find(
        (link: PayPalLink) => link.rel === "approve"
      );
      if (approvalLink) {
        window.location.href = approvalLink.href;
      } else {
        console.error("Could not find PayPal approval link.");
        // Handle the error, e.g., show a message to the user
      }
    } catch (error) {
      console.error("Failed to create PayPal payment:", error);
      // Handle the error, e.g., show a message to the user
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
            Learn tech skills live with expert mentors and volunteers. Find the
            perfect course to start your journey in technology.
          </p>
          <div
            className="flex flex-col md:flex-row justify-center items-center gap-8 text-base"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
              <Video className="h-5 w-5 text-[#1d588a]" />
              <span className="font-semibold text-[#1d588a]">Live on Zoom</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
              <Users className="h-5 w-5 text-[#1d588a]" />
              <span className="font-semibold text-[#1d588a]">
                Expert Mentors
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
              <BookOpen className="h-5 w-5 text-[#1d588a]" />
              <span className="font-semibold text-[#1d588a]">
                Hands-on Learning
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-br from-[#1d588a]/5 to-[#1d588a]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-[#1d588a] mb-4">
              Available Courses & Boot Camps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Interactive, mentor-led courses designed to build technical
              skills.
            </p>
          </div>

          {loading ? (
            <div className="text-center col-span-full py-12">
              <p className="text-lg text-gray-500">Loading courses...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Card
                  key={course.id}
                  className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 ease-out hover:scale-[1.02] border-0 h-full flex flex-col overflow-hidden rounded-lg"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={course.courses_image || "/placeholder.svg"}
                      alt={course.course_name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-[#1d588a] mb-2 line-clamp-2 h-14">
                      {course.course_name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow text-sm text-gray-600 leading-relaxed line-clamp-4 h-20 overflow-hidden">
                    <MarkdownRenderer content={course.course_description} />
                  </CardContent>

                  <CardFooter className="pt-4 flex flex-col items-start bg-slate-50 mt-auto">
                    <div className="text-2xl font-bold text-[#1d588a] mb-4">
                      {`$${course.course_price}`}
                    </div>
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
                      <Button
                        size="sm"
                        className="flex-1 w-full text-sm py-2 rounded-lg hover:scale-[1.02] transition-all duration-300 ease-out bg-[#1d588a] hover:bg-[#1d588a]/90"
                        onClick={() => handleEnroll(course)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Enroll Now
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center col-span-full py-12">
              <p className="text-lg text-gray-500">
                No courses are available at the moment. Please check back later!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
