'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import {
  ArrowLeft,
  Building2,
  Users,
  CreditCard,
  Calendar,
  Activity,
  Phone,
  Mail,
  MapPin,
  User,
  Loader2,
  IndianRupee,
  FileText,
  Stethoscope,
  Bed,
  FlaskConical,
  Pill,
} from 'lucide-react';
import { getItems, Organization, DirectusUser, Patient, OPDToken, IPDAdmission, Bill, LabTest, PharmacyOrder } from '@/lib/directus';
import { toast } from 'sonner';

interface HospitalStats {
  totalUsers: number;
  totalPatients: number;
  totalOPDTokens: number;
  totalIPDAdmissions: number;
  totalBills: number;
  totalRevenue: number;
  pendingPayments: number;
  totalLabTests: number;
  totalPharmacyOrders: number;
}

export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hospitalId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState<Organization | null>(null);
  const [users, setUsers] = useState<DirectusUser[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [opdTokens, setOPDTokens] = useState<OPDToken[]>([]);
  const [ipdAdmissions, setIPDAdmissions] = useState<IPDAdmission[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>([]);
  const [stats, setStats] = useState<HospitalStats>({
    totalUsers: 0,
    totalPatients: 0,
    totalOPDTokens: 0,
    totalIPDAdmissions: 0,
    totalBills: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    totalLabTests: 0,
    totalPharmacyOrders: 0,
  });

  useEffect(() => {
    if (hospitalId) {
      loadHospitalData();
    }
  }, [hospitalId]);

  const loadHospitalData = async () => {
    setLoading(true);
    try {
      // Load hospital details
      const hospitalResult = await getItems<Organization>('organizations', {
        filter: { id: { _eq: hospitalId } },
      });

      if (hospitalResult.success && hospitalResult.data?.[0]) {
        setHospital(hospitalResult.data[0]);
      } else {
        toast.error('Hospital not found');
        router.push('/superadmin/hospitals');
        return;
      }

      // Load all related data in parallel
      const [usersRes, patientsRes, billsRes, opdRes, ipdRes, labRes, pharmacyRes] = await Promise.all([
        getItems<DirectusUser>('directus_users', {
          filter: { org_id: { _eq: hospitalId } },
          fields: ['id', 'email', 'first_name', 'last_name', 'status', 'role'],
        }),
        getItems<Patient>('patients', {
          filter: { org_id: { _eq: hospitalId } },
          fields: ['id', 'name', 'mobile', 'email', 'gender', 'date_created'],
          sort: ['-date_created'],
          limit: 100,
        }),
        getItems<Bill>('billing', {
          filter: { org_id: { _eq: hospitalId } },
          fields: ['id', 'bill_number', 'total_amount', 'payment_status', 'bill_date', 'bill_type'],
          sort: ['-date_created'],
          limit: 100,
        }),
        getItems<OPDToken>('opd_tokens', {
          filter: { org_id: { _eq: hospitalId } },
          fields: ['id', 'token_number', 'status', 'token_date', 'priority'],
          sort: ['-date_created'],
          limit: 100,
        }),
        getItems<IPDAdmission>('ipd_admissions', {
          filter: { org_id: { _eq: hospitalId } },
          fields: ['id', 'ip_number', 'status', 'admission_date', 'discharge_date'],
          sort: ['-date_created'],
          limit: 100,
        }),
        getItems<LabTest>('lab_tests', {
          filter: { org_id: { _eq: hospitalId } },
          fields: ['id', 'lab_number', 'test_name', 'status', 'test_date'],
          sort: ['-date_created'],
          limit: 100,
        }),
        getItems<PharmacyOrder>('pharmacy_orders', {
          filter: { org_id: { _eq: hospitalId } },
          fields: ['id', 'order_number', 'status', 'total_amount', 'payment_status'],
          sort: ['-date_created'],
          limit: 100,
        }),
      ]);

      const usersData = usersRes.success ? usersRes.data || [] : [];
      const patientsData = patientsRes.success ? patientsRes.data || [] : [];
      const billsData = billsRes.success ? billsRes.data || [] : [];
      const opdData = opdRes.success ? opdRes.data || [] : [];
      const ipdData = ipdRes.success ? ipdRes.data || [] : [];
      const labData = labRes.success ? labRes.data || [] : [];
      const pharmacyData = pharmacyRes.success ? pharmacyRes.data || [] : [];

      setUsers(usersData);
      setPatients(patientsData);
      setBills(billsData);
      setOPDTokens(opdData);
      setIPDAdmissions(ipdData);
      setLabTests(labData);
      setPharmacyOrders(pharmacyData);

      // Calculate stats
      const totalRevenue = billsData
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      const pendingPayments = billsData
        .filter(b => b.payment_status === 'pending' || b.payment_status === 'unpaid')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      setStats({
        totalUsers: usersData.length,
        totalPatients: patientsData.length,
        totalOPDTokens: opdData.length,
        totalIPDAdmissions: ipdData.length,
        totalBills: billsData.length,
        totalRevenue,
        pendingPayments,
        totalLabTests: labData.length,
        totalPharmacyOrders: pharmacyData.length,
      });

    } catch (error) {
      console.error('Error loading hospital data:', error);
      toast.error('Failed to load hospital data');
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'completed':
      case 'dispensed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'waiting':
      case 'in_progress':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'suspended':
      case 'cancelled':
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!hospital) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/superadmin/hospitals')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{hospital.name}</h1>
            <Badge className={getStatusColor(hospital.status)}>{hospital.status}</Badge>
            <Badge className={getPlanColor(hospital.subscription_plan || 'basic')}>
              {hospital.subscription_plan || 'basic'}
            </Badge>
          </div>
          <p className="text-gray-600">Code: {hospital.code}</p>
        </div>
      </div>

      {/* Hospital Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Hospital Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{hospital.address || 'N/A'}, {hospital.city}, {hospital.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{hospital.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{hospital.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>Owner: {hospital.owner_name || 'N/A'} ({hospital.owner_mobile || 'N/A'})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
                <p className="text-sm text-gray-600">Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <IndianRupee className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <CreditCard className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.pendingPayments)}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalBills}</p>
                <p className="text-sm text-gray-600">Bills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="text-lg font-semibold capitalize">{hospital.subscription_plan || 'Basic'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Max Users</p>
              <p className="text-lg font-semibold">{hospital.max_users || 5} ({stats.totalUsers} used)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="text-lg font-semibold">
                {hospital.subscription_start ? formatDate(hospital.subscription_start) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date</p>
              <p className="text-lg font-semibold">
                {hospital.subscription_end ? formatDate(hospital.subscription_end) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed data */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="opd" className="flex items-center gap-1">
            <Stethoscope className="w-4 h-4" />
            OPD
          </TabsTrigger>
          <TabsTrigger value="ipd" className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            IPD
          </TabsTrigger>
          <TabsTrigger value="lab" className="flex items-center gap-1">
            <FlaskConical className="w-4 h-4" />
            Lab
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Users ({users.length})</CardTitle>
              <CardDescription>All users associated with this hospital</CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No users found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patients ({patients.length})</CardTitle>
              <CardDescription>All registered patients</CardDescription>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No patients found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.slice(0, 20).map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.mobile}</TableCell>
                        <TableCell>{patient.email || '-'}</TableCell>
                        <TableCell className="capitalize">{patient.gender || '-'}</TableCell>
                        <TableCell>{formatDate(patient.date_created)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Bills ({bills.length})</CardTitle>
              <CardDescription>All billing records</CardDescription>
            </CardHeader>
            <CardContent>
              {bills.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No bills found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.slice(0, 20).map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-mono">{bill.bill_number}</TableCell>
                        <TableCell className="capitalize">{bill.bill_type || '-'}</TableCell>
                        <TableCell>{formatCurrency(bill.total_amount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(bill.payment_status)}>
                            {bill.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(bill.bill_date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* OPD Tab */}
        <TabsContent value="opd">
          <Card>
            <CardHeader>
              <CardTitle>OPD Tokens ({opdTokens.length})</CardTitle>
              <CardDescription>Outpatient department records</CardDescription>
            </CardHeader>
            <CardContent>
              {opdTokens.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No OPD tokens found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opdTokens.slice(0, 20).map((token) => (
                      <TableRow key={token.id}>
                        <TableCell className="font-mono">{token.token_number}</TableCell>
                        <TableCell>{formatDate(token.token_date)}</TableCell>
                        <TableCell className="capitalize">{token.priority}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(token.status)}>{token.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* IPD Tab */}
        <TabsContent value="ipd">
          <Card>
            <CardHeader>
              <CardTitle>IPD Admissions ({ipdAdmissions.length})</CardTitle>
              <CardDescription>Inpatient department records</CardDescription>
            </CardHeader>
            <CardContent>
              {ipdAdmissions.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No IPD admissions found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP #</TableHead>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Discharge Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipdAdmissions.slice(0, 20).map((admission) => (
                      <TableRow key={admission.id}>
                        <TableCell className="font-mono">{admission.ip_number}</TableCell>
                        <TableCell>{formatDate(admission.admission_date)}</TableCell>
                        <TableCell>
                          {admission.discharge_date ? formatDate(admission.discharge_date) : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(admission.status)}>{admission.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lab Tab */}
        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle>Lab Tests ({labTests.length})</CardTitle>
              <CardDescription>Laboratory test records</CardDescription>
            </CardHeader>
            <CardContent>
              {labTests.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No lab tests found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lab #</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labTests.slice(0, 20).map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-mono">{test.lab_number}</TableCell>
                        <TableCell>{test.test_name}</TableCell>
                        <TableCell>{formatDate(test.test_date)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
