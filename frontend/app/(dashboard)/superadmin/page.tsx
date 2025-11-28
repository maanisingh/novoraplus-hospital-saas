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
  DialogDescription,
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
import { getItems, createItemRecord, updateItemRecord, createDirectusUser, Organization, DirectusUser } from '@/lib/directus';
import { useAuthStore, isSuperAdmin } from '@/lib/auth-store';
import {
  Plus,
  Building2,
  Users,
  Activity,
  Search,
  Edit,
  Ban,
  CheckCircle,
  IndianRupee,
  Mail,
  MapPin,
  Loader2,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SuperAdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    subscription_plan: 'basic' | 'professional' | 'enterprise';
    max_users: number;
    // Admin user fields
    admin_first_name: string;
    admin_last_name: string;
    admin_email: string;
    admin_password: string;
  }>({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    subscription_plan: 'basic',
    max_users: 10,
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_password: '',
  });

  useEffect(() => {
    // Redirect non-superadmin users
    if (user && !isSuperAdmin(user)) {
      router.push('/dashboard');
      return;
    }
    loadOrganizations();
  }, [user, router]);

  const loadOrganizations = async () => {
    setIsLoading(true);
    try {
      const [orgsResult, usersResult] = await Promise.all([
        getItems<Organization>('organizations', {
          fields: ['*'],
          sort: ['-date_created'],
        }),
        getItems<DirectusUser>('directus_users', {
          fields: ['id'],
        }),
      ]);

      if (orgsResult.success && Array.isArray(orgsResult.data)) {
        setOrganizations(orgsResult.data);
      }
      if (usersResult.success && Array.isArray(usersResult.data)) {
        setTotalUsers(usersResult.data.length);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setIsLoading(false);
    }
  };

  const generateOrgCode = () => {
    const prefix = 'H';
    const num = (organizations.length + 101).toString();
    return `${prefix}${num}`;
  };

  const handleOpenDialog = (org?: Organization) => {
    if (org) {
      setEditingOrg(org);
      setFormData({
        name: org.name,
        code: org.code,
        email: org.email || '',
        phone: org.phone || '',
        address: org.address || '',
        city: org.city || '',
        state: org.state || '',
        subscription_plan: (org.subscription_plan as 'basic' | 'professional' | 'enterprise') || 'basic',
        max_users: org.max_users || 10,
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_password: '',
      });
    } else {
      setEditingOrg(null);
      setFormData({
        name: '',
        code: generateOrgCode(),
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        subscription_plan: 'basic',
        max_users: 10,
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_password: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code) {
      toast.error('Name and code are required');
      return;
    }

    // Validate admin fields when creating new hospital
    if (!editingOrg) {
      if (!formData.admin_email || !formData.admin_password) {
        toast.error('Admin email and password are required');
        return;
      }
      if (formData.admin_password.length < 6) {
        toast.error('Admin password must be at least 6 characters');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (editingOrg) {
        // Update existing organization
        const { admin_first_name, admin_last_name, admin_email, admin_password, ...orgUpdateData } = formData;
        const result = await updateItemRecord<Organization>(
          'organizations',
          editingOrg.id,
          orgUpdateData
        );

        if (result.success) {
          toast.success('Hospital updated successfully');
          setIsDialogOpen(false);
          loadOrganizations();
        } else {
          toast.error(result.error || 'Failed to update hospital');
        }
      } else {
        // Create new organization
        const { admin_first_name, admin_last_name, admin_email, admin_password, ...orgFields } = formData;
        const orgData: Partial<Organization> = {
          ...orgFields,
          status: 'active',
          subscription_start: new Date().toISOString(),
          subscription_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days trial
        };

        const orgResult = await createItemRecord<Organization>('organizations', orgData);

        if (orgResult.success && orgResult.data) {
          // Create admin user for the hospital
          const userResult = await createDirectusUser({
            first_name: admin_first_name || formData.name.split(' ')[0] || 'Admin',
            last_name: admin_last_name || '',
            email: admin_email,
            password: admin_password,
            org_id: orgResult.data.id,
            status: 'active',
          });

          if (userResult.success) {
            toast.success('Hospital and admin user created successfully');
          } else {
            toast.warning(`Hospital created but admin user failed: ${userResult.error}`);
          }

          setIsDialogOpen(false);
          loadOrganizations();
        } else {
          toast.error(orgResult.error || 'Failed to create hospital');
        }
      }
    } catch (error) {
      console.error('Error saving organization:', error);
      toast.error('Failed to save hospital');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (org: Organization) => {
    const newStatus = org.status === 'active' ? 'inactive' : 'active';
    try {
      const result = await updateItemRecord<Organization>('organizations', org.id, {
        status: newStatus,
      });

      if (result.success) {
        toast.success(`Hospital ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        loadOrganizations();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredOrgs = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.city && org.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeOrgs = organizations.filter((o) => o.status === 'active');
  const inactiveOrgs = organizations.filter((o) => o.status === 'inactive');

  // Calculate revenue based on actual subscription plans
  const planPrices: Record<string, number> = {
    basic: 999,
    professional: 2499,
    enterprise: 4999,
  };
  const monthlyRevenue = activeOrgs.reduce((total, org) => {
    return total + (planPrices[org.subscription_plan || 'basic'] || 999);
  }, 0);

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        <Ban className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-blue-100 text-blue-700',
      professional: 'bg-purple-100 text-purple-700',
      enterprise: 'bg-orange-100 text-orange-700',
    };
    return (
      <Badge className={`${colors[plan] || colors.basic} hover:opacity-90`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage all hospitals and subscriptions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hospital
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrg ? 'Edit Hospital' : 'Add New Hospital'}
              </DialogTitle>
              <DialogDescription>
                {editingOrg
                  ? 'Update hospital information and settings.'
                  : 'Create a new hospital with an admin user who can manage the hospital.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2">
                <Label htmlFor="name">Hospital Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter hospital name"
                />
              </div>
              <div>
                <Label htmlFor="code">Hospital Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., H101"
                  disabled={!!editingOrg}
                />
              </div>
              <div>
                <Label htmlFor="email">Hospital Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@hospital.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Contact number"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                />
              </div>
              <div>
                <Label>Subscription Plan</Label>
                <Select
                  value={formData.subscription_plan}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subscription_plan: value as 'basic' | 'professional' | 'enterprise' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - ₹999/month</SelectItem>
                    <SelectItem value="professional">Professional - ₹2,499/month</SelectItem>
                    <SelectItem value="enterprise">Enterprise - ₹4,999/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max_users">Max Users</Label>
                <Input
                  id="max_users"
                  type="number"
                  value={formData.max_users}
                  onChange={(e) =>
                    setFormData({ ...formData, max_users: parseInt(e.target.value) || 10 })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                />
              </div>

              {/* Admin User Section - only shown when creating new hospital */}
              {!editingOrg && (
                <>
                  <div className="col-span-2 border-t pt-4 mt-2">
                    <h3 className="font-semibold text-gray-900 mb-3">Hospital Admin User</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      This user will be the primary administrator for the hospital.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="admin_first_name">Admin First Name</Label>
                    <Input
                      id="admin_first_name"
                      value={formData.admin_first_name}
                      onChange={(e) => setFormData({ ...formData, admin_first_name: e.target.value })}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_last_name">Admin Last Name</Label>
                    <Input
                      id="admin_last_name"
                      value={formData.admin_last_name}
                      onChange={(e) => setFormData({ ...formData, admin_last_name: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_email">Admin Email *</Label>
                    <Input
                      id="admin_email"
                      type="email"
                      value={formData.admin_email}
                      onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                      placeholder="admin@hospital.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_password">Admin Password *</Label>
                    <Input
                      id="admin_password"
                      type="password"
                      value={formData.admin_password}
                      onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                      placeholder="Min 6 characters"
                    />
                  </div>
                </>
              )}

              <div className="col-span-2 flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingOrg ? 'Update Hospital' : 'Create Hospital'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Hospitals</p>
                <p className="text-3xl font-bold text-gray-900">{organizations.length}</p>
              </div>
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-indigo-600">{totalUsers}</p>
              </div>
              <Users className="w-10 h-10 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeOrgs.length}</p>
              </div>
              <Activity className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-3xl font-bold text-gray-400">{inactiveOrgs.length}</p>
              </div>
              <Ban className="w-10 h-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{monthlyRevenue.toLocaleString()}
                </p>
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
              placeholder="Search by name, code, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hospitals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            All Hospitals ({filteredOrgs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredOrgs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hospitals found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Hospital Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-mono text-blue-600 font-medium">
                      {org.code}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        {org.email && (
                          <p className="text-xs text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {org.email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {org.city && org.state ? (
                        <span className="flex items-center text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {org.city}, {org.state}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{getPlanBadge(org.subscription_plan || 'basic')}</TableCell>
                    <TableCell>{getStatusBadge(org.status)}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(org.date_created).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/superadmin/hospitals/${org.id}`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(org)}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(org)}
                          title={org.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {org.status === 'active' ? (
                            <Ban className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
