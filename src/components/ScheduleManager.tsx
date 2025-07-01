
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ClassSchedule {
  id: string;
  subject: string;
  instructor: string;
  room: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  authorizedStudents: string[];
}

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([
    {
      id: '1',
      subject: 'Computer Science 101',
      instructor: 'Dr. Smith',
      room: 'Room 301',
      dayOfWeek: 'monday',
      startTime: '09:00',
      endTime: '10:30',
      authorizedStudents: ['John Doe', 'Jane Smith', 'Bob Johnson']
    },
    {
      id: '2',
      subject: 'Mathematics',
      instructor: 'Prof. Johnson',
      room: 'Room 205',
      dayOfWeek: 'wednesday',
      startTime: '14:00',
      endTime: '15:30',
      authorizedStudents: ['Alice Brown', 'Charlie Wilson']
    }
  ]);

  const [formData, setFormData] = useState({
    subject: '',
    instructor: '',
    room: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    authorizedStudents: ''
  });

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const addSchedule = () => {
    if (!formData.subject || !formData.instructor || !formData.room || 
        !formData.dayOfWeek || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newSchedule: ClassSchedule = {
      id: Date.now().toString(),
      subject: formData.subject,
      instructor: formData.instructor,
      room: formData.room,
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      authorizedStudents: formData.authorizedStudents
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0)
    };

    setSchedules(prev => [...prev, newSchedule]);
    setFormData({
      subject: '',
      instructor: '',
      room: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      authorizedStudents: ''
    });
    toast.success('Schedule added successfully!');
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    toast.success('Schedule removed');
  };

  const getCurrentStatus = () => {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const activeClass = schedules.find(schedule => {
      const scheduleDay = schedule.dayOfWeek;
      return scheduleDay === currentDay && 
             currentTime >= schedule.startTime && 
             currentTime <= schedule.endTime;
    });

    return activeClass;
  };

  const activeClass = getCurrentStatus();

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeClass ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800">{activeClass.subject}</h3>
                  <p className="text-green-600">
                    Instructor: {activeClass.instructor} • Room: {activeClass.room}
                  </p>
                  <p className="text-sm text-green-500">
                    {activeClass.startTime} - {activeClass.endTime}
                  </p>
                </div>
                <div className="text-green-600 font-medium">
                  CLASS IN SESSION
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-green-700">
                  Authorized Students: {activeClass.authorizedStudents.join(', ')}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-600">No active class at this time</p>
              <p className="text-sm text-gray-500">Room is currently vacant</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Schedule Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject name"
                />
              </div>
              
              <div>
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  placeholder="Enter instructor name"
                />
              </div>
              
              <div>
                <Label htmlFor="room">Room *</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="Enter room number"
                />
              </div>
              
              <div>
                <Label htmlFor="dayOfWeek">Day of Week *</Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="authorizedStudents">Authorized Students</Label>
                <Input
                  id="authorizedStudents"
                  value={formData.authorizedStudents}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorizedStudents: e.target.value }))}
                  placeholder="Enter student names (comma separated)"
                />
              </div>
              
              <Button onClick={addSchedule} className="w-full">
                Add Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Class Schedules ({schedules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{schedule.subject}</h3>
                      <p className="text-sm text-gray-600">
                        {schedule.instructor} • {schedule.room}
                      </p>
                    </div>
                    <Button
                      onClick={() => deleteSchedule(schedule.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>
                      {daysOfWeek.find(d => d.value === schedule.dayOfWeek)?.label} • 
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                    <p className="mt-1">
                      Students: {schedule.authorizedStudents.length > 0 
                        ? schedule.authorizedStudents.join(', ') 
                        : 'No students assigned'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleManager;
