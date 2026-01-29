'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, Fragment, useEffect } from 'react';
import { PlusIcon, UploadIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import HoursLogForm from '@/components/hours-log-form';
import { useSession } from 'next-auth/react';

// Log Hours Form Component
function LogHoursFormComponent({ onClose, onAddNewHour }: { onClose: () => void; onAddNewHour: (newHour: any) => void }) {
  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Refresh the hours data after successful submission
        const newHour = await response.json();
        onAddNewHour(newHour);
        onClose(); // Close the dialog after submission
      } else {
        console.error('Failed to submit hours:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting hours:', error);
    }
  };

  return (
    <HoursLogForm onSubmit={handleSubmit} onCancel={onClose} />
  );
}

// Mock data for demonstration
const mockActivities = [
  { id: 1, name: 'Community Garden Cleanup', date: '2024-01-15', hours: 3, status: 'approved', reflection: 'During this activity, I had the opportunity to work with children teaching them about sustainable gardening practices. I learned how important it is to engage the younger generation in environmental stewardship. Working with the community members was incredibly rewarding as we planted various vegetables that will be donated to local food banks. This experience reinforced my belief in the power of collective action and community involvement. I felt a deep sense of satisfaction knowing that our efforts will provide fresh produce to families in need.', comments: 'Great work! Your reflection shows real engagement with the community.' },
  { id: 2, name: 'Food Bank Volunteering', date: '2024-01-12', hours: 4, status: 'pending', reflection: 'At the food bank, I spent my time sorting donations, organizing shelves, and helping distribute food packages to families. It was eye-opening to see the number of people who rely on food assistance. I met several individuals who shared their stories with me, which gave me a deeper understanding of food insecurity in our community. The experience taught me empathy and made me appreciate the resources I often take for granted. I realized how important it is to support organizations that help those in need.', comments: '' },
  { id: 3, name: 'Local Shelter Support', date: '2024-01-10', hours: 2.5, status: 'approved', reflection: 'I assisted with meal preparation and served dinner to shelter residents. The experience was humbling as I interacted with people from diverse backgrounds facing challenging circumstances. I learned that homelessness affects individuals from all walks of life and that compassion and dignity are essential when providing services. Serving meals face-to-face reminded me of the importance of treating everyone with respect and kindness regardless of their situation. This experience motivated me to continue volunteering and advocating for housing support initiatives.', comments: 'Thank you for your service to the community!' },
  { id: 4, name: 'Environmental Education Workshop', date: '2024-01-08', hours: 5, status: 'rejected', reflection: 'I led a workshop focusing on recycling and waste reduction techniques for local elementary school students. Preparing for the workshop helped me deepen my own understanding of environmental issues. Seeing the childrens enthusiasm as they learned about composting and reducing plastic waste was inspiring. I realized that education is a powerful tool for creating lasting environmental change. The experience strengthened my passion for environmental advocacy and showed me the impact of engaging young minds in sustainability practices.', comments: 'Unfortunately, we couldn\'t verify this activity. Please provide additional documentation.' },
  { id: 5, name: 'Senior Center Visits', date: '2024-01-05', hours: 3.5, status: 'pending', reflection: 'I visited the senior center and organized various activities including trivia games and craft sessions. Listening to the seniors stories provided valuable insights into history and life experiences I wouldnt have otherwise known. I learned patience and gained appreciation for the wisdom of older generations. The experience highlighted the importance of social connection for elderly individuals and how loneliness can significantly impact their wellbeing. This motivated me to establish a regular visiting schedule and consider organizing intergenerational programs.', comments: '' },
];


