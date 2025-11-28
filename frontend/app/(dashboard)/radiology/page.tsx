'use client';

import { useEffect, useState, useRef } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getItems, createItemRecord, updateItemRecord, deleteItemRecord, RadiologyTest, Patient } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import {
  Plus,
  Search,
  ScanLine,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Upload,
  Eye,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

const TEST_TYPE_OPTIONS = [
  { value: 'xray', label: 'X-Ray', color: 'bg-blue-100 text-blue-700' },
  { value: 'ct', label: 'CT Scan', color: 'bg-purple-100 text-purple-700' },
  { value: 'mri', label: 'MRI', color: 'bg-green-100 text-green-700' },
  { value: 'ultrasound', label: 'Ultrasound', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'mammography', label: 'Mammography', color: 'bg-pink-100 text-pink-700' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-700' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
];

export default function RadiologyPage() {
  const { user } = useAuthStore();
  const [tests, setTests] = useState<RadiologyTest[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<RadiologyTest | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTest, setNewTest] = useState({
    patient_id: '',
    test_type: 'xray' as RadiologyTest['test_type'],
    test_name: '',
    test_date: new Date().toISOString().split('T')[0],
    status: 'pending' as RadiologyTest['status'],
    findings: '',
    impression: '',
    price: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [testsResult, patientsResult] = await Promise.all([
        getItems<RadiologyTest>('radiology_tests', {
          fields: ['*', 'patient.name', 'patient.patient_code', 'patient.mobile'],
          sort: ['-date_created'],
          limit: 200,
        }),
        getItems<Patient>('patients', {
          fields: ['id', 'name', 'patient_code', 'mobile'],
          sort: ['name'],
          limit: 500,
        }),
      ]);

      if (testsResult.success && Array.isArray(testsResult.data)) {
        setTests(testsResult.data);
      }
      if (patientsResult.success && Array.isArray(patientsResult.data)) {
        setPatients(patientsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load radiology data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTestNumber = () => {
    const date = new Date();
    const prefix = 'RAD';
    const timestamp = date.getFullYear().toString().slice(-2) +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const handleCreateTest = async () => {
    if (!newTest.patient_id || !newTest.test_name) {
      toast.error('Patient and test name are required');
      return;
    }

    try {
      const testData: Partial<RadiologyTest> = {
        test_number: generateTestNumber(),
        patient_id: newTest.patient_id,
        test_type: newTest.test_type,
        test_name: newTest.test_name,
        test_date: newTest.test_date,
        status: newTest.status,
        findings: newTest.findings || undefined,
        impression: newTest.impression || undefined,
        price: newTest.price ? parseFloat(newTest.price) : undefined,
        org_id: user?.org_id,
      };

      const result = await createItemRecord<RadiologyTest>('radiology_tests', testData);

      if (result.success) {
        toast.success('Radiology test created successfully');
        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error(result.error || 'Failed to create radiology test');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error('Failed to create radiology test');
    }
  };

  const handleEditTest = async () => {
    if (!selectedTest) return;

    try {
      const result = await updateItemRecord<RadiologyTest>('radiology_tests', selectedTest.id, {
        test_type: selectedTest.test_type,
        test_name: selectedTest.test_name,
        test_date: selectedTest.test_date,
        status: selectedTest.status,
        findings: selectedTest.findings || undefined,
        impression: selectedTest.impression || undefined,
        price: selectedTest.price,
        completed_at: selectedTest.status === 'completed' ? new Date().toISOString() : undefined,
      });

      if (result.success) {
        toast.success('Radiology test updated successfully');
        setIsEditDialogOpen(false);
        setSelectedTest(null);
        loadData();
      } else {
        toast.error(result.error || 'Failed to update radiology test');
      }
    } catch (error) {
      console.error('Error updating test:', error);
      toast.error('Failed to update radiology test');
    }
  };

  const handleDeleteTest = async (test: RadiologyTest) => {
    if (!confirm(`Are you sure you want to delete test ${test.test_number}?`)) {
      return;
    }

    try {
      const result = await deleteItemRecord('radiology_tests', test.id);

      if (result.success) {
        toast.success('Radiology test deleted successfully');
        loadData();
      } else {
        toast.error(result.error || 'Failed to delete radiology test');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete radiology test');
    }
  };

  const handleFileUpload = async (test: RadiologyTest) => {
    if (!uploadedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    // In a real implementation, you would upload the file to Directus or a file storage service
    // For now, we'll simulate this by storing a reference
    try {
      // Convert file to base64 for demo (in production, use proper file upload)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Update the test with the PDF reference
        const result = await updateItemRecord<RadiologyTest>('radiology_tests', test.id, {
          report_pdf: `uploaded_${test.test_number}_${uploadedFile.name}`,
          status: 'completed',
          completed_at: new Date().toISOString(),
        });

        if (result.success) {
          toast.success('Report uploaded successfully');
          setIsUploadDialogOpen(false);
          setUploadedFile(null);
          setSelectedTest(null);
          loadData();
        } else {
          toast.error(result.error || 'Failed to upload report');
        }
      };
      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload report');
    }
  };

  const openEditDialog = (test: RadiologyTest) => {
    setSelectedTest({ ...test });
    setIsEditDialogOpen(true);
  };

  const openUploadDialog = (test: RadiologyTest) => {
    setSelectedTest(test);
    setUploadedFile(null);
    setIsUploadDialogOpen(true);
  };

  const resetForm = () => {
    setNewTest({
      patient_id: '',
      test_type: 'xray',
      test_name: '',
      test_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      findings: '',
      impression: '',
      price: '',
    });
  };

  const getTestTypeBadge = (type: string) => {
    const option = TEST_TYPE_OPTIONS.find((t) => t.value === type);
    return option ? (
      <Badge className={option.color}>{option.label}</Badge>
    ) : (
      <Badge variant="secondary">{type}</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status);
    if (!option) return <Badge variant="secondary">{status}</Badge>;
    const Icon = option.icon;
    return (
      <Badge className={option.color}>
        <Icon className="w-3 h-3 mr-1" />
        {option.label}
      </Badge>
    );
  };

  const filteredTests = tests.filter((test) => {
    const patient = test.patient as Patient;
    const matchesSearch =
      test.test_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient?.name && patient.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient?.patient_code && patient.patient_code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = selectedTab === 'all' || test.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  // Stats
  const stats = {
    total: tests.length,
    pending: tests.filter((t) => t.status === 'pending').length,
    inProgress: tests.filter((t) => t.status === 'in_progress').length,
    completed: tests.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Radiology</h1>
          <p className="text-gray-600 mt-1">Manage X-Ray, CT, MRI and other imaging tests</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Radiology Test</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2">
                <Label htmlFor="patient">Patient *</Label>
                <Select
                  value={newTest.patient_id}
                  onValueChange={(value) => setNewTest({ ...newTest, patient_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search and select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.patient_code}) - {patient.mobile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="test_type">Test Type *</Label>
                <Select
                  value={newTest.test_type}
                  onValueChange={(value: RadiologyTest['test_type']) =>
                    setNewTest({ ...newTest, test_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="test_name">Test Name *</Label>
                <Input
                  id="test_name"
                  value={newTest.test_name}
                  onChange={(e) => setNewTest({ ...newTest, test_name: e.target.value })}
                  placeholder="Chest X-Ray, Brain MRI, etc."
                />
              </div>
              <div>
                <Label htmlFor="test_date">Test Date</Label>
                <Input
                  id="test_date"
                  type="date"
                  value={newTest.test_date}
                  onChange={(e) => setNewTest({ ...newTest, test_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price (INR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTest.price}
                  onChange={(e) => setNewTest({ ...newTest, price: e.target.value })}
                  placeholder="1500"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="findings">Findings</Label>
                <Textarea
                  id="findings"
                  value={newTest.findings}
                  onChange={(e) => setNewTest({ ...newTest, findings: e.target.value })}
                  placeholder="Enter radiological findings..."
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="impression">Impression</Label>
                <Textarea
                  id="impression"
                  value={newTest.impression}
                  onChange={(e) => setNewTest({ ...newTest, impression: e.target.value })}
                  placeholder="Enter clinical impression..."
                  rows={2}
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTest}>Create Test</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tests</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ScanLine className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
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
              placeholder="Search by test number, name, or patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tests List with Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Tests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ScanLine className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No radiology tests found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Test
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test No.</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => {
                  const patient = test.patient as Patient;
                  return (
                    <TableRow key={test.id}>
                      <TableCell className="font-mono text-blue-600">
                        {test.test_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="font-medium">{patient?.name || 'Unknown'}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {patient?.patient_code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTestTypeBadge(test.test_type)}</TableCell>
                      <TableCell className="font-medium">{test.test_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {new Date(test.test_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(test.status)}</TableCell>
                      <TableCell>
                        {test.report_pdf ? (
                          <Button variant="outline" size="sm" className="text-green-600">
                            <FileText className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUploadDialog(test)}
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(test)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openUploadDialog(test)}>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Report
                            </DropdownMenuItem>
                            {test.report_pdf && (
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteTest(test)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Test Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Radiology Test</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="edit-test_type">Test Type</Label>
                <Select
                  value={selectedTest.test_type}
                  onValueChange={(value: RadiologyTest['test_type']) =>
                    setSelectedTest({ ...selectedTest, test_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-test_name">Test Name</Label>
                <Input
                  id="edit-test_name"
                  value={selectedTest.test_name}
                  onChange={(e) =>
                    setSelectedTest({ ...selectedTest, test_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-test_date">Test Date</Label>
                <Input
                  id="edit-test_date"
                  type="date"
                  value={selectedTest.test_date}
                  onChange={(e) =>
                    setSelectedTest({ ...selectedTest, test_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedTest.status}
                  onValueChange={(value: RadiologyTest['status']) =>
                    setSelectedTest({ ...selectedTest, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-price">Price (INR)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={selectedTest.price || ''}
                  onChange={(e) =>
                    setSelectedTest({ ...selectedTest, price: parseFloat(e.target.value) || undefined })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-findings">Findings</Label>
                <Textarea
                  id="edit-findings"
                  value={selectedTest.findings || ''}
                  onChange={(e) =>
                    setSelectedTest({ ...selectedTest, findings: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-impression">Impression</Label>
                <Textarea
                  id="edit-impression"
                  value={selectedTest.impression || ''}
                  onChange={(e) =>
                    setSelectedTest({ ...selectedTest, impression: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTest}>Update Test</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Report Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Radiology Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedTest && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">{selectedTest.test_name}</p>
                <p className="text-sm text-gray-500">Test No: {selectedTest.test_number}</p>
              </div>
            )}

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.type !== 'application/pdf') {
                      toast.error('Please select a PDF file');
                      return;
                    }
                    setUploadedFile(file);
                  }
                }}
              />
              {uploadedFile ? (
                <div className="text-green-600">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">Click to upload PDF report</p>
                  <p className="text-sm text-gray-400 mt-1">Only PDF files are accepted</p>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => selectedTest && handleFileUpload(selectedTest)}
                disabled={!uploadedFile}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
