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

  const handleSearch = async () => {
    if (!email) return;

    setLoading(true);

    try {
      // Fetch user by email
      const response = await fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const userData = await response.json();
      setUser(userData);
      setRequiredHours(userData.requiredHours || 0);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Optionally show an error message to the user
      alert(error instanceof Error ? error.message : 'An error occurred while fetching the user');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVerified: !user.isVerified,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update verification status: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('An error occurred while updating verification status');
    }
  };

  const handleMakeAdmin = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdmin: !user.isAdmin,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update admin status: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setAdminDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('An error occurred while updating admin status');
    }
  };

  const handleBan = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isBanned: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ban user: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      alert(`User ${user.email} has been banned`);
    } catch (error) {
      console.error('Error banning user:', error);
      alert('An error occurred while banning the user');
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requiredHours,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          isBanned: user.isBanned,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save changes: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Update the local state with the response
      alert("Successfully saved!");
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('An error occurred while saving changes');
    }
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
                      onChange={async (e) => {
                        const newHours = Number(e.target.value);
                        setRequiredHours(newHours);

                        // Update the user's hours in the database
                        if (user) {
                          try {
                            const response = await fetch(`/api/users/${user.id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                requiredHours: newHours,
                              }),
                            });

                            if (!response.ok) {
                              throw new Error(`Failed to update hours: ${response.statusText}`);
                            }

                            const contentType = response.headers.get('content-type');
                            if (!contentType || !contentType.includes('application/json')) {
                              throw new Error('Response is not JSON');
                            }

                            const updatedUser = await response.json();
                            setUser(updatedUser);
                          } catch (error) {
                            console.error('Error updating hours:', error);
                            alert('An error occurred while updating hours');
                            // Revert the change if there was an error
                            setRequiredHours(user.requiredHours);
                          }
                        }
                      }}
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