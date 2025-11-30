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
import { getItems, createItemRecord, updateItemRecord, OPDToken, Patient, Department } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import { openWhatsApp, messageTemplates } from '@/lib/whatsapp';
import {
  Plus,
  Search,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function OPDPage() {
  const { user } = useAuthStore();
  const [tokens, setTokens] = useState<OPDToken[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [priority, setPriority] = useState<string>('normal');
  const [symptoms, setSymptoms] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load today's tokens
      const tokensResult = await getItems<OPDToken>('opd_tokens', {
        filter: { token_date: { _eq: today } },
        fields: ['*', 'patient_id.*', 'department_id.*'],
        sort: ['token_number'],
      });

      // Load patients
      const patientsResult = await getItems<Patient>('patients', {
        fields: ['id', 'name', 'patient_code', 'mobile'],
        sort: ['name'],
        limit: 500,
      });

      // Load departments
      const deptResult = await getItems<Department>('departments', {
        filter: { status: { _eq: 'active' } },
        fields: ['id', 'name', 'code'],
      });

      if (tokensResult.success && Array.isArray(tokensResult.data)) {
        setTokens(tokensResult.data);
      }
      if (patientsResult.success && Array.isArray(patientsResult.data)) {
        setPatients(patientsResult.data);
      }
      if (deptResult.success && Array.isArray(deptResult.data)) {
        setDepartments(deptResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextTokenNumber = () => {
    if (tokens.length === 0) return 1;
    const maxToken = Math.max(...tokens.map((t) => t.token_number));
    return maxToken + 1;
  };

  const handleCreateToken = async () => {
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }

    try {
      const tokenData: Partial<OPDToken> = {
        patient_id: selectedPatient,
        department_id: selectedDepartment || undefined,
        token_number: getNextTokenNumber(),
        token_date: today,
        status: 'waiting',
        priority: priority as 'normal' | 'urgent' | 'emergency',
        symptoms: symptoms || undefined,
        org_id: user?.org_id ?? undefined,
      };

      const result = await createItemRecord<OPDToken>('opd_tokens', tokenData);

      if (result.success) {
        toast.success(`Token #${tokenData.token_number} generated successfully`);
        setIsDialogOpen(false);
        setSelectedPatient('');
        setSelectedDepartment('');
        setPriority('normal');
        setSymptoms('');
        loadData();
      } else {
        toast.error(result.error || 'Failed to create token');
      }
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create token');
    }
  };

  const handleUpdateStatus = async (tokenId: string, newStatus: string) => {
    try {
      const updateData: Partial<OPDToken> = {
        status: newStatus as OPDToken['status'],
      };

      if (newStatus === 'in_progress') {
        updateData.called_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const result = await updateItemRecord<OPDToken>('opd_tokens', tokenId, updateData);

      if (result.success) {
        toast.success('Status updated');
        loadData();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
      waiting: { label: 'Waiting', variant: 'secondary', icon: Clock },
      in_progress: { label: 'In Progress', variant: 'default', icon: PlayCircle },
      completed: { label: 'Completed', variant: 'outline', icon: CheckCircle2 },
      cancelled: { label: 'Cancelled', variant: 'destructive', icon: AlertTriangle },
    };
    const { label, variant, icon: Icon } = config[status] || { label: status, variant: 'secondary' as const, icon: Clock };
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'emergency') {
      return <Badge variant="destructive">Emergency</Badge>;
    }
    if (priority === 'urgent') {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Urgent</Badge>;
    }
    return null;
  };

  const waitingTokens = tokens.filter((t) => t.status === 'waiting');
  const inProgressTokens = tokens.filter((t) => t.status === 'in_progress');
  const completedTokens = tokens.filter((t) => t.status === 'completed');

  const TokenCard = ({ token }: { token: OPDToken }) => {
    const patient = token.patient_id as unknown as Patient;
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 text-blue-700 text-xl font-bold px-4 py-2 rounded-lg">
              #{token.token_number}
            </div>
            <div>
              <p className="font-medium">{patient?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500">{patient?.patient_code || '-'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {getPriorityBadge(token.priority)}
            {getStatusBadge(token.status)}
          </div>
        </div>

        {token.symptoms && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            <span className="font-medium">Symptoms:</span> {token.symptoms}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-xs text-gray-400">
            {new Date(token.date_created).toLocaleTimeString()}
          </span>
          <div className="flex space-x-2">
            {token.status === 'waiting' && (
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(token.id, 'in_progress')}
              >
                <PlayCircle className="w-4 h-4 mr-1" />
                Call
              </Button>
            )}
            {token.status === 'in_progress' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus(token.id, 'completed')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OPD Management</h1>
          <p className="text-gray-600 mt-1">Today&apos;s Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Generate Token
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate OPD Token</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Patient *</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.patient_code} - {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Symptoms/Complaints</Label>
                  <Input
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Enter symptoms or complaints"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateToken}>
                    Generate Token #{getNextTokenNumber()}
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
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{tokens.length}</p>
              <p className="text-sm text-gray-500">Total Tokens</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{waitingTokens.length}</p>
              <p className="text-sm text-gray-500">Waiting</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{inProgressTokens.length}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{completedTokens.length}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Tabs */}
      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waiting" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Waiting ({waitingTokens.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            In Progress ({inProgressTokens.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Completed ({completedTokens.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waiting">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : waitingTokens.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No patients waiting</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waitingTokens.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in_progress">
          {inProgressTokens.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Stethoscope className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No consultations in progress</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressTokens.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedTokens.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No completed consultations today</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTokens.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
