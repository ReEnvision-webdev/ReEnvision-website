import EventsOverview from "@/components/events/events-overview"

export default function EventsPage() {
  return (
    <div className="container mx-auto p-6 py-25">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-[#1f639e]">Events</h1>
        <p className="text-muted-foreground text-center">Discover upcoming events and activities</p>
      </div>
      <EventsOverview />
    </div>
  )
}
