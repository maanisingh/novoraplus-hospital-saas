'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getItems, createItemRecord, updateItemRecord, deleteItemRecord, Patient } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import { Plus, Search, Users, Phone, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PatientsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    mobile: '',
    email: '',
    gender: '',
    blood_group: '',
    date_of_birth: '',
    address: '',
    emergency_contact: '',
    emergency_contact_name: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const result = await getItems<Patient>('patients', {
        fields: ['*'],
        sort: ['-date_created'],
        limit: 100,
      });

      if (result.success && Array.isArray(result.data)) {
        setPatients(result.data);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePatientCode = () => {
    const prefix = 'P';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const handleCreatePatient = async () => {
    if (!newPatient.name || !newPatient.mobile) {
      toast.error('Name and mobile are required');
      return;
    }

    try {
      const patientData: Partial<Patient> = {
        name: newPatient.name,
        mobile: newPatient.mobile,
        email: newPatient.email || undefined,
        gender: (newPatient.gender as 'male' | 'female' | 'other') || undefined,
        blood_group: newPatient.blood_group || undefined,
        date_of_birth: newPatient.date_of_birth || undefined,
        address: newPatient.address || undefined,
        emergency_contact: newPatient.emergency_contact || undefined,
        emergency_contact_name: newPatient.emergency_contact_name || undefined,
        patient_code: generatePatientCode(),
        org_id: user?.org_id ?? undefined,
      };

      const result = await createItemRecord<Patient>('patients', patientData);

      if (result.success) {
        toast.success('Patient registered successfully');
        setIsDialogOpen(false);
        setNewPatient({
          name: '',
          mobile: '',
          email: '',
          gender: '',
          blood_group: '',
          date_of_birth: '',
          address: '',
          emergency_contact: '',
          emergency_contact_name: '',
        });
        loadPatients();
      } else {
        toast.error(result.error || 'Failed to create patient');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to create patient');
    }
  };

  const handleEditPatient = async () => {
    if (!selectedPatient) return;

    try {
      const result = await updateItemRecord<Patient>('patients', selectedPatient.id, {
        name: selectedPatient.name,
        mobile: selectedPatient.mobile,
        email: selectedPatient.email || undefined,
        gender: selectedPatient.gender,
        blood_group: selectedPatient.blood_group || undefined,
        date_of_birth: selectedPatient.date_of_birth || undefined,
        address: selectedPatient.address || undefined,
        emergency_contact: selectedPatient.emergency_contact || undefined,
      });

      if (result.success) {
        toast.success('Patient updated successfully');
        setIsEditDialogOpen(false);
        setSelectedPatient(null);
        loadPatients();
      } else {
        toast.error(result.error || 'Failed to update patient');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient');
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    if (!confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
      return;
    }

    try {
      const result = await deleteItemRecord('patients', patient.id);

      if (result.success) {
        toast.success('Patient deleted successfully');
        loadPatients();
      } else {
        toast.error(result.error || 'Failed to delete patient');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient({ ...patient });
    setIsEditDialogOpen(true);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mobile.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Register New Patient</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={newPatient.mobile}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, mobile: e.target.value })
                  }
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={newPatient.gender}
                  onValueChange={(value) =>
                    setNewPatient({ ...newPatient, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select
                  value={newPatient.blood_group}
                  onValueChange={(value) =>
                    setNewPatient({ ...newPatient, blood_group: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={newPatient.date_of_birth}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, date_of_birth: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={newPatient.emergency_contact}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, emergency_contact: e.target.value })
                  }
                  placeholder="Emergency contact number"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newPatient.address}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, address: e.target.value })
                  }
                  placeholder="Enter address"
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePatient}>Register Patient</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, code, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Patient Records ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No patients found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/patients/${patient.id}`)}
                  >
                    <TableCell className="font-mono text-blue-600">
                      {patient.patient_code}
                    </TableCell>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                        {patient.mobile}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{patient.gender || '-'}</TableCell>
                    <TableCell>
                      {patient.blood_group ? (
                        <Badge variant="outline">{patient.blood_group}</Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(patient.date_created).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(patient)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePatient(patient)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={selectedPatient.name}
                  onChange={(e) =>
                    setSelectedPatient({ ...selectedPatient, name: e.target.value })
                  }
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <Label htmlFor="edit-mobile">Mobile Number *</Label>
                <Input
                  id="edit-mobile"
                  value={selectedPatient.mobile}
                  onChange={(e) =>
                    setSelectedPatient({ ...selectedPatient, mobile: e.target.value })
                  }
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedPatient.email || ''}
                  onChange={(e) =>
                    setSelectedPatient({ ...selectedPatient, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="edit-gender">Gender</Label>
                <Select
                  value={selectedPatient.gender || ''}
                  onValueChange={(value) =>
                    setSelectedPatient({ ...selectedPatient, gender: value as 'male' | 'female' | 'other' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-blood_group">Blood Group</Label>
                <Select
                  value={selectedPatient.blood_group || ''}
                  onValueChange={(value) =>
                    setSelectedPatient({ ...selectedPatient, blood_group: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-dob">Date of Birth</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={selectedPatient.date_of_birth || ''}
                  onChange={(e) =>
                    setSelectedPatient({ ...selectedPatient, date_of_birth: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-emergency">Emergency Contact</Label>
                <Input
                  id="edit-emergency"
                  value={selectedPatient.emergency_contact || ''}
                  onChange={(e) =>
                    setSelectedPatient({ ...selectedPatient, emergency_contact: e.target.value })
                  }
                  placeholder="Emergency contact number"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={selectedPatient.address || ''}
                  onChange={(e) =>
                    setSelectedPatient({ ...selectedPatient, address: e.target.value })
                  }
                  placeholder="Enter address"
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditPatient}>Update Patient</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
