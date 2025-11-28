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
    await logout();
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('directus_token');
      localStorage.removeItem('hospital-auth');
    }
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
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

  // The role field contains the role ID or name
  // You may need to adjust this based on Directus response
  return typeof user.role === 'string' ? user.role : 'unknown';
}

// Check if user is super admin
export function isSuperAdmin(user: DirectusUser | null): boolean {
  // Super admin has no org_id
  return user !== null && !user.org_id;
}
