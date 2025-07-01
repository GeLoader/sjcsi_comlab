
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { playVoiceAlert } from '@/utils/voiceAlerts';

interface Detection {
  id: string;
  name: string;
  confidence: number;
  authorized: boolean;
  timestamp: Date;
}

const CameraMonitor = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [currentStatus, setCurrentStatus] = useState<'secure' | 'alert' | 'unauthorized'>('secure');

  useEffect(() => {
    if (isMonitoring) {
      startCamera();
      const interval = setInterval(performFaceDetection, 2000);
      return () => clearInterval(interval);
    } else {
      stopCamera();
    }
  }, [isMonitoring]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      toast.success('Camera started successfully');
    } catch (error) {
      toast.error('Failed to access camera');
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const performFaceDetection = () => {
    // Simulate face detection - in real implementation, this would use ML models
    const mockDetections: Detection[] = [
      {
        id: '1',
        name: 'John Smith',
        confidence: 0.95,
        authorized: true,
        timestamp: new Date()
      },
      {
        id: '2',
        name: 'Unknown Person',
        confidence: 0.87,
        authorized: false,
        timestamp: new Date()
      }
    ];

    // Simulate random detections
    if (Math.random() > 0.7) {
      const detection = mockDetections[Math.floor(Math.random() * mockDetections.length)];
      setDetections(prev => [detection, ...prev.slice(0, 9)]);
      
      if (!detection.authorized) {
        setCurrentStatus('unauthorized');
        playVoiceAlert('unauthorized');
        toast.error(`Unauthorized person detected: ${detection.name}`);
      } else {
        setCurrentStatus('secure');
        toast.success(`Authorized person detected: ${detection.name}`);
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob and save
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `capture-${Date.now()}.png`;
            a.click();
            toast.success('Image captured successfully');
          }
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Camera Feed */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Live Camera Feed
            </span>
            <Badge 
              variant={currentStatus === 'secure' ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {currentStatus === 'secure' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              {currentStatus.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-96 bg-gray-900 rounded-lg object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Detection Overlay */}
            {detections.length > 0 && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded">
                <div className="text-sm">
                  Last Detection: {detections[0].name}
                </div>
                <div className="text-xs opacity-75">
                  Confidence: {(detections[0].confidence * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? 'destructive' : 'default'}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
            <Button
              onClick={captureImage}
              variant="outline"
              disabled={!isMonitoring}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Capture Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detection History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Detections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {detections.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No detections yet. Start monitoring to see results.
              </p>
            ) : (
              detections.map((detection) => (
                <div
                  key={`${detection.id}-${detection.timestamp.getTime()}`}
                  className={`p-3 rounded-lg border ${
                    detection.authorized 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{detection.name}</div>
                      <div className="text-sm text-gray-500">
                        {detection.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge
                      variant={detection.authorized ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {detection.authorized ? 'Authorized' : 'Unauthorized'}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Confidence: {(detection.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraMonitor;
