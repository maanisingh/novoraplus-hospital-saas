'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Receipt, CreditCard, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BillingDashboardProps {
  user: any;
}

export default function BillingDashboard({ user }: BillingDashboardProps) {
  const stats = {
    todayRevenue: 125000,
    pendingPayments: 45000,
    completedBills: 156,
    outstandingInvoices: 23,
    cashReceived: 85000,
    cardPayments: 40000,
  };

  const recentInvoices = [
    { id: 'INV-2024-001', patient: 'John Smith', amount: 5500, status: 'paid', date: '2024-12-04' },
    { id: 'INV-2024-002', patient: 'Sarah Johnson', amount: 3200, status: 'pending', date: '2024-12-04' },
    { id: 'INV-2024-003', patient: 'Mike Wilson', amount: 12000, status: 'paid', date: '2024-12-04' },
    { id: 'INV-2024-004', patient: 'Emma Davis', amount: 7500, status: 'pending', date: '2024-12-04' },
  ];

  const pendingPayments = [
    { patient: 'Robert Taylor', amount: 15000, dueDate: '2024-12-05', days: 1 },
    { patient: 'Lisa Anderson', amount: 8500, dueDate: '2024-12-03', days: -1 },
    { patient: 'James White', amount: 12000, dueDate: '2024-12-06', days: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Billing Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total collections today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.outstandingInvoices} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedBills}</div>
            <p className="text-xs text-muted-foreground">Bills processed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Received</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.cashReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Cash payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.cardPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Digital payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Collection efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/billing">
              <Button className="w-full" variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Create New Invoice
              </Button>
            </Link>
            <Link href="/billing">
              <Button className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View All Invoices
              </Button>
            </Link>
            <Button className="w-full" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{payment.patient}</p>
                    <p className="text-xs text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{payment.amount.toLocaleString()}</p>
                    <p className={`text-xs ${payment.days < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {payment.days < 0 ? `${Math.abs(payment.days)}d overdue` : `${payment.days}d left`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.patient}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{invoice.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    invoice.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {invoice.status}
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
