"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { StandardResponse } from "@/lib/types";

type Chapter = {
  id: string;
  name: string;
  location: string;
  description: string;
  website: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ChapterManagement() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await fetch("/api/chapters");
      if (!response.ok) throw new Error("Failed to fetch chapters");
      const result = await response.json();
      console.log(result);
      setChapters(result.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      toast.error("Failed to fetch chapters");
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingChapter(null);
    setName("");
    setLocation("");
    setDescription("");
    setWebsite("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (chapter: Chapter) => {
    console.log("Opening edit dialog for chapter:", chapter);
    setEditingChapter(chapter);
    setName(chapter.name || "");
    setLocation(chapter.location || "");
    setDescription(chapter.description || "");
    setWebsite(chapter.website || "");
    setIsDialogOpen(true);
  };

  const createChapter = async ({
    name,
    location,
    description,
    website,
  }: {
    name: string;
    location: string;
    description: string;
    website: string;
  }): Promise<StandardResponse> => {
    const session = await getSession();
    if (!session?.user || !('id' in session.user) || !session.user.id) {
      throw new Error("User session not found");
    }

    const res = await fetch("/api/chapters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: name.trim(),
        location: location.trim(),
        description: description.trim(),
        website: website.trim() || null,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Create failed: ${res.status} ${text}`);
    }

    return res.json();
  };

  const updateChapter = async ({
    id,
    name,
    location,
    description,
    website,
  }: {
    id: string;
    name: string;
    location: string;
    description: string;
    website: string;
  }): Promise<StandardResponse> => {
    const payload = {
      name: name.trim(),
      location: location.trim(),
      description: description.trim(),
      website: website.trim() || null,
    };

    const res = await fetch(`/api/chapters/${id}`, {
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

  const saveChapter = async () => {
    if (!name.trim() || !location.trim() || !description.trim()) {
      toast.error("Name, location, and description are required");
      return;
    }

    try {
      if (editingChapter) {
        const result = await updateChapter({
          id: editingChapter.id,
          name,
          location,
          description,
          website,
        });
        if (!result?.data) throw new Error("Invalid response from server");

        const updated = result.data as Chapter;
        setChapters(chapters.map(c => (c.id === editingChapter.id ? updated : c)));
        setIsDialogOpen(false);
        resetForm();
        toast.success("Chapter updated successfully");
      } else {
        const result = await createChapter({
          name,
          location,
          description,
          website,
        });
        if (!result?.data) throw new Error("Invalid response from server");

        await fetchChapters();
        setIsDialogOpen(false);
        resetForm();
        toast.success("Chapter created successfully");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Error saving chapter:", err);
      toast.error(`Failed to save chapter: ${msg}`);
    }
  };

  const deleteChapter = async (chapterId: string) => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete chapter");

      setChapters(chapters.filter(chapter => chapter.id !== chapterId));
      toast.success("Chapter deleted successfully");
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("Failed to delete chapter");
    }
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setDescription("");
    setWebsite("");
    setEditingChapter(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8 text-[#1f639e]">
        Loading chapters...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1f639e] pr-5">
          Chapter Management
        </h2>
        <Button
          onClick={openCreateDialog}
          className="flex items-center gap-2 bg-[#1f639e] hover:bg-[#164a73]"
        >
          <Plus className="w-4 h-4" />
          Add New Chapter
        </Button>
      </div>

      <div className="grid gap-4">
        {chapters.map(chapter => (
          <Card key={chapter.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#1f639e]">
                  {chapter.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {chapter.location}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {chapter.description.substring(0, 100)}{chapter.description.length > 100 ? "..." : ""}
                </p>
                {chapter.website && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Website: <a href={chapter.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{chapter.website}</a>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-[#1f639e] hover:bg-[#164a73]"
                  onClick={() => openEditDialog(chapter)}
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
                      <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{chapter.name}
                        &quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteChapter(chapter.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}

        {chapters.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No chapters found. Create your first chapter!
            </p>
          </Card>
        )}
      </div>

      {/* Single Dialog component for editing chapters */}
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
              {editingChapter ? "Edit Chapter" : "New Chapter"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Chapter name"
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Chapter location"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="Chapter website (optional)"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Chapter description"
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
                onClick={saveChapter}
              >
                Save Chapter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}