'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Clock, FileText, Pill, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DoctorDashboardProps {
  user: any;
}

export default function DoctorDashboard({ user }: DoctorDashboardProps) {
  const stats = {
    todayAppointments: 18,
    waiting: 6,
    completed: 12,
    myPatients: 145,
    pendingPrescriptions: 3,
    ipdRounds: 8,
  };

  const todaySchedule = [
    { time: '09:00 AM', patient: 'John Doe', type: 'Follow-up', status: 'completed' },
    { time: '09:30 AM', patient: 'Sarah Smith', type: 'New Consultation', status: 'completed' },
    { time: '10:00 AM', patient: 'Mike Johnson', type: 'Check-up', status: 'in-progress' },
    { time: '10:30 AM', patient: 'Emma Wilson', type: 'Follow-up', status: 'waiting' },
    { time: '11:00 AM', patient: 'David Brown', type: 'New Consultation', status: 'waiting' },
  ];

  const ipdPatients = [
    { id: '1', name: 'Robert Taylor', bed: 'ICU-5', condition: 'Post-Surgery', days: 3 },
    { id: '2', name: 'Lisa Anderson', bed: 'GW-12', condition: 'Pneumonia', days: 5 },
    { id: '3', name: 'James White', bed: 'PW-8', condition: 'Cardiac Monitoring', days: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Welcome, Dr. {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{stats.waiting} waiting</span> •
              <span className="text-green-600"> {stats.completed} completed</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myPatients}</div>
            <p className="text-xs text-muted-foreground">Total under my care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPD Rounds</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ipdRounds}</div>
            <p className="text-xs text-muted-foreground">Patients to visit today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Now</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waiting}</div>
            <p className="text-xs text-muted-foreground">Patients in queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPrescriptions}</div>
            <p className="text-xs text-muted-foreground">To be reviewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Consultations done</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's OPD Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's OPD Schedule</CardTitle>
            <Link href="/opd">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaySchedule.map((appt, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-medium text-sm">{appt.time}</p>
                  </div>
                  <div>
                    <p className="font-medium">{appt.patient}</p>
                    <p className="text-sm text-muted-foreground">{appt.type}</p>
                  </div>
                </div>
                <div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                    appt.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {appt.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* IPD Patients to Visit */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>IPD Patients - Today's Rounds</CardTitle>
            <Link href="/ipd">
              <Button variant="outline" size="sm">View All IPD</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ipdPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/ipd/${patient.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{patient.bed}</p>
                  <p className="text-xs text-muted-foreground">Day {patient.days}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/opd">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Calendar className="h-8 w-8 text-primary" />
                <p className="font-medium">OPD Queue</p>
                <p className="text-xs text-muted-foreground">Manage appointments</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patients">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="h-8 w-8 text-primary" />
                <p className="font-medium">My Patients</p>
                <p className="text-xs text-muted-foreground">View patient records</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/pharmacy">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Pill className="h-8 w-8 text-primary" />
                <p className="font-medium">Prescriptions</p>
                <p className="text-xs text-muted-foreground">Write prescriptions</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/lab">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <FileText className="h-8 w-8 text-primary" />
                <p className="font-medium">Lab Orders</p>
                <p className="text-xs text-muted-foreground">Order lab tests</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
