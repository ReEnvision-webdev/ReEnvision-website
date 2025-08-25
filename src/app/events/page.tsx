"use client";
import { useEffect } from "react";
import EventsOverview from "@/components/events/events-overview";
import AOS from "aos";
import "aos/dist/aos.css";

export default function EventsPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);
  return (
    <div className="container mx-auto p-6 py-25" data-aos="fade-up">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold text-center mb-2 text-[#1f639e]"
          data-aos="fade-up"
        >
          Events
        </h1>
        <p
          className="text-muted-foreground text-center mb-8"
          data-aos="fade-up"
        >
          Discover upcoming events and activities
        </p>
      </div>
      <EventsOverview />
    </div>
  );
}
