
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Calendar, ImageIcon } from "lucide-react"
import { toast } from "sonner"

type Event = {
  id: string
  event_title: string
  event_desc: string
  event_date: string
  image_url: string | null
  created_at: string
  updated_at: string
  created_by: string
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state - ensure all have initial empty string values
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const result = await response.json()
      setEvents(result.data)
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }

  const createBlankEvent = async () => {
    try {
      const eventData = {
        user_id: null,
        event_title: "New Event",
        event_desc: "Event description",
        event_date: new Date().toISOString(),
        image_url: null,
      }
      
      console.log("Sending event data:", JSON.stringify(eventData))
      
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", [...response.headers.entries()])

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to create event:", response.status, errorText)
        throw new Error(`Failed to create event: ${response.status} ${errorText}`)
      }
      
      const result = await response.json()
      console.log("Created event result:", result)

      // Open the edit dialog for the newly created event
      openEditDialog(result.data)
      
      // Fetch all events to update the list
      await fetchEvents()
      toast.success("Blank event created successfully")
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error(`Failed to create event: ${error.message}`)
    }
  }

  const openEditDialog = (event: Event) => {
    console.log("Opening edit dialog for event:", event);
    setEditingEvent(event)
    setTitle(event.event_title || "")
    setContent(event.event_desc || "")
    
    // Handle date parsing more robustly
    try {
      const date = new Date(event.event_date)
      if (!isNaN(date.getTime())) {
        // datetime-local input expects YYYY-MM-DDTHH:mm format
        const formattedDate = date.toISOString().slice(0, 16)
        console.log("Setting event date to:", formattedDate);
        setEventDate(formattedDate)
      } else {
        // Fallback to current date if parsing fails
        const formattedDate = new Date().toISOString().slice(0, 16)
        console.log("Setting fallback event date to:", formattedDate);
        setEventDate(formattedDate)
      }
    } catch (error) {
      // Fallback to current date if parsing fails
      const formattedDate = new Date().toISOString().slice(0, 16)
      console.log("Setting error fallback event date to:", formattedDate);
      setEventDate(formattedDate)
    }
    
    setImagePreview(event.image_url || null)
    setImageFile(null)
    setIsDialogOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
      toast.error("Please select a JPEG image")
      return
    }

    // Validate file size (400KB = 400 * 1024 bytes)
    if (file.size > 400 * 1024) {
      toast.error("Image must be 400KB or smaller")
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Failed to upload image")
    const data = await response.json()
    return data.url
  }

  const saveEvent = async () => {
    console.log("Save event clicked");
    console.log("Editing event:", editingEvent);
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Event date:", eventDate);
    
    if (!editingEvent) {
      console.log("No editing event, returning");
      return;
    }

    // Validate required fields
    if (!title.trim() || !content.trim() || !eventDate) {
      console.log("Validation failed - Title:", title.trim(), "Content:", content.trim(), "EventDate:", eventDate);
      toast.error("All fields are required");
      return;
    }

    try {
      console.log("Starting save process");
      let imageUrl = editingEvent.image_url;

      // Upload new image if selected
      if (imageFile) {
        console.log("Uploading image");
        imageUrl = await uploadImage(imageFile);
      }

      const eventData = {
        event_title: title.trim() || "Untitled Event",
        event_desc: content.trim() || "No description provided",
        event_date: new Date(eventDate).toISOString(),
        image_url: imageUrl,
      }

      console.log("Updating event with data:", JSON.stringify(eventData));

      const response = await fetch(`/api/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      console.log("Update response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update event:", response.status, errorText);
        throw new Error(`Failed to update event: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Update result:", result);
      
      // Check if we have data in the response
      if (!result || !result.data) {
        throw new Error("Invalid response from server");
      }
      
      const updatedEvent = result.data;

      // Update local state
      setEvents(events.map((event) => (event.id === editingEvent.id ? updatedEvent : event)));

      setIsDialogOpen(false);
      resetForm();
      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(`Failed to save event: ${error.message}`);
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete event")
      
      // Parse the response to ensure it's successful
      const result = await response.json()
      
      setEvents(events.filter((event) => event.id !== eventId))
      toast.success("Event deleted successfully")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setEventDate("")
    setImageFile(null)
    setImagePreview(null)
    setEditingEvent(null)
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading events...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button onClick={createBlankEvent} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Event
        </Button>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{event.event_title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-4 h-4" />
                  {(() => {
                    try {
                      return new Date(event.event_date).toLocaleDateString()
                    } catch (error) {
                      return "Invalid Date"
                    }
                  })()}
                </p>
                {event.image_url && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <ImageIcon className="w-4 h-4" />
                    Image attached
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                  <Edit className="w-4 h-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{event.event_title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteEvent(event.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}

        {events.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No events found. Create your first event!</p>
          </Card>
        )}
      </div>
      
      {/* Single Dialog component for editing events */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          // Reset form when dialog is closed
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "New Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>

            <div>
              <Label htmlFor="date">Event Date *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="image">Image (JPEG, max 400KB)</Label>
              <Input id="image" type="file" accept=".jpg,.jpeg" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="content">Description (Markdown) *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Event description in markdown format"
                rows={8}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveEvent}>Save Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

