'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Archive, FolderOpen, Upload, Download, Search, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MedicalRecordsDashboardProps {
  user: any;
}

export default function MedicalRecordsDashboard({ user }: MedicalRecordsDashboardProps) {
  const stats = {
    totalRecords: 12450,
    newRecordsToday: 48,
    pendingScanning: 125,
    archivedRecords: 8900,
    recordsRequested: 22,
    incompleteRecords: 15,
    digitalizedRecords: 9850,
    digitalizationRate: 79.1,
  };

  const recentRecords = [
    { id: 'MR-2024-1245', patient: 'John Smith', type: 'Consultation', doctor: 'Dr. Sharma', date: '2024-12-04', status: 'complete' },
    { id: 'MR-2024-1246', patient: 'Sarah Johnson', type: 'Lab Reports', doctor: 'Dr. Patel', date: '2024-12-04', status: 'pending' },
    { id: 'MR-2024-1247', patient: 'Mike Wilson', type: 'Surgery Notes', doctor: 'Dr. Kumar', date: '2024-12-04', status: 'complete' },
    { id: 'MR-2024-1248', patient: 'Emma Davis', type: 'Imaging', doctor: 'Dr. Reddy', date: '2024-12-04', status: 'complete' },
  ];

  const recordRequests = [
    { id: 'REQ-245', patient: 'Robert Taylor', requestedBy: 'Dr. Singh', purpose: 'Consultation', date: '2024-12-04', urgency: 'high' },
    { id: 'REQ-246', patient: 'Lisa Anderson', requestedBy: 'Dr. Gupta', purpose: 'Follow-up', date: '2024-12-04', urgency: 'medium' },
    { id: 'REQ-247', patient: 'James White', requestedBy: 'Insurance Dept', purpose: 'Claim Processing', date: '2024-12-03', urgency: 'low' },
  ];

  const scanningQueue = [
    { patient: 'Anil Kumar', documents: '15 pages', type: 'Historical Records', priority: 'Normal' },
    { patient: 'Priya Sharma', documents: '8 pages', type: 'Lab Reports', priority: 'High' },
    { patient: 'Rajesh Patel', documents: '22 pages', type: 'Surgery Notes', priority: 'Normal' },
    { patient: 'Meena Singh', documents: '5 pages', type: 'Prescriptions', priority: 'High' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Medical Records Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All patient records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Records Today</CardTitle>
            <Upload className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newRecordsToday}</div>
            <p className="text-xs text-muted-foreground">Added today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Scanning</CardTitle>
            <FolderOpen className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingScanning}</div>
            <p className="text-xs text-muted-foreground">Awaiting digitization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived Records</CardTitle>
            <Archive className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archivedRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">In archive storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records Requested</CardTitle>
            <Search className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recordsRequested}</div>
            <p className="text-xs text-muted-foreground">Pending retrieval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incomplete Records</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incompleteRecords}</div>
            <p className="text-xs text-muted-foreground">Requires completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Records</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.digitalizedRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Fully digitalized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digitalization Rate</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.digitalizationRate}%</div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Record Requests */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search Records
            </Button>
            <Button className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Records
            </Button>
            <Button className="w-full" variant="outline">
              <Archive className="mr-2 h-4 w-4" />
              Archive Old Records
            </Button>
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Record Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recordRequests.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{request.patient}</p>
                    <p className="text-xs text-muted-foreground">{request.requestedBy}</p>
                    <p className="text-xs text-muted-foreground">{request.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      request.urgency === 'high'
                        ? 'bg-red-100 text-red-700'
                        : request.urgency === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {request.urgency}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scanning Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Scanning Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scanningQueue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.patient}</p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{item.documents}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.priority === 'High'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{record.id}</p>
                  <p className="text-sm text-muted-foreground">{record.patient}</p>
                  <p className="text-xs text-muted-foreground">{record.doctor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{record.type}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    record.status === 'complete'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {record.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
