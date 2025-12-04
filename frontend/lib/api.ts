// Hospital SaaS Backend API Client
// Replaces Directus SDK with direct Express API calls

const API_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:5000';

// Helper to make API requests
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string; count?: number }> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      return { success: false, error: errorData.error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

// ============================================================================
// SUBSCRIPTION PLANS
// ============================================================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  maxUsers?: number;
  maxPatients?: number;
  modules?: string[];
  features?: string[];
  isPopular?: boolean;
  status: 'active' | 'inactive';
  sort?: number;
  dateCreated: string;
  dateUpdated: string;
}

export async function getSubscriptionPlans() {
  return apiFetch<SubscriptionPlan[]>('/api/subscription-plans');
}

export async function getSubscriptionPlan(id: string) {
  return apiFetch<SubscriptionPlan>(`/api/subscription-plans/${id}`);
}

export async function createSubscriptionPlan(data: Partial<SubscriptionPlan>) {
  return apiFetch<SubscriptionPlan>('/api/subscription-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSubscriptionPlan(id: string, data: Partial<SubscriptionPlan>) {
  return apiFetch<SubscriptionPlan>(`/api/subscription-plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteSubscriptionPlan(id: string) {
  return apiFetch(`/api/subscription-plans/${id}`, { method: 'DELETE' });
}

// ============================================================================
// SUPERADMIN SETTINGS
// ============================================================================

export interface SuperAdminSettings {
  id: string;
  platformName?: string;
  platformLogo?: string;
  supportEmail?: string;
  supportPhone?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  paymentGateway?: string;
  paymentApiKey?: string;
  paymentSecretKey?: string;
  currency?: string;
  taxRate?: number;
  trialDays?: number;
  maintenanceMode?: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export async function getSuperAdminSettings() {
  return apiFetch<SuperAdminSettings[]>('/api/superadmin-settings');
}

export async function getSuperAdminSetting(id: string) {
  return apiFetch<SuperAdminSettings>(`/api/superadmin-settings/${id}`);
}

export async function createSuperAdminSettings(data: Partial<SuperAdminSettings>) {
  return apiFetch<SuperAdminSettings>('/api/superadmin-settings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSuperAdminSettings(id: string, data: Partial<SuperAdminSettings>) {
  return apiFetch<SuperAdminSettings>(`/api/superadmin-settings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ============================================================================
// PROMOTIONS
// ============================================================================

export interface Promotion {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  timesUsed?: number;
  applicablePlans?: string[];
  isActive?: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export async function getPromotions() {
  return apiFetch<Promotion[]>('/api/promotions');
}

export async function getPromotion(id: string) {
  return apiFetch<Promotion>(`/api/promotions/${id}`);
}

export async function createPromotion(data: Partial<Promotion>) {
  return apiFetch<Promotion>('/api/promotions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePromotion(id: string, data: Partial<Promotion>) {
  return apiFetch<Promotion>(`/api/promotions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deletePromotion(id: string) {
  return apiFetch(`/api/promotions/${id}`, { method: 'DELETE' });
}

// ============================================================================
// SURGICAL HISTORY
// ============================================================================

export interface SurgicalHistory {
  id: string;
  patientId: string;
  surgeryName: string;
  surgeryDate: string;
  surgeonName?: string;
  hospitalName?: string;
  notes?: string;
  complications?: string;
  dateCreated: string;
  dateUpdated: string;
}

export async function getSurgicalHistories() {
  return apiFetch<SurgicalHistory[]>('/api/surgical-history');
}

export async function getSurgicalHistory(id: string) {
  return apiFetch<SurgicalHistory>(`/api/surgical-history/${id}`);
}

export async function createSurgicalHistory(data: Partial<SurgicalHistory>) {
  return apiFetch<SurgicalHistory>('/api/surgical-history', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSurgicalHistory(id: string, data: Partial<SurgicalHistory>) {
  return apiFetch<SurgicalHistory>(`/api/surgical-history/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteSurgicalHistory(id: string) {
  return apiFetch(`/api/surgical-history/${id}`, { method: 'DELETE' });
}

// ============================================================================
// PAYMENT HISTORY
// ============================================================================

export interface PaymentHistory {
  id: string;
  hospitalId: string;
  subscriptionPlanId?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  status?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  invoiceUrl?: string;
  dateCreated: string;
  dateUpdated: string;
}

export async function getPaymentHistories() {
  return apiFetch<PaymentHistory[]>('/api/payment-history');
}

export async function getPaymentHistory(id: string) {
  return apiFetch<PaymentHistory>(`/api/payment-history/${id}`);
}

export async function createPaymentHistory(data: Partial<PaymentHistory>) {
  return apiFetch<PaymentHistory>('/api/payment-history', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePaymentHistory(id: string, data: Partial<PaymentHistory>) {
  return apiFetch<PaymentHistory>(`/api/payment-history/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deletePaymentHistory(id: string) {
  return apiFetch(`/api/payment-history/${id}`, { method: 'DELETE' });
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export interface DashboardStats {
  totalPlans: number;
  activePlans: number;
  totalPromotions: number;
  activePromotions: number;
  totalPayments: number;
  totalRevenue: number;
}

export async function getDashboardStats() {
  return apiFetch<DashboardStats>('/api/stats/dashboard');
}

// Helper functions for backward compatibility with existing code
export async function getItems<T>(collection: string, options?: { sort?: string[]; limit?: number }) {
  // Map Directus-style calls to new API
  switch (collection) {
    case 'subscription_plans':
      return getSubscriptionPlans() as Promise<{ success: boolean; data?: T[]; error?: string }>;
    case 'superadmin_settings':
      return getSuperAdminSettings() as Promise<{ success: boolean; data?: T[]; error?: string }>;
    case 'promotions':
      return getPromotions() as Promise<{ success: boolean; data?: T[]; error?: string }>;
    case 'surgical_history':
      return getSurgicalHistories() as Promise<{ success: boolean; data?: T[]; error?: string }>;
    case 'payment_history':
      return getPaymentHistories() as Promise<{ success: boolean; data?: T[]; error?: string }>;
    default:
      return { success: false, error: `Collection ${collection} not found` };
  }
}

export async function createItemRecord<T>(collection: string, data: Partial<T>) {
  switch (collection) {
    case 'subscription_plans':
      return createSubscriptionPlan(data as Partial<SubscriptionPlan>) as Promise<{ success: boolean; data?: T; error?: string }>;
    case 'superadmin_settings':
      return createSuperAdminSettings(data as Partial<SuperAdminSettings>) as Promise<{ success: boolean; data?: T; error?: string }>;
    case 'promotions':
      return createPromotion(data as Partial<Promotion>) as Promise<{ success: boolean; data?: T; error?: string }>;
    case 'surgical_history':
      return createSurgicalHistory(data as Partial<SurgicalHistory>) as Promise<{ success: boolean; data?: T; error?: string }>;
    case 'payment_history':
      return createPaymentHistory(data as Partial<PaymentHistory>) as Promise<{ success: boolean; data?: T; error?: string }>;
    default:
      return { success: false, error: `Collection ${collection} not found` };
  }
}

export async function updateItemRecord<T>(collection: string, id: string, data: Partial<T>) {
  switch (collection) {
    case 'subscription_plans':
      return updateSubscriptionPlan(id, data as Partial<SubscriptionPlan>) as Promise<{ success: boolean; data?: T; error?: string }>;
    case 'superadmin_settings':
      return updateSuperAdminSettings(id, data as Partial<SuperAdminSettings>) as Promise<{ success: boolean; data?: T; error?: string }>;
    case 'promotions':
      return updatePromotion(id, data as Partial<Promotion>) as Promise<{ success: boolean; data?: T; error?: string }>;
    case 'surgical_history':
      return updateSurgicalHistory(id, data as Partial<SurgicalHistory>) as Promise<{ success: boolean; data?: T; error?: string }>;
    case 'payment_history':
      return updatePaymentHistory(id, data as Partial<PaymentHistory>) as Promise<{ success: boolean; data?: T; error?: string }>;
    default:
      return { success: false, error: `Collection ${collection} not found` };
  }
}

export async function deleteItemRecord(collection: string, id: string) {
  switch (collection) {
    case 'subscription_plans':
      return deleteSubscriptionPlan(id);
    case 'promotions':
      return deletePromotion(id);
    case 'surgical_history':
      return deleteSurgicalHistory(id);
    case 'payment_history':
      return deletePaymentHistory(id);
    default:
      return { success: false, error: `Collection ${collection} not found` };
  }
}
