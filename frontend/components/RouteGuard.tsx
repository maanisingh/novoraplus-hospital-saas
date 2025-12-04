'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, getUserRole } from '@/lib/auth-store';
import { hasRoutePermission, getDefaultRoute } from '@/lib/permissions';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Don't check permissions while loading
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check route permissions
    if (user) {
      const userRole = getUserRole(user);
      const hasPermission = hasRoutePermission(userRole, pathname);

      if (!hasPermission) {
        // User doesn't have permission - redirect to their default route
        const defaultRoute = getDefaultRoute(userRole);
        console.warn(
          `[RBAC] User ${user.email} (${userRole}) denied access to ${pathname}`
        );
        router.push(defaultRoute);
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check permissions one more time before rendering
  if (user) {
    const userRole = getUserRole(user);
    const hasPermission = hasRoutePermission(userRole, pathname);

    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center space-y-6 p-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-6">
                <ShieldAlert className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
              <p className="text-gray-600">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500">
                Your role: <span className="font-medium">{userRole}</span>
              </p>
            </div>
            <Button
              onClick={() => router.push(getDefaultRoute(userRole))}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      );
    }
  }

  // User has permission - render the page
  return <>{children}</>;
}
