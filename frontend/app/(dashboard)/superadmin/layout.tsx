'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, isSuperAdmin } from '@/lib/auth-store';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    // After loading, check if user is superadmin
    if (!isLoading && user && !isSuperAdmin(user)) {
      // Not a superadmin - redirect to regular dashboard
      router.push('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If user is not logged in, don't render anything (parent layout handles auth redirect)
  if (!user) {
    return null;
  }

  // If user is not superadmin, show access denied while redirecting
  if (!isSuperAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this area.</p>
          <p className="text-gray-500 text-sm mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
