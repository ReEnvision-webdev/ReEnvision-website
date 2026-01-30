"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Search, ShieldCheck, ShieldX, Ban, UserRoundPen } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  isVerified: boolean;
  isAdmin: boolean;
  requiredHours: number;
}

export default function UserManagementModal() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [requiredHours, setRequiredHours] = useState(0);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);

  const handleSearch = () => {
    // Simulate API call to fetch user data
    setLoading(true);
    
    // Mock user data - in real implementation this would come from an API
    setTimeout(() => {
      setUser({
        id: "1",
        email,
        name: "John Doe",
        profilePicture: "/placeholder-avatar.jpg",
        isVerified: false,
        isAdmin: false,
        requiredHours: 20,
      });
      setRequiredHours(20);
      setLoading(false);
    }, 500);
  };

  const handleVerifyToggle = () => {
    if (user) {
      setUser({
        ...user,
        isVerified: !user.isVerified,
      });
    }
  };

  const handleMakeAdmin = () => {
    if (user) {
      setUser({
        ...user,
        isAdmin: !user.isAdmin,
      });
    }
    setAdminDialogOpen(false); // Close the dialog
  };

  const handleBan = () => {
    // In real implementation, this would call an API to ban the user
    console.log(`User ${user?.email} has been banned`);
  };

  const handleSaveChanges = () => {
    // In real implementation, this would call an API to save changes
    console.log("Saving changes:", { ...user, requiredHours });
    alert("Successfully saved!");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[#1f639e]">
          <Search className="w-5 h-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Search Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#1f639e]">User Email</Label>
              <div className="flex mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-r-none border-gray-300 focus:border-[#1f639e] focus:ring-[#1f639e]"
                />
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="rounded-l-none bg-[#1f639e] hover:bg-blue-700"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            {user && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
                    {user.profilePicture ? (
                      <Image
                        src={user.profilePicture}
                        alt={user.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={e => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite loop
                          target.src = "https://placehold.co/150x150/cccccc/666666?text=Profile"; // Fallback image
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">{user.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="hours" className="text-[#1f639e]">Required Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      value={requiredHours}
                      onChange={(e) => setRequiredHours(Number(e.target.value))}
                      min="0"
                      className="border-gray-300 focus:border-[#1f639e] focus:ring-[#1f639e]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={user.isVerified ? "secondary" : "outline"}
                      onClick={handleVerifyToggle}
                      className={`flex items-center gap-2 border ${user.isVerified ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' : 'border-[#1f639e] text-[#1f639e] hover:bg-[#1f639e]/10'}`}
                    >
                      {user.isVerified ? <ShieldX className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      {user.isVerified ? "Unverify" : "Verify"}
                    </Button>

                    <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant={user.isAdmin ? "secondary" : "outline"}
                          className={`flex items-center gap-2 border ${user.isAdmin ? 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100' : 'border-[#1f639e] text-[#1f639e] hover:bg-[#1f639e]/10'}`}
                        >
                          <UserRoundPen className="w-4 h-4" />
                          {user.isAdmin ? "Remove Admin" : "Make Admin"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-[#1f639e]">Confirm Administrative Action</DialogTitle>
                          <DialogDescription className="text-gray-600">
                            Are you sure you want to {user.isAdmin ? "remove admin privileges from" : "grant admin privileges to"} {user.name}? This action will {user.isAdmin ? "revoke" : "grant"} administrative access to the platform.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-gray-300 text-gray-600 hover:bg-gray-100"
                            onClick={() => setAdminDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleMakeAdmin}
                            className={`${user.isAdmin ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1f639e] hover:bg-blue-700'}`}
                          >
                            {user.isAdmin ? "Remove Admin" : "Grant Admin"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                        >
                          <Ban className="w-4 h-4" />
                          Ban User
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-[#1f639e]">Confirm User Ban</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to ban {user.name}? This action will permanently revoke their access to the platform and remove their account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-300 text-gray-600 hover:bg-gray-100">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleBan}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Ban User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="border border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2">Search for a user by email to view and manage their account</p>
            </div>
          </div>
        </div>

        {user && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveChanges}
              className="bg-[#1f639e] hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}