export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<any[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const response = await fetch('/api/hours');
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
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

  // Calculate progress percentage based on approved hours
  const approvedHours = activities
    .filter(activity => activity.approved === true)
    .reduce((sum, activity) => sum + parseFloat(activity.hours || 0), 0);

  // Get total goal hours from user profile (fallback to 50 if not available)
  const totalGoalHours = 50; // This could come from user profile in the future
  const progressPercentage = totalGoalHours > 0 ? Math.min(100, (approvedHours / totalGoalHours) * 100) : 0;
  const remainingHours = totalGoalHours - approvedHours;

  const toggleExpandRow = (id: number) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 14) {
      return 'Good noon';
    } else if (hour >= 14 && hour < 18) {
      return 'Good afternoon';
    } else if (hour >= 18 && hour < 22) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
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
    <div className="bg-[#F0F8FF] min-h-screen py-8 px-4 pt-30">
      <div className="max-w-6xl mx-auto">
        {/* Header with quick action bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1d588a]">
              {getGreeting()}, {session?.user?.name || 'User'}!
            </h1>
            <p className="text-[#6b7280] mt-2">Track your volunteer hours and stay on target with your goals</p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Dialog open={showLogForm} onOpenChange={setShowLogForm}>
              <DialogTrigger asChild>
                <Button className="bg-[#1d588a] hover:bg-[#00427A] text-white flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Add Hours
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-[#1f639e]">Add Volunteer Hours</DialogTitle>
                  <DialogDescription>
                    Enter the details of your volunteer activity
                  </DialogDescription>
                </DialogHeader>
                <LogHoursFormComponent
                  onClose={() => setShowLogForm(false)}
                  onAddNewHour={(newHour) => setActivities(prev => [...prev, newHour])}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Hours Logged Card */}
          <Card className="bg-white shadow-lg rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#1d588a]">Hours Completed</CardTitle>
              <CardDescription className="text-[#6b7280]">You've completed {approvedHours} of {totalGoalHours} required hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="relative w-32 h-32">
                  {/* Circular progress indicator */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#1d588a"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${progressPercentage * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[#1d588a]">{approvedHours}</span>
                    <span className="text-sm text-[#6b7280]">of {totalGoalHours}</span>
                  </div>
                </div>

                <div className="flex-1 ml-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Progress:</span>
                      <span className="font-medium text-[#1d588a]">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#1d588a] h-2.5 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-[#1d588a]" />
                      <span className="text-sm font-medium text-[#1d588a]">
                        {remainingHours} hours left to complete your goal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hours Left Card */}
          <Card className="bg-white shadow-lg rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#1d588a]">Hours Remaining</CardTitle>
              <CardDescription className="text-[#6b7280]">You need {remainingHours} more hours to reach your goal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="relative w-32 h-32">
                  {/* Circular progress indicator for remaining hours */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="8"
                    />
                    {/* Remaining hours circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#ff6b6b"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${((totalGoalHours - approvedHours) / totalGoalHours) * 283} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-red-500">{remainingHours}</span>
                    <span className="text-sm text-[#6b7280]">hours left</span>
                  </div>
                </div>

                <div className="flex-1 ml-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Remaining:</span>
                      <span className="font-medium text-[#1d588a]">{Math.round(100 - progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${100 - progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-[#6b7280]">
                      Keep going! You're {Math.round(progressPercentage)}% of the way to your goal.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Hours Section */}
        <Card className="bg-white shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg text-[#1d588a]">All Hours</CardTitle>
            <CardDescription className="text-[#6b7280]">Your volunteer hours submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-[#6b7280]">Activity</th>
                    <th className="text-left py-3 px-4 text-[#6b7280]">Date</th>
                    <th className="text-left py-3 px-4 text-[#6b7280]">Hours</th>
                    <th className="text-left py-3 px-4 text-[#6b7280]">Status</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <Fragment key={activity.id}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-[#1d588a]">{activity.activityName || activity.name}</td>
                        <td className="py-3 px-4 text-[#6b7280]">{formatDate(activity.date)}</td>
                        <td className="py-3 px-4 text-[#1d588a]">{activity.hours} hrs</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={activity.approved === true ? 'default' :  // approved
                                    activity.approved === false ? 'destructive' :  // rejected
                                    'secondary'} // pending (when approved is null)
                          >
                            {activity.approved === true ? 'Approved' :
                             activity.approved === false ? 'Rejected' :
                             'Pending'}
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
                          <td colSpan={5} className="py-4 px-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-[#1d588a] mb-2">Reflection</h4>
                                <p className="text-[#6b7280] whitespace-pre-line break-words">{activity.reflection}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-[#1d588a] mb-2">Admin Comments</h4>
                                {activity.adminComments ? (
                                  <p className="text-[#6b7280] whitespace-pre-line break-words">{activity.adminComments}</p>
                                ) : (
                                  <p className="text-[#6b7280] italic">No comments from admin</p>
                                )}
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
      </div>
    </div>
  );
}

