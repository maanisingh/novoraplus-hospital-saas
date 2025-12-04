// Role-Based Access Control (RBAC) Configuration
// Defines which roles can access which routes and features

export type Role =
  | 'SuperAdmin'
  | 'HospitalAdmin'
  | 'Doctor'
  | 'Nurse'
  | 'Receptionist'
  | 'Pharmacist'
  | 'LabTechnician'
  | 'Radiologist'
  | 'Billing'
  | 'Accountant'
  | 'HRManager'
  | 'MedicalRecords'
  | 'InventoryManager'
  | 'Dietitian'
  | 'Physiotherapist'
  | 'Patient';

// Route permissions - defines which roles can access which routes
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  // SuperAdmin only routes
  '/superadmin': ['SuperAdmin'],
  '/superadmin/hospitals': ['SuperAdmin'],
  '/superadmin/users': ['SuperAdmin'],
  '/superadmin/settings': ['SuperAdmin'],
  '/superadmin/subscription-plans': ['SuperAdmin'],
  '/superadmin/promotions': ['SuperAdmin'],

  // Dashboard - All authenticated users
  '/dashboard': [
    'SuperAdmin',
    'HospitalAdmin',
    'Doctor',
    'Nurse',
    'Receptionist',
    'Pharmacist',
    'LabTechnician',
    'Radiologist',
    'Billing',
    'Accountant',
    'HRManager',
    'MedicalRecords',
    'InventoryManager',
    'Dietitian',
    'Physiotherapist',
  ],

  // Patients - Most clinical staff can view
  '/patients': [
    'HospitalAdmin',
    'Doctor',
    'Nurse',
    'Receptionist',
    'LabTechnician',
    'Radiologist',
    'Pharmacist',
    'MedicalRecords',
    'Dietitian',
    'Physiotherapist',
  ],

  // OPD - Front desk and clinical staff
  '/opd': ['HospitalAdmin', 'Doctor', 'Nurse', 'Receptionist'],

  // IPD - Inpatient care staff
  '/ipd': ['HospitalAdmin', 'Doctor', 'Nurse', 'Dietitian', 'Physiotherapist'],

  // Lab - Lab technicians and doctors
  '/lab': ['HospitalAdmin', 'Doctor', 'Nurse', 'LabTechnician'],

  // Radiology - Radiology staff and doctors
  '/radiology': ['HospitalAdmin', 'Doctor', 'Radiologist'],

  // Pharmacy - Pharmacists and prescribing doctors
  '/pharmacy': ['HospitalAdmin', 'Doctor', 'Pharmacist'],

  // Inventory - Inventory managers and pharmacists
  '/inventory': ['HospitalAdmin', 'Pharmacist', 'InventoryManager'],

  // Billing - Billing staff and accountants
  '/billing': ['HospitalAdmin', 'Billing', 'Accountant', 'Receptionist'],

  // Staff management - Admin and HR
  '/staff': ['HospitalAdmin', 'HRManager'],

  // Departments - Admin only
  '/departments': ['HospitalAdmin'],

  // Beds - Admin and nursing staff
  '/beds': ['HospitalAdmin', 'Nurse'],

  // Master Data - Admin only
  '/master-data': ['HospitalAdmin'],

  // Settings - Admin and relevant managers
  '/settings': ['HospitalAdmin', 'HRManager', 'InventoryManager'],

  // Profile - All users can access their own profile
  '/profile': [
    'SuperAdmin',
    'HospitalAdmin',
    'Doctor',
    'Nurse',
    'Receptionist',
    'Pharmacist',
    'LabTechnician',
    'Radiologist',
    'Billing',
    'Accountant',
    'HRManager',
    'MedicalRecords',
    'InventoryManager',
    'Dietitian',
    'Physiotherapist',
  ],

  // Patient Portal - Patients only (future feature)
  '/patient-portal': ['Patient'],
};

// Check if user role has permission to access a route
export function hasRoutePermission(userRole: string | null, path: string): boolean {
  if (!userRole) return false;

  // Remove query params and trailing slashes
  const cleanPath = path.split('?')[0].replace(/\/$/, '');

  // Check exact match first
  if (ROUTE_PERMISSIONS[cleanPath]) {
    return ROUTE_PERMISSIONS[cleanPath].includes(userRole as Role);
  }

  // Check parent routes (e.g., /patients/123 should check /patients)
  const pathParts = cleanPath.split('/').filter(Boolean);
  for (let i = pathParts.length; i > 0; i--) {
    const parentPath = '/' + pathParts.slice(0, i).join('/');
    if (ROUTE_PERMISSIONS[parentPath]) {
      return ROUTE_PERMISSIONS[parentPath].includes(userRole as Role);
    }
  }

  // Default deny - if route not explicitly allowed, deny access
  return false;
}

// Get default route for a given role
export function getDefaultRoute(role: string): string {
  switch (role) {
    case 'SuperAdmin':
      return '/superadmin';
    case 'HospitalAdmin':
      return '/dashboard';
    case 'Doctor':
      return '/dashboard';
    case 'Nurse':
      return '/dashboard';
    case 'Receptionist':
      return '/dashboard';
    case 'Pharmacist':
      return '/dashboard';
    case 'LabTechnician':
      return '/dashboard';
    case 'Radiologist':
      return '/dashboard';
    case 'Billing':
      return '/dashboard';
    case 'Accountant':
      return '/dashboard';
    case 'HRManager':
      return '/dashboard';
    case 'MedicalRecords':
      return '/dashboard';
    case 'InventoryManager':
      return '/dashboard';
    case 'Dietitian':
      return '/dashboard';
    case 'Physiotherapist':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}

// Feature permissions - for more granular control
export const FEATURE_PERMISSIONS = {
  canManageHospitals: ['SuperAdmin'],
  canManageSubscriptions: ['SuperAdmin'],
  canManageAllUsers: ['SuperAdmin', 'HospitalAdmin'],
  canManageDepartments: ['HospitalAdmin'],
  canManageStaff: ['HospitalAdmin', 'HRManager'],
  canPrescribeMedicine: ['Doctor'],
  canDispenseMedicine: ['Pharmacist'],
  canPerformLabTests: ['LabTechnician'],
  canPerformRadiology: ['Radiologist'],
  canManageBilling: ['Billing', 'Accountant'],
  canManageInventory: ['InventoryManager', 'Pharmacist'],
  canAdmitPatients: ['Doctor', 'Receptionist', 'HospitalAdmin'],
  canDischargePatients: ['Doctor', 'HospitalAdmin'],
  canViewFinancials: ['HospitalAdmin', 'Accountant', 'Billing'],
  canManagePayroll: ['HRManager', 'HospitalAdmin'],
  canAccessMedicalRecords: [
    'Doctor',
    'Nurse',
    'MedicalRecords',
    'HospitalAdmin',
  ],
};

// Check if user has a specific feature permission
export function hasFeaturePermission(
  userRole: string | null,
  feature: keyof typeof FEATURE_PERMISSIONS
): boolean {
  if (!userRole) return false;
  return FEATURE_PERMISSIONS[feature].includes(userRole as Role);
}
