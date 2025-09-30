import CourseDetail from "@/components/courses/course-detail";
import { StandardResponse } from "@/lib/types";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// This Server Component fetches a single course and handles errors correctly.

// The course data structure from the API
interface ApiCourse {
  id: string;
  course_name: string;
  course_description: string;
  course_price: string;
  courses_image: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// The data structure expected by the CourseDetail component
export interface MappedCourse {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Reusable error component for non-404 errors.
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Could Not Load Course
        </h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}

// The page is an async server function that fetches its own data.
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  try {
    // Construct the absolute URL for server-side fetching.
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const apiUrl = `${baseUrl}/api/courses/${id}`;

    const response = await fetch(apiUrl, { cache: "no-store" });

    // If the API returns a 404, trigger the Not Found page.
    if (response.status === 404) {
      notFound();
      return;
    }

    const result: StandardResponse = await response.json();

    // For other server errors, display an error on the page.
    if (!response.ok || !result.success) {
      return (
        <ErrorDisplay
          message={
            result.error ||
            "The course could not be found due to a server error."
          }
        />
      );
    }

    if (!result.data || Array.isArray(result.data)) {
      return (
        <ErrorDisplay
          message={"The course data is missing or in an incorrect format."}
        />
      );
    }

    const apiCourse = result.data as unknown as ApiCourse;

    // Map the API data to a more friendly structure for the detail component.
    const mappedCourse: MappedCourse = {
      id: apiCourse.id,
      title: apiCourse.course_name,
      description: apiCourse.course_description,
      price: apiCourse.course_price,
      imageUrl: apiCourse.courses_image,
      createdAt: apiCourse.createdAt,
      updatedAt: apiCourse.updatedAt,
      createdBy: apiCourse.createdBy,
    };

    // Render the CourseDetail component with the fetched data.
    return <CourseDetail course={mappedCourse} />;
  } catch (err: unknown) {
    console.error("Catastrophic error in CourseDetailPage:", err);
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected internal error occurred.";
    return <ErrorDisplay message={message} />;
  }
}
