
"use client";

import { useState } from "react";
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
  const [emailVerificationStep, setEmailVerificationStep] = useState("enterEmail");

  if (!user) {
    return null; // Or a loading state
  }

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
                <p className="text-lg">{user.name}</p>
              </div>
              <Dialog>
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
                    <Input id="name" defaultValue={user.name ?? ""} />
                  </div>
                  <DialogFooter>
                    <Button>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Email</Label>
                <p className="text-lg">{user.email}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Email</DialogTitle>
                  </DialogHeader>
                  {emailVerificationStep === "enterEmail" && (
                    <>
                      <div className="py-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user.email ?? ""}
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setEmailVerificationStep("enterCode")}>
                          Send Verification Code
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                  {emailVerificationStep === "enterCode" && (
                    <>
                      <div className="py-4">
                        <Label htmlFor="verification-code">Verification Code</Label>
                        <Input id="verification-code" placeholder="Enter code" />
                      </div>
                      <DialogFooter>
                        <Button>Verify & Save</Button>
                      </DialogFooter>
                    </>
                  )}
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
