
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Eye, Camera, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'unauthorized' | 'prohibited_item' | 'distraction' | 'violation';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  image?: string;
  location: string;
  resolved: boolean;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'unauthorized',
      message: 'Unknown person detected in classroom',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      severity: 'high',
      location: 'Room 301',
      resolved: false
    },
    {
      id: '2',
      type: 'prohibited_item',
      message: 'Person wearing face mask detected',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      severity: 'medium',
      location: 'Room 301',
      resolved: false
    },
    {
      id: '3',
      type: 'distraction',
      message: 'Student using mobile phone during class',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      severity: 'low',
      location: 'Room 205',
      resolved: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const alertTypes = ['unauthorized', 'prohibited_item', 'distraction', 'violation'] as const;
        const severities = ['low', 'medium', 'high'] as const;
        const locations = ['Room 301', 'Room 205', 'Room 102'];
        const messages = {
          unauthorized: 'Unauthorized person detected',
          prohibited_item: 'Person with prohibited item detected',
          distraction: 'Student distraction detected',
          violation: 'Class rule violation detected'
        };

        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const newAlert: Alert = {
          id: Date.now().toString(),
          type,
          message: messages[type],
          timestamp: new Date(),
          severity: severities[Math.floor(Math.random() * severities.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          resolved: false
        };

        setAlerts(prev => [newAlert, ...prev]);
        toast.error(`New ${type.replace('_', ' ')} alert: ${newAlert.message}`);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'unauthorized': return <AlertTriangle className="w-4 h-4" />;
      case 'prohibited_item': return <Eye className="w-4 h-4" />;
      case 'distraction': return <Camera className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const markAsResolved = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    toast.success('Alert marked as resolved');
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast.success('Alert deleted');
  };

  const exportAlerts = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Type,Message,Timestamp,Severity,Location,Resolved\n" +
      alerts.map(alert => 
        `${alert.id},${alert.type},${alert.message},${alert.timestamp.toISOString()},${alert.severity},${alert.location},${alert.resolved}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alerts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Alerts exported successfully');
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'resolved') return alert.resolved;
    if (filter === 'unresolved') return !alert.resolved;
    return true;
  });

  const unresolvedCount = alerts.filter(alert => !alert.resolved).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{unresolvedCount}</div>
            <div className="text-sm text-gray-600">Unresolved Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.resolved).length}
            </div>
            <div className="text-sm text-gray-600">Resolved Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{alerts.length}</div>
            <div className="text-sm text-gray-600">Total Alerts</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Alerts Panel */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Security Alerts
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unresolved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unresolved')}
              >
                Unresolved
              </Button>
              <Button
                variant={filter === 'resolved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('resolved')}
              >
                Resolved
              </Button>
              <Button
                onClick={exportAlerts}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredAlerts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No alerts found for the selected filter.
              </p>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${
                    alert.resolved ? 'bg-gray-50' : 'bg-white'
                  } ${
                    alert.severity === 'high' && !alert.resolved ? 'border-red-200' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(alert.type)}
                      <span className="font-medium">{alert.message}</span>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {alert.resolved && (
                        <Badge variant="outline" className="text-green-600">
                          RESOLVED
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!alert.resolved && (
                        <Button
                          onClick={() => markAsResolved(alert.id)}
                          variant="outline"
                          size="sm"
                        >
                          Resolve
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteAlert(alert.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Location: {alert.location}</p>
                    <p>Time: {alert.timestamp.toLocaleString()}</p>
                    <p>Type: {alert.type.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  
                  {alert.image && (
                    <div className="mt-3">
                      <img
                        src={alert.image}
                        alt="Alert evidence"
                        className="w-32 h-24 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPanel;
