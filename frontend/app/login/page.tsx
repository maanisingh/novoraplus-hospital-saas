'use client';

import { useState } from 'react';
import { useAuthStore, isSuperAdmin } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Key, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

// Demo credentials for quick login - ALL 15 ROLES with unified password
const DEMO_CREDENTIALS = [
  {
    label: 'SuperAdmin',
    email: 'superadmin@hospital.com',
    password: 'admin123',
    description: 'Full platform access - Manage all hospitals',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    label: 'Hospital Admin',
    email: 'admin@hospital.com',
    password: 'admin123',
    description: 'Hospital management - Departments & staff',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    label: 'Doctor',
    email: 'doctor@hospital.com',
    password: 'admin123',
    description: 'Dr. John Smith - Patient care & prescriptions',
    color: 'bg-green-100 text-green-700',
  },
  {
    label: 'Nurse',
    email: 'nurse@hospital.com',
    password: 'admin123',
    description: 'Mary Johnson - Vital signs & patient care',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    label: 'Receptionist',
    email: 'receptionist@hospital.com',
    password: 'admin123',
    description: 'Lisa Brown - Patient registration & OPD tokens',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    label: 'Pharmacist',
    email: 'pharmacist@hospital.com',
    password: 'admin123',
    description: 'Mike Wilson - Medicine dispensing & inventory',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    label: 'Lab Technician',
    email: 'labtech@hospital.com',
    password: 'admin123',
    description: 'Sarah Davis - Lab tests & reports',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    label: 'Radiologist',
    email: 'radiologist@hospital.com',
    password: 'admin123',
    description: 'Dr. James Miller - Imaging & scans',
    color: 'bg-cyan-100 text-cyan-700',
  },
  {
    label: 'Billing Staff',
    email: 'billing@hospital.com',
    password: 'admin123',
    description: 'Emily Garcia - Invoices & payments',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    label: 'Accountant',
    email: 'accountant@hospital.com',
    password: 'admin123',
    description: 'Robert Taylor - Financial reports & analysis',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    label: 'HR Manager',
    email: 'hr@hospital.com',
    password: 'admin123',
    description: 'Jennifer Anderson - Staff & payroll management',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    label: 'Medical Records',
    email: 'records@hospital.com',
    password: 'admin123',
    description: 'Patricia White - Document management',
    color: 'bg-slate-100 text-slate-700',
  },
  {
    label: 'Inventory Manager',
    email: 'inventory@hospital.com',
    password: 'admin123',
    description: 'Michael Brown - Supply chain & inventory',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    label: 'Dietitian',
    email: 'dietitian@hospital.com',
    password: 'admin123',
    description: 'Laura Martinez - Patient nutrition & diet plans',
    color: 'bg-lime-100 text-lime-700',
  },
  {
    label: 'Physiotherapist',
    email: 'physiotherapist@hospital.com',
    password: 'admin123',
    description: 'David Garcia - Physical therapy & rehabilitation',
    color: 'bg-sky-100 text-sky-700',
  },
];

export default function LoginPage() {
  const { login, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  // Use LOCAL loading state for login page - the global isLoading defaults to true
  // which would block the form. Local state ensures form is enabled on page load.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        const { user } = useAuthStore.getState();
        // CRITICAL: Use hard page reload instead of router.push
        // This ensures ALL JavaScript state is reset for the new session
        if (typeof window !== 'undefined') {
          if (isSuperAdmin(user)) {
            window.location.href = '/superadmin';
          } else {
            window.location.href = '/dashboard';
          }
        }
      } else {
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    clearError();
    setIsSubmitting(true);

    try {
      const success = await login(cred.email, cred.password);
      if (success) {
        const { user } = useAuthStore.getState();
        // CRITICAL: Use hard page reload instead of router.push
        // This ensures ALL JavaScript state is reset for the new session
        if (typeof window !== 'undefined') {
          if (isSuperAdmin(user)) {
            window.location.href = '/superadmin';
          } else {
            window.location.href = '/dashboard';
          }
        }
      } else {
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = (index: number, cred: typeof DEMO_CREDENTIALS[0]) => {
    navigator.clipboard.writeText(`Email: ${cred.email}\nPassword: ${cred.password}`);
    setCopiedIndex(index);
    toast.success('Credentials copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://novoraplus.com/images/logo.png"
              alt="NovoraPlus"
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access the Hospital Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center mb-4">
              <Key className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-500">Quick Demo Login</span>
            </div>
            <div className="space-y-3">
              {DEMO_CREDENTIALS.map((cred, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={cred.color}>{cred.label}</Badge>
                    <button
                      type="button"
                      onClick={() => copyCredentials(index, cred)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Copy credentials"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{cred.description}</div>
                  <div className="text-xs space-y-1">
                    <div className="flex">
                      <span className="text-gray-400 w-16">Email:</span>
                      <span className="font-mono text-gray-600">{cred.email}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-16">Pass:</span>
                      <span className="font-mono text-gray-600">{cred.password}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => handleQuickLogin(cred)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3 h-3 animate-spin mr-2" />
                    ) : null}
                    Login as {cred.label}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Building2 className="w-4 h-4 mr-2" />
              Hospital Management System
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// Build version: 2.2.0 - CRITICAL FIX: Use local isSubmitting state instead of global isLoading
// The global isLoading defaults to true (to prevent race conditions on protected pages),
// but this caused the login form to be disabled forever. Local state fixes this.
// Also uses window.location.href for login redirect to ensure complete JS state reset.
// Last update: 2025-11-30T22:30:00Z
