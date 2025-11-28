'use client';

import { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Building2, Search, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getItems, createItemRecord, updateItemRecord, deleteItemRecord, createDirectusUser, Organization } from '@/lib/directus';
import { toast } from 'sonner';

export default function HospitalsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    owner_name: '',
    owner_mobile: '',
    subscription_plan: 'basic' as 'basic' | 'professional' | 'enterprise',
    max_users: 5,
    status: 'active' as 'active' | 'inactive' | 'suspended',
    // Admin user fields (for new hospital only)
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_password: '',
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    const result = await getItems<Organization>('organizations', {
      sort: ['-date_created'],
    });
    if (result.success && result.data) {
      setOrganizations(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingOrg) {
        // Update existing hospital - don't include admin fields
        const { admin_first_name, admin_last_name, admin_email, admin_password, ...orgData } = formData;
        const result = await updateItemRecord<Organization>('organizations', editingOrg.id, orgData);
        if (result.success) {
          toast.success('Hospital updated successfully');
          loadOrganizations();
          resetForm();
        } else {
          toast.error(result.error || 'Failed to update hospital');
        }
      } else {
        // Create new hospital with admin user
        // Validate admin fields
        if (!formData.admin_email || !formData.admin_password) {
          toast.error('Admin email and password are required for new hospitals');
          setSaving(false);
          return;
        }

        // First create the organization
        const { admin_first_name, admin_last_name, admin_email, admin_password, ...orgData } = formData;
        const orgResult = await createItemRecord<Organization>('organizations', orgData);

        if (orgResult.success && orgResult.data) {
          // Now create the admin user for this hospital
          const userResult = await createDirectusUser({
            first_name: admin_first_name || formData.owner_name?.split(' ')[0] || 'Admin',
            last_name: admin_last_name || formData.owner_name?.split(' ').slice(1).join(' ') || '',
            email: admin_email,
            password: admin_password,
            org_id: orgResult.data.id,
            status: 'active',
          });

          if (userResult.success) {
            toast.success('Hospital and admin user created successfully');
          } else {
            // Hospital was created but user failed - still notify
            console.error('User creation failed:', userResult.error);
            toast.warning(`Hospital created, but failed to create admin user: ${userResult.error}`);
          }

          loadOrganizations();
          resetForm();
        } else {
          toast.error(orgResult.error || 'Failed to create hospital');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    }

    setSaving(false);
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      code: org.code || '',
      name: org.name || '',
      address: org.address || '',
      city: org.city || '',
      state: org.state || '',
      phone: org.phone || '',
      email: org.email || '',
      owner_name: org.owner_name || '',
      owner_mobile: org.owner_mobile || '',
      subscription_plan: org.subscription_plan || 'basic',
      max_users: org.max_users || 5,
      status: org.status || 'active',
      // Admin fields not used for editing
      admin_first_name: '',
      admin_last_name: '',
      admin_email: '',
      admin_password: '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hospital?')) {
      const result = await deleteItemRecord('organizations', id);
      if (result.success) {
        toast.success('Hospital deleted successfully');
        loadOrganizations();
      } else {
        toast.error(result.error || 'Failed to delete hospital');
      }
    }
  };

  const resetForm = () => {
    setEditingOrg(null);
    setFormData({
      code: '',
      name: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      email: '',
      owner_name: '',
      owner_mobile: '',
      subscription_plan: 'basic',
      max_users: 5,
      status: 'active',
      admin_first_name: '',
      admin_last_name: '',
      admin_email: '',
      admin_password: '',
    });
    setIsDialogOpen(false);
  };

  const filteredOrgs = organizations.filter(org =>
    org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hospitals</h1>
          <p className="text-gray-600">Manage all registered hospitals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
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
                  ? 'Update hospital information below.'
                  : 'Fill in the hospital details and create an admin account.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Hospital Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., HOSP001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Hospital Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Hospital name"
                    required
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="owner_name">Owner Name</Label>
                  <Input
                    id="owner_name"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    placeholder="Owner name"
                  />
                </div>
                <div>
                  <Label htmlFor="owner_mobile">Owner Mobile</Label>
                  <Input
                    id="owner_mobile"
                    value={formData.owner_mobile}
                    onChange={(e) => setFormData({ ...formData, owner_mobile: e.target.value })}
                    placeholder="Owner mobile"
                  />
                </div>
                <div>
                  <Label htmlFor="subscription_plan">Subscription Plan</Label>
                  <Select
                    value={formData.subscription_plan}
                    onValueChange={(value) => setFormData({ ...formData, subscription_plan: value as 'basic' | 'professional' | 'enterprise' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max_users">Max Users</Label>
                  <Input
                    id="max_users"
                    type="number"
                    value={formData.max_users}
                    onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) })}
                    min={1}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' | 'suspended' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Admin User Section - Only show for new hospitals */}
              {!editingOrg && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold mb-4">Hospital Admin Account</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    This user will be the administrator for this hospital and can create additional users.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="admin_first_name">Admin First Name</Label>
                      <Input
                        id="admin_first_name"
                        value={formData.admin_first_name}
                        onChange={(e) => setFormData({ ...formData, admin_first_name: e.target.value })}
                        placeholder="First name (optional, uses owner name)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin_last_name">Admin Last Name</Label>
                      <Input
                        id="admin_last_name"
                        value={formData.admin_last_name}
                        onChange={(e) => setFormData({ ...formData, admin_last_name: e.target.value })}
                        placeholder="Last name (optional)"
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
                        required={!editingOrg}
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin_password">Admin Password *</Label>
                      <Input
                        id="admin_password"
                        type="password"
                        value={formData.admin_password}
                        onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                        placeholder="Enter password"
                        required={!editingOrg}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingOrg ? 'Update' : 'Create'} Hospital
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredOrgs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hospitals found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-mono">{org.code}</TableCell>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.city}, {org.state}</TableCell>
                    <TableCell>
                      <Badge className={getPlanColor(org.subscription_plan || 'basic')}>
                        {org.subscription_plan || 'basic'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(org.status)}>
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/superadmin/hospitals/${org.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(org)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(org.id)}>
                          <Trash2 className="w-4 h-4" />
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
