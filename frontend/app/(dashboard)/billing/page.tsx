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
import { getItems, createItemRecord, updateItemRecord, Billing, Patient, LabTest, PharmacyOrder, IPDAdmission } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import { initiateRazorpayPayment, RazorpayResponse } from '@/lib/razorpay';
import { openWhatsApp, messageTemplates } from '@/lib/whatsapp';
import {
  Plus,
  Search,
  Receipt,
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Printer,
  CreditCard,
  Smartphone,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function BillingPage() {
  const { user } = useAuthStore();
  const [bills, setBills] = useState<Billing[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [billItems, setBillItems] = useState<{description: string; amount: number}[]>([]);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemAmount, setNewItemAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'netbanking' | 'insurance' | 'online'>('cash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Billing | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [billsRes, patientsRes] = await Promise.all([
        getItems<Billing>('billing', {
          fields: ['*', 'patient_id.*'],
          sort: ['-date_created'],
          limit: 100,
        }),
        getItems<Patient>('patients', {
          fields: ['id', 'name', 'patient_code', 'mobile'],
          sort: ['name'],
          limit: 500,
        }),
      ]);

      if (billsRes.success && Array.isArray(billsRes.data)) {
        setBills(billsRes.data);
      }
      if (patientsRes.success && Array.isArray(patientsRes.data)) {
        setPatients(patientsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBillNumber = () => {
    const prefix = 'BILL';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const handleAddItem = () => {
    if (!newItemDesc || newItemAmount <= 0) return;
    setBillItems(prev => [...prev, { description: newItemDesc, amount: newItemAmount }]);
    setNewItemDesc('');
    setNewItemAmount(0);
  };

  const removeItem = (index: number) => {
    setBillItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (subtotal * discount / 100);
  };

  const handleCreateBill = async () => {
    if (!selectedPatient || billItems.length === 0) {
      toast.error('Patient and at least one item required');
      return;
    }

    try {
      const billData: Partial<Billing> = {
        patient_id: selectedPatient,
        bill_number: generateBillNumber(),
        items: billItems,
        subtotal: calculateSubtotal(),
        discount: discount,
        total_amount: calculateTotal(),
        payment_status: 'paid',
        payment_method: paymentMethod,
        bill_date: new Date().toISOString(),
        org_id: user?.org_id ?? undefined,
      };

      const result = await createItemRecord<Billing>('billing', billData);

      if (result.success) {
        toast.success('Bill created successfully');
        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error(result.error || 'Failed to create bill');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill');
    }
  };

  const resetForm = () => {
    setSelectedPatient('');
    setBillItems([]);
    setDiscount(0);
    setPaymentMethod('cash');
  };

  // Handle Razorpay online payment
  const handleRazorpayPayment = async (bill: Billing) => {
    const patient = bill.patient_id as unknown as Patient;
    if (!patient) {
      toast.error('Patient information not found');
      return;
    }

    setIsProcessingPayment(true);
    setSelectedBillForPayment(bill);

    await initiateRazorpayPayment(
      {
        amount: bill.total_amount || 0,
        patientName: patient.name || 'Patient',
        patientEmail: patient.email,
        patientPhone: patient.mobile,
        billNumber: bill.bill_number || 'BILL',
        description: `Hospital Bill Payment - ${bill.bill_number}`,
        notes: {
          patient_id: patient.id,
          org_id: user?.org_id || '',
        },
      },
      async (response: RazorpayResponse) => {
        // Payment successful
        try {
          await updateItemRecord('billing', bill.id, {
            payment_status: 'paid',
            payment_method: 'online',
            razorpay_payment_id: response.razorpay_payment_id,
            paid_at: new Date().toISOString(),
          });
          toast.success(`Payment successful! ID: ${response.razorpay_payment_id}`);
          loadData();

          // Send WhatsApp confirmation
          if (patient.mobile) {
            const hospitalName = 'Hospital SaaS';
            openWhatsApp(
              patient.mobile,
              messageTemplates.paymentConfirmation({
                patientName: patient.name || 'Patient',
                billNumber: bill.bill_number || 'BILL',
                amount: bill.total_amount || 0,
                hospitalName,
              })
            );
          }
        } catch (error) {
          toast.error('Payment recorded but failed to update bill status');
        }
        setIsProcessingPayment(false);
        setSelectedBillForPayment(null);
      },
      (error: string) => {
        toast.error(error);
        setIsProcessingPayment(false);
        setSelectedBillForPayment(null);
      }
    );
  };

  // Send bill notification via WhatsApp
  const sendBillWhatsApp = (bill: Billing) => {
    const patient = bill.patient_id as unknown as Patient;
    if (!patient?.mobile) {
      toast.error('Patient mobile number not found');
      return;
    }

    const hospitalName = 'Hospital SaaS';
    const paymentLink = `${window.location.origin}/pay/${bill.id}`;

    openWhatsApp(
      patient.mobile,
      messageTemplates.billNotification({
        patientName: patient.name || 'Patient',
        billNumber: bill.bill_number || 'BILL',
        amount: bill.total_amount || 0,
        hospitalName,
        paymentLink: bill.payment_status !== 'paid' ? paymentLink : undefined,
      })
    );
    toast.success('Opening WhatsApp...');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: typeof Clock }> = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
      paid: { label: 'Paid', className: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      partial: { label: 'Partial', className: 'bg-blue-100 text-blue-700', icon: CreditCard },
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

  const todayBills = bills.filter(
    (b) => new Date(b.date_created).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayBills
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const pendingBills = bills.filter((b) => b.payment_status === 'pending');
  const totalCollected = bills
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);

  const filteredBills = bills.filter((bill) => {
    const patient = bill.patient_id as unknown as Patient;
    return (
      patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.bill_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-1">Manage patient bills and payments</p>
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
                New Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Bill</DialogTitle>
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
                    <Label>Item Description</Label>
                    <Input
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      placeholder="e.g., Consultation Fee"
                    />
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        value={newItemAmount}
                        onChange={(e) => setNewItemAmount(parseFloat(e.target.value) || 0)}
                      />
                      <Button onClick={handleAddItem} disabled={!newItemDesc || newItemAmount <= 0}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {billItems.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Bill Items</h4>
                    <div className="space-y-2">
                      {billItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{item.description}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t space-y-1">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹{calculateSubtotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Discount (%)</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={discount}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span>₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card' | 'upi' | 'netbanking' | 'insurance' | 'online')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="online">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Online (Razorpay)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBill}>Create Bill</Button>
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
                <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{todayRevenue.toLocaleString()}</p>
              </div>
              <IndianRupee className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Bills</p>
                <p className="text-3xl font-bold text-blue-600">{todayBills.length}</p>
              </div>
              <Receipt className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingBills.length}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Collected</p>
                <p className="text-3xl font-bold text-purple-600">₹{totalCollected.toLocaleString()}</p>
              </div>
              <CreditCard className="w-10 h-10 text-purple-600" />
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
              placeholder="Search by patient or bill number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Recent Bills ({filteredBills.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No bills found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill Number</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => {
                  const patient = bill.patient_id as unknown as Patient;
                  const items = bill.items as {description: string}[] || [];
                  return (
                    <TableRow key={bill.id}>
                      <TableCell className="font-mono text-blue-600">
                        {bill.bill_number}
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
                        ₹{(bill.total_amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {bill.payment_method || 'Cash'}
                      </TableCell>
                      <TableCell>
                        {new Date(bill.bill_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(bill.payment_status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="Print">
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => sendBillWhatsApp(bill)}
                            title="Send via WhatsApp"
                            className="text-green-600 hover:text-green-700"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          {bill.payment_status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRazorpayPayment(bill)}
                              disabled={isProcessingPayment && selectedBillForPayment?.id === bill.id}
                              title="Pay Online"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {isProcessingPayment && selectedBillForPayment?.id === bill.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Smartphone className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
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
