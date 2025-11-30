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
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    const result = await login(email, password);

    if (result.success) {
      const userResult = await getCurrentUser();
      if (userResult.success && userResult.data) {
        set({
          user: userResult.data as DirectusUser,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      }
    }

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
    set({ isLoading: true });
    const result = await getCurrentUser();

    if (result.success && result.data) {
      set({
        user: result.data as DirectusUser,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
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
