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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getItems, createItemRecord, updateItemRecord, deleteItemRecord, Staff, Department } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import {
  Plus,
  Search,
  UserCog,
  MoreHorizontal,
  Edit,
  Trash2,
  Stethoscope,
  Heart,
  Syringe,
  UserCircle,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

const DESIGNATION_OPTIONS = [
  { value: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'bg-blue-100 text-blue-700' },
  { value: 'nurse', label: 'Nurse', icon: Heart, color: 'bg-pink-100 text-pink-700' },
  { value: 'technician', label: 'Technician', icon: Syringe, color: 'bg-green-100 text-green-700' },
  { value: 'receptionist', label: 'Receptionist', icon: UserCircle, color: 'bg-purple-100 text-purple-700' },
  { value: 'pharmacist', label: 'Pharmacist', icon: Syringe, color: 'bg-orange-100 text-orange-700' },
  { value: 'admin', label: 'Admin', icon: UserCog, color: 'bg-gray-100 text-gray-700' },
  { value: 'other', label: 'Other', icon: UserCircle, color: 'bg-slate-100 text-slate-700' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-700' },
  { value: 'on_leave', label: 'On Leave', color: 'bg-yellow-100 text-yellow-700' },
];

export default function StaffPage() {
  const { user } = useAuthStore();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    staff_code: '',
    designation: 'doctor' as Staff['designation'],
    department_id: '',
    specialization: '',
    qualification: '',
    mobile: '',
    email: '',
    address: '',
    date_of_joining: new Date().toISOString().split('T')[0],
    status: 'active' as Staff['status'],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [staffResult, deptResult] = await Promise.all([
        getItems<Staff>('staff', {
          fields: ['*', 'department.name'],
          sort: ['name'],
          limit: 200,
        }),
        getItems<Department>('departments', {
          fields: ['*'],
          filter: { status: { _eq: 'active' } },
          sort: ['name'],
        }),
      ]);

      if (staffResult.success && Array.isArray(staffResult.data)) {
        setStaff(staffResult.data);
      }
      if (deptResult.success && Array.isArray(deptResult.data)) {
        setDepartments(deptResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load staff data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStaff = async () => {
    if (!newStaff.name) {
      toast.error('Staff name is required');
      return;
    }

    try {
      const staffData: Partial<Staff> = {
        name: newStaff.name,
        staff_code: newStaff.staff_code || undefined,
        designation: newStaff.designation,
        department_id: newStaff.department_id || undefined,
        specialization: newStaff.specialization || undefined,
        qualification: newStaff.qualification || undefined,
        mobile: newStaff.mobile || undefined,
        email: newStaff.email || undefined,
        address: newStaff.address || undefined,
        date_of_joining: newStaff.date_of_joining || undefined,
        status: newStaff.status,
        org_id: user?.org_id,
      };

      const result = await createItemRecord<Staff>('staff', staffData);

      if (result.success) {
        toast.success('Staff member created successfully');
        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error(result.error || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error('Failed to create staff member');
    }
  };

  const handleEditStaff = async () => {
    if (!selectedStaff) return;

    try {
      const result = await updateItemRecord<Staff>('staff', selectedStaff.id, {
        name: selectedStaff.name,
        staff_code: selectedStaff.staff_code || undefined,
        designation: selectedStaff.designation,
        department_id: selectedStaff.department_id || undefined,
        specialization: selectedStaff.specialization || undefined,
        qualification: selectedStaff.qualification || undefined,
        mobile: selectedStaff.mobile || undefined,
        email: selectedStaff.email || undefined,
        address: selectedStaff.address || undefined,
        date_of_joining: selectedStaff.date_of_joining || undefined,
        status: selectedStaff.status,
      });

      if (result.success) {
        toast.success('Staff member updated successfully');
        setIsEditDialogOpen(false);
        setSelectedStaff(null);
        loadData();
      } else {
        toast.error(result.error || 'Failed to update staff member');
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Failed to update staff member');
    }
  };

  const handleDeleteStaff = async (staffMember: Staff) => {
    if (!confirm(`Are you sure you want to delete ${staffMember.name}?`)) {
      return;
    }

    try {
      const result = await deleteItemRecord('staff', staffMember.id);

      if (result.success) {
        toast.success('Staff member deleted successfully');
        loadData();
      } else {
        toast.error(result.error || 'Failed to delete staff member');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Failed to delete staff member');
    }
  };

  const openEditDialog = (staffMember: Staff) => {
    setSelectedStaff({ ...staffMember });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setNewStaff({
      name: '',
      staff_code: '',
      designation: 'doctor',
      department_id: '',
      specialization: '',
      qualification: '',
      mobile: '',
      email: '',
      address: '',
      date_of_joining: new Date().toISOString().split('T')[0],
      status: 'active',
    });
  };

  const getDesignationBadge = (designation: string) => {
    const option = DESIGNATION_OPTIONS.find((d) => d.value === designation);
    return option ? (
      <Badge className={option.color}>{option.label}</Badge>
    ) : (
      <Badge variant="secondary">{designation}</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status);
    return option ? (
      <Badge className={option.color}>{option.label}</Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    );
  };

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.staff_code && s.staff_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.mobile && s.mobile.includes(searchQuery));
    const matchesTab = selectedTab === 'all' || s.designation === selectedTab;
    return matchesSearch && matchesTab;
  });

  // Stats
  const stats = {
    total: staff.length,
    doctors: staff.filter((s) => s.designation === 'doctor').length,
    nurses: staff.filter((s) => s.designation === 'nurse').length,
    active: staff.filter((s) => s.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital staff and doctors</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Dr. John Smith"
                />
              </div>
              <div>
                <Label htmlFor="staff_code">Staff Code</Label>
                <Input
                  id="staff_code"
                  value={newStaff.staff_code}
                  onChange={(e) => setNewStaff({ ...newStaff, staff_code: e.target.value.toUpperCase() })}
                  placeholder="EMP001"
                />
              </div>
              <div>
                <Label htmlFor="designation">Designation *</Label>
                <Select
                  value={newStaff.designation}
                  onValueChange={(value: Staff['designation']) =>
                    setNewStaff({ ...newStaff, designation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESIGNATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newStaff.department_id}
                  onValueChange={(value) => setNewStaff({ ...newStaff, department_id: value })}
                >
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
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newStaff.specialization}
                  onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                  placeholder="Cardiology, Pediatrics, etc."
                />
              </div>
              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={newStaff.qualification}
                  onChange={(e) => setNewStaff({ ...newStaff, qualification: e.target.value })}
                  placeholder="MBBS, MD, etc."
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  value={newStaff.mobile}
                  onChange={(e) => setNewStaff({ ...newStaff, mobile: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="john@hospital.com"
                />
              </div>
              <div>
                <Label htmlFor="date_of_joining">Date of Joining</Label>
                <Input
                  id="date_of_joining"
                  type="date"
                  value={newStaff.date_of_joining}
                  onChange={(e) => setNewStaff({ ...newStaff, date_of_joining: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newStaff.status}
                  onValueChange={(value: Staff['status']) =>
                    setNewStaff({ ...newStaff, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newStaff.address}
                  onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                  placeholder="Enter address..."
                  rows={2}
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateStaff}>Add Staff Member</Button>
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
                <p className="text-sm text-gray-500">Total Staff</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <UserCog className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Doctors</p>
                <p className="text-2xl font-bold">{stats.doctors}</p>
              </div>
              <Stethoscope className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Nurses</p>
                <p className="text-2xl font-bold">{stats.nurses}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <UserCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, code, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List with Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value="doctor">Doctors</TabsTrigger>
              <TabsTrigger value="nurse">Nurses</TabsTrigger>
              <TabsTrigger value="technician">Technicians</TabsTrigger>
              <TabsTrigger value="other">Others</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserCog className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No staff members found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Staff Member
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell className="font-mono text-blue-600">
                      {staffMember.staff_code || '-'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{staffMember.name}</div>
                        {staffMember.specialization && (
                          <div className="text-xs text-gray-500">
                            {staffMember.specialization}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getDesignationBadge(staffMember.designation)}</TableCell>
                    <TableCell>
                      {staffMember.department ? (
                        <div className="flex items-center">
                          <Building2 className="w-3 h-3 mr-1 text-gray-400" />
                          {(staffMember.department as Department).name}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {staffMember.mobile && (
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {staffMember.mobile}
                          </div>
                        )}
                        {staffMember.email && (
                          <div className="flex items-center text-gray-500">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {staffMember.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(staffMember.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(staffMember)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteStaff(staffMember)}
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

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={selectedStaff.name}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-staff_code">Staff Code</Label>
                <Input
                  id="edit-staff_code"
                  value={selectedStaff.staff_code || ''}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, staff_code: e.target.value.toUpperCase() })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-designation">Designation *</Label>
                <Select
                  value={selectedStaff.designation}
                  onValueChange={(value: Staff['designation']) =>
                    setSelectedStaff({ ...selectedStaff, designation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESIGNATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={selectedStaff.department_id || ''}
                  onValueChange={(value) =>
                    setSelectedStaff({ ...selectedStaff, department_id: value })
                  }
                >
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
                <Label htmlFor="edit-specialization">Specialization</Label>
                <Input
                  id="edit-specialization"
                  value={selectedStaff.specialization || ''}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, specialization: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-qualification">Qualification</Label>
                <Input
                  id="edit-qualification"
                  value={selectedStaff.qualification || ''}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, qualification: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-mobile">Mobile</Label>
                <Input
                  id="edit-mobile"
                  value={selectedStaff.mobile || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, mobile: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedStaff.email || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-date_of_joining">Date of Joining</Label>
                <Input
                  id="edit-date_of_joining"
                  type="date"
                  value={selectedStaff.date_of_joining || ''}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, date_of_joining: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedStaff.status}
                  onValueChange={(value: Staff['status']) =>
                    setSelectedStaff({ ...selectedStaff, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
              <div className="col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={selectedStaff.address || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditStaff}>Update Staff Member</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
