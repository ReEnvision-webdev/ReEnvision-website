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
    setEditingEvent(event);
    setTitle(event.eventTitle || "");
    setContent(event.eventDesc || "");

    try {
      const date = new Date(event.eventDate);
      const formattedDate = !isNaN(date.getTime())
        ? date.toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);
      setEventDate(formattedDate);
    } catch {
      setEventDate(new Date().toISOString().slice(0, 16));
    }

    setImagePreview(event.imageUrl || null);
    setImageUrl(event.imageUrl || null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(editingEvent ? editingEvent.imageUrl : null);
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
      return;
    }

    if (file.size > 400 * 1024) {
      toast.error("File too large (max 400KB).");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/events/image", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const json: StandardResponse = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(
          json?.error || `Upload failed with status ${res.status}`,
        );
      }
      const uploadedUrl = (json.data as Record<string, unknown> | null)?.[
        "url"
      ] as string | undefined;
      if (!uploadedUrl) {
        throw new Error("Upload response missing image URL.");
      }
      return uploadedUrl;
    } finally {
      setUploading(false);
    }
  };

  const saveEvent = async () => {
    if (!title.trim() || !content.trim() || !eventDate) {
      toast.error("All fields are required");
      return;
    }

    try {
      let finalImageUrl = editingEvent?.imageUrl ?? null;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const isoDate = new Date(eventDate).toISOString();
      const payload = {
        event_title: title.trim(),
        event_desc: content.trim(),
        event_date: isoDate,
        image_url: finalImageUrl,
      };

      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          editingEvent
            ? payload
            : { ...payload, user_id: (await getSession())?.user.id },
        ),
      });

      const result: StandardResponse = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to save event");
      }

      await fetchEvents();
      setIsDialogOpen(false);
      resetForm();
      toast.success(
        `Event ${editingEvent ? "updated" : "created"} successfully`,
      );
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

      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          setIsDialogOpen(open);
          if (!open) {
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveEvent}
                disabled={uploading}
                className="bg-[#1f639e] hover:bg-[#164a73]"
              >
                {uploading ? "Saving..." : "Save Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
