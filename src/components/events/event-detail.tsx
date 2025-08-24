
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Event } from "@/lib/supabase"
import MarkdownRenderer from "./markdown-renderer"

interface EventDetailProps {
  event: Event
}

export default function EventDetail({ event }: EventDetailProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
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

  const isUpcoming = new Date(event.event_date) > new Date()
  const isPast = new Date(event.event_date) < new Date()

  return (
    <div className="container mx-auto p-6 max-w-4xl pt-30">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-[#1f639e] hover:text-[#164a73]">
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Button>

      {/* Event Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold leading-tight text-[#1f639e]">{event.title}</h1>
          <div className="flex gap-2">
            {isUpcoming && (
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                Upcoming
              </Badge>
            )}
            {isPast && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                Past Event
              </Badge>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-wrap gap-6 text-lg text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{formatTime(event.event_date)}</span>
          </div>
        </div>
      </div>

      {/* Event Image */}
      {event.image_url && (
        <div className="mb-8">
          <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
            <img src={event.image_url || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Event Description */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#1f639e]">About This Event</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <MarkdownRenderer content={event.content} />
          </div>
        </CardContent>
      </Card>

      {/* Event Meta Information */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(event.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date(event.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

