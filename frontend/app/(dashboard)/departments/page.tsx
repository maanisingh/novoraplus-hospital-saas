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
import { getItems, createItemRecord, updateItemRecord, deleteItemRecord, Department } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import { Plus, Search, Building2, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DepartmentsPage() {
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      const result = await getItems<Department>('departments', {
        fields: ['*'],
        sort: ['name'],
        limit: 100,
      });

      if (result.success && Array.isArray(result.data)) {
        setDepartments(result.data);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDepartment.name) {
      toast.error('Department name is required');
      return;
    }

    try {
      const departmentData: Partial<Department> = {
        name: newDepartment.name,
        code: newDepartment.code || undefined,
        description: newDepartment.description || undefined,
        status: newDepartment.status,
        org_id: user?.org_id ?? undefined,
      };

      const result = await createItemRecord<Department>('departments', departmentData);

      if (result.success) {
        toast.success('Department created successfully');
        setIsDialogOpen(false);
        setNewDepartment({
          name: '',
          code: '',
          description: '',
          status: 'active',
        });
        loadDepartments();
      } else {
        toast.error(result.error || 'Failed to create department');
      }
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department');
    }
  };

  const handleEditDepartment = async () => {
    if (!selectedDepartment) return;

    try {
      const result = await updateItemRecord<Department>('departments', selectedDepartment.id, {
        name: selectedDepartment.name,
        code: selectedDepartment.code || undefined,
        description: selectedDepartment.description || undefined,
        status: selectedDepartment.status,
      });

      if (result.success) {
        toast.success('Department updated successfully');
        setIsEditDialogOpen(false);
        setSelectedDepartment(null);
        loadDepartments();
      } else {
        toast.error(result.error || 'Failed to update department');
      }
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Failed to update department');
    }
  };

  const handleDeleteDepartment = async (department: Department) => {
    if (!confirm(`Are you sure you want to delete ${department.name}?`)) {
      return;
    }

    try {
      const result = await deleteItemRecord('departments', department.id);

      if (result.success) {
        toast.success('Department deleted successfully');
        loadDepartments();
      } else {
        toast.error(result.error || 'Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  const openEditDialog = (department: Department) => {
    setSelectedDepartment({ ...department });
    setIsEditDialogOpen(true);
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dept.code && dept.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage hospital departments</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                  placeholder="e.g., Cardiology, Orthopedics"
                />
              </div>
              <div>
                <Label htmlFor="code">Department Code</Label>
                <Input
                  id="code"
                  value={newDepartment.code}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., CARD, ORTH"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDepartment.description}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, description: e.target.value })
                  }
                  placeholder="Department description..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newDepartment.status}
                  onValueChange={(value: 'active' | 'inactive') =>
                    setNewDepartment({ ...newDepartment, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDepartment}>Create Department</Button>
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
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Departments ({filteredDepartments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No departments found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Department
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-mono text-blue-600">
                      {department.code || '-'}
                    </TableCell>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell className="text-gray-500 max-w-xs truncate">
                      {department.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={department.status === 'active' ? 'default' : 'secondary'}
                      >
                        {department.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(department)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteDepartment(department)}
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

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="edit-name">Department Name *</Label>
                <Input
                  id="edit-name"
                  value={selectedDepartment.name}
                  onChange={(e) =>
                    setSelectedDepartment({ ...selectedDepartment, name: e.target.value })
                  }
                  placeholder="e.g., Cardiology, Orthopedics"
                />
              </div>
              <div>
                <Label htmlFor="edit-code">Department Code</Label>
                <Input
                  id="edit-code"
                  value={selectedDepartment.code || ''}
                  onChange={(e) =>
                    setSelectedDepartment({ ...selectedDepartment, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., CARD, ORTH"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedDepartment.description || ''}
                  onChange={(e) =>
                    setSelectedDepartment({ ...selectedDepartment, description: e.target.value })
                  }
                  placeholder="Department description..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedDepartment.status}
                  onValueChange={(value: 'active' | 'inactive') =>
                    setSelectedDepartment({ ...selectedDepartment, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditDepartment}>Update Department</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
