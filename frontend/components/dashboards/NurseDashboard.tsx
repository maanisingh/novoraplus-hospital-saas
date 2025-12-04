'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Bed, Clock, Thermometer, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NurseDashboardProps {
  user: any;
}

export default function NurseDashboard({ user }: NurseDashboardProps) {
  const stats = {
    assignedPatients: 12,
    vitalsToRecord: 8,
    medicationsDue: 5,
    criticalAlerts: 2,
    completedTasks: 15,
    pendingAdmissions: 3,
  };

  const vitalsSchedule = [
    { id: '1', patient: 'Robert Taylor', bed: 'ICU-5', time: '09:00 AM', status: 'completed' },
    { id: '2', patient: 'Lisa Anderson', bed: 'GW-12', time: '09:30 AM', status: 'completed' },
    { id: '3', patient: 'James White', bed: 'PW-8', time: '10:00 AM', status: 'pending' },
    { id: '4', patient: 'Mary Davis', bed: 'ICU-3', time: '10:30 AM', status: 'pending' },
  ];

  const criticalPatients = [
    { id: '1', name: 'Robert Taylor', bed: 'ICU-5', alert: 'BP High', severity: 'high' },
    { id: '2', name: 'Mary Davis', bed: 'ICU-3', alert: 'Low O2', severity: 'critical' },
  ];

  const medicationSchedule = [
    { patient: 'Lisa Anderson', bed: 'GW-12', medication: 'Amoxicillin 500mg', time: '10:00 AM', status: 'due' },
    { patient: 'James White', bed: 'PW-8', medication: 'Insulin', time: '11:00 AM', status: 'due' },
    { patient: 'Sarah Miller', bed: 'GW-8', medication: 'Paracetamol', time: '11:30 AM', status: 'scheduled' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Patients</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedPatients}</div>
            <p className="text-xs text-muted-foreground">Under your care today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vitals to Record</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vitalsToRecord}</div>
            <p className="text-xs text-muted-foreground">Pending vital signs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medications Due</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.medicationsDue}</div>
            <p className="text-xs text-muted-foreground">Next 2 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">Today's progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Admissions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAdmissions}</div>
            <p className="text-xs text-muted-foreground">To be processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalPatients.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalPatients.map((patient) => (
                <Link
                  key={patient.id}
                  href={`/ipd/${patient.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white border border-red-200 hover:border-red-300 transition-colors"
                >
                  <div>
                    <p className="font-medium text-red-900">{patient.name}</p>
                    <p className="text-sm text-red-700">{patient.bed} • {patient.alert}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    patient.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {patient.severity}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vitals Recording Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vitals Recording Schedule</CardTitle>
            <Link href="/ipd">
              <Button variant="outline" size="sm">View All Patients</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vitalsSchedule.map((item) => (
              <Link
                key={item.id}
                href={`/ipd/${item.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-medium text-sm">{item.time}</p>
                  </div>
                  <div>
                    <p className="font-medium">{item.patient}</p>
                    <p className="text-sm text-muted-foreground">{item.bed}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medication Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medicationSchedule.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{med.patient}</p>
                  <p className="text-sm text-muted-foreground">{med.bed} • {med.medication}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{med.time}</p>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    med.status === 'due' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {med.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/ipd">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Bed className="h-8 w-8 text-primary" />
                <p className="font-medium">IPD Patients</p>
                <p className="text-xs text-muted-foreground">View all patients</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/ipd">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Thermometer className="h-8 w-8 text-primary" />
                <p className="font-medium">Record Vitals</p>
                <p className="text-xs text-muted-foreground">Update vital signs</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/pharmacy">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Clock className="h-8 w-8 text-primary" />
                <p className="font-medium">Medications</p>
                <p className="text-xs text-muted-foreground">Administer meds</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patients">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Activity className="h-8 w-8 text-primary" />
                <p className="font-medium">Patient Records</p>
                <p className="text-xs text-muted-foreground">View history</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
