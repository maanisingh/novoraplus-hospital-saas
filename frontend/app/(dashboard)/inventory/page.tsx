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
import { getItems, createItemRecord, updateItemRecord, Inventory } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Edit,
  Pill,
  Beaker,
  Boxes,
} from 'lucide-react';
import { toast } from 'sonner';

export default function InventoryPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [formData, setFormData] = useState<{
    item_name: string;
    item_code: string;
    item_type: 'medicine' | 'consumable' | 'equipment';
    quantity: number;
    unit: string;
    unit_price: number;
    reorder_level: number;
    batch_number: string;
    expiry_date: string;
    supplier: string;
  }>({
    item_name: '',
    item_code: '',
    item_type: 'medicine',
    quantity: 0,
    unit: 'pcs',
    unit_price: 0,
    reorder_level: 10,
    batch_number: '',
    expiry_date: '',
    supplier: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await getItems<Inventory>('inventory', {
        fields: ['*'],
        sort: ['item_name'],
        limit: 500,
      });

      if (result.success && Array.isArray(result.data)) {
        setItems(result.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const generateItemCode = () => {
    const prefix = formData.item_type === 'medicine' ? 'MED' : formData.item_type === 'consumable' ? 'CON' : 'EQP';
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}${timestamp}`;
  };

  const handleOpenDialog = (item?: Inventory) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        item_name: item.item_name,
        item_code: item.item_code,
        item_type: item.item_type as 'medicine' | 'consumable' | 'equipment',
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price || 0,
        reorder_level: item.reorder_level || 10,
        batch_number: item.batch_number || '',
        expiry_date: item.expiry_date || '',
        supplier: item.supplier || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        item_name: '',
        item_code: '',
        item_type: 'medicine',
        quantity: 0,
        unit: 'pcs',
        unit_price: 0,
        reorder_level: 10,
        batch_number: '',
        expiry_date: '',
        supplier: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.item_name) {
      toast.error('Item name is required');
      return;
    }

    try {
      const itemData: Partial<Inventory> = {
        ...formData,
        item_code: formData.item_code || generateItemCode(),
        org_id: user?.org_id ?? undefined,
      };

      if (editingItem) {
        const result = await updateItemRecord<Inventory>('inventory', editingItem.id, itemData);
        if (result.success) {
          toast.success('Item updated successfully');
          setIsDialogOpen(false);
          loadData();
        } else {
          toast.error(result.error || 'Failed to update item');
        }
      } else {
        const result = await createItemRecord<Inventory>('inventory', itemData);
        if (result.success) {
          toast.success('Item added successfully');
          setIsDialogOpen(false);
          loadData();
        } else {
          toast.error(result.error || 'Failed to add item');
        }
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const getStockBadge = (item: Inventory) => {
    if (item.quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (item.quantity <= (item.reorder_level || 10)) {
      return <Badge className="bg-yellow-100 text-yellow-700">Low Stock</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700">In Stock</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medicine':
        return <Pill className="w-4 h-4 text-blue-600" />;
      case 'consumable':
        return <Beaker className="w-4 h-4 text-green-600" />;
      case 'equipment':
        return <Boxes className="w-4 h-4 text-purple-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const medicines = items.filter((i) => i.item_type === 'medicine');
  const consumables = items.filter((i) => i.item_type === 'consumable');
  const equipment = items.filter((i) => i.item_type === 'equipment');
  const lowStockItems = items.filter((i) => i.quantity <= (i.reorder_level || 10));

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.item_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track medicines, consumables, and equipment</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.item_name}
                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Item Code</Label>
                  <Input
                    id="code"
                    value={formData.item_code}
                    onChange={(e) => setFormData({ ...formData, item_code: e.target.value })}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <Label>Item Type</Label>
                  <Select
                    value={formData.item_type}
                    onValueChange={(value) => setFormData({ ...formData, item_type: value as 'medicine' | 'consumable' | 'equipment' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="strips">Strips</SelectItem>
                      <SelectItem value="bottles">Bottles</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                      <SelectItem value="ml">ML</SelectItem>
                      <SelectItem value="mg">MG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Unit Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="reorder">Reorder Level</Label>
                  <Input
                    id="reorder"
                    type="number"
                    value={formData.reorder_level}
                    onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 10 })}
                  />
                </div>
                <div>
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
                <div className="col-span-2 flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Button>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{items.length}</p>
              </div>
              <Package className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Medicines</p>
                <p className="text-3xl font-bold text-blue-600">{medicines.length}</p>
              </div>
              <Pill className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Consumables</p>
                <p className="text-3xl font-bold text-green-600">{consumables.length}</p>
              </div>
              <Beaker className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock Alerts</p>
                <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="consumable">Consumable</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Inventory Items ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No items found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-blue-600">
                      {item.item_code}
                    </TableCell>
                    <TableCell className="font-medium">{item.item_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(item.item_type)}
                        <span className="capitalize">{item.item_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>₹{(item.unit_price || 0).toLocaleString()}</TableCell>
                    <TableCell>{getStockBadge(item)}</TableCell>
                    <TableCell className="text-gray-500">
                      {item.expiry_date
                        ? new Date(item.expiry_date).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
