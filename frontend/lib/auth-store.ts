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

// BULLETPROOF AUTH STORE
// - isLoading starts TRUE to prevent redirect race
// - No persist, always verify with server
// - Uses nuclear clear on logout
export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: true,  // Start as true to prevent redirect race condition
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    console.log('[AUTH STORE] login() called for:', email);

    // Clear any existing state FIRST
    set({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null
    });

    const result = await login(email, password);

    if (result.success && result.user) {
      // Login now returns user data directly - use it!
      console.log('[AUTH STORE] login() success, user:', result.user.email, 'role:', result.user.role?.name);
      set({
        user: result.user as DirectusUser,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    }

    console.log('[AUTH STORE] login failed:', result.error);
    set({
      user: null,
      isAuthenticated: false,
      error: result.error || 'Login failed',
      isLoading: false
    });
    return false;
  },

  logout: async () => {
    console.log('[AUTH STORE] logout() called');

    // Clear Zustand state IMMEDIATELY
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });

    // Call logout which does nuclear clear
    await logout();

    // CRITICAL: Force hard page reload to reset ALL JS state
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  checkAuth: async () => {
    console.log('[AUTH STORE] checkAuth() called');
    set({ isLoading: true });

    const result = await getCurrentUser();

    if (result.success && result.data) {
      console.log('[AUTH STORE] checkAuth success:', result.data.email, 'role:', (result.data as DirectusUser).role);
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

// Build: 20251130-v3 - Sync with bulletproof directus.ts auth
