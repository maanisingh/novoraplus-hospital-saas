'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, isSuperAdmin } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Building2,
  Users,
  Stethoscope,
  FlaskConical,
  Pill,
  Bed,
  Receipt,
  Package,
  ArrowRight,
  Check,
  Shield,
  Globe,
  Zap,
  BarChart3,
  Phone,
  Mail,
  ChevronRight,
  Star,
} from 'lucide-react';

// Features for the landing page
const FEATURES = [
  {
    icon: Users,
    title: 'Patient Management',
    description: 'Complete patient records, history tracking, and easy search functionality',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Stethoscope,
    title: 'OPD Management',
    description: 'Token generation, queue management, and doctor consultation tracking',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: Bed,
    title: 'IPD Management',
    description: 'Admission, bed allocation, daily records, and discharge management',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: FlaskConical,
    title: 'Laboratory',
    description: 'Lab test management, sample collection, and digital report generation',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Pill,
    title: 'Pharmacy',
    description: 'Medicine dispensing, prescription management, and inventory tracking',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: Package,
    title: 'Inventory',
    description: 'Stock management, expiry tracking, and automated reorder alerts',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
  },
  {
    icon: Receipt,
    title: 'Billing',
    description: 'Integrated billing, payment gateway, and financial reporting',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Comprehensive dashboards and data-driven insights',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
];

const PRICING_PLANS = [
  {
    name: 'Basic',
    price: '₹4,999',
    period: '/month',
    description: 'Perfect for small clinics',
    features: [
      'Up to 5 users',
      'OPD Management',
      'Patient Records',
      'Basic Billing',
      'Email Support',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹9,999',
    period: '/month',
    description: 'For growing hospitals',
    features: [
      'Up to 25 users',
      'All Basic features',
      'IPD Management',
      'Lab Integration',
      'Pharmacy Module',
      'Inventory Management',
      'Priority Support',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '₹19,999',
    period: '/month',
    description: 'For large hospitals',
    features: [
      'Unlimited users',
      'All Professional features',
      'Multi-branch Support',
      'Custom Integrations',
      'Advanced Analytics',
      'Dedicated Account Manager',
      '24/7 Support',
    ],
    popular: false,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (isSuperAdmin(user)) {
          router.push('/superadmin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setShowLanding(true);
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (!showLanding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://novoraplus.com/images/logo.png"
                alt="NovoraPlus"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Star className="w-3 h-3 mr-1" />
              #1 Hospital Management Software in India
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Complete Hospital
              <br />
              <span className="text-blue-600">Management System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A comprehensive SaaS solution for clinics, hospitals, and healthcare providers.
              Manage patients, appointments, billing, inventory, and more from a single platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  See Features
                </Button>
              </a>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16">
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-30" />
              <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-500 w-64 text-center">
                      hospital.novoraplus.com/dashboard
                    </div>
                  </div>
                </div>
                {/* Dashboard Preview Image */}
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">1,245</p>
                          <p className="text-xs text-gray-500">Total Patients</p>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">48</p>
                          <p className="text-xs text-gray-500">OPD Today</p>
                        </div>
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Stethoscope className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">12</p>
                          <p className="text-xs text-gray-500">IPD Admissions</p>
                        </div>
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Bed className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">₹85K</p>
                          <p className="text-xs text-gray-500">Revenue Today</p>
                        </div>
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <Receipt className="w-5 h-5 text-amber-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm border h-40">
                      <p className="text-sm font-medium text-gray-700 mb-2">Patient Visits - Last 7 Days</p>
                      <div className="flex items-end justify-between h-24 gap-2 px-4">
                        {[35, 52, 45, 68, 58, 72, 48].map((h, i) => (
                          <div key={i} className="w-8 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border h-40">
                      <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions</p>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 bg-blue-50 rounded text-xs text-blue-700">
                          <Users className="w-3 h-3 mr-2" /> New Patient
                        </div>
                        <div className="flex items-center p-2 bg-green-50 rounded text-xs text-green-700">
                          <Stethoscope className="w-3 h-3 mr-2" /> OPD Token
                        </div>
                        <div className="flex items-center p-2 bg-purple-50 rounded text-xs text-purple-700">
                          <Bed className="w-3 h-3 mr-2" /> IPD Admission
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-50 to-blue-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-2 bg-green-100 text-green-700">Try It Now</Badge>
            <h2 className="text-2xl font-bold text-gray-900">Demo Credentials</h2>
            <p className="text-gray-600 mt-1">Use these credentials to explore the full platform</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Hospital Admin</h3>
                    <p className="text-sm text-gray-500">Full hospital management access</p>
                  </div>
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email:</span>
                    <code className="bg-white px-3 py-1 rounded text-sm font-mono">admin@hospital.com</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Password:</span>
                    <code className="bg-white px-3 py-1 rounded text-sm font-mono">demo123</code>
                  </div>
                </div>
                <Link href="/login" className="mt-4 block">
                  <Button className="w-full">
                    Login as Hospital Admin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Super Admin</h3>
                    <p className="text-sm text-gray-500">Multi-hospital management</p>
                  </div>
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email:</span>
                    <code className="bg-white px-3 py-1 rounded text-sm font-mono">superadmin@novoraplus.com</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Password:</span>
                    <code className="bg-white px-3 py-1 rounded text-sm font-mono">super123</code>
                  </div>
                </div>
                <Link href="/login" className="mt-4 block">
                  <Button variant="outline" className="w-full">
                    Login as Super Admin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-400">Hospitals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-gray-400">Patients Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-gray-400">Daily Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Hospital
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From patient registration to billing, our comprehensive suite of tools
              streamlines every aspect of hospital management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">
                HIPAA compliant with enterprise-grade security. Your data is encrypted and protected.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Anywhere</h3>
              <p className="text-gray-600">
                Cloud-based solution accessible from any device. Work from clinic, home, or on the go.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Optimized for speed. Handle thousands of patients without any slowdown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your hospital. All plans include free setup and training.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-gray-500 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Get Started
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of hospitals already using NovoraPlus to streamline their operations.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://novoraplus.com/images/logo.png"
                alt="NovoraPlus"
                className="h-8 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400">
                Complete Hospital Management System for modern healthcare providers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +91 99999 99999
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  support@novoraplus.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NovoraPlus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
