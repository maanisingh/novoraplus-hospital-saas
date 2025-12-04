'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, PieChart, FileText, AlertTriangle, Receipt, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AccountantDashboardProps {
  user: any;
}

export default function AccountantDashboard({ user }: AccountantDashboardProps) {
  const stats = {
    monthlyRevenue: 4250000,
    monthlyExpenses: 2850000,
    netProfit: 1400000,
    profitMargin: 32.9,
    pendingInvoices: 67,
    overduePayments: 15,
    cashFlow: 950000,
    accountsPayable: 480000,
  };

  const recentTransactions = [
    { id: 'TXN-001', type: 'Revenue', description: 'Patient Billing - Dec', amount: 145000, date: '2024-12-04' },
    { id: 'TXN-002', type: 'Expense', description: 'Medical Supplies', amount: -85000, date: '2024-12-04' },
    { id: 'TXN-003', type: 'Revenue', description: 'Insurance Settlement', amount: 320000, date: '2024-12-04' },
    { id: 'TXN-004', type: 'Expense', description: 'Staff Salaries', amount: -1200000, date: '2024-12-03' },
  ];

  const expenseBreakdown = [
    { category: 'Salaries & Benefits', amount: 1200000, percentage: 42 },
    { category: 'Medical Supplies', amount: 650000, percentage: 23 },
    { category: 'Utilities & Maintenance', amount: 420000, percentage: 15 },
    { category: 'Equipment & Technology', amount: 350000, percentage: 12 },
    { category: 'Administrative', amount: 230000, percentage: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Accounting Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.netProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Profit margin: {stats.profitMargin}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.cashFlow.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available liquidity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overduePayments}</div>
            <p className="text-xs text-muted-foreground">Requires follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Payable</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.accountsPayable.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <PieChart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profitMargin}%</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Expense Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Financial Report
            </Button>
            <Button className="w-full" variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              View All Invoices
            </Button>
            <Button className="w-full" variant="outline">
              <PieChart className="mr-2 h-4 w-4" />
              Expense Analysis
            </Button>
            <Button className="w-full" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Reconcile Accounts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseBreakdown.map((expense, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{expense.category}</span>
                    <span className="text-muted-foreground">₹{expense.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${expense.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{expense.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{transaction.id}</p>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${
                    transaction.type === 'Revenue'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.type}
                  </span>
                  <p className={`font-semibold mt-1 ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
