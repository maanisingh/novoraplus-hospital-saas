'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Calendar, TrendingUp, Clock, CheckCircle, ClipboardList, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PhysiotherapistDashboardProps {
  user: any;
}

export default function PhysiotherapistDashboard({ user }: PhysiotherapistDashboardProps) {
  const stats = {
    activePatients: 48,
    todaysSessions: 12,
    completedSessions: 8,
    pendingSessions: 4,
    newPatients: 5,
    inProgressPlans: 42,
    avgProgressRate: 87.5,
    equipmentInUse: 15,
  };

  const todaysSessions = [
    { time: '09:00 AM', patient: 'Mr. Gupta', type: 'Post-Surgery Rehab', sessionNo: 8, progress: 75 },
    { time: '10:00 AM', patient: 'Mrs. Sharma', type: 'Stroke Recovery', sessionNo: 15, progress: 60 },
    { time: '11:30 AM', patient: 'Mr. Kumar', type: 'Sports Injury', sessionNo: 5, progress: 85 },
    { time: '02:00 PM', patient: 'Ms. Patel', type: 'Back Pain Treatment', sessionNo: 12, progress: 70 },
  ];

  const patientProgress = [
    { patient: 'John Smith', condition: 'Knee Replacement', sessions: 12, totalSessions: 20, progress: 60, lastSession: '2024-12-03' },
    { patient: 'Sarah Johnson', condition: 'Spinal Injury', sessions: 18, totalSessions: 25, progress: 72, lastSession: '2024-12-04' },
    { patient: 'Mike Wilson', condition: 'Shoulder Dislocation', sessions: 8, totalSessions: 10, progress: 80, lastSession: '2024-12-02' },
    { patient: 'Emma Davis', condition: 'Hip Fracture', sessions: 15, totalSessions: 30, progress: 50, lastSession: '2024-12-04' },
  ];

  const exerciseCategories = [
    { name: 'Strength Training', patients: 18, percentage: 38 },
    { name: 'Mobility Exercises', patients: 15, percentage: 31 },
    { name: 'Balance Training', patients: 8, percentage: 17 },
    { name: 'Pain Management', patients: 5, percentage: 10 },
    { name: 'Cardio Rehab', patients: 2, percentage: 4 },
  ];

  const upcomingAssessments = [
    { patient: 'Robert Taylor', type: 'Progress Evaluation', scheduledDate: '2024-12-05', currentWeek: 4 },
    { patient: 'Lisa Anderson', type: 'Initial Assessment', scheduledDate: '2024-12-06', currentWeek: 1 },
    { patient: 'James White', type: 'Final Evaluation', scheduledDate: '2024-12-08', currentWeek: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Physiotherapist Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePatients}</div>
            <p className="text-xs text-muted-foreground">Under treatment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaysSessions}</div>
            <p className="text-xs text-muted-foreground">{stats.completedSessions} completed, {stats.pendingSessions} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sessions</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSessions}</div>
            <p className="text-xs text-muted-foreground">Remaining today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newPatients}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Plans</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressPlans}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgressRate}%</div>
            <p className="text-xs text-muted-foreground">All active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment in Use</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipmentInUse}</div>
            <p className="text-xs text-muted-foreground">Active equipment</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Exercise Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Create Treatment Plan
            </Button>
            <Button className="w-full" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
            <Button className="w-full" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Record Session Notes
            </Button>
            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Patient Progress Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exerciseCategories.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.patients} patients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Therapy Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todaysSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{session.time}</p>
                  <p className="text-sm text-muted-foreground">{session.patient}</p>
                  <p className="text-xs text-muted-foreground">{session.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Session {session.sessionNo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${session.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{session.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {patientProgress.map((patient, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{patient.patient}</p>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{patient.sessions}/{patient.totalSessions} sessions</p>
                    <p className="text-xs text-muted-foreground">Last: {patient.lastSession}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${patient.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-blue-600">{patient.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingAssessments.map((assessment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{assessment.patient}</p>
                  <p className="text-sm text-muted-foreground">{assessment.type}</p>
                  <p className="text-xs text-muted-foreground">Week {assessment.currentWeek}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{assessment.scheduledDate}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    assessment.type === 'Initial Assessment'
                      ? 'bg-blue-100 text-blue-700'
                      : assessment.type === 'Final Evaluation'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {assessment.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
