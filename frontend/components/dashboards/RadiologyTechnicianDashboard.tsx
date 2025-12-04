'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Clock, CheckCircle2, AlertCircle, Camera, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface RadiologyTechnicianDashboardProps {
  user: any;
}

export default function RadiologyTechnicianDashboard({ user }: RadiologyTechnicianDashboardProps) {
  const stats = {
    pendingScans: 14,
    inProgress: 3,
    completedToday: 28,
    urgentScans: 2,
    awaitingReport: 9,
    totalScheduled: 35,
  };

  const pendingScans = [
    { id: '1', patient: 'John Doe', scanType: 'Chest X-Ray', priority: 'urgent', ordered: '09:00 AM', doctor: 'Dr. Smith' },
    { id: '2', patient: 'Sarah Miller', scanType: 'CT Scan - Abdomen', priority: 'urgent', ordered: '09:30 AM', doctor: 'Dr. Johnson' },
    { id: '3', patient: 'Mike Wilson', scanType: 'MRI - Brain', priority: 'normal', ordered: '10:00 AM', doctor: 'Dr. Brown' },
    { id: '4', patient: 'Emma Davis', scanType: 'X-Ray - Knee', priority: 'normal', ordered: '10:15 AM', doctor: 'Dr. White' },
  ];

  const inProgressScans = [
    { id: '5', patient: 'Robert Taylor', scanType: 'CT Scan - Chest', status: 'scanning', timeRemaining: '10 min' },
    { id: '6', patient: 'Lisa Anderson', scanType: 'MRI - Spine', status: 'processing', timeRemaining: '25 min' },
  ];

  const awaitingReportScans = [
    { id: '7', patient: 'James White', scanType: 'X-Ray - Chest', completedAt: '11:45 AM', radiologist: 'Dr. Martinez' },
    { id: '8', patient: 'Mary Johnson', scanType: 'Ultrasound - Abdomen', completedAt: '11:30 AM', radiologist: 'Dr. Lee' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Radiology Technician Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Scans</CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingScans}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{stats.urgentScans} urgent</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently scanning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+10%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Scans</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentScans}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Report</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awaitingReport}</div>
            <p className="text-xs text-muted-foreground">Ready for radiologist</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScheduled}</div>
            <p className="text-xs text-muted-foreground">Today's schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Scans - Priority Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Urgent Scans - Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingScans.filter(s => s.priority === 'urgent').map((scan) => (
              <Link
                key={scan.id}
                href={`/radiology/${scan.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-red-200 hover:border-red-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-red-900">{scan.patient}</p>
                  <p className="text-sm text-red-700">{scan.scanType}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ordered by {scan.doctor} at {scan.ordered}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  URGENT
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Scans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Scans</CardTitle>
            <Link href="/radiology">
              <Button variant="outline" size="sm">View All Scans</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingScans.filter(s => s.priority === 'normal').map((scan) => (
              <Link
                key={scan.id}
                href={`/radiology/${scan.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{scan.patient}</p>
                  <p className="text-sm text-muted-foreground">{scan.scanType}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ordered by {scan.doctor} at {scan.ordered}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Normal
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* In Progress Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Scans in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inProgressScans.map((scan) => (
              <Link
                key={scan.id}
                href={`/radiology/${scan.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div>
                  <p className="font-medium">{scan.patient}</p>
                  <p className="text-sm text-muted-foreground">{scan.scanType}</p>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {scan.status}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{scan.timeRemaining}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Awaiting Radiology Report */}
      <Card>
        <CardHeader>
          <CardTitle>Completed - Awaiting Radiology Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {awaitingReportScans.map((scan) => (
              <Link
                key={scan.id}
                href={`/radiology/${scan.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{scan.patient}</p>
                  <p className="text-sm text-muted-foreground">{scan.scanType}</p>
                  <p className="text-xs text-muted-foreground mt-1">Assigned to {scan.radiologist}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{scan.completedAt}</p>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 mt-1">
                    pending-report
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/radiology">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Scan className="h-8 w-8 text-primary" />
                <p className="font-medium">All Scans</p>
                <p className="text-xs text-muted-foreground">View all imaging</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/radiology">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Camera className="h-8 w-8 text-primary" />
                <p className="font-medium">Start Scan</p>
                <p className="text-xs text-muted-foreground">Begin imaging</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/radiology">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <FileText className="h-8 w-8 text-primary" />
                <p className="font-medium">Upload Images</p>
                <p className="text-xs text-muted-foreground">Add scan results</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patients">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <p className="font-medium">Reports</p>
                <p className="text-xs text-muted-foreground">View statistics</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
