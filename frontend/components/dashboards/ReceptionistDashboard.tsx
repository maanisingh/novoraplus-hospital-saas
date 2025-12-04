'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Clock, DollarSign, FileText, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ReceptionistDashboardProps {
  user: any;
}

export default function ReceptionistDashboard({ user }: ReceptionistDashboardProps) {
  const stats = {
    todayRegistrations: 24,
    waitingQueue: 12,
    todayRevenue: 15000,
    pendingBills: 8,
    totalPatients: 1250,
    todayAppointments: 45,
  };

  const waitingQueue = [
    { token: 'OPD-001', patient: 'John Doe', doctor: 'Dr. Smith', time: '09:00 AM', status: 'waiting' },
    { token: 'OPD-002', patient: 'Sarah Miller', doctor: 'Dr. Johnson', time: '09:15 AM', status: 'in-consultation' },
    { token: 'OPD-003', patient: 'Mike Wilson', doctor: 'Dr. Smith', time: '09:30 AM', status: 'waiting' },
    { token: 'OPD-004', patient: 'Emma Davis', doctor: 'Dr. Brown', time: '09:45 AM', status: 'waiting' },
  ];

  const pendingPayments = [
    { id: '1', patient: 'Robert Taylor', amount: 2500, service: 'Consultation + Lab', status: 'pending' },
    { id: '2', patient: 'Lisa Anderson', amount: 1200, service: 'Medicine', status: 'pending' },
    { id: '3', patient: 'James White', amount: 3500, service: 'X-Ray + Consultation', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Receptionist Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Registrations</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayRegistrations}</div>
            <p className="text-xs text-muted-foreground">New patient registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Queue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitingQueue}</div>
            <p className="text-xs text-muted-foreground">Patients waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total collections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBills}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">In database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Current OPD Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current OPD Queue</CardTitle>
            <Link href="/opd">
              <Button variant="outline" size="sm">Manage Queue</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {waitingQueue.map((item) => (
              <div key={item.token} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="font-mono font-bold text-primary">
                    {item.token}
                  </div>
                  <div>
                    <p className="font-medium">{item.patient}</p>
                    <p className="text-sm text-muted-foreground">{item.doctor} • {item.time}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'in-consultation' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Payments</CardTitle>
            <Link href="/billing">
              <Button variant="outline" size="sm">View All Bills</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingPayments.map((payment) => (
              <Link
                key={payment.id}
                href={`/billing/${payment.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{payment.patient}</p>
                  <p className="text-sm text-muted-foreground">{payment.service}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{payment.amount.toLocaleString()}</p>
                  <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 mt-1">
                    {payment.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/patients">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <UserPlus className="h-8 w-8 text-primary" />
                <p className="font-medium">Register Patient</p>
                <p className="text-xs text-muted-foreground">Add new patient</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/opd">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Calendar className="h-8 w-8 text-primary" />
                <p className="font-medium">Book Appointment</p>
                <p className="text-xs text-muted-foreground">Schedule OPD visit</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/billing">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <p className="font-medium">Generate Bill</p>
                <p className="text-xs text-muted-foreground">Create invoice</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patients">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="h-8 w-8 text-primary" />
                <p className="font-medium">Search Patient</p>
                <p className="text-xs text-muted-foreground">Find records</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
