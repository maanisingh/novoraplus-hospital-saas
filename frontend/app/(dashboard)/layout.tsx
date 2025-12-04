'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import TopNavbar from '@/components/layouts/TopNavbar';
import RouteGuard from '@/components/RouteGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
