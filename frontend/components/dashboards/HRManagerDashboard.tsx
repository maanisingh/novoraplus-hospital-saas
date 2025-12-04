'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Calendar, DollarSign, Clock, AlertCircle, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HRManagerDashboardProps {
  user: any;
}

export default function HRManagerDashboard({ user }: HRManagerDashboardProps) {
  const stats = {
    totalEmployees: 245,
    activeRecruitment: 12,
    pendingApprovals: 8,
    monthlyPayroll: 1850000,
    avgAttendance: 94.5,
    leaveRequests: 15,
    newHires: 6,
    turnoverRate: 3.2,
  };

  const recentHires = [
    { name: 'Dr. Priya Sharma', position: 'Cardiologist', department: 'Cardiology', joinDate: '2024-12-01' },
    { name: 'Nurse Ravi Kumar', position: 'Staff Nurse', department: 'Emergency', joinDate: '2024-11-28' },
    { name: 'Anita Desai', position: 'Lab Technician', department: 'Laboratory', joinDate: '2024-11-25' },
    { name: 'Rajesh Patel', position: 'Pharmacist', department: 'Pharmacy', joinDate: '2024-11-22' },
  ];

  const pendingLeaves = [
    { employee: 'Dr. Amit Verma', type: 'Sick Leave', duration: '3 days', startDate: '2024-12-10', status: 'pending' },
    { employee: 'Nurse Maya Singh', type: 'Casual Leave', duration: '2 days', startDate: '2024-12-08', status: 'pending' },
    { employee: 'Suresh Kumar', type: 'Annual Leave', duration: '5 days', startDate: '2024-12-15', status: 'pending' },
  ];

  const departmentStats = [
    { department: 'Medical Staff', count: 85, percentage: 35 },
    { department: 'Nursing', count: 65, percentage: 27 },
    { department: 'Support Staff', count: 48, percentage: 20 },
    { department: 'Administrative', count: 32, percentage: 13 },
    { department: 'Technical', count: 15, percentage: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">HR Manager Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recruitment</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRecruitment}</div>
            <p className="text-xs text-muted-foreground">Open positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total salary expense</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leaveRequests}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Requires action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires (Month)</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newHires}</div>
            <p className="text-xs text-muted-foreground">Onboarded this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.turnoverRate}%</div>
            <p className="text-xs text-muted-foreground">Annual rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Department Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Post New Job Opening
            </Button>
            <Button className="w-full" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Approve Leave Requests
            </Button>
            <Button className="w-full" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Process Payroll
            </Button>
            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Employee Directory
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentStats.map((dept, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{dept.department}</span>
                    <span className="text-muted-foreground">{dept.count} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{dept.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pendingLeaves.map((leave, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{leave.employee}</p>
                  <p className="text-sm text-muted-foreground">{leave.type}</p>
                  <p className="text-xs text-muted-foreground">From: {leave.startDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{leave.duration}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="text-green-600">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Hires */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Hires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentHires.map((hire, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{hire.name}</p>
                  <p className="text-sm text-muted-foreground">{hire.position}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{hire.department}</p>
                  <p className="text-xs text-muted-foreground">{hire.joinDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
