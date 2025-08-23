
import EventsSearch from "@/components/events/events-search"

export default function EventsSearchPage() {
  return (
    <div className="container mx-auto p-6 pt-35">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-[#1f639e]">Search Events</h1>
        <p className="text-muted-foreground text-center">Find events by title, description, or date</p>
      </div>
      <EventsSearch />
    </div>
  )
}
