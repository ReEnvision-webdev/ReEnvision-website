"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to update name:", error);
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
    if (newEmail === user.email) {
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

  return (
    <div className="container mx-auto p-6 py-25">
      <div className="mb-8 text-center">
        <Dialog>
          <DialogTrigger asChild>
            <div className="group relative mx-auto h-24 w-24 rounded-full bg-gray-300 mb-4 cursor-pointer">
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-300 flex items-center justify-center">
                <Pencil className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Profile Picture</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="pfp">Profile Picture</Label>
              <Input id="pfp" type="file" />
            </div>
            <DialogFooter>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <h1 className="text-3xl font-bold text-[#1f639e]">User Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Name</Label>
                <p className="text-lg">{session?.user?.name ?? user.name}</p>
              </div>
              <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Name</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleNameUpdate} disabled={isUpdatingName}>
                      {isUpdatingName ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Email</Label>
                <p className="text-lg">{user.email}</p>
              </div>
              <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Email</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">New Email Address</Label>
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
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Password</Label>
              <p className="text-lg">********</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <Label htmlFor="old-password">Old Password</Label>
                    <Input id="old-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <Input id="confirm-new-password" type="password" />
                  </div>
                </div>
                <DialogFooter>
                  <Button>Update Password</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers. To confirm, please
                    type your email address below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input
                    type="email"
                    placeholder={user.email ?? ""}
                    className="w-full"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Yes, delete my account</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}