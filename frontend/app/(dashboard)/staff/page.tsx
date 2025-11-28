'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { getItems, createItemRecord, updateItemRecord, deleteItemRecord, createDirectusUser, Staff, Department } from '@/lib/directus';
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
  Key,
  Shield,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const DESIGNATION_OPTIONS = [
  { value: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'bg-blue-100 text-blue-700', role: 'Doctor' },
  { value: 'nurse', label: 'Nurse', icon: Heart, color: 'bg-pink-100 text-pink-700', role: 'Nurse' },
  { value: 'technician', label: 'Technician', icon: Syringe, color: 'bg-green-100 text-green-700', role: 'Lab Staff' },
  { value: 'receptionist', label: 'Receptionist', icon: UserCircle, color: 'bg-purple-100 text-purple-700', role: 'Reception' },
  { value: 'pharmacist', label: 'Pharmacist', icon: Syringe, color: 'bg-orange-100 text-orange-700', role: 'Pharmacy Staff' },
  { value: 'admin', label: 'Admin', icon: UserCog, color: 'bg-gray-100 text-gray-700', role: 'Hospital Admin' },
  { value: 'billing', label: 'Billing Staff', icon: UserCircle, color: 'bg-yellow-100 text-yellow-700', role: 'Billing Staff' },
  { value: 'radiology', label: 'Radiology Staff', icon: UserCircle, color: 'bg-indigo-100 text-indigo-700', role: 'Radiology Staff' },
  { value: 'other', label: 'Other', icon: UserCircle, color: 'bg-slate-100 text-slate-700', role: null },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-700' },
  { value: 'on_leave', label: 'On Leave', color: 'bg-yellow-100 text-yellow-700' },
];

// Role mapping
const ROLE_ID_MAP: Record<string, string> = {
  'Doctor': '385c1253-5488-467c-9cf3-43abdbd4eebc',
  'Nurse': '5a4d22ae-7ec2-46d6-a876-d3193b1a5750',
  'Lab Staff': '079d48d9-e031-42ee-ba12-d7c46ff5618b',
  'Reception': '5646c077-e33c-4309-9663-6c02e1655512',
  'Pharmacy Staff': 'aaa915f0-15c7-4f51-8e78-2c46a1d48095',
  'Hospital Admin': '26315b1d-23e5-415e-b33d-cc87625c8dfc',
  'Billing Staff': '908219b6-8706-4e6d-a258-1b729c810a83',
  'Radiology Staff': '813e3192-24a5-4268-8525-2581a857a038',
};

interface ExtendedStaff extends Staff {
  user_id?: string;
  has_login?: boolean;
}

