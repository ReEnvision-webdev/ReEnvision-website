"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import EventCalendar from "./event-calendar";

type Event = {
  id: string;
  title: string;
  content: string;
  event_date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export default function EventsOverview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [latestEvents, setLatestEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const result = await response.json();
      // Map database fields to frontend expected fields
      const allEvents = (result.data || []).map(
        (event: {
          id: string;
          eventTitle: string;
          eventDesc: string;
          eventDate: string;
          imageUrl: string | null;
          createdAt: string;
          updatedAt: string;
          createdBy: string;
        }) => ({
          id: event.id,
          title: event.eventTitle,
          content: event.eventDesc,
          event_date: event.eventDate,
          image_url: event.imageUrl,
          created_at: event.createdAt,
          updated_at: event.updatedAt,
          user_id: event.createdBy,
        }),
      );

      // Sort events by date for calendar and by created_at for latest
      const sortedByDate = [...allEvents].sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
      );
      const sortedByCreated = [...allEvents].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setEvents(sortedByDate);
      setLatestEvents(sortedByCreated.slice(0, 6));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId: string) => {
    // Ensure we have a valid event ID before navigating
    if (eventId && typeof eventId === "string" && eventId.length > 0) {
      router.push(`/events/${eventId}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-[#1f639e]">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12" data-aos="fade-up">
      {/* Calendar Section */}
      <section data-aos="fade-up">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#1f639e]">
            Event Calendar
          </h2>
          <p className="text-muted-foreground">
            View all upcoming events in calendar format
          </p>
        </div>
        <EventCalendar events={events} onEventClick={handleEventClick} />
      </section>

      {/* Latest Events Section */}
      <section data-aos="fade-up">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#1f639e]">
            Latest Events
          </h2>
          <p className="text-muted-foreground">
            Discover our most recently added events
          </p>
        </div>

        {latestEvents.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No events available at the moment.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestEvents.map(event => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                onClick={() => handleEventClick(event.id)}
                data-aos="fade-up"
                data-aos-delay={100 + latestEvents.indexOf(event) * 100} // Add delay based on index
              >
                {event.image_url && (
                  <div className="aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-lg text-[#1f639e]">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.event_date)}</span>
                    </div>
                    {new Date(event.event_date) > new Date() && (
                      <Badge
                        variant="secondary"
                        className="w-fit text-[#1f639e]"
                      >
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
