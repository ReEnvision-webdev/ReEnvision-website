"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CourseManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCoursePrice("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      resetForm();
      return;
    }

    // Validate file type (JPEG only)
    if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
      toast.error("Only JPEG files are allowed.");
      e.target.value = ""; // Clear the file input
      return;
    }

    // Validate file size (400KB max)
    if (file.size > 400 * 1024) {
      toast.error("File size must be less than 400KB.");
      e.target.value = ""; // Clear the file input
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCourse = async () => {
    if (!courseName || !courseDescription || !coursePrice || !imageFile) {
      toast.error("All fields, including the image, are required.");
      return;
    }

    setUploading(true);
    let imageUrl = "";

    try {
      // Step 1: Upload the image
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);
      imageFormData.append("uploadType", "course"); // Specify the upload type for the backend

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: imageFormData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || "Failed to upload image.");
      }

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url; // Assumes the backend returns { url: "..." }

      if (!imageUrl) {
        throw new Error("Image URL was not returned from the upload.");
      }

      // Step 2: Create the course with the returned image URL
      const courseRes = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: courseName,
          course_description: courseDescription,
          course_price: coursePrice,
          courses_image: imageUrl,
        }),
      });

      if (!courseRes.ok) {
        const errorData = await courseRes.json();
        throw new Error(errorData.error || "Failed to create course.");
      }

      toast.success("Course created successfully!");
      setIsDialogOpen(false);
      resetForm();
      // Optionally, you could trigger a refetch of courses here if displaying them
    } catch (error) {
      const msg = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Error creating course:", msg);
      toast.error(`Error: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1f639e]">Course Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-[#1f639e] hover:bg-[#164a73]">
              <Plus className="w-4 h-4" />
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add a New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g., Introduction to Web Development"
                />
              </div>
              <div>
                <Label htmlFor="coursePrice">Price *</Label>
                <Input
                  id="coursePrice"
                  type="number"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  placeholder="e.g., 99.99"
                />
              </div>
              <div>
                <Label htmlFor="image">Course Image (JPEG, Max 400KB) *</Label>
                <Input
                  id="image"
                  type="file"
                  accept=".jpg,.jpeg"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="courseDescription">Description *</Label>
                <Textarea
                  id="courseDescription"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Describe the course..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCourse}
                  disabled={uploading}
                  className="bg-[#1f639e] hover:bg-[#164a73]"
                >
                  {uploading ? "Saving..." : "Save Course"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
       {/* A placeholder for where the list of courses would go */}
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
            Course listing will be displayed here in the future.
        </p>
      </Card>
    </div>
  );
}