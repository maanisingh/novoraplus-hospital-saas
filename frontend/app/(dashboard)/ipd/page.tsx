'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { getItems, createItemRecord, updateItemRecord, IPDAdmission, Patient, Bed, Department } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import {
  Plus,
  Search,
  BedDouble,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

export default function IPDPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [admissions, setAdmissions] = useState<IPDAdmission[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedBed, setSelectedBed] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [admissionsRes, patientsRes, bedsRes, deptsRes] = await Promise.all([
        getItems<IPDAdmission>('ipd_admissions', {
          fields: ['*', 'patient_id.*', 'bed_id.*', 'department_id.*'],
          sort: ['-admission_date'],
          limit: 100,
        }),
        getItems<Patient>('patients', {
          fields: ['id', 'name', 'patient_code', 'mobile'],
          sort: ['name'],
          limit: 500,
        }),
        getItems<Bed>('beds', {
          fields: ['*'],
          filter: { status: { _eq: 'available' } },
        }),
        getItems<Department>('departments', {
          filter: { status: { _eq: 'active' } },
          fields: ['id', 'name'],
        }),
      ]);

      if (admissionsRes.success && Array.isArray(admissionsRes.data)) {
        setAdmissions(admissionsRes.data);
      }
      if (patientsRes.success && Array.isArray(patientsRes.data)) {
        setPatients(patientsRes.data);
      }
      if (bedsRes.success && Array.isArray(bedsRes.data)) {
        setBeds(bedsRes.data);
      }
      if (deptsRes.success && Array.isArray(deptsRes.data)) {
        setDepartments(deptsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateIPNumber = () => {
    const prefix = 'IP';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const handleAdmit = async () => {
    if (!selectedPatient || !selectedBed) {
      toast.error('Patient and bed are required');
      return;
    }

    try {
      const admissionData: Partial<IPDAdmission> = {
        patient_id: selectedPatient,
        bed_id: selectedBed,
        department_id: selectedDepartment || undefined,
        ip_number: generateIPNumber(),
        admission_date: new Date().toISOString(),
        status: 'admitted',
        diagnosis: diagnosis || undefined,
        notes: notes || undefined,
        org_id: user?.org_id,
      };

      const result = await createItemRecord<IPDAdmission>('ipd_admissions', admissionData);

      if (result.success) {
        // Update bed status
        await updateItemRecord<Bed>('beds', selectedBed, { status: 'occupied' });

        toast.success('Patient admitted successfully');
        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error(result.error || 'Failed to admit patient');
      }
    } catch (error) {
      console.error('Error admitting patient:', error);
      toast.error('Failed to admit patient');
    }
  };

  const handleDischarge = async (admission: IPDAdmission) => {
    try {
      const result = await updateItemRecord<IPDAdmission>('ipd_admissions', admission.id, {
        status: 'discharged',
        discharge_date: new Date().toISOString(),
      });

      if (result.success) {
        // Free up the bed
        if (admission.bed_id) {
          const bedId = typeof admission.bed_id === 'object' ? (admission.bed_id as Bed).id : admission.bed_id;
          await updateItemRecord<Bed>('beds', bedId, { status: 'available' });
        }

        toast.success('Patient discharged successfully');
        loadData();
      } else {
        toast.error(result.error || 'Failed to discharge patient');
      }
    } catch (error) {
      console.error('Error discharging patient:', error);
      toast.error('Failed to discharge patient');
    }
  };

  const resetForm = () => {
    setSelectedPatient('');
    setSelectedBed('');
    setSelectedDepartment('');
    setDiagnosis('');
    setNotes('');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
      admitted: { label: 'Admitted', className: 'bg-blue-100 text-blue-700', icon: BedDouble },
      discharged: { label: 'Discharged', className: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      transferred: { label: 'Transferred', className: 'bg-orange-100 text-orange-700', icon: AlertCircle },
    };
    const { label, className, icon: Icon } = config[status] || config.admitted;
    return (
      <Badge className={`${className} hover:opacity-90`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const activeAdmissions = admissions.filter((a) => a.status === 'admitted');
  const dischargedAdmissions = admissions.filter((a) => a.status === 'discharged');

  const filteredAdmissions = admissions.filter((admission) => {
    const patient = admission.patient_id as unknown as Patient;
    return (
      patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.ip_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IPD Management</h1>
          <p className="text-gray-600 mt-1">Manage inpatient admissions and discharges</p>
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
                New Admission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>New IPD Admission</DialogTitle>
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
                  <Label>Bed *</Label>
                  <Select value={selectedBed} onValueChange={setSelectedBed}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select available bed" />
                    </SelectTrigger>
                    <SelectContent>
                      {beds.map((bed) => (
                        <SelectItem key={bed.id} value={bed.id}>
                          {bed.bed_number} - {bed.ward} ({bed.bed_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Diagnosis</Label>
                  <Input
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Primary diagnosis"
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdmit}>Admit Patient</Button>
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
              <p className="text-3xl font-bold text-gray-900">{admissions.length}</p>
              <p className="text-sm text-gray-500">Total Admissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{activeAdmissions.length}</p>
              <p className="text-sm text-gray-500">Currently Admitted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{beds.length}</p>
              <p className="text-sm text-gray-500">Available Beds</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{dischargedAdmissions.length}</p>
              <p className="text-sm text-gray-500">Discharged Today</p>
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
              placeholder="Search by patient name or IP number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BedDouble className="w-5 h-5 mr-2" />
            IPD Admissions ({filteredAdmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredAdmissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BedDouble className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No admissions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Number</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmissions.map((admission) => {
                  const patient = admission.patient_id as unknown as Patient;
                  const bed = admission.bed_id as unknown as Bed;
                  return (
                    <TableRow
                      key={admission.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => router.push(`/ipd/${admission.id}`)}
                    >
                      <TableCell className="font-mono text-blue-600">
                        {admission.ip_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{patient?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{patient?.patient_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {bed ? `${bed.bed_number} - ${bed.ward}` : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(admission.admission_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {admission.diagnosis || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(admission.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/ipd/${admission.id}`);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {admission.status === 'admitted' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDischarge(admission);
                              }}
                            >
                              Discharge
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
