"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Tag } from "lucide-react";
import Image from "next/image";
import MarkdownRenderer from "@/components/markdown-renderer";
import { MappedCourse } from "@/app/courses/[id]/page";

interface CourseDetailProps {
  course: MappedCourse;
}

// This component renders the detailed view of a single course.
export default function CourseDetail({ course }: CourseDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Course Title and Image */}
      <section className="relative bg-gradient-to-b from-[#1d588a] to-[#1f639e] text-white py-24 md:py-32 text-center">
        <div className="absolute inset-0">
          {course.imageUrl && (
            <Image
              src={course.imageUrl}
              alt={course.title}
              layout="fill"
              objectFit="cover"
              className="opacity-20"
            />
          )}
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {course.title}
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto p-6 md:p-8 -mt-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Price and Enroll Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6 border-b">
              <div className="flex items-center text-3xl font-bold text-[#1d588a] mb-4 md:mb-0">
                <Tag className="w-6 h-6 mr-3 text-gray-400" />
                {`$${course.price}`}
              </div>
              <Button
                size="lg"
                className="w-full md:w-auto bg-[#1d588a] hover:bg-[#1f639e]"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Enroll Now
              </Button>
            </div>

            {/* Course Description */}
            <div className="prose prose-lg max-w-none">
              <MarkdownRenderer content={course.description} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
