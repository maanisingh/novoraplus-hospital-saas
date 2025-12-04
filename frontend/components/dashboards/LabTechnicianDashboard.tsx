'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, Clock, CheckCircle2, AlertCircle, TrendingUp, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LabTechnicianDashboardProps {
  user: any;
}

export default function LabTechnicianDashboard({ user }: LabTechnicianDashboardProps) {
  const stats = {
    pendingTests: 18,
    inProgress: 5,
    completedToday: 32,
    urgentTests: 3,
    awaitingApproval: 7,
    totalSamples: 45,
  };

  const pendingTests = [
    { id: '1', patient: 'John Doe', test: 'Complete Blood Count (CBC)', priority: 'urgent', ordered: '09:00 AM', doctor: 'Dr. Smith' },
    { id: '2', patient: 'Sarah Miller', test: 'Lipid Profile', priority: 'normal', ordered: '09:30 AM', doctor: 'Dr. Johnson' },
    { id: '3', patient: 'Mike Wilson', test: 'Thyroid Function Test', priority: 'urgent', ordered: '10:00 AM', doctor: 'Dr. Brown' },
    { id: '4', patient: 'Emma Davis', test: 'Blood Sugar (Fasting)', priority: 'normal', ordered: '10:15 AM', doctor: 'Dr. White' },
  ];

  const inProgressTests = [
    { id: '5', patient: 'Robert Taylor', test: 'Liver Function Test', status: 'processing', timeRemaining: '15 min' },
    { id: '6', patient: 'Lisa Anderson', test: 'Kidney Function Test', status: 'analyzing', timeRemaining: '30 min' },
  ];

  const completedTests = [
    { id: '7', patient: 'James White', test: 'Complete Blood Count', status: 'pending-review', completedAt: '11:45 AM' },
    { id: '8', patient: 'Mary Johnson', test: 'Urine Analysis', status: 'approved', completedAt: '11:30 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Lab Technician Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTests}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{stats.urgentTests} urgent</span>
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
            <p className="text-xs text-muted-foreground">Currently processing</p>
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
              <span className="text-green-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tests</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentTests}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Approval</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awaitingApproval}</div>
            <p className="text-xs text-muted-foreground">Ready for doctor review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSamples}</div>
            <p className="text-xs text-muted-foreground">Collected today</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Tests - Priority Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Urgent Tests - Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTests.filter(t => t.priority === 'urgent').map((test) => (
              <Link
                key={test.id}
                href={`/lab/${test.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-red-200 hover:border-red-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-red-900">{test.patient}</p>
                  <p className="text-sm text-red-700">{test.test}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ordered by {test.doctor} at {test.ordered}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  URGENT
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Tests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Tests</CardTitle>
            <Link href="/lab">
              <Button variant="outline" size="sm">View All Tests</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTests.filter(t => t.priority === 'normal').map((test) => (
              <Link
                key={test.id}
                href={`/lab/${test.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{test.patient}</p>
                  <p className="text-sm text-muted-foreground">{test.test}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ordered by {test.doctor} at {test.ordered}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Normal
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* In Progress Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Tests in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inProgressTests.map((test) => (
              <Link
                key={test.id}
                href={`/lab/${test.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div>
                  <p className="font-medium">{test.patient}</p>
                  <p className="text-sm text-muted-foreground">{test.test}</p>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {test.status}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{test.timeRemaining}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Completed */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Completed - Awaiting Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedTests.map((test) => (
              <Link
                key={test.id}
                href={`/lab/${test.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{test.patient}</p>
                  <p className="text-sm text-muted-foreground">{test.test}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{test.completedAt}</p>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    test.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {test.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/lab">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <FlaskConical className="h-8 w-8 text-primary" />
                <p className="font-medium">All Tests</p>
                <p className="text-xs text-muted-foreground">View all lab tests</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/lab">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Clock className="h-8 w-8 text-primary" />
                <p className="font-medium">Start Test</p>
                <p className="text-xs text-muted-foreground">Begin processing</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/lab">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <FileText className="h-8 w-8 text-primary" />
                <p className="font-medium">Enter Results</p>
                <p className="text-xs text-muted-foreground">Update test results</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patients">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <TrendingUp className="h-8 w-8 text-primary" />
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
