
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"

type Event = {
  id: number
  title: string
  content: string
  event_date: string
  image_url: string | null
  created_at: string
  updated_at: string
  user_id: string
}

const EVENTS_PER_PAGE = 6

export default function EventsSearch() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const router = useRouter()
  const searchParams = useSearchParams()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    setSearchQuery(query)
    setCurrentPage(page)
  }, [searchParams])

  // Search events when query or page changes
  useEffect(() => {
    searchEvents(debouncedSearchQuery, currentPage)
  }, [debouncedSearchQuery, currentPage])

  const searchEvents = async (query: string, page: number) => {
    setLoading(true)
    try {
      const response = await fetch("/api/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const result = await response.json()
      // Map database fields to frontend expected fields
      let allEvents = (result.data || []).map((event: any) => ({
        id: event.id,
        title: event.eventTitle,
        content: event.eventDesc,
        event_date: event.eventDate,
        image_url: event.imageUrl,
        created_at: event.createdAt,
        updated_at: event.updatedAt,
        user_id: event.createdBy,
      }))

      // Apply search filter if query exists
      if (query.trim()) {
        const searchTerm = query.toLowerCase()
        allEvents = allEvents.filter(
          (event: Event) =>
            event.title.toLowerCase().includes(searchTerm) || event.content.toLowerCase().includes(searchTerm),
        )
      }

      // Sort by event date descending
      allEvents.sort((a: Event, b: Event) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

      // Apply pagination
      const totalCount = allEvents.length
      const from = (page - 1) * EVENTS_PER_PAGE
      const to = from + EVENTS_PER_PAGE
      const paginatedEvents = allEvents.slice(from, to)

      setEvents(paginatedEvents)
      setTotalEvents(totalCount)
      setTotalPages(Math.ceil(totalCount / EVENTS_PER_PAGE))

      // Update URL
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      if (page > 1) params.set("page", page.toString())

      const newUrl = params.toString() ? `/events/search?${params.toString()}` : "/events/search"
      window.history.replaceState({}, "", newUrl)
    } catch (error) {
      console.error("Error searching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>,
      )
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {startPage > 1 && (
          <>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)}>
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {loading ? (
            "Searching..."
          ) : (
            <>
              {totalEvents} event{totalEvents !== 1 ? "s" : ""} found
              {searchQuery.trim() && ` for "${searchQuery.trim()}"`}
            </>
          )}
        </p>
        {totalPages > 1 && (
          <p className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-[#1f639e]">Loading events...</div>
        </div>
      ) : events.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery.trim() ? `No events found matching "${searchQuery.trim()}"` : "No events available."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              onClick={() => handleEventClick(event.id)}
            >
              {event.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.image_url || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg text-[#1f639e]">{event.title}</CardTitle>
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
                    <Badge variant="secondary" className="w-fit text-[#1f639e]">
                      Upcoming
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  )
}

