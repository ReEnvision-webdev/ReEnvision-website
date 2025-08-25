"use client";
import { useEffect } from "react";
import EventsSearch from "@/components/events/events-search";
import AOS from "aos";
import "aos/dist/aos.css";

export default function EventsSearchPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);
  return (
    <div className="container mx-auto p-6 pt-35" data-aos="fade-up">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold text-center mb-2 text-[#1f639e]"
          data-aos="fade-up"
        >
          Search Events
        </h1>
        <p className="text-muted-foreground text-center" data-aos="fade-up">
          Find events by title, description, or date
        </p>
      </div>
      <EventsSearch />
    </div>
  );
}
