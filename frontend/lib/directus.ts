import { createDirectus, authentication, rest, readMe, readItem, readItems, createItem, updateItem, deleteItem, createUser, AuthenticationData } from '@directus/sdk';

// Type definitions for our collections
export interface Organization {
  id: string;
  code: string;
  name: string;
  logo?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  owner_name?: string;
  owner_mobile?: string;
  razorpay_account_id?: string;
  whatsapp_number?: string;
  subscription_plan?: 'basic' | 'professional' | 'enterprise';
  subscription_start?: string;
  subscription_end?: string;
  max_users?: number;
  status: 'active' | 'inactive' | 'suspended';
  date_created: string;
}

export interface Patient {
  id: string;
  org_id: string;
  patient_code: string;
  name: string;
  mobile: string;
  email?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
  emergency_contact_name?: string;
  allergies?: string;
  medical_history?: string;
  date_created: string;
}

export interface OPDToken {
  id: string;
  org_id: string;
  patient_id: string;
  doctor_id?: string;
  department_id?: string;
  token_number: number;
  token_date: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent' | 'emergency';
  symptoms?: string;
  diagnosis?: string;
  prescription?: object;
  notes?: string;
  consultation_fee?: number;
  called_at?: string;
  completed_at?: string;
  date_created: string;
  // Relations
  patient?: Patient;
}

export interface Department {
  id: string;
  org_id: string;
  name: string;
  code?: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface Bed {
  id: string;
  org_id: string;
  bed_number: string;
  ward?: string;
  bed_type?: 'general' | 'semi_private' | 'private' | 'icu' | 'nicu';
  status: 'available' | 'occupied' | 'maintenance';
  daily_rate?: number;
}

export interface Staff {
  id: string;
  org_id: string;
  staff_code?: string;
  name: string;
  designation: 'doctor' | 'nurse' | 'technician' | 'receptionist' | 'pharmacist' | 'admin' | 'other';
  department_id?: string;
  department?: Department;
  specialization?: string;
  qualification?: string;
  mobile?: string;
  email?: string;
  address?: string;
  date_of_joining?: string;
  status: 'active' | 'inactive' | 'on_leave';
  date_created: string;
}

export interface RadiologyTest {
  id: string;
  org_id: string;
  patient_id: string;
  test_number: string;
  test_type: 'xray' | 'ct' | 'mri' | 'ultrasound' | 'mammography' | 'other';
  test_name: string;
  test_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  findings?: string;
  impression?: string;
  report_pdf?: string;
  images?: string[];
  price?: number;
  doctor_id?: string;
  technician_id?: string;
  completed_at?: string;
  date_created: string;
  patient?: Patient;
}

export interface IPDDailyRecord {
  id: string;
  org_id: string;
  ipd_admission_id: string;
  record_date: string;
  vital_signs?: {
    temperature?: number;
    pulse?: number;
    blood_pressure?: string;
    respiratory_rate?: number;
    oxygen_saturation?: number;
    weight?: number;
  };
  chief_complaints?: string;
  examination_notes?: string;
  treatment_given?: string;
  medications?: string;
  diet?: string;
  nursing_notes?: string;
  doctor_notes?: string;
  doctor_id?: string;
  recorded_by?: string;
  date_created: string;
}

export interface IPDAdmission {
  id: string;
  org_id: string;
  patient_id: string;
  bed_id?: string;
  doctor_id?: string;
  department_id?: string;
  ip_number: string;
  admission_type?: 'emergency' | 'planned' | 'referral';
  admission_date: string;
  expected_discharge?: string;
  discharge_date?: string;
  status: 'admitted' | 'discharged' | 'transferred' | 'lama' | 'deceased';
  diagnosis?: string;
  notes?: string;
  treatment_plan?: string;
  discharge_summary?: string;
  total_amount?: number;
  date_created: string;
}

export interface LabTest {
  id: string;
  org_id: string;
  patient_id: string;
  opd_id?: string;
  lab_number: string;
  test_name: string;
  test_date: string;
  test_category?: 'pathology' | 'radiology' | 'cardiology' | 'microbiology';
  status: 'pending' | 'sample_collected' | 'in_progress' | 'completed';
  result?: string;
  result_date?: string;
  remarks?: string;
  report_pdf?: string;
  price?: number;
  sample_collected_at?: string;
  completed_at?: string;
  date_created: string;
}

export interface PharmacyOrder {
  id: string;
  org_id: string;
  patient_id: string;
  order_number?: string;
  items?: object;
  medicines?: object;
  status: 'pending' | 'processing' | 'dispensed' | 'cancelled';
  total_amount?: number;
  discount?: number;
  payment_status: 'unpaid' | 'paid' | 'partial';
  notes?: string;
  order_date?: string;
  dispensed_at?: string;
  date_created: string;
}

export interface InventoryItem {
  id: string;
  org_id: string;
  item_code: string;
  item_name: string;
  item_type: 'medicine' | 'consumable' | 'equipment';
  category?: 'medicine' | 'surgical' | 'consumables' | 'equipment';
  quantity: number;
  unit: string;
  unit_price?: number;
  reorder_level?: number;
  min_stock_level?: number;
  purchase_price?: number;
  selling_price?: number;
  batch_number?: string;
  expiry_date?: string;
  supplier?: string;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'expired';
  date_created: string;
}

export interface Bill {
  id: string;
  org_id: string;
  patient_id: string;
  bill_number: string;
  invoice_number?: string;
  bill_type?: 'opd' | 'ipd' | 'lab' | 'pharmacy' | 'radiology';
  items?: object;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  total_amount: number;
  paid_amount?: number;
  payment_status: 'unpaid' | 'partial' | 'paid' | 'pending' | 'refunded';
  payment_method?: 'cash' | 'card' | 'upi' | 'netbanking' | 'online' | 'insurance';
  razorpay_payment_id?: string;
  notes?: string;
  bill_date: string;
  date_created: string;
}

// Type aliases for backward compatibility
export type Billing = Bill;
export type Inventory = InventoryItem;

export interface DirectusUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password?: string;
  role: string | { id: string; name: string };
  org_id?: string | null;
  status: string;
  avatar?: string;
}

