'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { getItems, createItemRecord, updateItemRecord, IPDAdmission, IPDDailyRecord, Patient, Bed, Department } from '@/lib/directus';
import { useAuthStore } from '@/lib/auth-store';
import {
  ArrowLeft,
  Plus,
  BedDouble,
  User,
  Calendar,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplet,
  Weight,
  FileText,
  Pill,
  Utensils,
  Stethoscope,
  ClipboardList,
  Edit,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function IPDDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [admission, setAdmission] = useState<IPDAdmission | null>(null);
  const [dailyRecords, setDailyRecords] = useState<IPDDailyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    temperature: '',
    pulse: '',
    blood_pressure: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    weight: '',
    chief_complaints: '',
    examination_notes: '',
    treatment_given: '',
    medications: '',
    diet: '',
    nursing_notes: '',
    doctor_notes: '',
  });

  useEffect(() => {
    if (params.id) {
      loadData();
    }
  }, [params.id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [admissionRes, recordsRes] = await Promise.all([
        getItems<IPDAdmission>('ipd_admissions', {
          fields: ['*', 'patient_id.*', 'bed_id.*', 'department_id.*'],
          filter: { id: { _eq: params.id } },
          limit: 1,
        }),
        getItems<IPDDailyRecord>('ipd_daily_records', {
          fields: ['*'],
          filter: { ipd_admission_id: { _eq: params.id } },
          sort: ['-record_date'],
          limit: 50,
        }),
      ]);

      if (admissionRes.success && admissionRes.data && admissionRes.data.length > 0) {
        setAdmission(admissionRes.data[0]);
      }
      if (recordsRes.success && Array.isArray(recordsRes.data)) {
        setDailyRecords(recordsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load admission data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDailyRecord = async () => {
    try {
      const recordData: Partial<IPDDailyRecord> = {
        ipd_admission_id: params.id as string,
        record_date: new Date().toISOString(),
        vital_signs: {
          temperature: newRecord.temperature ? parseFloat(newRecord.temperature) : undefined,
          pulse: newRecord.pulse ? parseInt(newRecord.pulse) : undefined,
          blood_pressure: newRecord.blood_pressure || undefined,
          respiratory_rate: newRecord.respiratory_rate ? parseInt(newRecord.respiratory_rate) : undefined,
          oxygen_saturation: newRecord.oxygen_saturation ? parseInt(newRecord.oxygen_saturation) : undefined,
          weight: newRecord.weight ? parseFloat(newRecord.weight) : undefined,
        },
        chief_complaints: newRecord.chief_complaints || undefined,
        examination_notes: newRecord.examination_notes || undefined,
        treatment_given: newRecord.treatment_given || undefined,
        medications: newRecord.medications || undefined,
        diet: newRecord.diet || undefined,
        nursing_notes: newRecord.nursing_notes || undefined,
        doctor_notes: newRecord.doctor_notes || undefined,
        org_id: user?.org_id,
      };

      const result = await createItemRecord<IPDDailyRecord>('ipd_daily_records', recordData);

      if (result.success) {
        toast.success('Daily record added successfully');
        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error(result.error || 'Failed to add daily record');
      }
    } catch (error) {
      console.error('Error creating daily record:', error);
      toast.error('Failed to add daily record');
    }
  };

  const handleDischarge = async () => {
    if (!admission) return;

    if (!confirm('Are you sure you want to discharge this patient?')) return;

    try {
      const result = await updateItemRecord<IPDAdmission>('ipd_admissions', admission.id, {
        status: 'discharged',
        discharge_date: new Date().toISOString(),
      });

      if (result.success) {
        // Free up the bed
        if (admission.bed_id) {
          const bedId = typeof admission.bed_id === 'object' ? (admission.bed_id as Bed).id : admission.bed_id;
          await updateItemRecord<Bed>('beds', bedId, { status: 'available' });
        }

        toast.success('Patient discharged successfully');
        router.push('/ipd');
      } else {
        toast.error(result.error || 'Failed to discharge patient');
      }
    } catch (error) {
      console.error('Error discharging patient:', error);
      toast.error('Failed to discharge patient');
    }
  };

  const resetForm = () => {
    setNewRecord({
      temperature: '',
      pulse: '',
      blood_pressure: '',
      respiratory_rate: '',
      oxygen_saturation: '',
      weight: '',
      chief_complaints: '',
      examination_notes: '',
      treatment_given: '',
      medications: '',
      diet: '',
      nursing_notes: '',
      doctor_notes: '',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Admission not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/ipd')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to IPD
        </Button>
      </div>
    );
  }

  const patient = admission.patient_id as unknown as Patient;
  const bed = admission.bed_id as unknown as Bed;
  const department = admission.department_id as unknown as Department;

  const daysAdmitted = Math.ceil(
    (new Date().getTime() - new Date(admission.admission_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/ipd')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IPD Patient Details</h1>
            <p className="text-gray-600">IP Number: {admission.ip_number}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {admission.status === 'admitted' && (
            <>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Daily Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Daily Record</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    {/* Vital Signs Section */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Vital Signs
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="flex items-center">
                            <Thermometer className="w-3 h-3 mr-1" />
                            Temperature (°F)
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={newRecord.temperature}
                            onChange={(e) => setNewRecord({ ...newRecord, temperature: e.target.value })}
                            placeholder="98.6"
                          />
                        </div>
                        <div>
                          <Label className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            Pulse (bpm)
                          </Label>
                          <Input
                            type="number"
                            value={newRecord.pulse}
                            onChange={(e) => setNewRecord({ ...newRecord, pulse: e.target.value })}
                            placeholder="72"
                          />
                        </div>
                        <div>
                          <Label className="flex items-center">
                            <Activity className="w-3 h-3 mr-1" />
                            Blood Pressure
                          </Label>
                          <Input
                            value={newRecord.blood_pressure}
                            onChange={(e) => setNewRecord({ ...newRecord, blood_pressure: e.target.value })}
                            placeholder="120/80"
                          />
                        </div>
                        <div>
                          <Label className="flex items-center">
                            <Wind className="w-3 h-3 mr-1" />
                            Respiratory Rate
                          </Label>
                          <Input
                            type="number"
                            value={newRecord.respiratory_rate}
                            onChange={(e) => setNewRecord({ ...newRecord, respiratory_rate: e.target.value })}
                            placeholder="16"
                          />
                        </div>
                        <div>
                          <Label className="flex items-center">
                            <Droplet className="w-3 h-3 mr-1" />
                            SpO2 (%)
                          </Label>
                          <Input
                            type="number"
                            value={newRecord.oxygen_saturation}
                            onChange={(e) => setNewRecord({ ...newRecord, oxygen_saturation: e.target.value })}
                            placeholder="98"
                          />
                        </div>
                        <div>
                          <Label className="flex items-center">
                            <Weight className="w-3 h-3 mr-1" />
                            Weight (kg)
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={newRecord.weight}
                            onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
                            placeholder="70"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Clinical Notes Section */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Clinical Notes
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Chief Complaints</Label>
                          <Textarea
                            value={newRecord.chief_complaints}
                            onChange={(e) => setNewRecord({ ...newRecord, chief_complaints: e.target.value })}
                            placeholder="Patient's complaints today..."
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Examination Notes</Label>
                          <Textarea
                            value={newRecord.examination_notes}
                            onChange={(e) => setNewRecord({ ...newRecord, examination_notes: e.target.value })}
                            placeholder="Physical examination findings..."
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Doctor's Notes</Label>
                          <Textarea
                            value={newRecord.doctor_notes}
                            onChange={(e) => setNewRecord({ ...newRecord, doctor_notes: e.target.value })}
                            placeholder="Doctor's observations and plan..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Treatment Section */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Pill className="w-4 h-4 mr-2" />
                        Treatment
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Treatment Given</Label>
                          <Textarea
                            value={newRecord.treatment_given}
                            onChange={(e) => setNewRecord({ ...newRecord, treatment_given: e.target.value })}
                            placeholder="Procedures, treatments..."
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Medications</Label>
                          <Textarea
                            value={newRecord.medications}
                            onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
                            placeholder="Medicines prescribed..."
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label className="flex items-center">
                            <Utensils className="w-3 h-3 mr-1" />
                            Diet
                          </Label>
                          <Input
                            value={newRecord.diet}
                            onChange={(e) => setNewRecord({ ...newRecord, diet: e.target.value })}
                            placeholder="Diet instructions..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Nursing Notes */}
                    <div>
                      <Label>Nursing Notes</Label>
                      <Textarea
                        value={newRecord.nursing_notes}
                        onChange={(e) => setNewRecord({ ...newRecord, nursing_notes: e.target.value })}
                        placeholder="Nursing observations..."
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateDailyRecord}>Save Daily Record</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="text-red-600" onClick={handleDischarge}>
                Discharge Patient
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Patient Info & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-semibold">{patient?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-400">{patient?.patient_code}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <BedDouble className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bed</p>
                <p className="font-semibold">{bed?.bed_number || 'Not assigned'}</p>
                <p className="text-xs text-gray-400">{bed?.ward} ({bed?.bed_type})</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Admitted</p>
                <p className="font-semibold">{new Date(admission.admission_date).toLocaleDateString()}</p>
                <p className="text-xs text-gray-400">{daysAdmitted} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${admission.status === 'admitted' ? 'bg-blue-100' : 'bg-green-100'}`}>
                {admission.status === 'admitted' ? (
                  <BedDouble className="w-5 h-5 text-blue-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={admission.status === 'admitted' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                  {admission.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis & Department */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Diagnosis</p>
              <p className="font-medium">{admission.diagnosis || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Department</p>
              <p className="font-medium">{department?.name || 'Not assigned'}</p>
            </div>
            {admission.notes && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700">{admission.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            Daily Records ({dailyRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No daily records yet</p>
              {admission.status === 'admitted' && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Record
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {dailyRecords.map((record, index) => (
                <Card key={record.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">
                          {new Date(record.record_date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(record.record_date).toLocaleTimeString()}
                        </span>
                      </div>
                      <Badge variant="outline">Day {dailyRecords.length - index}</Badge>
                    </div>

                    {/* Vital Signs */}
                    {record.vital_signs && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500 mb-2">Vital Signs</p>
                        <div className="grid grid-cols-6 gap-4 text-sm">
                          {record.vital_signs.temperature && (
                            <div className="flex items-center">
                              <Thermometer className="w-3 h-3 mr-1 text-red-500" />
                              <span>{record.vital_signs.temperature}°F</span>
                            </div>
                          )}
                          {record.vital_signs.pulse && (
                            <div className="flex items-center">
                              <Heart className="w-3 h-3 mr-1 text-pink-500" />
                              <span>{record.vital_signs.pulse} bpm</span>
                            </div>
                          )}
                          {record.vital_signs.blood_pressure && (
                            <div className="flex items-center">
                              <Activity className="w-3 h-3 mr-1 text-purple-500" />
                              <span>{record.vital_signs.blood_pressure}</span>
                            </div>
                          )}
                          {record.vital_signs.respiratory_rate && (
                            <div className="flex items-center">
                              <Wind className="w-3 h-3 mr-1 text-blue-500" />
                              <span>{record.vital_signs.respiratory_rate}/min</span>
                            </div>
                          )}
                          {record.vital_signs.oxygen_saturation && (
                            <div className="flex items-center">
                              <Droplet className="w-3 h-3 mr-1 text-cyan-500" />
                              <span>{record.vital_signs.oxygen_saturation}%</span>
                            </div>
                          )}
                          {record.vital_signs.weight && (
                            <div className="flex items-center">
                              <Weight className="w-3 h-3 mr-1 text-gray-500" />
                              <span>{record.vital_signs.weight} kg</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes Sections */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {record.chief_complaints && (
                        <div>
                          <p className="font-semibold text-gray-500">Chief Complaints</p>
                          <p className="text-gray-700">{record.chief_complaints}</p>
                        </div>
                      )}
                      {record.examination_notes && (
                        <div>
                          <p className="font-semibold text-gray-500">Examination</p>
                          <p className="text-gray-700">{record.examination_notes}</p>
                        </div>
                      )}
                      {record.doctor_notes && (
                        <div>
                          <p className="font-semibold text-gray-500">Doctor's Notes</p>
                          <p className="text-gray-700">{record.doctor_notes}</p>
                        </div>
                      )}
                      {record.treatment_given && (
                        <div>
                          <p className="font-semibold text-gray-500">Treatment</p>
                          <p className="text-gray-700">{record.treatment_given}</p>
                        </div>
                      )}
                      {record.medications && (
                        <div>
                          <p className="font-semibold text-gray-500">Medications</p>
                          <p className="text-gray-700">{record.medications}</p>
                        </div>
                      )}
                      {record.diet && (
                        <div>
                          <p className="font-semibold text-gray-500">Diet</p>
                          <p className="text-gray-700">{record.diet}</p>
                        </div>
                      )}
                      {record.nursing_notes && (
                        <div className="col-span-2">
                          <p className="font-semibold text-gray-500">Nursing Notes</p>
                          <p className="text-gray-700">{record.nursing_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
