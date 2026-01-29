'use client';

import { useState, Fragment, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, XIcon, MessageSquareIcon } from 'lucide-react';

// Define types for the activity objects
interface Activity {
  id: number;
  studentName: string;
  activityName: string;
  date: string;
  hours: string | number;
  reflection: string;
  approved: boolean | null;
  adminComments?: string | null;
  daysPending?: number;
  supervisor?: string;
  supervisorEmail?: string;
}


export default function AdminApprovalWorkflow() {
  const [pendingActivities, setPendingActivities] = useState<Activity[]>([]);
  const [approvedActivities, setApprovedActivities] = useState<Activity[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Activity | null>(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const response = await fetch('/api/hours');
        if (response.ok) {
          const data = await response.json();
          // Separate pending and approved/rejected activities
          const pending = data.filter((activity: Activity) => activity.approved === null);
          const approvedOrRejected = data.filter((activity: Activity) => activity.approved !== null);

          setPendingActivities(pending);
          setApprovedActivities(approvedOrRejected);
        } else {
          console.error('Failed to fetch hours:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching hours:', error);
      } finally {
        // Removed setLoading call since loading state was removed
      }
    };

    fetchHours();
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingActivities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingActivities.map(activity => activity.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleExpandRow = (id: number) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const approveSelected = async () => {
    try {
      // Process each selected item
      for (const id of selectedIds) {
        await fetch('/api/hours', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, approved: true, adminComments: comments }),
        });
      }

      // Update the local state after all approvals
      const updatedPending = pendingActivities.filter(
        activity => !selectedIds.includes(activity.id)
      );

      setPendingActivities(updatedPending);
      setSelectedIds([]);
      setComments('');
    } catch (error) {
      console.error('Error approving selected hours:', error);
    }
  };

  const denySelected = async () => {
    try {
      // Process each selected item
      for (const id of selectedIds) {
        await fetch('/api/hours', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, approved: false, adminComments: comments }),
        });
      }

      // Update the local state after all denials
      const updatedPending = pendingActivities.filter(
        activity => !selectedIds.includes(activity.id)
      );

      setPendingActivities(updatedPending);
      setSelectedIds([]);
      setComments('');
    } catch (error) {
      console.error('Error denying selected hours:', error);
    }
  };

  const approveSingle = async (id: number) => {
    try {
      const response = await fetch('/api/hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, approved: true, adminComments: comments }),
      });

      if (response.ok) {
        const updatedActivity: Activity = await response.json();
        // Remove from pending and add to approved
        const updatedPending = pendingActivities.filter(a => a.id !== id);
        setPendingActivities(updatedPending);
        setApprovedActivities([...approvedActivities, updatedActivity]);
        setComments('');
      } else {
        console.error('Failed to approve hours:', response.statusText);
      }
    } catch (error) {
      console.error('Error approving hours:', error);
    }
  };

  const rejectSingle = async (id: number) => {
    try {
      const response = await fetch('/api/hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, approved: false, adminComments: comments }),
      });

      if (response.ok) {
        const updatedActivity: Activity = await response.json();
        // Remove from pending and add to approved/rejected list
        const updatedPending = pendingActivities.filter(a => a.id !== id);
        setPendingActivities(updatedPending);
        setApprovedActivities([...approvedActivities, updatedActivity]);
        setComments('');
      } else {
        console.error('Failed to reject hours:', response.statusText);
      }
    } catch (error) {
      console.error('Error rejecting hours:', error);
    }
  };

  const openReviewModal = (entry: Activity) => {
    setCurrentEntry(entry);
    setComments(entry.adminComments || ''); // Initialize with existing comment
    setShowReviewModal(true);
  };

  const formatDate = (dateString: string) => {
    // Handle ISO date strings properly to prevent timezone shifts
    // If dateString is in YYYY-MM-DD format, treat it as local date
    let date: Date;
    if (dateString.includes('T')) {
      // If it's an ISO string with time, create date object directly
      date = new Date(dateString);
    } else {
      // If it's just YYYY-MM-DD, treat as local date to avoid timezone shift
      const [year, month, day] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day); // month is 0-indexed
    }

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8">
      {/* Pending Hours Section */}
      <Card className="bg-white shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg text-[#1d588a] flex items-center gap-2">
            Hours to be Approved
          </CardTitle>
          <CardDescription>
            {pendingActivities.length} pending submissions awaiting review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending hours to approve
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedIds.length === pendingActivities.length && pendingActivities.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="data-[state=checked]:bg-[#1d588a] data-[state=checked]:text-white"
                  />
                  <span>Select All</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={denySelected}
                    disabled={selectedIds.length === 0}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Deny Selected
                  </Button>
                  <Button
                    onClick={approveSelected}
                    disabled={selectedIds.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Selected
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="w-12"></th>
                      <th className="text-left py-3 px-4">Student</th>
                      <th className="text-left py-3 px-4">Activity</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Hours</th>
                      <th className="text-left py-3 px-4">Days Pending</th>
                      <th className="text-left py-3 px-4">Actions</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingActivities.map((activity) => (
                      <Fragment key={activity.id}>
                        <tr className={`border-b ${activity.daysPending && activity.daysPending > 7 ? 'bg-red-50' : ''}`}>
                          <td className="py-3 px-4 align-top">
                            <Checkbox
                              checked={selectedIds.includes(activity.id)}
                              onCheckedChange={() => toggleSelect(activity.id)}
                              className="data-[state=checked]:bg-[#1d588a] data-[state=checked]:text-white"
                            />
                          </td>
                          <td className="py-3 px-4">{activity.studentName}</td>
                          <td className="py-3 px-4">{activity.activityName}</td>
                          <td className="py-3 px-4">{formatDate(activity.date)}</td>
                          <td className="py-3 px-4">{activity.hours} hrs</td>
                          <td className="py-3 px-4">
                            <Badge variant={activity.daysPending && activity.daysPending > 7 ? 'destructive' : 'secondary'}>
                              {activity.daysPending} days
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => approveSingle(activity.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckIcon className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectSingle(activity.id)}
                                className="border-red-500 text-red-500 hover:bg-red-50"
                              >
                                <XIcon className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          </td>
                          <td className="py-3 px-4 align-top">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpandRow(activity.id)}
                            >
                              {expandedRows.includes(activity.id) ?
                                <ChevronUpIcon className="w-4 h-4" /> :
                                <ChevronDownIcon className="w-4 h-4" />
                              }
                            </Button>
                          </td>
                        </tr>

                        {expandedRows.includes(activity.id) && (
                          <tr>
                            <td colSpan={8} className="py-4 px-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Reflection</h4>
                                  <p className="text-gray-600 whitespace-pre-line break-words">{activity.reflection}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Comments</h4>
                                  {activity.adminComments ? (
                                    <p className="text-gray-600 whitespace-pre-line break-words">{activity.adminComments}</p>
                                  ) : (
                                    <p className="text-gray-600 italic">No comments yet</p>
                                  )}
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openReviewModal(activity)}
                                    >
                                      <MessageSquareIcon className="w-4 h-4 mr-1" /> Add/Edit Comment
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => approveSingle(activity.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => rejectSingle(activity.id)}
                                    >
                                      Deny
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Approved Hours Section */}
      <Card className="bg-white shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg text-[#1d588a]">Approved Hours</CardTitle>
          <CardDescription>
            Previously approved volunteer hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Activity</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Hours</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedActivities.map((activity) => (
                  <Fragment key={activity.id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{activity.studentName}</td>
                      <td className="py-3 px-4">{activity.activityName}</td>
                      <td className="py-3 px-4">{formatDate(activity.date)}</td>
                      <td className="py-3 px-4">{activity.hours} hrs</td>
                      <td className="py-3 px-4">
                        <Badge variant={activity.approved === true ? 'default' : 'destructive'}>
                          {activity.approved === true ? 'Approved' : 'Rejected'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandRow(activity.id)}
                        >
                          {expandedRows.includes(activity.id) ?
                            <ChevronUpIcon className="w-4 h-4" /> :
                            <ChevronDownIcon className="w-4 h-4" />
                          }
                        </Button>
                      </td>
                    </tr>

                    {expandedRows.includes(activity.id) && (
                      <tr>
                        <td colSpan={6} className="py-4 px-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Reflection</h4>
                              <p className="text-gray-600 whitespace-pre-line break-words">{activity.reflection}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Comments</h4>
                              {activity.adminComments ? (
                                <p className="text-gray-600 whitespace-pre-line break-words">{activity.adminComments}</p>
                              ) : (
                                <p className="text-gray-600 italic">No comments yet</p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openReviewModal(activity)}
                                >
                                  <MessageSquareIcon className="w-4 h-4 mr-1" /> Add/Edit Comment
                                </Button>
                                {activity.approved === true && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={async () => {
                                      // Veto the approval (change to rejected)
                                      const response = await fetch('/api/hours', {
                                        method: 'PUT',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          id: activity.id,
                                          approved: false,
                                          adminComments: activity.adminComments // Keep existing comments
                                        }),
                                      });

                                      if (response.ok) {
                                        const updatedActivity = await response.json();

                                        // Move from approved list to pending list
                                        setApprovedActivities(prev =>
                                          prev.filter(item => item.id !== activity.id)
                                        );
                                        setPendingActivities(prev =>
                                          [...prev, updatedActivity]
                                        );
                                      }
                                    }}
                                  >
                                    Veto Approval
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {showReviewModal && currentEntry && (
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Review Entry</DialogTitle>
              <DialogDescription>
                Review the submitted hours and add comments if needed
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Submitted Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Student</Label>
                    <p>{currentEntry.studentName}</p>
                  </div>
                  <div>
                    <Label>Activity</Label>
                    <p>{currentEntry.activityName}</p>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <p>{formatDate(currentEntry.date)}</p>
                  </div>
                  <div>
                    <Label>Hours</Label>
                    <p>{currentEntry.hours} hrs</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-4">Reflection</h3>
                <div className="bg-gray-50 p-4 rounded-md min-h-[100px] whitespace-pre-line break-words">
                  {currentEntry.reflection}
                </div>

                <div className="mt-6">
                  <Label htmlFor="comments">Comments (optional)</Label>
                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                    placeholder="Add comments for the student..."
                  />
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-[#1d588a] hover:bg-[#00427A]"
                    onClick={async () => {
                      // Update only the comments for the entry
                      const response = await fetch('/api/hours', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          id: currentEntry.id,
                          approved: currentEntry.approved, // Keep the current approval status
                          adminComments: comments
                        }),
                      });

                      if (response.ok) {
                        const updatedActivity = await response.json();

                        // Update the state with the new comment
                        if (currentEntry.approved !== null) {
                          // If it's in the approved list, update it there
                          setApprovedActivities(prev =>
                            prev.map(item => item.id === updatedActivity.id ? updatedActivity : item)
                          );
                        } else {
                          // If it's in the pending list, update it there
                          setPendingActivities(prev =>
                            prev.map(item => item.id === updatedActivity.id ? updatedActivity : item)
                          );
                        }
                      }

                      setShowReviewModal(false);
                      setComments('');
                    }}
                  >
                    Save Comment
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}