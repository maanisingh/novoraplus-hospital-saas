'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { getItems, createItemRecord, updateItemRecord, LabTest, Patient } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import {
  Plus,
  Search,
  FlaskConical,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';

const testTypes = [
  { name: 'Complete Blood Count (CBC)', price: 500 },
  { name: 'Blood Sugar (Fasting)', price: 150 },
  { name: 'Blood Sugar (PP)', price: 150 },
  { name: 'HbA1c', price: 800 },
  { name: 'Lipid Profile', price: 700 },
  { name: 'Liver Function Test (LFT)', price: 900 },
  { name: 'Kidney Function Test (KFT)', price: 800 },
  { name: 'Thyroid Profile (T3, T4, TSH)', price: 1000 },
  { name: 'Urine Routine', price: 200 },
  { name: 'Chest X-Ray', price: 400 },
  { name: 'ECG', price: 300 },
  { name: 'Ultrasound Abdomen', price: 1200 },
];

export default function LabPage() {
  const { user } = useAuthStore();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedTestType, setSelectedTestType] = useState<string>('');
  const [testResult, setTestResult] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [testsRes, patientsRes] = await Promise.all([
        getItems<LabTest>('lab_tests', {
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

      if (testsRes.success && Array.isArray(testsRes.data)) {
        setTests(testsRes.data);
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

  const generateLabNumber = () => {
    const prefix = 'LAB';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const handleCreateTest = async () => {
    if (!selectedPatient || !selectedTestType) {
      toast.error('Patient and test type are required');
      return;
    }

    const testInfo = testTypes.find((t) => t.name === selectedTestType);

    try {
      const testData: Partial<LabTest> = {
        patient_id: selectedPatient,
        lab_number: generateLabNumber(),
        test_name: selectedTestType,
        test_date: new Date().toISOString(),
        status: 'pending',
        price: testInfo?.price || 0,
        org_id: user?.org_id,
      };

      const result = await createItemRecord<LabTest>('lab_tests', testData);

      if (result.success) {
        toast.success('Lab test created successfully');
        setIsDialogOpen(false);
        setSelectedPatient('');
        setSelectedTestType('');
        loadData();
      } else {
        toast.error(result.error || 'Failed to create test');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error('Failed to create test');
    }
  };

  const handleUpdateResult = async () => {
    if (!selectedTest || !testResult) {
      toast.error('Please enter test result');
      return;
    }

    try {
      const result = await updateItemRecord<LabTest>('lab_tests', selectedTest.id, {
        status: 'completed',
        result: testResult,
        remarks: remarks || undefined,
        result_date: new Date().toISOString(),
      });

      if (result.success) {
        toast.success('Result updated successfully');
        setIsResultDialogOpen(false);
        setSelectedTest(null);
        setTestResult('');
        setRemarks('');
        loadData();
      } else {
        toast.error(result.error || 'Failed to update result');
      }
    } catch (error) {
      console.error('Error updating result:', error);
      toast.error('Failed to update result');
    }
  };

  const handleOpenResultDialog = (test: LabTest) => {
    setSelectedTest(test);
    setTestResult(test.result || '');
    setRemarks(test.remarks || '');
    setIsResultDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: typeof Clock }> = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
      in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700', icon: FlaskConical },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-700', icon: CheckCircle2 },
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

  const pendingTests = tests.filter((t) => t.status === 'pending');
  const completedTests = tests.filter((t) => t.status === 'completed');

  const filteredTests = tests.filter((test) => {
    const patient = test.patient_id as unknown as Patient;
    return (
      patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.lab_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.test_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab & Diagnostics</h1>
          <p className="text-gray-600 mt-1">Manage lab tests and results</p>
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
                New Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Lab Test</DialogTitle>
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

                <div>
                  <Label>Test Type *</Label>
                  <Select value={selectedTestType} onValueChange={setSelectedTestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test" />
                    </SelectTrigger>
                    <SelectContent>
                      {testTypes.map((test) => (
                        <SelectItem key={test.name} value={test.name}>
                          {test.name} - ₹{test.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTest}>Create Test</Button>
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
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{tests.length}</p>
              <p className="text-sm text-gray-500">Total Tests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{pendingTests.length}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{completedTests.length}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                ₹{tests.reduce((sum, t) => sum + (t.price || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Revenue</p>
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
              placeholder="Search by patient, lab number, or test name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FlaskConical className="w-5 h-5 mr-2" />
            Lab Tests ({filteredTests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FlaskConical className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No tests found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lab Number</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => {
                  const patient = test.patient_id as unknown as Patient;
                  return (
                    <TableRow key={test.id}>
                      <TableCell className="font-mono text-blue-600">
                        {test.lab_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{patient?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{patient?.patient_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>{test.test_name}</TableCell>
                      <TableCell>₹{(test.price || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(test.test_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(test.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {test.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenResultDialog(test)}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Enter Result
                            </Button>
                          )}
                          {test.status === 'completed' && (
                            <Button variant="ghost" size="sm">
                              <Printer className="w-4 h-4" />
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

      {/* Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Test Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Test: {selectedTest?.test_name}</Label>
            </div>
            <div>
              <Label>Result *</Label>
              <Textarea
                value={testResult}
                onChange={(e) => setTestResult(e.target.value)}
                placeholder="Enter test result"
                rows={4}
              />
            </div>
            <div>
              <Label>Remarks</Label>
              <Input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Additional remarks"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsResultDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateResult}>Save Result</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
