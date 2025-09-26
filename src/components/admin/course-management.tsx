"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Course {
  id: string;
  course_name: string;
  course_description: string;
  course_price: string;
  courses_image: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  // Form state
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses.");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCoursePrice("");
    setImageFile(null);
    setImagePreview(null);
    setEditingCourse(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseName(course.course_name);
    setCourseDescription(course.course_description);
    setCoursePrice(course.course_price);
    setImagePreview(course.courses_image);
    setIsDialogOpen(true);
  };

  const confirmDelete = (courseId: string) => {
    setCourseToDelete(courseId);
  };

  const executeDelete = async (courseId: string | null) => {
    if (courseId === null) return;
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete course.");
      }

      toast.success("Course deleted successfully!");
      fetchCourses(); // Refresh the list
      setCourseToDelete(null);
    } catch (error) {
      setCourseToDelete(null); // Reset even on error
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
        toast.error("Only JPEG files are allowed.");
        e.target.value = "";
        return;
      }
      if (file.size > 400 * 1024) {
        toast.error("File size must be less than 400KB.");
        e.target.value = "";
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCourse = async () => {
    if (!courseName || !courseDescription || !coursePrice) {
      toast.error("All fields are required.");
      return;
    }
    if (!editingCourse && !imageFile) {
      toast.error("An image is required for new courses.");
      return;
    }

    let finalImageUrl = editingCourse?.courses_image;

    try {
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("uploadType", "course");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || "Failed to upload image.");
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      if (!finalImageUrl) {
        throw new Error("Image URL is missing.");
      }

      const courseData = {
        course_name: courseName,
        course_description: courseDescription,
        course_price: coursePrice,
        courses_image: finalImageUrl,
      };

      const url = editingCourse
        ? `/api/courses/${editingCourse.id}`
        : "/api/courses";
      const method = editingCourse ? "PUT" : "POST";

      const courseRes = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!courseRes.ok) {
        const errorData = await courseRes.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingCourse ? "update" : "create"} course.`,
        );
      }

      toast.success(
        `Course ${editingCourse ? "updated" : "created"} successfully!`,
      );
      handleDialogOpenChange(false);
      fetchCourses();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1f639e] pr-5">
          Course Management
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-[#1f639e] hover:bg-[#164a73]">
              <Plus className="w-4 h-4" />
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Edit Course" : "Add a New Course"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  placeholder="e.g., Introduction to Web Development"
                />
              </div>
              <div>
                <Label htmlFor="coursePrice">Price *</Label>
                <Input
                  id="coursePrice"
                  type="number"
                  value={coursePrice}
                  onChange={e => setCoursePrice(e.target.value)}
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
                  onChange={e => setCourseDescription(e.target.value)}
                  placeholder="Describe the course..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCourse}
                  className="bg-[#1f639e] hover:bg-[#164a73]"
                >
                  {editingCourse ? "Save Changes" : "Save Course"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-[#1f639e] text-center">Loading courses...</p>
      ) : (
        <Card>
          <AlertDialog
            open={courseToDelete !== null}
            onOpenChange={open => {
              if (!open) {
                setCourseToDelete(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  course.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCourseToDelete(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => executeDelete(courseToDelete)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#1f639e]">Course Name</TableHead>
                  <TableHead className="text-right pr-8 text-[#1f639e]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length > 0 ? (
                  courses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium text-[#1f639e]">
                        {course.course_name}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-[#1f639e] hover:bg-[#164a73]"
                            onClick={() => handleEdit(course)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => confirmDelete(course.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
