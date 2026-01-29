'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, PlusIcon } from 'lucide-react';

interface HoursLogFormData {
  activityName: string;
  date: string;
  hours: string;
  reflection: string;
}

interface HoursLogFormProps {
  onSubmit?: (data: HoursLogFormData) => void;
  onCancel?: () => void;
  initialData?: {
    activityName?: string;
    date?: string;
    hours?: string;
    reflection?: string;
  };
}

export default function HoursLogForm({ onSubmit, onCancel, initialData }: HoursLogFormProps) {
  const [formData, setFormData] = useState<HoursLogFormData>({
    activityName: initialData?.activityName || '',
    date: initialData?.date || '',
    hours: initialData?.hours || '',
    reflection: initialData?.reflection || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.activityName.trim()) {
      newErrors.activityName = 'Activity name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      // Check if date is valid
      const date = new Date(formData.date);
      if (isNaN(date.getTime())) {
        newErrors.date = 'Invalid date format';
      }
    }

    if (!formData.hours) {
      newErrors.hours = 'Hours are required';
    } else {
      const hoursNum = parseFloat(formData.hours);
      if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
        newErrors.hours = 'Enter a valid number of hours (0.1 - 24)';
      }
    }

    if (!formData.reflection.trim()) {
      newErrors.reflection = 'Reflection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-[#1d588a] flex items-center gap-2">
            <PlusIcon className="w-6 h-6" />
            Add Volunteer Hours
          </CardTitle>
          <CardDescription className="text-[#6b7280]">
            Fill out the form below to log your volunteer hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityName" className="text-[#1d588a]">Activity Name *</Label>
                <Input
                  id="activityName"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  placeholder="What volunteer activity did you participate in?"
                  className={`${errors.activityName ? 'border-red-500' : ''} text-[#1d588a]`}
                />
                {errors.activityName && (
                  <p className="text-red-500 text-sm">{errors.activityName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[#1d588a]">Date *</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`pr-10 ${errors.date ? 'border-red-500' : ''} text-[#1d588a] [appearance:textfield] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1d588a] cursor-pointer"
                      onClick={() => document.getElementById('date')?.showPicker()}
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.date && (
                    <p className="text-red-500 text-sm">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours" className="text-[#1d588a]">Hours *</Label>
                  <Input
                    id="hours"
                    name="hours"
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="24"
                    value={formData.hours}
                    onChange={handleChange}
                    placeholder="Number of hours"
                    className={errors.hours ? 'border-red-500' : 'text-[#1d588a]'}
                  />
                  {errors.hours && (
                    <p className="text-red-500 text-sm">{errors.hours}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reflection" className="text-[#1d588a]">Reflection *</Label>
                <Textarea
                  id="reflection"
                  name="reflection"
                  value={formData.reflection}
                  onChange={handleChange}
                  placeholder="Reflect on your volunteer experience... What did you learn? How did it impact you or the community?"
                  rows={5}
                  className={errors.reflection ? 'border-red-500' : 'text-[#1d588a]'}
                />
                {errors.reflection && (
                  <p className="text-red-500 text-sm">{errors.reflection}</p>
                )}
                <p className="text-sm text-[#6b7280]">
                  {formData.reflection.length} characters
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="text-[#1d588a] border-[#1d588a]">
                  Cancel
                </Button>
              )}
              <Button type="submit" className="bg-[#1d588a] hover:bg-[#00427A]">
                Submit Hours
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}