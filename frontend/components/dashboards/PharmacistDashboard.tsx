'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Package, AlertTriangle, TrendingDown, DollarSign, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PharmacistDashboardProps {
  user: any;
}

export default function PharmacistDashboard({ user }: PharmacistDashboardProps) {
  const stats = {
    pendingPrescriptions: 12,
    dispensedToday: 45,
    lowStockItems: 8,
    expiringItems: 5,
    todayRevenue: 8500,
    totalOrders: 57,
  };

  const pendingPrescriptions = [
    { id: '1', patient: 'John Doe', doctor: 'Dr. Smith', items: 3, priority: 'urgent', time: '09:00 AM' },
    { id: '2', patient: 'Sarah Miller', doctor: 'Dr. Johnson', items: 2, priority: 'normal', time: '09:30 AM' },
    { id: '3', patient: 'Mike Wilson', doctor: 'Dr. Brown', items: 4, priority: 'normal', time: '10:00 AM' },
  ];

  const lowStockItems = [
    { name: 'Paracetamol 500mg', stock: 50, reorderLevel: 200, unit: 'tablets' },
    { name: 'Amoxicillin 250mg', stock: 30, reorderLevel: 100, unit: 'capsules' },
    { name: 'Insulin (Glargine)', stock: 5, reorderLevel: 20, unit: 'vials' },
  ];

  const expiringItems = [
    { name: 'Cough Syrup', batch: 'CS-2024-01', expiry: '2025-01-15', quantity: 25, days: 42 },
    { name: 'Vitamin D3', batch: 'VD-2023-12', expiry: '2025-02-01', quantity: 50, days: 59 },
  ];

  const recentDispensing = [
    { id: '1', patient: 'Robert Taylor', medication: 'Metformin 500mg', quantity: 60, time: '11:45 AM' },
    { id: '2', patient: 'Lisa Anderson', medication: 'Atorvastatin 20mg', quantity: 30, time: '11:30 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Pharmacist Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPrescriptions}</div>
            <p className="text-xs text-muted-foreground">Awaiting dispensing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dispensedToday}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expiringItems}</div>
            <p className="text-xs text-muted-foreground">Within 60 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Medicine sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Today's orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Low Stock Alerts - Urgent Reorder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockItems.map((item, idx) => (
              <Link
                key={idx}
                href="/inventory"
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-orange-200 hover:border-orange-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-orange-900">{item.name}</p>
                  <p className="text-sm text-orange-700">Current: {item.stock} {item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-900">Reorder Level: {item.reorderLevel}</p>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 mt-1">
                    Low Stock
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expiring Items */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Medicines Expiring Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expiringItems.map((item, idx) => (
              <Link
                key={idx}
                href="/inventory"
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-red-200 hover:border-red-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-red-900">{item.name}</p>
                  <p className="text-sm text-red-700">Batch: {item.batch} • Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-900">{item.expiry}</p>
                  <p className="text-xs text-muted-foreground">{item.days} days remaining</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Prescriptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Prescriptions</CardTitle>
            <Link href="/pharmacy">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingPrescriptions.map((prescription) => (
              <Link
                key={prescription.id}
                href={`/pharmacy/${prescription.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{prescription.patient}</p>
                  <p className="text-sm text-muted-foreground">
                    Prescribed by {prescription.doctor} • {prescription.items} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{prescription.time}</p>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    prescription.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {prescription.priority}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Dispensing */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Dispensed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDispensing.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{item.patient}</p>
                  <p className="text-sm text-muted-foreground">{item.medication}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Qty: {item.quantity}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/pharmacy">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <FileText className="h-8 w-8 text-primary" />
                <p className="font-medium">Prescriptions</p>
                <p className="text-xs text-muted-foreground">Dispense medicines</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Package className="h-8 w-8 text-primary" />
                <p className="font-medium">Inventory</p>
                <p className="text-xs text-muted-foreground">Manage stock</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Pill className="h-8 w-8 text-primary" />
                <p className="font-medium">Add Medicine</p>
                <p className="text-xs text-muted-foreground">Update inventory</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/billing">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <p className="font-medium">Sales Report</p>
                <p className="text-xs text-muted-foreground">View revenue</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
