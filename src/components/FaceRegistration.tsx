
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Users, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegisteredPerson {
  id: string;
  name: string;
  role: 'student' | 'instructor';
  studentId?: string;
  department: string;
  imageData: string;
  registeredAt: Date;
}

const FaceRegistration = () => {
  const [registeredPeople, setRegisteredPeople] = useState<RegisteredPerson[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'student' as 'student' | 'instructor',
    studentId: '',
    department: ''
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      toast.error('Failed to access camera');
      console.error('Camera error:', error);
    }
  };

  const stopCapture = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };

  const captureAndRegister = () => {
    if (!formData.name || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        const newPerson: RegisteredPerson = {
          id: Date.now().toString(),
          name: formData.name,
          role: formData.role,
          studentId: formData.studentId,
          department: formData.department,
          imageData,
          registeredAt: new Date()
        };
        
        setRegisteredPeople(prev => [...prev, newPerson]);
        setFormData({
          name: '',
          role: 'student',
          studentId: '',
          department: ''
        });
        
        stopCapture();
        toast.success(`${formData.name} registered successfully!`);
      }
    }
  };

  const deletePerson = (id: string) => {
    setRegisteredPeople(prev => prev.filter(person => person.id !== id));
    toast.success('Person removed from registry');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Register New Person
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'student' | 'instructor') => 
                  setFormData(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.role === 'student' && (
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                  placeholder="Enter student ID"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Enter department"
              />
            </div>
            
            {/* Camera Feed */}
            <div className="space-y-2">
              <Label>Face Capture</Label>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 bg-gray-900 rounded-lg object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-2">
                {!isCapturing ? (
                  <Button onClick={startCapture} className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={captureAndRegister} className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Capture & Register
                    </Button>
                    <Button onClick={stopCapture} variant="outline">
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registered People */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Registered People ({registeredPeople.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {registeredPeople.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No people registered yet. Register someone to get started.
              </p>
            ) : (
              registeredPeople.map((person) => (
                <div key={person.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <img
                    src={person.imageData}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-gray-500">
                      {person.role === 'student' ? `Student ID: ${person.studentId}` : 'Instructor'}
                    </div>
                    <div className="text-xs text-gray-400">{person.department}</div>
                  </div>
                  <Button
                    onClick={() => deletePerson(person.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaceRegistration;
