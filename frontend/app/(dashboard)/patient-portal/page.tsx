'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Calendar,
  FileText,
  Heart,
  Pill,
  TestTube,
  User,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  status: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: string;
}

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  status: string;
}

interface LabReport {
  id: string;
  date: string;
  testName: string;
  status: 'pending' | 'completed';
  result?: string;
  remarks?: string;
}

export default function PatientPortalPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);

  useEffect(() => {
    // Simulate loading patient data
    setTimeout(() => {
      // Mock data for demo - In production, fetch from API
      setMedicalRecords([
        {
          id: '1',
          date: '2025-12-01',
          type: 'OPD Visit',
          doctor: 'Dr. John Smith',
          diagnosis: 'Routine checkup - All vitals normal',
          status: 'Completed',
        },
        {
          id: '2',
          date: '2025-11-15',
          type: 'Follow-up',
          doctor: 'Dr. Sarah Johnson',
          diagnosis: 'Hypertension management',
          status: 'Completed',
        },
      ]);

      setAppointments([
        {
          id: '1',
          date: '2025-12-10',
          time: '10:00 AM',
          doctor: 'Dr. John Smith',
          department: 'Cardiology',
          status: 'scheduled',
          type: 'Consultation',
        },
        {
          id: '2',
          date: '2025-12-05',
          time: '2:00 PM',
          doctor: 'Dr. Emily Davis',
          department: 'General Medicine',
          status: 'completed',
          type: 'Follow-up',
        },
      ]);

      setPrescriptions([
        {
          id: 'PRE20251201001',
          date: '2025-12-01',
          doctor: 'Dr. John Smith',
          medicines: [
            {
              name: 'Aspirin',
              dosage: '500mg',
              frequency: 'Once daily',
              duration: '30 days',
            },
            {
              name: 'Vitamin D3',
              dosage: '1000IU',
              frequency: 'Once daily',
              duration: '30 days',
            },
          ],
          status: 'Active',
        },
      ]);

      setLabReports([
        {
          id: 'LAB20251201001',
          date: '2025-12-01',
          testName: 'Complete Blood Count (CBC)',
          status: 'completed',
          result: 'Normal',
          remarks: 'All parameters within normal range',
        },
        {
          id: 'LAB20251203001',
          date: '2025-12-03',
          testName: 'Lipid Profile',
          status: 'pending',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
      completed: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
      scheduled: { color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3 h-3" /> },
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle className="w-3 h-3" /> },
      cancelled: { color: 'bg-red-100 text-red-700', icon: <AlertCircle className="w-3 h-3" /> },
      active: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
    };

    const config = statusMap[status.toLowerCase()] || {
      color: 'bg-gray-100 text-gray-700',
      icon: <AlertCircle className="w-3 h-3" />
    };

    return (
      <Badge className={config.color}>
        {config.icon}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading your medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Portal</h1>
          <p className="text-muted-foreground">
            Access your medical records, appointments, and prescriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span className="font-medium">{user?.first_name || user?.email || 'Patient'}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter(a => a.status === 'scheduled').length}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Reports</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labReports.length}</div>
            <p className="text-xs text-muted-foreground">Total reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Overall health</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">
            <FileText className="w-4 h-4 mr-2" />
            Medical Records
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="w-4 h-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <Pill className="w-4 h-4 mr-2" />
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="lab">
            <TestTube className="w-4 h-4 mr-2" />
            Lab Reports
          </TabsTrigger>
        </TabsList>

        {/* Medical Records Tab */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Your complete medical record history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{record.type}</h3>
                        <p className="text-sm text-gray-600">{record.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{record.diagnosis}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
              <CardDescription>View and manage your upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{appointment.type}</h3>
                        <p className="text-sm text-gray-600">{appointment.doctor}</p>
                        <p className="text-sm text-gray-500">{appointment.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(appointment.date), 'MMM dd, yyyy')}</p>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
              <CardDescription>Your current medication prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Prescription #{prescription.id}</h3>
                        <p className="text-sm text-gray-600">{prescription.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(prescription.date), 'MMM dd, yyyy')}</p>
                        {getStatusBadge(prescription.status)}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {prescription.medicines.map((medicine, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-blue-900">{medicine.name}</p>
                              <p className="text-sm text-blue-700">{medicine.dosage}</p>
                            </div>
                            <Pill className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="mt-2 text-sm text-blue-800">
                            <p>Frequency: {medicine.frequency}</p>
                            <p>Duration: {medicine.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lab Reports Tab */}
        <TabsContent value="lab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Reports</CardTitle>
              <CardDescription>View your lab test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{report.testName}</h3>
                        <p className="text-sm text-gray-600">Report ID: {report.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(report.date), 'MMM dd, yyyy')}</p>
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                    {report.result && (
                      <div className="mt-3 bg-green-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-900">Result: {report.result}</p>
                        {report.remarks && (
                          <p className="text-sm text-green-700 mt-1">{report.remarks}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
