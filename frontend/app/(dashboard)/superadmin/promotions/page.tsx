'use client';

import { useState, useEffect } from 'react';
import { Promotion, getItems, createItemRecord, updateItemRecord, deleteItemRecord } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Tag, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    startDate: '',
    endDate: '',
    usageLimit: 0,
    applicablePlans: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    const result = await getItems<Promotion>('promotions');

    if (result.success && result.data) {
      setPromotions(result.data);
    } else {
      toast.error('Failed to load promotions');
    }
    setLoading(false);
  };

  const handleOpenDialog = (promo?: Promotion) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        code: promo.code,
        description: promo.description || '',
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        startDate: promo.startDate ? promo.startDate.split('T')[0] : '',
        endDate: promo.endDate ? promo.endDate.split('T')[0] : '',
        usageLimit: promo.usageLimit || 0,
        applicablePlans: promo.applicablePlans || [],
        isActive: promo.isActive !== false,
      });
    } else {
      setEditingPromo(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        startDate: '',
        endDate: '',
        usageLimit: 0,
        applicablePlans: [],
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.discountValue) {
      toast.error('Please fill in required fields');
      return;
    }

    const data = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    const result = editingPromo
      ? await updateItemRecord<Promotion>('promotions', editingPromo.id, data)
      : await createItemRecord<Promotion>('promotions', data);

    if (result.success) {
      toast.success('Promotion saved successfully');
      loadPromotions();
      setDialogOpen(false);
    } else {
      toast.error('Failed to save: ' + result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    const result = await deleteItemRecord('promotions', id);
    if (result.success) {
      toast.success('Promotion deleted');
      loadPromotions();
    } else {
      toast.error('Failed to delete: ' + result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promotions & Discounts</h1>
          <p className="mt-1 text-gray-600">Manage promotional codes and discounts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPromo ? 'Edit' : 'Create New'} Promotion</DialogTitle>
              <DialogDescription>
                {editingPromo ? 'Update the promotion details' : 'Create a new promotional discount code'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Promotion Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER2024"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: 'percentage' | 'fixed') =>
                      setFormData({ ...formData, discountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <div className="flex items-center">
                          <Percent className="mr-2 h-4 w-4" />
                          Percentage
                        </div>
                      </SelectItem>
                      <SelectItem value="fixed">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Fixed Amount
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this promotion..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountValue">
                    Discount Value * ({formData.discountType === 'percentage' ? '%' : '₹'})
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="usageLimit">Usage Limit (0 = unlimited)</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    min="0"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active (customers can use this promotion)
                </Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingPromo ? 'Update' : 'Create'} Promotion</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Tag className="mr-2 inline h-5 w-5" />
            All Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {promo.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{promo.description || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {promo.discountValue}
                      {promo.discountType === 'percentage' ? '%' : '₹'}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {promo.startDate && promo.endDate ? (
                      <>
                        {format(new Date(promo.startDate), 'MMM dd')} -{' '}
                        {format(new Date(promo.endDate), 'MMM dd, yyyy')}
                      </>
                    ) : (
                      'No expiry'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {promo.timesUsed || 0} / {promo.usageLimit || '∞'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={promo.isActive ? 'default' : 'secondary'}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(promo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(promo.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {promotions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                    <div>
                      <Tag className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-lg font-semibold">No promotions yet</p>
                      <p className="mt-1 text-sm">Create your first promotional code to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
