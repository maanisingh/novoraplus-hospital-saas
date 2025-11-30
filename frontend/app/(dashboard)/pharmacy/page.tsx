'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getItems, createItemRecord, updateItemRecord, PharmacyOrder, Patient, Inventory } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import {
  Plus,
  Search,
  Pill,
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Package,
  IndianRupee,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PharmacyPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedMedicines, setSelectedMedicines] = useState<{id: string; quantity: number; price: number; name: string}[]>([]);
  const [currentMedicine, setCurrentMedicine] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, patientsRes, inventoryRes] = await Promise.all([
        getItems<PharmacyOrder>('pharmacy_orders', {
          fields: ['*', 'patient_id.*'],
          sort: ['-date_created'],
          limit: 100,
        }),
        getItems<Patient>('patients', {
          fields: ['id', 'name', 'patient_code', 'mobile'],
          sort: ['name'],
          limit: 500,
        }),
        getItems<Inventory>('inventory', {
          fields: ['*'],
          filter: { item_type: { _eq: 'medicine' }, quantity: { _gt: 0 } },
          sort: ['item_name'],
        }),
      ]);

      if (ordersRes.success && Array.isArray(ordersRes.data)) {
        setOrders(ordersRes.data);
      }
      if (patientsRes.success && Array.isArray(patientsRes.data)) {
        setPatients(patientsRes.data);
      }
      if (inventoryRes.success && Array.isArray(inventoryRes.data)) {
        setMedicines(inventoryRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateOrderNumber = () => {
    const prefix = 'PH';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const handleAddMedicine = () => {
    if (!currentMedicine) return;

    const medicine = medicines.find(m => m.id === currentMedicine);
    if (!medicine) return;

    const existing = selectedMedicines.find(m => m.id === currentMedicine);
    if (existing) {
      setSelectedMedicines(prev =>
        prev.map(m => m.id === currentMedicine
          ? {...m, quantity: m.quantity + currentQuantity}
          : m
        )
      );
    } else {
      setSelectedMedicines(prev => [...prev, {
        id: medicine.id,
        name: medicine.item_name,
        quantity: currentQuantity,
        price: medicine.unit_price || 0,
      }]);
    }

    setCurrentMedicine('');
    setCurrentQuantity(1);
  };

  const removeMedicine = (id: string) => {
    setSelectedMedicines(prev => prev.filter(m => m.id !== id));
  };

  const calculateTotal = () => {
    return selectedMedicines.reduce((sum, m) => sum + (m.price * m.quantity), 0);
  };

  const handleCreateOrder = async () => {
    if (!selectedPatient || selectedMedicines.length === 0) {
      toast.error('Patient and at least one medicine required');
      return;
    }

    try {
      const orderData: Partial<PharmacyOrder> = {
        patient_id: selectedPatient,
        order_number: generateOrderNumber(),
        items: selectedMedicines,
        total_amount: calculateTotal(),
        status: 'pending',
        order_date: new Date().toISOString(),
        org_id: user?.org_id ?? undefined,
      };

      const result = await createItemRecord<PharmacyOrder>('pharmacy_orders', orderData);

      if (result.success) {
        toast.success('Order created successfully');
        setIsDialogOpen(false);
        setSelectedPatient('');
        setSelectedMedicines([]);
        loadData();
      } else {
        toast.error(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  const handleDispense = async (order: PharmacyOrder) => {
    try {
      const result = await updateItemRecord<PharmacyOrder>('pharmacy_orders', order.id, {
        status: 'dispensed',
        dispensed_at: new Date().toISOString(),
      });

      if (result.success) {
        toast.success('Order dispensed');
        loadData();
      } else {
        toast.error(result.error || 'Failed to dispense');
      }
    } catch (error) {
      console.error('Error dispensing:', error);
      toast.error('Failed to dispense');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: typeof Clock }> = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
      dispensed: { label: 'Dispensed', className: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700', icon: XCircle },
    };
    const { label, className, icon: Icon } = config[status] || config.pending;
    return (
      <Badge className={`${className} hover:opacity-90`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const dispensedOrders = orders.filter((o) => o.status === 'dispensed');
  const todayRevenue = orders
    .filter((o) => o.status === 'dispensed' && new Date(o.date_created).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const filteredOrders = orders.filter((order) => {
    const patient = order.patient_id as unknown as Patient;
    return (
      patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy</h1>
          <p className="text-gray-600 mt-1">Manage prescriptions and medicine dispensing</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Pharmacy Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Patient *</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.patient_code} - {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Label>Add Medicine</Label>
                    <Select value={currentMedicine} onValueChange={setCurrentMedicine}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medicine" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicines.map((med) => (
                          <SelectItem key={med.id} value={med.id}>
                            {med.item_name} - ₹{med.unit_price} (Stock: {med.quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Qty</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min={1}
                        value={currentQuantity}
                        onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                      />
                      <Button onClick={handleAddMedicine} disabled={!currentMedicine}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedMedicines.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {selectedMedicines.map((med) => (
                        <div key={med.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{med.name} x {med.quantity}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">₹{(med.price * med.quantity).toLocaleString()}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeMedicine(med.id)}>
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateOrder}>Create Order</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingOrders.length}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dispensed</p>
                <p className="text-3xl font-bold text-green-600">{dispensedOrders.length}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
                <p className="text-3xl font-bold text-purple-600">₹{todayRevenue.toLocaleString()}</p>
              </div>
              <IndianRupee className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by patient or order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="w-5 h-5 mr-2" />
            Pharmacy Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const patient = order.patient_id as unknown as Patient;
                  const items = order.items as {name: string; quantity: number}[] || [];
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-blue-600">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{patient?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{patient?.patient_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{(order.total_amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(order.order_date || order.date_created).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDispense(order)}
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Dispense
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
