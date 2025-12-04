'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Plus, Building2, Search, Edit, Trash2, Loader2, Eye, Filter, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getItems, createItemRecord, updateItemRecord, deleteItemRecord, createDirectusUser, Organization } from '@/lib/directus';
import { toast } from 'sonner';

export default function HospitalsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    logo: null as string | null,
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    helpline_number: '',
    owner_name: '',
    owner_email: '',
    owner_mobile: '',
    // Social Media
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    twitter_url: '',
    linkedin_url: '',
    dashboard_footer_text: '',
    // Subscription & Modules
    modules: [] as string[],
    subscription_start_date: '',
    subscription_end_date: '',
    subscription_status: 'active' as string,
    payment_status: 'pending' as string,
    // Theme Colors
    theme_primary_color: '#6644FF',
    theme_secondary_color: '#333333',
    header_color: '#ffffff',
    footer_color: '#333333',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    // Admin user fields (for new hospital only)
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_password: '',
  });

  const availableModules = [
    'OPD',
    'IPD',
    'Pharmacy',
    'Lab',
    'Radiology',
    'Billing',
    'Inventory',
  ];

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

  const toggleModule = (module: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingOrg) {
        // Update existing hospital - don't include admin fields
        const { admin_first_name, admin_last_name, admin_email, admin_password, ...orgData } = formData;
        // Filter out null values to avoid TypeScript errors
        const cleanedOrgData = Object.fromEntries(
          Object.entries(orgData).filter(([_, v]) => v !== null)
        ) as Partial<Organization>;
        const result = await updateItemRecord<Organization>('organizations', editingOrg.id, cleanedOrgData);
        if (result.success) {
          toast.success('Hospital updated successfully');
          loadOrganizations();
          resetForm();
        } else {
          toast.error(result.error || 'Failed to update hospital');
        }
      } else {
        // Create new hospital with admin user
        if (!formData.admin_email || !formData.admin_password) {
          toast.error('Admin email and password are required for new hospitals');
          setSaving(false);
          return;
        }

        // First create the organization
        const { admin_first_name, admin_last_name, admin_email, admin_password, ...orgData } = formData;
        const orgDataWithDefaults = {
          ...orgData,
          subscription_start_date: formData.subscription_start_date || new Date().toISOString(),
        };
        // Filter out null values to match Organization type
        const cleanedOrgData = Object.fromEntries(
          Object.entries(orgDataWithDefaults).filter(([_, v]) => v !== null)
        ) as Partial<Organization>;
        const orgResult = await createItemRecord<Organization>('organizations', cleanedOrgData);

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
      logo: org.logo || null,
      address: org.address || '',
      city: org.city || '',
      state: org.state || '',
      pincode: org.pincode || '',
      phone: org.phone || '',
      email: org.email || '',
      helpline_number: org.helpline_number || '',
      owner_name: org.owner_name || '',
      owner_email: org.owner_email || '',
      owner_mobile: org.owner_mobile || '',
      facebook_url: org.facebook_url || '',
      instagram_url: org.instagram_url || '',
      youtube_url: org.youtube_url || '',
      twitter_url: org.twitter_url || '',
      linkedin_url: org.linkedin_url || '',
      dashboard_footer_text: org.dashboard_footer_text || '',
      modules: org.modules || [],
      subscription_start_date: org.subscription_start_date || '',
      subscription_end_date: org.subscription_end_date || '',
      subscription_status: org.subscription_status || 'active',
      payment_status: org.payment_status || 'pending',
      theme_primary_color: org.theme_primary_color || '#6644FF',
      theme_secondary_color: org.theme_secondary_color || '#333333',
      header_color: org.header_color || '#ffffff',
      footer_color: org.footer_color || '#333333',
      status: org.status || 'active',
      admin_first_name: '',
      admin_last_name: '',
      admin_email: '',
      admin_password: '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hospital? This will also delete all associated data.')) {
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
      logo: null,
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      helpline_number: '',
      owner_name: '',
      owner_email: '',
      owner_mobile: '',
      facebook_url: '',
      instagram_url: '',
      youtube_url: '',
      twitter_url: '',
      linkedin_url: '',
      dashboard_footer_text: '',
      modules: ['OPD', 'Billing'],
      subscription_start_date: '',
      subscription_end_date: '',
      subscription_status: 'active',
      payment_status: 'pending',
      theme_primary_color: '#6644FF',
      theme_secondary_color: '#333333',
      header_color: '#ffffff',
      footer_color: '#333333',
      status: 'active',
      admin_first_name: '',
      admin_last_name: '',
      admin_email: '',
      admin_password: '',
    });
    setIsDialogOpen(false);
  };

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || org.status === filterStatus;
    const matchesPayment = filterPlan === 'all' || org.payment_status === filterPlan;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="owner">Owner Details</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code">Organization Code *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g., H101, H102"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Business Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Hospital/Clinic name"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full address"
                        rows={2}
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
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="Pincode"
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
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="helpline_number">Helpline Number</Label>
                      <Input
                        id="helpline_number"
                        value={formData.helpline_number}
                        onChange={(e) => setFormData({ ...formData, helpline_number: e.target.value })}
                        placeholder="Helpline/Emergency number"
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
                </TabsContent>

                <TabsContent value="owner" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="owner_name">Owner Name</Label>
                      <Input
                        id="owner_name"
                        value={formData.owner_name}
                        onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                        placeholder="Owner full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="owner_email">Owner Email</Label>
                      <Input
                        id="owner_email"
                        type="email"
                        value={formData.owner_email}
                        onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                        placeholder="owner@example.com"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="owner_mobile">Owner Mobile Number</Label>
                      <Input
                        id="owner_mobile"
                        value={formData.owner_mobile}
                        onChange={(e) => setFormData({ ...formData, owner_mobile: e.target.value })}
                        placeholder="Owner mobile number"
                      />
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
                            minLength={8}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="facebook_url">Facebook URL</Label>
                      <Input
                        id="facebook_url"
                        value={formData.facebook_url}
                        onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram_url">Instagram URL</Label>
                      <Input
                        id="instagram_url"
                        value={formData.instagram_url}
                        onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtube_url">YouTube URL</Label>
                      <Input
                        id="youtube_url"
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter_url">Twitter URL</Label>
                      <Input
                        id="twitter_url"
                        value={formData.twitter_url}
                        onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="dashboard_footer_text">Dashboard Footer Text</Label>
                      <Textarea
                        id="dashboard_footer_text"
                        value={formData.dashboard_footer_text}
                        onChange={(e) => setFormData({ ...formData, dashboard_footer_text: e.target.value })}
                        placeholder="© 2024 Hospital Name. All rights reserved."
                        rows={2}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="subscription" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Select Modules</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {availableModules.map(module => (
                          <div key={module} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`module-${module}`}
                              checked={formData.modules.includes(module)}
                              onChange={() => toggleModule(module)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <Label htmlFor={`module-${module}`} className="cursor-pointer">
                              {module}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <Label htmlFor="subscription_start_date">Subscription Start Date</Label>
                        <Input
                          id="subscription_start_date"
                          type="date"
                          value={formData.subscription_start_date}
                          onChange={(e) => setFormData({ ...formData, subscription_start_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="subscription_end_date">Subscription End Date</Label>
                        <Input
                          id="subscription_end_date"
                          type="date"
                          value={formData.subscription_end_date}
                          onChange={(e) => setFormData({ ...formData, subscription_end_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="subscription_status">Subscription Status</Label>
                        <Select
                          value={formData.subscription_status}
                          onValueChange={(value) => setFormData({ ...formData, subscription_status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="payment_status">Payment Status</Label>
                        <Select
                          value={formData.payment_status}
                          onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="theme" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme_primary_color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="theme_primary_color"
                          type="color"
                          value={formData.theme_primary_color}
                          onChange={(e) => setFormData({ ...formData, theme_primary_color: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.theme_primary_color}
                          onChange={(e) => setFormData({ ...formData, theme_primary_color: e.target.value })}
                          placeholder="#6644FF"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="theme_secondary_color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="theme_secondary_color"
                          type="color"
                          value={formData.theme_secondary_color}
                          onChange={(e) => setFormData({ ...formData, theme_secondary_color: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.theme_secondary_color}
                          onChange={(e) => setFormData({ ...formData, theme_secondary_color: e.target.value })}
                          placeholder="#333333"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="header_color">Header Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="header_color"
                          type="color"
                          value={formData.header_color}
                          onChange={(e) => setFormData({ ...formData, header_color: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.header_color}
                          onChange={(e) => setFormData({ ...formData, header_color: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="footer_color">Footer Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="footer_color"
                          type="color"
                          value={formData.footer_color}
                          onChange={(e) => setFormData({ ...formData, footer_color: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.footer_color}
                          onChange={(e) => setFormData({ ...formData, footer_color: e.target.value })}
                          placeholder="#333333"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
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
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search hospitals by name, code, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">
              Total: {filteredOrgs.length} hospitals
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Loading hospitals...</p>
            </div>
          ) : filteredOrgs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No hospitals found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrgs.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-mono font-semibold">{org.code}</TableCell>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>{org.city}, {org.state}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {org.modules?.slice(0, 3).map(m => (
                            <Badge key={m} variant="outline" className="text-xs">
                              {m}
                            </Badge>
                          ))}
                          {(org.modules?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(org.modules?.length || 0) - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={org.subscription_status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {org.subscription_status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentColor(org.payment_status || 'pending')}>
                          {org.payment_status || 'pending'}
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
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(org.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
