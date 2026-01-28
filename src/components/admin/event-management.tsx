"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "../ui/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Calendar, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { StandardResponse } from "@/lib/types";

type Event = {
  id: string;
  eventTitle: string;
  eventDesc: string;
  eventDate: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
};

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state - ensure all have initial empty string values
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const result = await response.json();
      console.log(result);
      setEvents(result.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setTitle("");
    setContent("");
    const formattedDate = new Date().toISOString().slice(0, 16);
    setEventDate(formattedDate);
    setImageFile(null);
    setImagePreview(null);
    setImageUrl(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    console.log("Opening edit dialog for event:", event);
    setEditingEvent(event);
    setTitle(event.eventTitle || "");
    setContent(event.eventDesc || "");

    // Handle date parsing more robustly
    try {
      const date = new Date(event.eventDate);
      if (!isNaN(date.getTime())) {
        // datetime-local input expects YYYY-MM-DDTHH:mm format
        const formattedDate = date.toISOString().slice(0, 16);
        console.log("Setting event date to:", formattedDate);
        setEventDate(formattedDate);
      } else {
        // Fallback to current date if parsing fails
        const formattedDate = new Date().toISOString().slice(0, 16);
        console.log("Setting fallback event date to:", formattedDate);
        setEventDate(formattedDate);
      }
    } catch {
      // Fallback to current date if parsing fails
      const formattedDate = new Date().toISOString().slice(0, 16);
      console.log("Setting error fallback event date to:", formattedDate);
      setEventDate(formattedDate);
    }

    setImagePreview(event.imageUrl || null);
    setImageUrl(event.imageUrl || null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    const allowedTypes = new Set([
      "image/jpeg",
      "image/jpg",
      "image/pjpeg",
      "image/png",
      "image/x-png",
      "image/webp",
    ]);

    if (!allowedTypes.has(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP images are allowed.");
      e.target.value = "";
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (file.size > 400 * 1024) {
      toast.error("File too large (max 400KB).");
      e.target.value = "";
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageFile(file);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch {
      setImagePreview(null);
    }
  };

  const createEvent = async ({
    title,
    content,
    eventDate,
  }: {
    title: string;
    content: string;
    eventDate: string;
  }): Promise<StandardResponse> => {
    const isoDate = new Date(eventDate).toISOString();
    let finalImageUrl: string | null = imageUrl ?? null;

    if (imageFile) {
      setUploading(true);

      try {
        const form = new FormData();

        form.append("file", imageFile);

        const res = await fetch("/api/events/image", {
          method: "POST",
          body: form,
          credentials: "include",
        });

        const json: StandardResponse = await res.json();

        if (!res.ok || !json?.success) {
          throw new Error(
            json?.error ||
              json?.message ||
              `Upload failed with status ${res.status}`,
          );
        }

        const uploadedUrl = (json.data as Record<string, unknown> | null)?.[
          "url"
        ] as string | undefined;

        if (!uploadedUrl) {
          throw new Error("Upload response missing image URL.");
        }

        finalImageUrl = uploadedUrl;
        setImageUrl(uploadedUrl);
      } finally {
        setUploading(false);
      }
    }

    const session = await getSession();
    if (!session?.user || !('id' in session.user) || !session.user.id) {
      throw new Error("User session not found");
    }
    
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        event_title: title.trim(),
        event_desc: content.trim(),
        event_date: isoDate,
        image_url: finalImageUrl,
        user_id: (session.user as { id: string }).id,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Create failed: ${res.status} ${text}`);
    }

    return res.json();
  };

  const updateEvent = async ({
    id,
    title,
    content,
    eventDate,
  }: {
    id: string;
    title: string;
    content: string;
    eventDate: string;
  }): Promise<StandardResponse> => {
    const isoDate = new Date(eventDate).toISOString();

    const payload = {
      event_title: title.trim(),
      event_desc: content.trim(),
      event_date: isoDate,
      image_url: imageUrl,
    };

    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Update failed: ${res.status} ${text}`);
    }

    return res.json();
  };

  const saveEvent = async () => {
    if (!title.trim() || !content.trim() || !eventDate) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editingEvent) {
        const result = await updateEvent({
          id: editingEvent.id,
          title,
          content,
          eventDate,
        });
        if (!result?.data) throw new Error("Invalid response from server");

        const updated = result.data as Event;
        setEvents(events.map(e => (e.id === editingEvent.id ? updated : e)));
        setIsDialogOpen(false);
        resetForm();
        toast.success("Event updated successfully");
      } else {
        const result = await createEvent({
          title,
          content,
          eventDate,
        });
        if (!result?.data) throw new Error("Invalid response from server");

        await fetchEvents();
        setIsDialogOpen(false);
        resetForm();
        toast.success("Event created successfully");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Error saving event:", err);
      toast.error(`Failed to save event: ${msg}`);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      setEvents(events.filter(event => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEventDate("");
    setImageFile(null);
    setImagePreview(null);
    setImageUrl(null);
    setEditingEvent(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8 text-[#1f639e]">
        Loading events...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1f639e] pr-5">
          Event Management
        </h2>
        <Button
          onClick={openCreateDialog}
          className="flex items-center gap-2 bg-[#1f639e] hover:bg-[#164a73]"
        >
          <Plus className="w-4 h-4" />
          Add New Event
        </Button>
      </div>

      <div className="grid gap-4">
        {events.map(event => (
          <Card key={event.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#1f639e]">
                  {event.eventTitle}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-4 h-4" />
                  {(() => {
                    try {
                      return new Date(event.eventDate).toLocaleDateString();
                    } catch {
                      return "Invalid Date";
                    }
                  })()}
                </p>
                {event.imageUrl && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <ImageIcon className="w-4 h-4" />
                    Image attached
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-[#1f639e] hover:bg-[#164a73]"
                  onClick={() => openEditDialog(event)}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-[#1f639e] hover:bg-[#164a73]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{event.eventTitle}
                        &quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteEvent(event.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}

        {events.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No events found. Create your first event!
            </p>
          </Card>
        )}
      </div>

      {/* Single Dialog component for editing events */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          setIsDialogOpen(open);
          if (!open) {
            // Reset form when dialog is closed
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "New Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>

            <div>
              <Label htmlFor="date">Event Date *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="image">Image (Max 400KB)</Label>
              <Input
                id="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    width={128}
                    height={128}
                    // className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="content">Description *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Event description"
                rows={8}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="bg-[#1f639e] hover:bg-[#164a73]"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#1f639e] hover:bg-[#164a73]"
                onClick={saveEvent}
                disabled={uploading}
              >
                Save Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