export default function StaffPage() {
  const { user } = useAuthStore();
  const [staff, setStaff] = useState<ExtendedStaff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<ExtendedStaff | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

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
    // User account fields
    create_login: true,
    login_email: '',
    password: '',
  });

  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [staffResult, deptResult] = await Promise.all([
        getItems<ExtendedStaff>('staff', {
          fields: ['*', 'department.name', 'user_id'],
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
        // Mark staff that have login accounts
        const staffWithLogin = staffResult.data.map(s => ({
          ...s,
          has_login: !!s.user_id
        }));
        setStaff(staffWithLogin);
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

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateStaff = async () => {
    if (!newStaff.name) {
      toast.error('Staff name is required');
      return;
    }

    if (newStaff.create_login) {
      if (!newStaff.login_email) {
        toast.error('Login email is required when creating user account');
        return;
      }
      if (!newStaff.password || newStaff.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    setIsSaving(true);

    try {
      let userId: string | undefined;

      // Step 1: Create user account if requested
      if (newStaff.create_login) {
        const designation = DESIGNATION_OPTIONS.find(d => d.value === newStaff.designation);
        const roleId = designation?.role ? ROLE_ID_MAP[designation.role] : undefined;

        const userResult = await createDirectusUser({
          email: newStaff.login_email,
          password: newStaff.password,
          first_name: newStaff.name.split(' ')[0],
          last_name: newStaff.name.split(' ').slice(1).join(' ') || '',
          org_id: user?.org_id,
          status: 'active',
        });

        if (!userResult.success) {
          toast.error(userResult.error || 'Failed to create user account');
          setIsSaving(false);
          return;
        }

        userId = (userResult.data as { id: string })?.id;
        toast.success('User account created successfully');
      }

      // Step 2: Create staff record
      const staffData: Partial<ExtendedStaff> = {
        name: newStaff.name,
        staff_code: newStaff.staff_code || undefined,
        designation: newStaff.designation,
        department_id: newStaff.department_id || undefined,
        specialization: newStaff.specialization || undefined,
        qualification: newStaff.qualification || undefined,
        mobile: newStaff.mobile || undefined,
        email: newStaff.email || newStaff.login_email || undefined,
        address: newStaff.address || undefined,
        date_of_joining: newStaff.date_of_joining || undefined,
        status: newStaff.status,
        org_id: user?.org_id,
        user_id: userId,
      };

      const result = await createItemRecord<ExtendedStaff>('staff', staffData);

      if (result.success) {
        toast.success('Staff member created successfully');

        // Show login credentials if created
        if (newStaff.create_login) {
          toast.info(
            `Login credentials:\nEmail: ${newStaff.login_email}\nPassword: ${newStaff.password}`,
            { duration: 10000 }
          );
        }

        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error(result.error || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error('Failed to create staff member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditStaff = async () => {
    if (!selectedStaff) return;

    setIsSaving(true);

    try {
      const result = await updateItemRecord<ExtendedStaff>('staff', selectedStaff.id, {
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
        setEditPassword('');
        loadData();
      } else {
        toast.error(result.error || 'Failed to update staff member');
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Failed to update staff member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStaff = async (staffMember: ExtendedStaff) => {
    if (!confirm(`Are you sure you want to delete ${staffMember.name}?\n\nThis will NOT delete their login account if they have one.`)) {
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

  const handleCreateLoginForStaff = async (staffMember: ExtendedStaff) => {
    if (staffMember.has_login) {
      toast.error('This staff member already has a login account');
      return;
    }

    const email = staffMember.email;
    if (!email) {
      toast.error('Staff member must have an email address to create login');
      return;
    }

    const password = generatePassword();

    setIsSaving(true);
    try {
      const designation = DESIGNATION_OPTIONS.find(d => d.value === staffMember.designation);

      const userResult = await createDirectusUser({
        email: email,
        password: password,
        first_name: staffMember.name.split(' ')[0],
        last_name: staffMember.name.split(' ').slice(1).join(' ') || '',
        org_id: user?.org_id,
        status: 'active',
      });

      if (!userResult.success) {
        toast.error(userResult.error || 'Failed to create user account');
        return;
      }

      const userId = (userResult.data as { id: string })?.id;

      // Update staff record with user_id
      await updateItemRecord('staff', staffMember.id, {
        user_id: userId,
      });

      toast.success('Login account created!');
      toast.info(
        `Login credentials:\nEmail: ${email}\nPassword: ${password}`,
        { duration: 15000 }
      );

      loadData();
    } catch (error) {
      console.error('Error creating login:', error);
      toast.error('Failed to create login account');
    } finally {
      setIsSaving(false);
    }
  };

  const openEditDialog = (staffMember: ExtendedStaff) => {
    setSelectedStaff({ ...staffMember });
    setEditPassword('');
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
      create_login: true,
      login_email: '',
      password: '',
    });
    setShowPassword(false);
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
      (s.mobile && s.mobile.includes(searchQuery)) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = selectedTab === 'all' || s.designation === selectedTab;
    return matchesSearch && matchesTab;
  });

  // Stats
  const stats = {
    total: staff.length,
    doctors: staff.filter((s) => s.designation === 'doctor').length,
    nurses: staff.filter((s) => s.designation === 'nurse').length,
    active: staff.filter((s) => s.status === 'active').length,
    withLogin: staff.filter((s) => s.has_login).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital staff, doctors, and their login accounts</p>
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
              <DialogDescription>
                Create a new staff member and optionally set up their login account
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="email">Contact Email</Label>
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
                </div>
              </div>

              <Separator />

              {/* Login Account Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    Login Account
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="create_login"
                      checked={newStaff.create_login}
                      onCheckedChange={(checked) => setNewStaff({ ...newStaff, create_login: checked })}
                    />
                    <Label htmlFor="create_login" className="text-sm">Create Login Account</Label>
                  </div>
                </div>

                {newStaff.create_login && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div>
                      <Label htmlFor="login_email">Login Email *</Label>
                      <Input
                        id="login_email"
                        type="email"
                        value={newStaff.login_email}
                        onChange={(e) => setNewStaff({ ...newStaff, login_email: e.target.value })}
                        placeholder="john@hospital.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">This will be used to login</p>
                    </div>
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={newStaff.password}
                          onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                          placeholder="Min 6 characters"
                          className="pr-20"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-full px-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-full px-2"
                            onClick={() => setNewStaff({ ...newStaff, password: generatePassword() })}
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Click key icon to generate</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center text-sm text-blue-700">
                        <Shield className="w-4 h-4 mr-2" />
                        <span>
                          Role: <strong>{DESIGNATION_OPTIONS.find(d => d.value === newStaff.designation)?.role || 'No role assigned'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleCreateStaff} disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add Staff Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">With Login</p>
                <p className="text-2xl font-bold">{stats.withLogin}</p>
              </div>
              <Key className="w-8 h-8 text-orange-500" />
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
                placeholder="Search by name, code, mobile, or email..."
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
            <div className="text-center py-8 text-gray-500">
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
              Loading staff...
            </div>
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
                  <TableHead>Login</TableHead>
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
                    <TableCell>
                      {staffMember.has_login ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Has Login
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          <XCircle className="w-3 h-3 mr-1" />
                          No Login
                        </Badge>
                      )}
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
                            Edit Details
                          </DropdownMenuItem>
                          {!staffMember.has_login && staffMember.email && (
                            <DropdownMenuItem onClick={() => handleCreateLoginForStaff(staffMember)}>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Create Login Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteStaff(staffMember)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Staff
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
            <DialogDescription>
              Update staff member details
            </DialogDescription>
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

              {/* Login Status */}
              <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Login Account:</span>
                  </div>
                  {selectedStaff.has_login ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Has Login Account
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-gray-500">No Login</Badge>
                      {selectedStaff.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreateLoginForStaff(selectedStaff)}
                          disabled={isSaving}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Create Login
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleEditStaff} disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update Staff Member
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
