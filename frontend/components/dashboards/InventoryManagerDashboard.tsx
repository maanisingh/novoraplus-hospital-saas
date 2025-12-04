'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, ShoppingCart, TrendingDown, Truck, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface InventoryManagerDashboardProps {
  user: any;
}

export default function InventoryManagerDashboard({ user }: InventoryManagerDashboardProps) {
  const stats = {
    totalItems: 2845,
    lowStockItems: 42,
    outOfStock: 8,
    pendingOrders: 15,
    expiringItems: 23,
    totalValue: 12500000,
    ordersThisMonth: 89,
    supplierCount: 145,
  };

  const lowStockItems = [
    { name: 'Surgical Gloves (Size M)', current: 150, minimum: 500, unit: 'boxes', urgency: 'high' },
    { name: 'IV Fluid (Normal Saline)', current: 75, minimum: 200, unit: 'units', urgency: 'high' },
    { name: 'Syringes (5ml)', current: 300, minimum: 1000, unit: 'pieces', urgency: 'medium' },
    { name: 'Bandage Rolls', current: 50, minimum: 150, unit: 'rolls', urgency: 'medium' },
  ];

  const expiringItems = [
    { name: 'Antibiotic Cream', quantity: 45, expiryDate: '2024-12-15', daysLeft: 11, category: 'Pharmaceuticals' },
    { name: 'IV Solutions', quantity: 30, expiryDate: '2024-12-20', daysLeft: 16, category: 'Medical Supplies' },
    { name: 'Sterile Gauze', quantity: 100, expiryDate: '2024-12-25', daysLeft: 21, category: 'Surgical Supplies' },
  ];

  const pendingOrders = [
    { orderID: 'PO-2024-145', supplier: 'MedSupply Inc', items: 15, value: 245000, expectedDate: '2024-12-08', status: 'in-transit' },
    { orderID: 'PO-2024-146', supplier: 'HealthCare Suppliers', items: 8, value: 125000, expectedDate: '2024-12-10', status: 'processing' },
    { orderID: 'PO-2024-147', supplier: 'Surgical Equipment Co', items: 22, value: 560000, expectedDate: '2024-12-12', status: 'confirmed' },
  ];

  const categoryDistribution = [
    { category: 'Pharmaceuticals', value: 4500000, percentage: 36 },
    { category: 'Medical Supplies', value: 3200000, percentage: 26 },
    { category: 'Surgical Equipment', value: 2800000, percentage: 22 },
    { category: 'Lab Supplies', value: 1500000, percentage: 12 },
    { category: 'Office Supplies', value: 500000, percentage: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Inventory Management Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Below minimum level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Immediate action required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringItems}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Inventory worth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersThisMonth}</div>
            <p className="text-xs text-muted-foreground">Purchase orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.supplierCount}</div>
            <p className="text-xs text-muted-foreground">Registered suppliers</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Category Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create Purchase Order
            </Button>
            <Button className="w-full" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Receive Stock
            </Button>
            <Button className="w-full" variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              View Low Stock Items
            </Button>
            <Button className="w-full" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Inventory Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryDistribution.map((cat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-muted-foreground">₹{(cat.value / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alert</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current: {item.current} {item.unit} | Minimum: {item.minimum} {item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.urgency === 'high'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.urgency}
                  </span>
                  <Button size="sm" className="mt-2" variant="outline">
                    Order Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expiring Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {expiringItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-xs text-muted-foreground">Quantity: {item.quantity} units</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{item.expiryDate}</p>
                  <p className={`text-xs ${
                    item.daysLeft <= 15 ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {item.daysLeft} days left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pendingOrders.map((order) => (
              <div key={order.orderID} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{order.orderID}</p>
                  <p className="text-sm text-muted-foreground">{order.supplier}</p>
                  <p className="text-xs text-muted-foreground">{order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.value.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'in-transit'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">ETA: {order.expectedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
