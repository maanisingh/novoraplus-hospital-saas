'use client';

import { useAuthStore } from '@/lib/auth-store';
import { getUserRole } from '@/lib/auth-store';

// Import all role-specific dashboards
import SuperAdminDashboard from '@/components/dashboards/SuperAdminDashboard';
import HospitalAdminDashboard from '@/components/dashboards/HospitalAdminDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import NurseDashboard from '@/components/dashboards/NurseDashboard';
import ReceptionistDashboard from '@/components/dashboards/ReceptionistDashboard';
import LabTechnicianDashboard from '@/components/dashboards/LabTechnicianDashboard';
import PharmacistDashboard from '@/components/dashboards/PharmacistDashboard';
import RadiologyTechnicianDashboard from '@/components/dashboards/RadiologyTechnicianDashboard';
import BillingDashboard from '@/components/dashboards/BillingDashboard';
import AccountantDashboard from '@/components/dashboards/AccountantDashboard';
import HRManagerDashboard from '@/components/dashboards/HRManagerDashboard';
import MedicalRecordsDashboard from '@/components/dashboards/MedicalRecordsDashboard';
import InventoryManagerDashboard from '@/components/dashboards/InventoryManagerDashboard';
import DietitianDashboard from '@/components/dashboards/DietitianDashboard';
import PhysiotherapistDashboard from '@/components/dashboards/PhysiotherapistDashboard';

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const userRole = getUserRole(user);

  // Route to role-specific dashboard
  // Handle both spaced and non-spaced role names
  switch (userRole) {
    case 'SuperAdmin':
    case 'Administrator':
      return <SuperAdminDashboard user={user} />;

    case 'Hospital Admin':
    case 'HospitalAdmin':
      return <HospitalAdminDashboard user={user} />;

    case 'Doctor':
      return <DoctorDashboard user={user} />;

    case 'Nurse':
      return <NurseDashboard user={user} />;

    case 'Receptionist':
      return <ReceptionistDashboard user={user} />;

    case 'Lab Technician':
    case 'LabTechnician':
      return <LabTechnicianDashboard user={user} />;

    case 'Pharmacist':
      return <PharmacistDashboard user={user} />;

    case 'Radiology Technician':
    case 'RadiologyTechnician':
    case 'Radiologist':
      return <RadiologyTechnicianDashboard user={user} />;

    case 'Billing':
      return <BillingDashboard user={user} />;

    case 'Accountant':
      return <AccountantDashboard user={user} />;

    case 'HR Manager':
    case 'HRManager':
      return <HRManagerDashboard user={user} />;

    case 'Medical Records':
    case 'MedicalRecords':
      return <MedicalRecordsDashboard user={user} />;

    case 'Inventory Manager':
    case 'InventoryManager':
      return <InventoryManagerDashboard user={user} />;

    case 'Dietitian':
      return <DietitianDashboard user={user} />;

    case 'Physiotherapist':
      return <PhysiotherapistDashboard user={user} />;

    default:
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Hospital SaaS</h1>
            <p className="text-muted-foreground">
              Role: {userRole || 'Unknown'}
            </p>
            <p className="text-sm text-red-600 mt-2">
              No dashboard configured for your role. Please contact your administrator.
            </p>
          </div>
        </div>
      );
  }
}
