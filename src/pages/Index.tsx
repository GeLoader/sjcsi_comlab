
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FaceRegistration from '@/components/FaceRegistration';
import CameraMonitor from '@/components/CameraMonitor';
import ScheduleManager from '@/components/ScheduleManager';
import AlertsPanel from '@/components/AlertsPanel';
import { Camera, Users, Calendar, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('monitor');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Classroom Face Recognition System
          </h1>
          <p className="text-lg text-gray-600">
            AI-Powered Attendance & Security Monitoring
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Live Monitor
            </TabsTrigger>
            <TabsTrigger value="registration" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Registration
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor">
            <CameraMonitor />
          </TabsContent>

          <TabsContent value="registration">
            <FaceRegistration />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleManager />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
