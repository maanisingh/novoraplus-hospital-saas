'use client';

import { useState, useEffect } from 'react';
import { SubscriptionPlan, getItems, createItemRecord, updateItemRecord, deleteItemRecord } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

const AVAILABLE_MODULES = [
  { value: 'opd', label: 'OPD Management' },
  { value: 'ipd', label: 'IPD Management' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'billing', label: 'Billing & Invoicing' },
  { value: 'inventory', label: 'Inventory Management' },
  { value: 'hr', label: 'HR & Payroll' },
  { value: 'reports', label: 'Reports & Analytics' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'telemedicine', label: 'Telemedicine' },
  { value: 'mobile_app', label: 'Mobile App Access' },
];

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    billingCycle: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    maxUsers: 10,
    maxPatients: 1000,
    modules: [] as string[],
    features: [] as string[],
    isPopular: false,
    status: 'active' as 'active' | 'inactive',
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const result = await getItems<SubscriptionPlan>('subscription_plans', {
      sort: ['price'],
    });

    if (result.success && result.data) {
      setPlans(result.data);
    } else {
      toast.error('Failed to load subscription plans');
    }
    setLoading(false);
  };

  const handleOpenDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        billingCycle: plan.billingCycle,
        maxUsers: plan.maxUsers || 10,
        maxPatients: plan.maxPatients || 1000,
        modules: plan.modules || [],
        features: plan.features || [],
        isPopular: plan.isPopular || false,
        status: plan.status,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        billingCycle: 'monthly',
        maxUsers: 10,
        maxPatients: 1000,
        modules: [],
        features: [],
        isPopular: false,
        status: 'active',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || formData.modules.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const planData = {
      ...formData,
    };

    if (editingPlan) {
      const result = await updateItemRecord<SubscriptionPlan>('subscription_plans', editingPlan.id, planData);
      if (result.success) {
        toast.success('Subscription plan updated successfully');
        loadPlans();
        setDialogOpen(false);
      } else {
        toast.error('Failed to update plan: ' + result.error);
      }
    } else {
      const result = await createItemRecord<SubscriptionPlan>('subscription_plans', planData);
      if (result.success) {
        toast.success('Subscription plan created successfully');
        loadPlans();
        setDialogOpen(false);
      } else {
        toast.error('Failed to create plan: ' + result.error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return;

    const result = await deleteItemRecord('subscription_plans', id);
    if (result.success) {
      toast.success('Subscription plan deleted successfully');
      loadPlans();
    } else {
      toast.error('Failed to delete plan: ' + result.error);
    }
  };

  const handleModuleToggle = (moduleValue: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(moduleValue)
        ? prev.modules.filter((m) => m !== moduleValue)
        : [...prev.modules, moduleValue],
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-gray-600 mt-1">Manage your subscription plans and pricing</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
              <DialogDescription>
                {editingPlan ? 'Update the subscription plan details' : 'Add a new subscription plan to your system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Professional Plan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the plan..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCycle">Billing Cycle *</Label>
                  <Select
                    value={formData.billingCycle}
                    onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') =>
                      setFormData({ ...formData, billingCycle: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxUsers">Max Users</Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    min="1"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPatients">Max Patients</Label>
                  <Input
                    id="maxPatients"
                    type="number"
                    min="1"
                    value={formData.maxPatients}
                    onChange={(e) => setFormData({ ...formData, maxPatients: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Included Modules *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2 p-4 border rounded-lg">
                  {AVAILABLE_MODULES.map((module) => (
                    <div key={module.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={module.value}
                        checked={formData.modules.includes(module.value)}
                        onCheckedChange={() => handleModuleToggle(module.value)}
                      />
                      <label htmlFor={module.value} className="text-sm cursor-pointer">
                        {module.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Key Features</Label>
                <div className="space-y-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={feature} readOnly />
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFeature(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    />
                    <Button type="button" onClick={handleAddFeature}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPopular"
                      checked={formData.isPopular}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
                    />
                    <label htmlFor="isPopular" className="text-sm cursor-pointer">
                      Mark as Popular Plan
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingPlan ? 'Update' : 'Create'} Plan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.isPopular ? 'border-blue-500 border-2' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {plan.isPopular && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>{plan.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">₹{plan.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">per {plan.billingCycle}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Max Users:</span> {plan.maxUsers || 'Unlimited'}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Max Patients:</span> {plan.maxPatients || 'Unlimited'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold mb-2">Modules ({plan.modules?.length || 0})</div>
                  <div className="flex flex-wrap gap-1">
                    {plan.modules?.slice(0, 3).map((module) => (
                      <Badge key={module} variant="outline" className="text-xs">
                        {AVAILABLE_MODULES.find((m) => m.value === module)?.label || module}
                      </Badge>
                    ))}
                    {(plan.modules?.length || 0) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(plan.modules?.length || 0) - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold mb-2">Features</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 3 && <li className="text-blue-600">+{plan.features.length - 3} more</li>}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(plan)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold">No subscription plans yet</p>
              <p className="mt-2">Create your first subscription plan to get started</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
