'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, TrendingUp, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SuperAdminDashboardProps {
  user: any;
}

export default function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  // Mock data - replace with actual API calls
  const stats = {
    totalHospitals: 45,
    activeHospitals: 42,
    totalUsers: 1250,
    activeSubscriptions: 42,
    monthlyRevenue: 125000,
    pendingIssues: 8,
  };

  const recentHospitals = [
    { id: '1', name: 'City General Hospital', status: 'active', plan: 'Enterprise', users: 85 },
    { id: '2', name: 'Metro Care Center', status: 'active', plan: 'Professional', users: 45 },
    { id: '3', name: 'Valley Medical', status: 'trial', plan: 'Trial', users: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHospitals}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats.activeHospitals} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all hospitals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Paid subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8.2%</div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingIssues}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Hospitals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Hospitals</CardTitle>
            <Link href="/superadmin/hospitals">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentHospitals.map((hospital) => (
              <Link
                key={hospital.id}
                href={`/superadmin/hospitals/${hospital.id}`}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{hospital.name}</p>
                    <p className="text-sm text-muted-foreground">{hospital.plan} Plan</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    hospital.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {hospital.status}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{hospital.users} users</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/superadmin/hospitals">
              <Button variant="outline" className="w-full">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Hospitals
              </Button>
            </Link>
            <Link href="/superadmin/users">
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/superadmin/subscription-plans">
              <Button variant="outline" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Subscription Plans
              </Button>
            </Link>
            <Link href="/superadmin/promotions">
              <Button variant="outline" className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                Promotions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
