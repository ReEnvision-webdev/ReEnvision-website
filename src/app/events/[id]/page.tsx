import EventDetail from "@/components/events/event-detail";
import { StandardResponse } from "@/lib/types";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// This is the correct Server Component implementation that handles all error cases as requested.

interface ApiEvent {
  id: string;
  eventTitle: string;
  eventDesc: string;
  eventDate: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface MappedEvent {
  id: string;
  eventTitle: string;
  eventDesc: string;
  eventDate: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// A reusable error component, rendered on the server for non-404 errors.
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Could Not Load Event
        </h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // If there's no ID in the path, it's a 404.
  if (!id) {
    notFound();
  }

  try {
    // FIX: This correctly creates the absolute URL for server-side fetching.
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const apiUrl = `${baseUrl}/api/events/${id}`;

    const response = await fetch(apiUrl, { cache: "no-store" });

    // CORRECT: As you instructed, if the API returns a 404, use the notFound() function.
    if (response.status === 404) {
      notFound();
      return; // Eslint requires a return after notFound()
    }

    const result: StandardResponse = await response.json();

    // CORRECT: For other errors (e.g., 500), display the error on the page.
    if (!response.ok || !result.success) {
      return (
        <ErrorDisplay
          message={
            result.error ||
            "The event could not be found due to a server error."
          }
        />
      );
    }

    const apiEvent: ApiEvent = result.data;

    const mappedEvent: MappedEvent = {
      id: apiEvent.id,
      eventTitle: apiEvent.eventTitle,
      eventDesc: apiEvent.eventDesc,
      eventDate: apiEvent.eventDate,
      imageUrl: apiEvent.imageUrl,
      createdAt: apiEvent.createdAt,
      updatedAt: apiEvent.updatedAt,
      createdBy: apiEvent.createdBy,
    };

    return <EventDetail event={mappedEvent} />;
  } catch (err: unknown) {
    console.error("Catastrophic error in EventDetailPage:", err);
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected internal error occurred.";
    // CORRECT: For catastrophic failures (like the original 'fetch failed'), show the error on the page.
    return <ErrorDisplay message={message} />;
  }
}
