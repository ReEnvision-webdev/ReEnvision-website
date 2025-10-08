"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { type User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

interface SettingsFormProps {
  user: User | undefined;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const { data: session, update } = useSession();
  const [name, setName] = useState(user?.name ?? "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isProfilePictureDialogOpen, setIsProfilePictureDialogOpen] = useState(false);
  const [isUpdatingProfilePicture, setIsUpdatingProfilePicture] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [deleteConfirmationEmail, setDeleteConfirmationEmail] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Clean up preview URL when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Clean up preview URL when dialog is closed
  useEffect(() => {
    if (!isProfilePictureDialogOpen && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [isProfilePictureDialogOpen, previewUrl]);

  if (!user) {
    return null; // Or a loading state
  }

  const handleNameUpdate = async () => {
    setIsUpdatingName(true);
    try {
      const response = await fetch("/api/user/update-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data.success) {
        await update();
        setIsNameDialogOpen(false);
        alert("Name updated successfully");
      } else {
        alert(data.message || "Failed to update name");
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to update name:", error);
      alert("Failed to update name");
    }
    setIsUpdatingName(false);
  };

  const handleEmailUpdate = async () => {
    // Basic email validation
    if (!newEmail || !newEmail.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    // Check if the new email is the same as the current email
    if (newEmail === (session?.user?.email ?? user.email)) {
      alert("This is already your current email address");
      return;
    }

    setIsSendingVerification(true);
    try {
      const response = await fetch("/api/user/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Verification email sent! Please check your inbox.");
        // Close the dialog
        setIsEmailDialogOpen(false);
      } else {
        alert(data.error || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending the verification email");
    }
    setIsSendingVerification(false);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Only JPEG, JPG, PNG, WEBP, and GIF are allowed.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Maximum size is 5MB.");
        return;
      }

      setSelectedFile(file);
      
      // Create a preview URL for the selected file
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleProfilePictureUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select a profile picture");
      return;
    }

    // Validate file type again in case file was changed externally
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file type. Only JPEG, JPG, PNG, WEBP, and GIF are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size too large. Maximum size is 5MB.");
      return;
    }

    setIsUpdatingProfilePicture(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      const response = await fetch("/api/user/update-profile-picture", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await update(); // Update session to reflect new profile picture
        setIsProfilePictureDialogOpen(false);
        // Revoke the preview URL to free up memory
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
        alert("Profile picture updated successfully");
      } else {
        alert(data.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture");
    }
    setIsUpdatingProfilePicture(false);
  };

const handleChangePassword = async () => {
  
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    alert("Please fill in all password fields");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    alert("New password and confirm new password do not match");
    return;
  }



  setIsUpdatingPassword(true);
  
  try {
    console.log("Making API call to change password");
    const response = await fetch("/api/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    const data = await response.json();
    console.log("API response:", response.status, data);

    if (response.ok && data.success) {
      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsPasswordDialogOpen(false);
      await update(); // Keep this for session update
    } else {
      const errorMessage = data.message || data.error || "Failed to update password";
      alert(errorMessage);
    }
  } catch (error) {
    console.error("Error updating password:", error);
    alert(`An error occurred while updating password`);
  } finally {
    setIsUpdatingPassword(false);
  }
};

const handleDeleteAccount = async () => {
    if (deleteConfirmationEmail !== (session?.user?.email ?? user.email)) {
      alert("Email address does not match.");
      return;
    }

    setIsDeletingAccount(true);
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: deleteConfirmationEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Account deleted successfully. You are being redirected.");
        await signOut({ callbackUrl: '/' });
      } else {
        alert(data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const profilePictureUrl = user?.image || (user?.profilePicture && user.profilePicture !== "skibiditoilet" ? user.profilePicture : undefined);

  return (
    <div className="container mx-auto p-6 py-25">
      <div className="mb-8 text-center">
        <Dialog open={isProfilePictureDialogOpen} onOpenChange={setIsProfilePictureDialogOpen}>
          <DialogTrigger asChild>
            <div className="group relative mx-auto h-24 w-24 rounded-full bg-gray-300 mb-4 cursor-pointer overflow-hidden">
              {profilePictureUrl ? (
                <img 
                  src={profilePictureUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = "https://placehold.co/150x150/cccccc/666666?text=Profile"; // Fallback image
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No image</span>
                </div>
              )}
              <div className="absolute inset-0 group-hover:bg-[#1f639e] rounded-full transition-all duration-300 flex items-center justify-center">
                <Pencil className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#1f639e]">Upload Profile Picture</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleProfilePictureUpdate}>
              <div className="py-4 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium" className="text-[#1f639e]">Current Picture</h3>
                    <div className="mt-2 flex justify-center">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden border">
                        {profilePictureUrl ? (
                          <img 
                            src={profilePictureUrl} 
                            alt="Current profile" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = "https://placehold.co/150x150/cccccc/666666?text=Profile"; // Fallback image
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium" className="text-[#1f639e]">New Picture Preview</h3>
                    <div className="mt-2 flex justify-center">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden border bg-gray-100">
                        <img 
                          src={previewUrl || "https://placehold.co/150x150/cccccc/666666?text=Preview"} 
                          alt="New profile preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="profilePicture" className="text-[#1f639e]">Select New Profile Picture</Label>
                  <Input 
                    id="profilePicture" 
                    name="profilePicture" 
                    type="file" 
                    accept="image/*" 
                    className="mt-1"
                    onChange={handleProfilePictureChange}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Accepted formats: JPEG, JPG, PNG, WEBP, GIF. Max size: 5MB.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdatingProfilePicture} className="bg-[#1f639e]  hover:bg-[#164a73]">
                  {isUpdatingProfilePicture ? "Uploading..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <h1 className="text-3xl font-bold text-[#1f639e]">User Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#1f639e]">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4 border-[#1f639e]">
              <div>
                <Label className="text-[#1f639e]">Name</Label>
                <p className="text-lg text-muted-foreground">{session?.user?.name ?? user.name}</p>
              </div>
              <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4 text-[#1f639e]" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-[#1f639e]">Edit Name</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="name"  className="text-[#1f639e]">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleNameUpdate} disabled={isUpdatingName} className="bg-[#1f639e]  hover:bg-[#164a73]">
                      {isUpdatingName ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4  border-[#1f639e]">
              <div>
                <Label className="text-[#1f639e]">Email</Label>
                <p className="text-lg text-muted-foreground">{session?.user?.email ?? user.email}</p>
              </div>
              <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4 text-[#1f639e]" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-[#1f639e]">Edit Email</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[#1f639e]">New Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter new email address"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleEmailUpdate}
                        disabled={isSendingVerification}
                        className="bg-[#1f639e]  hover:bg-[#164a73]"
                      >
                        {isSendingVerification ? "Sending Verification Email..." : "Send Verification Email"}
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <p className="text-sm text-muted-foreground">
                      A verification email will be sent to your new email address. 
                      Please click the link in the email to confirm the change.
                    </p>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#1f639e]">Security</h2>
          <div className="flex items-center justify-between rounded-lg border p-4  border-[#1f639e]">
            <div>
              <Label className="text-[#1f639e]">Password</Label>
              <p className="text-lg text-muted-foreground">********</p>
            </div>
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4 text-[#1f639e]" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-[#1f639e]">Change Password</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <Label htmlFor="old-password" className="text-[#1f639e]">Old Password</Label>
                    <Input 
                      id="old-password" 
                      type="password" 
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password" className="text-[#1f639e]">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-new-password" className="text-[#1f639e]">Confirm New Password</Label>
                    <Input 
                      id="confirm-new-password" 
                      type="password" 
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleChangePassword} disabled={isUpdatingPassword} className="bg-[#1f639e]  hover:bg-[#164a73]">
                    {isUpdatingPassword ? (
                      <div className="flex items-center justify-center">
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        <div>
          <h2 className="text-xl font-semibold mb-4 text-destructive">Delete Account</h2>
          <div className="rounded-lg border border-destructive p-4">
            <p className="text-destructive mb-4">
              This action is irreversible. Please be certain before proceeding.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#1f639e]">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers. To confirm, please
                    type your email address below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input
                    id="delete-confirm-email"
                    type="email"
                    placeholder={session?.user?.email ?? user.email ?? ""}
                    className="w-full"
                    value={deleteConfirmationEmail}
                    onChange={(e) => setDeleteConfirmationEmail(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-[#1f639e] text-[#1f639e] hover:text-[#164a73]">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeletingAccount} className="bg-[#1f639e]  hover:bg-[#164a73]">
                    {isDeletingAccount ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
