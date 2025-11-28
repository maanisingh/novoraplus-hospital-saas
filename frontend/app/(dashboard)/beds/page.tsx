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
import { getItems, createItemRecord, updateItemRecord, deleteItemRecord, Bed } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import { Plus, Search, BedDouble, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const BED_TYPES = [
  { value: 'general', label: 'General Ward' },
  { value: 'semi_private', label: 'Semi Private' },
  { value: 'private', label: 'Private' },
  { value: 'icu', label: 'ICU' },
  { value: 'nicu', label: 'NICU' },
];

const BED_STATUS = [
  { value: 'available', label: 'Available', color: 'bg-green-500' },
  { value: 'occupied', label: 'Occupied', color: 'bg-red-500' },
  { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-500' },
];

export default function BedsPage() {
  const { user } = useAuthStore();
  const [beds, setBeds] = useState<Bed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [newBed, setNewBed] = useState({
    bed_number: '',
    ward: '',
    bed_type: 'general' as 'general' | 'semi_private' | 'private' | 'icu' | 'nicu',
    status: 'available' as 'available' | 'occupied' | 'maintenance',
    daily_rate: '',
  });

  useEffect(() => {
    loadBeds();
  }, []);

  const loadBeds = async () => {
    setIsLoading(true);
    try {
      const result = await getItems<Bed>('beds', {
        fields: ['*'],
        sort: ['bed_number'],
        limit: 200,
      });

      if (result.success && Array.isArray(result.data)) {
        setBeds(result.data);
      }
    } catch (error) {
      console.error('Error loading beds:', error);
      toast.error('Failed to load beds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBed = async () => {
    if (!newBed.bed_number) {
      toast.error('Bed number is required');
      return;
    }

    try {
      const bedData: Partial<Bed> = {
        bed_number: newBed.bed_number,
        ward: newBed.ward || undefined,
        bed_type: newBed.bed_type,
        status: newBed.status,
        daily_rate: newBed.daily_rate ? parseFloat(newBed.daily_rate) : undefined,
        org_id: user?.org_id,
      };

      const result = await createItemRecord<Bed>('beds', bedData);

      if (result.success) {
        toast.success('Bed created successfully');
        setIsDialogOpen(false);
        setNewBed({
          bed_number: '',
          ward: '',
          bed_type: 'general',
          status: 'available',
          daily_rate: '',
        });
        loadBeds();
      } else {
        toast.error(result.error || 'Failed to create bed');
      }
    } catch (error) {
      console.error('Error creating bed:', error);
      toast.error('Failed to create bed');
    }
  };

  const handleEditBed = async () => {
    if (!selectedBed) return;

    try {
      const result = await updateItemRecord<Bed>('beds', selectedBed.id, {
        bed_number: selectedBed.bed_number,
        ward: selectedBed.ward || undefined,
        bed_type: selectedBed.bed_type,
        status: selectedBed.status,
        daily_rate: selectedBed.daily_rate,
      });

      if (result.success) {
        toast.success('Bed updated successfully');
        setIsEditDialogOpen(false);
        setSelectedBed(null);
        loadBeds();
      } else {
        toast.error(result.error || 'Failed to update bed');
      }
    } catch (error) {
      console.error('Error updating bed:', error);
      toast.error('Failed to update bed');
    }
  };

  const handleDeleteBed = async (bed: Bed) => {
    if (bed.status === 'occupied') {
      toast.error('Cannot delete an occupied bed');
      return;
    }

    if (!confirm(`Are you sure you want to delete bed ${bed.bed_number}?`)) {
      return;
    }

    try {
      const result = await deleteItemRecord('beds', bed.id);

      if (result.success) {
        toast.success('Bed deleted successfully');
        loadBeds();
      } else {
        toast.error(result.error || 'Failed to delete bed');
      }
    } catch (error) {
      console.error('Error deleting bed:', error);
      toast.error('Failed to delete bed');
    }
  };

  const openEditDialog = (bed: Bed) => {
    setSelectedBed({ ...bed });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = BED_STATUS.find((s) => s.value === status);
    const variant = status === 'available' ? 'default' : status === 'occupied' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{statusInfo?.label || status}</Badge>;
  };

  const filteredBeds = beds.filter((bed) => {
    const matchesSearch =
      bed.bed_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bed.ward && bed.ward.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || bed.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: beds.length,
    available: beds.filter((b) => b.status === 'available').length,
    occupied: beds.filter((b) => b.status === 'occupied').length,
    maintenance: beds.filter((b) => b.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bed Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital beds and wards</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Bed
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Bed</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="bed_number">Bed Number *</Label>
                <Input
                  id="bed_number"
                  value={newBed.bed_number}
                  onChange={(e) =>
                    setNewBed({ ...newBed, bed_number: e.target.value })
                  }
                  placeholder="e.g., A101, B202"
                />
              </div>
              <div>
                <Label htmlFor="ward">Ward</Label>
                <Input
                  id="ward"
                  value={newBed.ward}
                  onChange={(e) =>
                    setNewBed({ ...newBed, ward: e.target.value })
                  }
                  placeholder="e.g., Ward A, ICU"
                />
              </div>
              <div>
                <Label htmlFor="bed_type">Bed Type</Label>
                <Select
                  value={newBed.bed_type}
                  onValueChange={(value: 'general' | 'semi_private' | 'private' | 'icu' | 'nicu') =>
                    setNewBed({ ...newBed, bed_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BED_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="daily_rate">Daily Rate (₹)</Label>
                <Input
                  id="daily_rate"
                  type="number"
                  value={newBed.daily_rate}
                  onChange={(e) =>
                    setNewBed({ ...newBed, daily_rate: e.target.value })
                  }
                  placeholder="e.g., 1500"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newBed.status}
                  onValueChange={(value: 'available' | 'occupied' | 'maintenance') =>
                    setNewBed({ ...newBed, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {BED_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBed}>Add Bed</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Beds</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.occupied}</div>
              <div className="text-sm text-gray-500">Occupied</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.maintenance}</div>
              <div className="text-sm text-gray-500">Maintenance</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by bed number or ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {BED_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Beds Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BedDouble className="w-5 h-5 mr-2" />
            Beds ({filteredBeds.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredBeds.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BedDouble className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No beds found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Bed
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bed Number</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeds.map((bed) => (
                  <TableRow key={bed.id}>
                    <TableCell className="font-mono font-medium text-blue-600">
                      {bed.bed_number}
                    </TableCell>
                    <TableCell>{bed.ward || '-'}</TableCell>
                    <TableCell>
                      {BED_TYPES.find((t) => t.value === bed.bed_type)?.label || bed.bed_type || '-'}
                    </TableCell>
                    <TableCell>
                      {bed.daily_rate ? `₹${bed.daily_rate.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(bed.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(bed)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteBed(bed)}
                            className="text-red-600"
                            disabled={bed.status === 'occupied'}
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

      {/* Edit Bed Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bed</DialogTitle>
          </DialogHeader>
          {selectedBed && (
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="edit-bed_number">Bed Number *</Label>
                <Input
                  id="edit-bed_number"
                  value={selectedBed.bed_number}
                  onChange={(e) =>
                    setSelectedBed({ ...selectedBed, bed_number: e.target.value })
                  }
                  placeholder="e.g., A101, B202"
                />
              </div>
              <div>
                <Label htmlFor="edit-ward">Ward</Label>
                <Input
                  id="edit-ward"
                  value={selectedBed.ward || ''}
                  onChange={(e) =>
                    setSelectedBed({ ...selectedBed, ward: e.target.value })
                  }
                  placeholder="e.g., Ward A, ICU"
                />
              </div>
              <div>
                <Label htmlFor="edit-bed_type">Bed Type</Label>
                <Select
                  value={selectedBed.bed_type || 'general'}
                  onValueChange={(value: 'general' | 'semi_private' | 'private' | 'icu' | 'nicu') =>
                    setSelectedBed({ ...selectedBed, bed_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BED_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-daily_rate">Daily Rate (₹)</Label>
                <Input
                  id="edit-daily_rate"
                  type="number"
                  value={selectedBed.daily_rate || ''}
                  onChange={(e) =>
                    setSelectedBed({ ...selectedBed, daily_rate: parseFloat(e.target.value) || undefined })
                  }
                  placeholder="e.g., 1500"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedBed.status}
                  onValueChange={(value: 'available' | 'occupied' | 'maintenance') =>
                    setSelectedBed({ ...selectedBed, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {BED_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditBed}>Update Bed</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
