'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getItem, getItems, Patient, OPDToken, IPDAdmission, LabTest, PharmacyOrder, Billing } from '@/lib/directus';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Droplets,
  MapPin,
  AlertCircle,
  Stethoscope,
  Bed,
  FlaskConical,
  Pill,
  Receipt,
  FileText,
  Edit,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [opdTokens, setOpdTokens] = useState<OPDToken[]>([]);
  const [ipdAdmissions, setIpdAdmissions] = useState<IPDAdmission[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>([]);
  const [bills, setBills] = useState<Billing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    setIsLoading(true);
    try {
      // Load patient details
      const patientResult = await getItem<Patient>('patients', patientId, {
        fields: ['*'],
      });

      if (patientResult.success && patientResult.data) {
        setPatient(patientResult.data);
      } else {
        toast.error('Patient not found');
        router.push('/patients');
        return;
      }

      // Load related records in parallel
      const [opdRes, ipdRes, labRes, pharmaRes, billRes] = await Promise.all([
        getItems<OPDToken>('opd_tokens', {
          filter: { patient_id: { _eq: patientId } },
          fields: ['*', 'department_id.*'],
          sort: ['-token_date'],
          limit: 50,
        }),
        getItems<IPDAdmission>('ipd_admissions', {
          filter: { patient_id: { _eq: patientId } },
          fields: ['*', 'bed_id.*', 'department_id.*'],
          sort: ['-admission_date'],
          limit: 50,
        }),
        getItems<LabTest>('lab_tests', {
          filter: { patient_id: { _eq: patientId } },
          fields: ['*'],
          sort: ['-test_date'],
          limit: 50,
        }),
        getItems<PharmacyOrder>('pharmacy_orders', {
          filter: { patient_id: { _eq: patientId } },
          fields: ['*'],
          sort: ['-date_created'],
          limit: 50,
        }),
        getItems<Billing>('billing', {
          filter: { patient_id: { _eq: patientId } },
          fields: ['*'],
          sort: ['-bill_date'],
          limit: 50,
        }),
      ]);

      if (opdRes.success && Array.isArray(opdRes.data)) setOpdTokens(opdRes.data);
      if (ipdRes.success && Array.isArray(ipdRes.data)) setIpdAdmissions(ipdRes.data);
      if (labRes.success && Array.isArray(labRes.data)) setLabTests(labRes.data);
      if (pharmaRes.success && Array.isArray(pharmaRes.data)) setPharmacyOrders(pharmaRes.data);
      if (billRes.success && Array.isArray(billRes.data)) setBills(billRes.data);
    } catch (error) {
      console.error('Error loading patient data:', error);
      toast.error('Failed to load patient data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const totalBilled = bills.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const totalPaid = bills.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.total_amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading patient data...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/patients')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-500 font-mono">{patient.patient_code}</p>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Patient
        </Button>
      </div>

      {/* Patient Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="flex items-center font-medium">
                  <Phone className="w-4 h-4 mr-1 text-gray-400" />
                  {patient.mobile || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="flex items-center font-medium">
                  <Mail className="w-4 h-4 mr-1 text-gray-400" />
                  {patient.email || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{patient.gender || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="flex items-center font-medium">
                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                  {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{calculateAge(patient.date_of_birth || '')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="flex items-center font-medium">
                  <Droplets className="w-4 h-4 mr-1 text-red-400" />
                  {patient.blood_group || '-'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="flex items-center font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {patient.address || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Emergency Contact</p>
                <p className="flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1 text-orange-400" />
                  {patient.emergency_contact || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">OPD Visits</span>
              <Badge variant="secondary">{opdTokens.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">IPD Admissions</span>
              <Badge variant="secondary">{ipdAdmissions.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Lab Tests</span>
              <Badge variant="secondary">{labTests.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Pharmacy Orders</span>
              <Badge variant="secondary">{pharmacyOrders.length}</Badge>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Billed</span>
                <span className="font-bold">₹{totalBilled.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-green-600">₹{totalPaid.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Registered: {new Date(patient.date_created).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="opd">
            <TabsList className="mb-4">
              <TabsTrigger value="opd" className="flex items-center gap-1">
                <Stethoscope className="w-4 h-4" />
                OPD ({opdTokens.length})
              </TabsTrigger>
              <TabsTrigger value="ipd" className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                IPD ({ipdAdmissions.length})
              </TabsTrigger>
              <TabsTrigger value="lab" className="flex items-center gap-1">
                <FlaskConical className="w-4 h-4" />
                Lab ({labTests.length})
              </TabsTrigger>
              <TabsTrigger value="pharmacy" className="flex items-center gap-1">
                <Pill className="w-4 h-4" />
                Pharmacy ({pharmacyOrders.length})
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-1">
                <Receipt className="w-4 h-4" />
                Billing ({bills.length})
              </TabsTrigger>
            </TabsList>

            {/* OPD History */}
            <TabsContent value="opd">
              {opdTokens.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No OPD visits recorded</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Symptoms</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opdTokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell className="font-mono text-blue-600">#{token.token_number}</TableCell>
                        <TableCell>{new Date(token.token_date).toLocaleDateString()}</TableCell>
                        <TableCell>{(token.department_id as any)?.name || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{token.symptoms || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={token.priority === 'emergency' ? 'destructive' : token.priority === 'urgent' ? 'default' : 'secondary'}>
                            {token.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={token.status === 'completed' ? 'outline' : 'default'}>
                            {token.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* IPD History */}
            <TabsContent value="ipd">
              {ipdAdmissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No IPD admissions recorded</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP Number</TableHead>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Discharge Date</TableHead>
                      <TableHead>Bed</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipdAdmissions.map((admission) => (
                      <TableRow key={admission.id}>
                        <TableCell className="font-mono text-blue-600">{admission.ip_number}</TableCell>
                        <TableCell>{new Date(admission.admission_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {admission.discharge_date ? new Date(admission.discharge_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>{(admission.bed_id as any)?.bed_number || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{admission.diagnosis || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={admission.status === 'discharged' ? 'outline' : 'default'}>
                            {admission.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Lab History */}
            <TabsContent value="lab">
              {labTests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No lab tests recorded</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lab Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-mono text-blue-600">{test.lab_number}</TableCell>
                        <TableCell>{new Date(test.test_date).toLocaleDateString()}</TableCell>
                        <TableCell>{test.test_name}</TableCell>
                        <TableCell>₹{(test.price || 0).toLocaleString()}</TableCell>
                        <TableCell className="max-w-xs truncate">{test.result || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={test.status === 'completed' ? 'outline' : 'default'}>
                            {test.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Pharmacy History */}
            <TabsContent value="pharmacy">
              {pharmacyOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pharmacy orders recorded</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pharmacyOrders.map((order) => {
                      const items = order.items as any[] || [];
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-blue-600">{order.order_number}</TableCell>
                          <TableCell>{new Date(order.date_created).toLocaleDateString()}</TableCell>
                          <TableCell>{items.length} item(s)</TableCell>
                          <TableCell>₹{(order.total_amount || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === 'dispensed' ? 'outline' : 'default'}>
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Billing History */}
            <TabsContent value="billing">
              {bills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No bills recorded</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => {
                      const items = bill.items as any[] || [];
                      return (
                        <TableRow key={bill.id}>
                          <TableCell className="font-mono text-blue-600">{bill.bill_number}</TableCell>
                          <TableCell>{new Date(bill.bill_date).toLocaleDateString()}</TableCell>
                          <TableCell>{items.length} item(s)</TableCell>
                          <TableCell className="font-medium">₹{(bill.total_amount || 0).toLocaleString()}</TableCell>
                          <TableCell className="capitalize">{bill.payment_method || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={bill.payment_status === 'paid' ? 'outline' : 'default'} className={bill.payment_status === 'paid' ? 'bg-green-100 text-green-700' : ''}>
                              {bill.payment_status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
