'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import {
  getItems,
  createItemRecord,
  updateItemRecord,
  deleteItemRecord,
  Symptom,
  Investigation,
  DiagnosisMaster,
  MedicalHistory,
  LifestyleOption,
  ICDCode,
  TPACode,
  PaymentMode,
} from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import {
  Plus,
  Search,
  Database,
  Stethoscope,
  FlaskConical,
  Activity,
  History,
  Heart,
  FileCode,
  Building2,
  CreditCard,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type MasterDataType = 'symptoms' | 'investigations' | 'diagnosis' | 'medical_history' | 'lifestyle' | 'icd_codes' | 'tpa_codes' | 'payment_modes';

const masterDataConfig = {
  symptoms: {
    title: 'Symptoms / Complaints',
    icon: Stethoscope,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  investigations: {
    title: 'Investigations',
    icon: FlaskConical,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  diagnosis: {
    title: 'Diagnosis',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  medical_history: {
    title: 'Medical History',
    icon: History,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  lifestyle: {
    title: 'Lifestyle Options',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  icd_codes: {
    title: 'ICD Codes',
    icon: FileCode,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  tpa_codes: {
    title: 'TPA Codes',
    icon: Building2,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  payment_modes: {
    title: 'Payment Modes',
    icon: CreditCard,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
};

export default function MasterDataPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<MasterDataType>('symptoms');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Data states
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisMaster[]>([]);
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>([]);
  const [lifestyleOptions, setLifestyleOptions] = useState<LifestyleOption[]>([]);
  const [icdCodes, setIcdCodes] = useState<ICDCode[]>([]);
  const [tpaCodes, setTpaCodes] = useState<TPACode[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);

  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        symptomsRes,
        investigationsRes,
        diagnosesRes,
        medicalHistoryRes,
        lifestyleRes,
        icdRes,
        tpaRes,
        paymentRes,
      ] = await Promise.all([
        getItems<Symptom>('symptoms', { sort: ['name'], limit: 500 }),
        getItems<Investigation>('investigations', { sort: ['name'], limit: 500 }),
        getItems<DiagnosisMaster>('diagnosis_master', { sort: ['name'], limit: 500 }),
        getItems<MedicalHistory>('medical_history', { sort: ['name'], limit: 500 }),
        getItems<LifestyleOption>('lifestyle_options', { sort: ['category', 'name'], limit: 500 }),
        getItems<ICDCode>('icd_codes', { sort: ['code'], limit: 1000 }),
        getItems<TPACode>('tpa_codes', { sort: ['code'], limit: 500 }),
        getItems<PaymentMode>('payment_modes', { sort: ['name'], limit: 100 }),
      ]);

      if (symptomsRes.success) setSymptoms(symptomsRes.data || []);
      if (investigationsRes.success) setInvestigations(investigationsRes.data || []);
      if (diagnosesRes.success) setDiagnoses(diagnosesRes.data || []);
      if (medicalHistoryRes.success) setMedicalHistories(medicalHistoryRes.data || []);
      if (lifestyleRes.success) setLifestyleOptions(lifestyleRes.data || []);
      if (icdRes.success) setIcdCodes(icdRes.data || []);
      if (tpaRes.success) setTpaCodes(tpaRes.data || []);
      if (paymentRes.success) setPaymentModes(paymentRes.data || []);
    } catch (error) {
      console.error('Error loading master data:', error);
      toast.error('Failed to load master data');
    } finally {
      setIsLoading(false);
    }
  };

  const getCollectionName = (type: MasterDataType): string => {
    const mapping: Record<MasterDataType, string> = {
      symptoms: 'symptoms',
      investigations: 'investigations',
      diagnosis: 'diagnosis_master',
      medical_history: 'medical_history',
      lifestyle: 'lifestyle_options',
      icd_codes: 'icd_codes',
      tpa_codes: 'tpa_codes',
      payment_modes: 'payment_modes',
    };
    return mapping[type];
  };

  const handleCreate = async () => {
    const collection = getCollectionName(activeTab);
    const data = {
      ...formData,
      org_id: user?.org_id,
      status: 'active',
    };

    const result = await createItemRecord(collection as any, data);
    if (result.success) {
      toast.success('Item created successfully');
      setIsDialogOpen(false);
      setFormData({});
      loadAllData();
    } else {
      toast.error(result.error || 'Failed to create item');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    const collection = getCollectionName(activeTab);

    const result = await updateItemRecord(collection as any, editingItem.id, formData);
    if (result.success) {
      toast.success('Item updated successfully');
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      loadAllData();
    } else {
      toast.error(result.error || 'Failed to update item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const collection = getCollectionName(activeTab);

    const result = await deleteItemRecord(collection as any, id);
    if (result.success) {
      toast.success('Item deleted successfully');
      loadAllData();
    } else {
      toast.error(result.error || 'Failed to delete item');
    }
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const getCurrentData = (): any[] => {
    const dataMap: Record<MasterDataType, any[]> = {
      symptoms,
      investigations,
      diagnosis: diagnoses,
      medical_history: medicalHistories,
      lifestyle: lifestyleOptions,
      icd_codes: icdCodes,
      tpa_codes: tpaCodes,
      payment_modes: paymentModes,
    };
    return dataMap[activeTab] || [];
  };

  const getFilteredData = () => {
    const data = getCurrentData();
    if (!searchQuery) return data;
    return data.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'symptoms':
        return (
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Symptom name"
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Unique code"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="respiratory">Respiratory</SelectItem>
                  <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="gastrointestinal">Gastrointestinal</SelectItem>
                  <SelectItem value="neurological">Neurological</SelectItem>
                  <SelectItem value="musculoskeletal">Musculoskeletal</SelectItem>
                  <SelectItem value="dermatological">Dermatological</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
        );

      case 'investigations':
        return (
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Investigation name"
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Unique code"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pathology">Pathology</SelectItem>
                  <SelectItem value="radiology">Radiology</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="microbiology">Microbiology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
        );

      case 'diagnosis':
        return (
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Diagnosis name"
              />
            </div>
            <div>
              <Label>ICD Code</Label>
              <Input
                value={formData.icd_code || ''}
                onChange={(e) => setFormData({ ...formData, icd_code: e.target.value })}
                placeholder="e.g., A00.0"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
        );

      case 'medical_history':
        return (
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Medical history item"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Past Medical History</SelectItem>
                  <SelectItem value="surgical">Past Surgical History</SelectItem>
                  <SelectItem value="family">Family History</SelectItem>
                  <SelectItem value="allergy">Allergy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Option name"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="addiction">Addiction</SelectItem>
                  <SelectItem value="diet">Diet</SelectItem>
                  <SelectItem value="appetite">Appetite</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="bladder">Bladder</SelectItem>
                  <SelectItem value="bowel">Bowel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
        );

      case 'icd_codes':
        return (
          <div className="space-y-4">
            <div>
              <Label>Code *</Label>
              <Input
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., A00.0"
              />
            </div>
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ICD code description"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <div>
              <Label>Chapter</Label>
              <Input
                value={formData.chapter || ''}
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                placeholder="Chapter"
              />
            </div>
          </div>
        );

      case 'tpa_codes':
        return (
          <div className="space-y-4">
            <div>
              <Label>Code *</Label>
              <Input
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="TPA code"
              />
            </div>
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Code description"
              />
            </div>
            <div>
              <Label>TPA Name</Label>
              <Input
                value={formData.tpa_name || ''}
                onChange={(e) => setFormData({ ...formData, tpa_name: e.target.value })}
                placeholder="TPA company name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
        );

      case 'payment_modes':
        return (
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Payment mode name"
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Unique code"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    const data = getFilteredData();
    const config = masterDataConfig[activeTab];

    if (data.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No {config.title} found</p>
          <p className="text-sm">Click &quot;Add New&quot; to create one</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {activeTab !== 'lifestyle' && <TableHead>Code</TableHead>}
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              {activeTab !== 'lifestyle' && (
                <TableCell className="font-mono text-sm">
                  {item.code || item.icd_code || '-'}
                </TableCell>
              )}
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {item.category || item.chapter || '-'}
                </Badge>
              </TableCell>
              <TableCell>
                {item.status === 'active' ? (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-700">
                    <XCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const config = masterDataConfig[activeTab];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
          <p className="text-gray-600 mt-1">Manage hospital master data and templates</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadAllData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit' : 'Add New'} {config.title}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {renderForm()}
                <div className="flex justify-end space-x-2 pt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingItem ? handleUpdate : handleCreate}>
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(masterDataConfig).slice(0, 4).map(([key, cfg]) => {
          const IconComp = cfg.icon;
          const dataMap: Record<string, any[]> = {
            symptoms,
            investigations,
            diagnosis: diagnoses,
            medical_history: medicalHistories,
          };
          const count = dataMap[key]?.length || 0;
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all ${activeTab === key ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
              onClick={() => setActiveTab(key as MasterDataType)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">{cfg.title}</p>
                  </div>
                  <div className={`p-3 rounded-full ${cfg.bgColor}`}>
                    <IconComp className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MasterDataType)}>
        <TabsList className="grid grid-cols-8 w-full">
          {Object.entries(masterDataConfig).map(([key, cfg]) => {
            const IconComp = cfg.icon;
            return (
              <TabsTrigger key={key} value={key} className="text-xs">
                <IconComp className="w-4 h-4 mr-1" />
                <span className="hidden lg:inline">{cfg.title.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.keys(masterDataConfig).map((key) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Icon className={`w-5 h-5 mr-2 ${config.color}`} />
                    {config.title} ({getFilteredData().length})
                  </CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : (
                  renderTable()
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
