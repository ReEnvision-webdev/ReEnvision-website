'use client';

import { useState, Fragment, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, XIcon, MessageSquareIcon } from 'lucide-react';

// Mock data for demonstration
const mockPendingActivities = [
  { id: 1, studentName: 'Alex Johnson', activityName: 'Community Garden Cleanup', date: '2024-01-15', hours: 3, reflection: 'During this activity, I had the opportunity to work with children teaching them about sustainable gardening practices. I learned how important it is to engage the younger generation in environmental stewardship. Working with the community members was incredibly rewarding as we planted various vegetables that will be donated to local food banks. This experience reinforced my belief in the power of collective action and community involvement. I felt a deep sense of satisfaction knowing that our efforts will provide fresh produce to families in need.', status: 'pending', daysPending: 2 },
  { id: 2, studentName: 'Taylor Smith', activityName: 'Food Bank Volunteering', date: '2024-01-12', hours: 4, reflection: 'At the food bank, I spent my time sorting donations, organizing shelves, and helping distribute food packages to families. It was eye-opening to see the number of people who rely on food assistance. I met several individuals who shared their stories with me, which gave me a deeper understanding of food insecurity in our community. The experience taught me empathy and made me appreciate the resources I often take for granted. I realized how important it is to support organizations that help those in need.', status: 'pending', daysPending: 8 },
  { id: 3, studentName: 'Morgan Chen', activityName: 'Local Shelter Support', date: '2024-01-10', hours: 2.5, reflection: 'I assisted with meal preparation and served dinner to shelter residents. The experience was humbling as I interacted with people from diverse backgrounds facing challenging circumstances. I learned that homelessness affects individuals from all walks of life and that compassion and dignity are essential when providing services. Serving meals face-to-face reminded me of the importance of treating everyone with respect and kindness regardless of their situation. This experience motivated me to continue volunteering and advocating for housing support initiatives.', status: 'pending', daysPending: 12 },
  { id: 4, studentName: 'Jamie Davis', activityName: 'Environmental Education Workshop', date: '2024-01-08', hours: 5, reflection: 'I led a workshop focusing on recycling and waste reduction techniques for local elementary school students. Preparing for the workshop helped me deepen my own understanding of environmental issues. Seeing the childrens enthusiasm as they learned about composting and reducing plastic waste was inspiring. I realized that education is a powerful tool for creating lasting environmental change. The experience strengthened my passion for environmental advocacy and showed me the impact of engaging young minds in sustainability practices.', status: 'pending', daysPending: 1 },
  { id: 5, studentName: 'Jordan Taylor', activityName: 'Senior Center Visits', date: '2024-01-05', hours: 3.5, reflection: 'I visited the senior center and organized various activities including trivia games and craft sessions. Listening to the seniors stories provided valuable insights into history and life experiences I wouldnt have otherwise known. I learned patience and gained appreciation for the wisdom of older generations. The experience highlighted the importance of social connection for elderly individuals and how loneliness can significantly impact their wellbeing. This motivated me to establish a regular visiting schedule and consider organizing intergenerational programs.', status: 'pending', daysPending: 5 },
];

const mockApprovedActivities = [
  { id: 6, studentName: 'Casey Wilson', activityName: 'Beach Cleanup', date: '2024-01-01', hours: 6, reflection: 'I participated in a beach cleanup with a team of volunteers, collecting trash along the coastline. The experience was educational as I learned about marine pollution and its impact on wildlife. We collected over 50 pounds of debris which felt incredibly rewarding. This activity reinforced my commitment to environmental conservation and showed me how individual actions can contribute to protecting our natural spaces. I plan to continue participating in similar environmental initiatives.', status: 'approved' },
  { id: 7, studentName: 'Riley Johnson', activityName: 'Animal Shelter Support', date: '2023-12-28', hours: 4, reflection: 'I spent time walking dogs and cleaning cages at the local animal shelter. The experience was heartwarming as I saw the positive impact on the animals wellbeing. I learned about animal care and the challenges shelters face in caring for abandoned pets. Interacting with the animals reminded me of the importance of compassion and responsibility toward all living beings. This experience inspired me to adopt a pet in the future and support animal welfare organizations.', status: 'approved' },
];

export default function AdminApprovalWorkflow() {
  const [pendingActivities, setPendingActivities] = useState<any[]>([]);
  const [approvedActivities, setApprovedActivities] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const response = await fetch('/api/hours');
        if (response.ok) {
          const data = await response.json();
          // Separate pending and approved/rejected activities
          const pending = data.filter((activity: any) => activity.approved === null);
          const approvedOrRejected = data.filter((activity: any) => activity.approved !== null);

          setPendingActivities(pending);
          setApprovedActivities(approvedOrRejected);
        } else {
          console.error('Failed to fetch hours:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching hours:', error);
      } finally {
        setLoading(false);
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
        const updatedActivity = await response.json();
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
        const updatedActivity = await response.json();
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

  const openReviewModal = (entry: any) => {
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
                        <tr className={`border-b ${activity.daysPending > 7 ? 'bg-red-50' : ''}`}>
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
                            <Badge variant={activity.daysPending > 7 ? 'destructive' : 'secondary'}>
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