'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Users, Search, UserPlus, Edit, Trash2, Loader2 } from 'lucide-react';
import { getItems, createDirectusUser, updateItemRecord, deleteItemRecord, DirectusUser, Organization } from '@/lib/directus';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<DirectusUser[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DirectusUser | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    org_id: '',
    status: 'active',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [usersResult, orgsResult] = await Promise.all([
      getItems<DirectusUser>('directus_users', {
        fields: ['id', 'email', 'first_name', 'last_name', 'role', 'status', 'org_id'],
      }),
      getItems<Organization>('organizations', {
        fields: ['id', 'code', 'name'],
        filter: { status: { _eq: 'active' } },
      }),
    ]);

    if (usersResult.success && usersResult.data) {
      setUsers(usersResult.data);
    }
    if (orgsResult.success && orgsResult.data) {
      setOrganizations(orgsResult.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingUser) {
        // Update existing user
        const updateData: Record<string, unknown> = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          status: formData.status,
        };

        if (formData.org_id) {
          updateData.org_id = formData.org_id;
        }

        if (formData.password) {
          updateData.password = formData.password;
        }

        const result = await updateItemRecord<DirectusUser>('directus_users', editingUser.id, updateData);
        if (result.success) {
          toast.success('User updated successfully');
          loadData();
          resetForm();
        } else {
          toast.error(result.error || 'Failed to update user');
        }
      } else {
        // Create new user using Directus SDK createUser method
        if (!formData.password) {
          toast.error('Password is required for new users');
          setSaving(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setSaving(false);
          return;
        }

        // Note: role is stored in a custom field, not Directus role (which requires UUID)
        const result = await createDirectusUser({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          org_id: formData.org_id || undefined,
          status: formData.status,
        });

        if (result.success) {
          toast.success('User created successfully');
          loadData();
          resetForm();
        } else {
          toast.error(result.error || 'Failed to create user');
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('An unexpected error occurred');
    }

    setSaving(false);
  };

  const handleEdit = (user: DirectusUser) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      password: '',
      org_id: user.org_id || '',
      status: user.status || 'active',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;

    const result = await deleteItemRecord('directus_users', deleteUserId);
    if (result.success) {
      toast.success('User deleted successfully');
      loadData();
    } else {
      toast.error(result.error || 'Failed to delete user');
    }
    setDeleteUserId(null);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      org_id: '',
      status: 'active',
    });
    setIsDialogOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'invited': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrgName = (orgId: string | undefined) => {
    if (!orgId) return 'Platform Staff';
    const org = organizations.find(o => o.id === orgId);
    return org ? org.name : 'Unknown';
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-600">Manage all system users</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Add New Staff User'}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? 'Update user information and settings.'
                  : 'Create a new staff user for your SaaS platform.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                  required
                  disabled={!!editingUser}
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Min 6 characters'}
                  required={!editingUser}
                />
              </div>

              <div>
                <Label htmlFor="org_id">Assign to Hospital (Optional)</Label>
                <Select
                  value={formData.org_id || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, org_id: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Platform Staff)</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name} ({org.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingUser ? 'Update' : 'Create'} User
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredUsers.length} users</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getOrgName(user.org_id)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => setDeleteUserId(user.id)}
                        >
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
