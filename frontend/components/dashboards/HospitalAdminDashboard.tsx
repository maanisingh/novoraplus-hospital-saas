'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCog, Bed, DollarSign, Activity, Calendar, Stethoscope, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HospitalAdminDashboardProps {
  user: any;
}

export default function HospitalAdminDashboard({ user }: HospitalAdminDashboardProps) {
  // Mock data - replace with actual API calls
  const stats = {
    totalPatients: 1250,
    totalStaff: 85,
    occupiedBeds: 42,
    totalBeds: 60,
    todayRevenue: 15000,
    todayAppointments: 45,
    pendingTests: 12,
    activeIPD: 42,
  };

  const departmentStats = [
    { name: 'Emergency', patients: 15, staff: 12, occupancy: 85 },
    { name: 'Surgery', patients: 8, staff: 15, occupancy: 60 },
    { name: 'Pediatrics', patients: 22, staff: 10, occupancy: 90 },
    { name: 'Cardiology', patients: 18, staff: 14, occupancy: 75 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Hospital Admin Dashboard</h1>
        <p className="text-muted-foreground">Complete hospital operations overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupiedBeds}/{stats.totalBeds}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.occupiedBeds / stats.totalBeds) * 100).toFixed(0)}% occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled OPD visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active IPD</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeIPD}</div>
            <p className="text-xs text-muted-foreground">Admitted patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Lab Tests</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTests}</div>
            <p className="text-xs text-muted-foreground">Awaiting results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OPD Queue</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Waiting patients</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Department Overview</CardTitle>
            <Link href="/departments">
              <Button variant="outline" size="sm">Manage Departments</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{dept.name}</p>
                  <p className="text-sm text-muted-foreground">{dept.staff} staff members</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{dept.patients} patients</p>
                  <p className="text-sm text-muted-foreground">{dept.occupancy}% occupancy</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Management Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/staff">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <UserCog className="h-8 w-8 text-primary" />
                <p className="font-medium">Manage Staff</p>
                <p className="text-xs text-muted-foreground">Add or edit staff members</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/departments">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Activity className="h-8 w-8 text-primary" />
                <p className="font-medium">Departments</p>
                <p className="text-xs text-muted-foreground">Configure departments</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/beds">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Bed className="h-8 w-8 text-primary" />
                <p className="font-medium">Bed Management</p>
                <p className="text-xs text-muted-foreground">Manage hospital beds</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/billing">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <p className="font-medium">Billing Overview</p>
                <p className="text-xs text-muted-foreground">View financial reports</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
