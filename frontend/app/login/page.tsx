'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, isSuperAdmin } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Key, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

// Demo credentials for quick login
const DEMO_CREDENTIALS = [
  {
    label: 'SuperAdmin',
    email: 'admin@novoraplus.com',
    password: 'NovoraPlus@2024!',
    description: 'Full platform access - manage all hospitals',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    label: 'Hospital Admin',
    email: 'admin@citygeneralhospital.com',
    password: 'Hospital@2024!',
    description: 'City General Hospital - Full hospital management',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    label: 'Doctor',
    email: 'doctor@citygeneralhospital.com',
    password: 'Staff@2024!',
    description: 'Dr. John Smith - Patient care & prescriptions',
    color: 'bg-green-100 text-green-700',
  },
  {
    label: 'Nurse',
    email: 'nurse@citygeneralhospital.com',
    password: 'Staff@2024!',
    description: 'Sarah Johnson - Vital signs & patient care',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    label: 'Receptionist',
    email: 'reception@citygeneralhospital.com',
    password: 'Staff@2024!',
    description: 'Emily Davis - Patient registration & billing',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    label: 'Lab Tech',
    email: 'lab@citygeneralhospital.com',
    password: 'Staff@2024!',
    description: 'Mike Wilson - Lab tests & reports',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    label: 'Pharmacist',
    email: 'pharmacy@citygeneralhospital.com',
    password: 'Staff@2024!',
    description: 'Lisa Brown - Medicine dispensing',
    color: 'bg-pink-100 text-pink-700',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login(email, password);
    if (success) {
      const { user } = useAuthStore.getState();
      if (isSuperAdmin(user)) {
        router.push('/superadmin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleQuickLogin = async (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    clearError();

    const success = await login(cred.email, cred.password);
    if (success) {
      const { user } = useAuthStore.getState();
      if (isSuperAdmin(user)) {
        router.push('/superadmin');
      } else {
        router.push('/dashboard');
      }
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
// Build version: 2.0.0 - Updated with 7 staff demo credentials
// Last update: 2025-11-30T14:25:00Z
