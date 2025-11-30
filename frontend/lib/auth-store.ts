import { create } from 'zustand';
import { login, logout, getCurrentUser, DirectusUser } from './directus';

interface AuthState {
  user: DirectusUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// No persist - always verify with server on page load
// CRITICAL: isLoading starts as TRUE to prevent premature redirect before checkAuth completes
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,  // Start as true to prevent redirect race condition
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    console.log('[AUTH STORE] login() called for:', email);
    set({ isLoading: true, error: null });
    const result = await login(email, password);

    if (result.success) {
      console.log('[AUTH STORE] login() success, getting user...');
      const userResult = await getCurrentUser();
      console.log('[AUTH STORE] getCurrentUser result:', userResult.success, userResult.data?.email);
      if (userResult.success && userResult.data) {
        set({
          user: userResult.data as DirectusUser,
          isAuthenticated: true,
          isLoading: false
        });
        console.log('[AUTH STORE] User set in store:', userResult.data.email, 'role:', (userResult.data as DirectusUser).role);
        return true;
      }
    }

    console.log('[AUTH STORE] login failed:', result.error);
    set({
      error: result.error || 'Login failed',
      isLoading: false
    });
    return false;
  },

  logout: async () => {
    set({ isLoading: true });
    // Clear local state first
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('directus-auth');
      localStorage.removeItem('directus_token');
      localStorage.removeItem('hospital-auth');
      // Also clear all storage
      localStorage.clear();
      sessionStorage.clear();
    }
    // Call logout to invalidate server-side token
    await logout();
    // CRITICAL: Force a hard page reload to completely reset JS state
    // This ensures the Directus SDK singleton is completely reset
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  checkAuth: async () => {
    console.log('[AUTH STORE] checkAuth() called');
    set({ isLoading: true });
    const result = await getCurrentUser();

    if (result.success && result.data) {
      console.log('[AUTH STORE] checkAuth success, user:', result.data.email, 'role:', (result.data as DirectusUser).role);
      set({
        user: result.data as DirectusUser,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      console.log('[AUTH STORE] checkAuth failed:', result.error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null }),
}));

// Helper to get role name from user
export function getUserRole(user: DirectusUser | null): string {
  if (!user?.role) return 'unknown';

  // The role field contains the role object with name
  if (typeof user.role === 'object' && user.role?.name) {
    return user.role.name;
  }
  return typeof user.role === 'string' ? user.role : 'unknown';
}

// Check if user is super admin - must check role name, not just org_id
export function isSuperAdmin(user: DirectusUser | null): boolean {
  if (!user) return false;
  const roleName = getUserRole(user);
  // Only SuperAdmin role should see superadmin dashboard
  return roleName === 'SuperAdmin' || roleName === 'Administrator';
}

// Check if user is hospital admin
export function isHospitalAdmin(user: DirectusUser | null): boolean {
  if (!user) return false;
  const roleName = getUserRole(user);
  return roleName === 'Hospital Admin' && user.org_id !== null;
}

// Check if user is staff (Doctor, Nurse, Receptionist, Lab Tech, Pharmacist)
export function isStaff(user: DirectusUser | null): boolean {
  if (!user) return false;
  const roleName = getUserRole(user);
  const staffRoles = ['Doctor', 'Nurse', 'Receptionist', 'Lab Technician', 'Pharmacist'];
  return staffRoles.includes(roleName) && user.org_id !== null;
}