// Master Data Interfaces
export interface Symptom {
  id: string;
  org_id: string;
  name: string;
  code?: string;
  category?: string;
  description?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface Investigation {
  id: string;
  org_id: string;
  name: string;
  code?: string;
  category?: 'pathology' | 'radiology' | 'cardiology' | 'microbiology' | 'other';
  price?: number;
  description?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface DiagnosisMaster {
  id: string;
  org_id: string;
  name: string;
  icd_code?: string;
  category?: string;
  description?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface MedicalHistory {
  id: string;
  org_id: string;
  name: string;
  category?: 'medical' | 'surgical' | 'family' | 'allergy';
  description?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface LifestyleOption {
  id: string;
  org_id: string;
  name: string;
  category: 'addiction' | 'diet' | 'appetite' | 'sleep' | 'bladder' | 'bowel';
  description?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface ICDCode {
  id: string;
  org_id?: string;
  code: string;
  name: string;
  category?: string;
  chapter?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface TPACode {
  id: string;
  org_id: string;
  code: string;
  name: string;
  tpa_name?: string;
  description?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface ServiceTemplate {
  id: string;
  org_id: string;
  name: string;
  service_type: 'opd' | 'ipd' | 'lab' | 'radiology' | 'pharmacy';
  items?: object;
  total_amount?: number;
  description?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface CertificateTemplate {
  id: string;
  org_id: string;
  name: string;
  template_type: 'fitness' | 'medical' | 'death' | 'birth' | 'disability' | 'custom';
  content?: string;
  header?: string;
  footer?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface MedicineTemplate {
  id: string;
  org_id: string;
  name: string;
  diagnosis?: string;
  medicines?: object;
  instructions?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface LabReportTemplate {
  id: string;
  org_id: string;
  name: string;
  test_category?: string;
  parameters?: object;
  normal_ranges?: object;
  format?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface PaymentMode {
  id: string;
  org_id: string;
  name: string;
  code?: string;
  description?: string;
  is_default?: boolean;
  status: 'active' | 'inactive';
  date_created: string;
}

export interface UserType {
  id: string;
  org_id: string;
  name: string;
  code?: string;
  permissions?: object;
  description?: string;
  status: 'active' | 'inactive';
  date_created: string;
}

// Schema type for Directus SDK
interface Schema {
  organizations: Organization[];
  patients: Patient[];
  opd_tokens: OPDToken[];
  departments: Department[];
  beds: Bed[];
  staff: Staff[];
  radiology_tests: RadiologyTest[];
  ipd_admissions: IPDAdmission[];
  ipd_daily_records: IPDDailyRecord[];
  lab_tests: LabTest[];
  pharmacy_orders: PharmacyOrder[];
  inventory: InventoryItem[];
  billing: Bill[];
  directus_users: DirectusUser[];
  // Master Data Collections
  symptoms: Symptom[];
  investigations: Investigation[];
  diagnosis_master: DiagnosisMaster[];
  medical_history: MedicalHistory[];
  lifestyle_options: LifestyleOption[];
  icd_codes: ICDCode[];
  tpa_codes: TPACode[];
  service_templates: ServiceTemplate[];
  certificate_templates: CertificateTemplate[];
  medicine_templates: MedicineTemplate[];
  lab_report_templates: LabReportTemplate[];
  payment_modes: PaymentMode[];
  user_types: UserType[];
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-0b20.up.railway.app';

// ============================================================================
// BULLETPROOF AUTH SYSTEM - No SDK caching, pure fetch-based
// ============================================================================

const AUTH_STORAGE_KEY = 'novoraplus_auth_session';

interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires: number;
  expires_at: number;
  user_id: string;  // Track which user this session belongs to
}

// Get current auth session
function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as AuthSession;
  } catch {
    return null;
  }
}

// Set auth session
function setAuthSession(session: AuthSession | null): void {
  if (typeof window === 'undefined') return;
  if (session) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

// NUCLEAR CLEAR - removes everything auth related
function nuclearClear(): void {
  if (typeof window === 'undefined') return;

  // Remove our auth key
  localStorage.removeItem(AUTH_STORAGE_KEY);

  // Remove legacy keys
  localStorage.removeItem('directus-auth');
  localStorage.removeItem('directus_token');
  localStorage.removeItem('hospital-auth');

  // Clear ALL localStorage items that might contain auth data
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('auth') || key.includes('token') || key.includes('directus') || key.includes('session'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Clear sessionStorage too
  sessionStorage.clear();
}

// ============================================================================
// AUTH FUNCTIONS - Pure fetch, no SDK
// ============================================================================

export async function login(email: string, password: string) {
  try {
    console.log('[AUTH] Login attempt for:', email);

    // STEP 1: Nuclear clear before login
    nuclearClear();
    console.log('[AUTH] Cleared all auth state');

    // STEP 2: Make login request
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('[AUTH] Login failed:', errorData);
      return { success: false, error: errorData.errors?.[0]?.message || 'Login failed' };
    }

    const data = await response.json();
    console.log('[AUTH] Login successful');

    // STEP 3: Immediately get user info to verify and get user_id
    const userResponse = await fetch(`${DIRECTUS_URL}/users/me?fields=id,email,first_name,last_name,role.id,role.name,org_id,avatar,status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.data.access_token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!userResponse.ok) {
      console.log('[AUTH] Failed to get user info after login');
      return { success: false, error: 'Failed to verify user' };
    }

    const userData = await userResponse.json();
    console.log('[AUTH] Verified user:', userData.data?.email, 'role:', userData.data?.role?.name);

    // STEP 4: Store session with user_id for verification
    const session: AuthSession = {
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires: data.data.expires,
      expires_at: Date.now() + data.data.expires,
      user_id: userData.data.id,
    };
    setAuthSession(session);
    console.log('[AUTH] Session stored for user:', userData.data.email);

    return { success: true, data: data.data, user: userData.data };
  } catch (error: unknown) {
    const err = error as Error;
    console.log('[AUTH] Login error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function logout() {
  try {
    console.log('[AUTH] Logout initiated');

    // Get current session to invalidate refresh token
    const session = getAuthSession();

    // Try to invalidate refresh token on server
    if (session?.refresh_token) {
      try {
        await fetch(`${DIRECTUS_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: session.refresh_token }),
          cache: 'no-store',
        });
        console.log('[AUTH] Server logout successful');
      } catch {
        console.log('[AUTH] Server logout failed (continuing anyway)');
      }
    }

    // NUCLEAR CLEAR
    nuclearClear();
    console.log('[AUTH] All auth state cleared');

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    // Even if logout fails, clear everything
    nuclearClear();
    return { success: false, error: err.message };
  }
}

export async function getCurrentUser() {
  try {
    console.log('[AUTH] getCurrentUser called');

    // Get session from storage
    const session = getAuthSession();
    if (!session?.access_token) {
      console.log('[AUTH] No access token in storage');
      return { success: false, error: 'No access token' };
    }

    console.log('[AUTH] Found session for user_id:', session.user_id);

    // Make request with NO CACHE
    const response = await fetch(`${DIRECTUS_URL}/users/me?fields=id,email,first_name,last_name,role.id,role.name,org_id,avatar,status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('[AUTH] /users/me failed:', errorData);
      // Token is invalid, clear session
      nuclearClear();
      return { success: false, error: errorData.errors?.[0]?.message || 'Failed to get user' };
    }

    const data = await response.json();
    console.log('[AUTH] getCurrentUser success:', data.data?.email, 'role:', data.data?.role?.name);

    // CRITICAL: Verify the returned user matches the session
    if (session.user_id && data.data?.id !== session.user_id) {
      console.log('[AUTH] USER MISMATCH! Session user_id:', session.user_id, 'API returned:', data.data?.id);
      // This should never happen, but if it does, clear everything
      nuclearClear();
      return { success: false, error: 'Session user mismatch' };
    }

    return { success: true, data: data.data };
  } catch (error: unknown) {
    const err = error as Error;
    console.log('[AUTH] getCurrentUser error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// DIRECTUS SDK - For CRUD operations only (not auth)
// ============================================================================

// Storage adapter that reads from our auth session
const storage = {
  get: () => {
    const session = getAuthSession();
    if (session) {
      return {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires: session.expires,
        expires_at: session.expires_at,
      } as AuthenticationData;
    }
    return null;
  },
  set: (data: AuthenticationData | null) => {
    // We manage auth separately, don't let SDK override
    console.log('[SDK] storage.set called - ignoring, we manage auth separately');
  },
};

function createDirectusClient() {
  return createDirectus<Schema>(DIRECTUS_URL)
    .with(authentication('json', { storage }))
    .with(rest());
}

let _directusClient = createDirectusClient();

export function getDirectusClient() {
  return _directusClient;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const directus = new Proxy({} as ReturnType<typeof createDirectusClient>, {
  get(_, prop) {
    return (_directusClient as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function resetDirectusClient() {
  console.log('[SDK] resetDirectusClient called');
  _directusClient = createDirectusClient();
}

// ============================================================================
// CRUD FUNCTIONS
// ============================================================================

export async function getItem<T>(collection: keyof Schema, id: string, options?: object) {
  try {
    const item = await _directusClient.request(readItem(collection, id, options as never));
    return { success: true, data: item as T };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function getItems<T>(collection: keyof Schema, options?: object) {
  try {
    const items = await _directusClient.request(readItems(collection, options as never));
    return { success: true, data: items as T[] };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function createItemRecord<T>(collection: keyof Schema, data: Partial<T>) {
  try {
    const item = await _directusClient.request(createItem(collection, data as never));
    return { success: true, data: item as T };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function updateItemRecord<T>(collection: keyof Schema, id: string, data: Partial<T>) {
  try {
    const item = await _directusClient.request(updateItem(collection, id, data as never));
    return { success: true, data: item as T };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function deleteItemRecord(collection: keyof Schema, id: string) {
  try {
    await _directusClient.request(deleteItem(collection, id));
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function createDirectusUser(userData: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  org_id?: string;
  role?: string;
  status?: string;
  title?: string;
  description?: string;
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directusUserData: any = {
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name,
      status: userData.status || 'active',
    };

    if (userData.role) directusUserData.role = userData.role;
    if (userData.title) directusUserData.title = userData.title;
    if (userData.description) directusUserData.description = userData.description;
    if (userData.org_id) directusUserData.org_id = userData.org_id;

    const user = await _directusClient.request(createUser(directusUserData));

    return { success: true, data: user };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Create user error:', err);
    const errorMessage = (error as { errors?: Array<{ message: string }> })?.errors?.[0]?.message || err.message;
    return { success: false, error: errorMessage };
  }
}

// Build: 20251130-v3 - Complete auth rewrite with nuclear clear and session isolation
