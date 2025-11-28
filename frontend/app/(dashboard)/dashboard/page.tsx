'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/auth-store';
import { getItems, OPDToken, Patient, LabTest, IPDAdmission } from '@/lib/directus';
import {
  Users,
  Stethoscope,
  FlaskConical,
  Bed,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalPatients: number;
  opdToday: number;
  opdWaiting: number;
  opdCompleted: number;
  pendingLabTests: number;
  activeIPD: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    opdToday: 0,
    opdWaiting: 0,
    opdCompleted: 0,
    pendingLabTests: 0,
    activeIPD: 0,
  });
  const [recentTokens, setRecentTokens] = useState<OPDToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      // Get patients count
      const patientsResult = await getItems<Patient>('patients', {
        aggregate: { count: '*' },
      });

      // Get today's OPD tokens
      const opdResult = await getItems<OPDToken>('opd_tokens', {
        filter: { token_date: { _eq: today } },
        fields: ['id', 'token_number', 'status', 'priority', 'patient_id.name', 'patient_id.patient_code', 'date_created'],
        sort: ['-date_created'],
        limit: 10,
      });

      // Get waiting OPD tokens
      const waitingResult = await getItems<OPDToken>('opd_tokens', {
        filter: { token_date: { _eq: today }, status: { _eq: 'waiting' } },
        aggregate: { count: '*' },
      });

      // Get completed OPD tokens
      const completedResult = await getItems<OPDToken>('opd_tokens', {
        filter: { token_date: { _eq: today }, status: { _eq: 'completed' } },
        aggregate: { count: '*' },
      });

      // Get pending lab tests
      const labResult = await getItems<LabTest>('lab_tests', {
        filter: { status: { _in: ['pending', 'sample_collected', 'in_progress'] } },
        aggregate: { count: '*' },
      });

      // Get active IPD admissions
      const ipdResult = await getItems<IPDAdmission>('ipd_admissions', {
        filter: { status: { _eq: 'admitted' } },
        aggregate: { count: '*' },
      });

      setStats({
        totalPatients: Array.isArray(patientsResult.data) ? patientsResult.data.length : 0,
        opdToday: opdResult.success && Array.isArray(opdResult.data) ? opdResult.data.length : 0,
        opdWaiting: Array.isArray(waitingResult.data) ? waitingResult.data.length : 0,
        opdCompleted: Array.isArray(completedResult.data) ? completedResult.data.length : 0,
        pendingLabTests: Array.isArray(labResult.data) ? labResult.data.length : 0,
        activeIPD: Array.isArray(ipdResult.data) ? ipdResult.data.length : 0,
      });

      if (opdResult.success && Array.isArray(opdResult.data)) {
        setRecentTokens(opdResult.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: "Today's OPD",
      value: stats.opdToday,
      icon: Stethoscope,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Waiting Queue',
      value: stats.opdWaiting,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Pending Lab Tests',
      value: stats.pendingLabTests,
      icon: FlaskConical,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active IPD',
      value: stats.activeIPD,
      icon: Bed,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Completed Today',
      value: stats.opdCompleted,
      icon: CheckCircle2,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      waiting: { label: 'Waiting', variant: 'secondary' },
      in_progress: { label: 'In Progress', variant: 'default' },
      completed: { label: 'Completed', variant: 'outline' },
      cancelled: { label: 'Cancelled', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'emergency') {
      return <Badge variant="destructive">Emergency</Badge>;
    }
    if (priority === 'urgent') {
      return <Badge variant="default" className="bg-orange-500">Urgent</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening at your hospital today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {isLoading ? '-' : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent OPD Tokens */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Today&apos;s OPD Queue
          </CardTitle>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentTokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No OPD tokens generated today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                      #{token.token_number}
                    </div>
                    <div>
                      <p className="font-medium">
                        {(token.patient as unknown as Patient)?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(token.patient as unknown as Patient)?.patient_code || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(token.priority)}
                    {getStatusBadge(token.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
