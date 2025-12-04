'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, isSuperAdmin, getUserRole } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Building2,
  Users,
  Stethoscope,
  FlaskConical,
  Pill,
  Bed,
  Receipt,
  Package,
  Settings,
  LogOut,
  LayoutDashboard,
  UserCircle,
  Menu,
  FolderKanban,
  BedDouble,
  UserCog,
  ChevronDown,
  ScanLine,
  Database,
  Calendar,
  FileText,
  DollarSign,
  UserPlus,
  Thermometer,
  Camera,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const superAdminNav = [
  { name: 'Dashboard', href: '/superadmin', icon: LayoutDashboard },
  { name: 'Hospitals', href: '/superadmin/hospitals', icon: Building2 },
  { name: 'Users', href: '/superadmin/users', icon: Users },
  { name: 'Settings', href: '/superadmin/settings', icon: Settings },
];

const hospitalAdminNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'OPD', href: '/opd', icon: Stethoscope },
  { name: 'IPD', href: '/ipd', icon: Bed },
  { name: 'Lab', href: '/lab', icon: FlaskConical },
  { name: 'Radiology', href: '/radiology', icon: ScanLine },
  { name: 'Pharmacy', href: '/pharmacy', icon: Pill },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Billing', href: '/billing', icon: Receipt },
];

const doctorNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'OPD Queue', href: '/opd', icon: Stethoscope },
  { name: 'My Patients', href: '/patients', icon: Users },
  { name: 'IPD Rounds', href: '/ipd', icon: Bed },
  { name: 'Lab Orders', href: '/lab', icon: FlaskConical },
  { name: 'Radiology', href: '/radiology', icon: ScanLine },
  { name: 'Prescriptions', href: '/pharmacy', icon: Pill },
];

const nurseNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'IPD Patients', href: '/ipd', icon: Bed },
  { name: 'Vitals', href: '/ipd', icon: Thermometer },
  { name: 'Medications', href: '/pharmacy', icon: Pill },
  { name: 'Patient Records', href: '/patients', icon: Users },
  { name: 'Lab Tests', href: '/lab', icon: FlaskConical },
];

const receptionistNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'OPD Queue', href: '/opd', icon: Calendar },
  { name: 'Appointments', href: '/opd', icon: Stethoscope },
  { name: 'Billing', href: '/billing', icon: Receipt },
];

const labTechnicianNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lab Tests', href: '/lab', icon: FlaskConical },
  { name: 'Test Results', href: '/lab', icon: FileText },
  { name: 'Patients', href: '/patients', icon: Users },
];

const pharmacistNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Prescriptions', href: '/pharmacy', icon: Pill },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Medicine Stock', href: '/inventory', icon: Database },
  { name: 'Billing', href: '/billing', icon: DollarSign },
];

const radiologyTechnicianNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Radiology', href: '/radiology', icon: ScanLine },
  { name: 'Scans Queue', href: '/radiology', icon: Camera },
  { name: 'Reports', href: '/radiology', icon: FileText },
  { name: 'Patients', href: '/patients', icon: Users },
];

const billingNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Billing', href: '/billing', icon: Receipt },
  { name: 'Invoices', href: '/billing', icon: FileText },
  { name: 'Patients', href: '/patients', icon: Users },
];

const accountantNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Billing', href: '/billing', icon: Receipt },
  { name: 'Reports', href: '/billing', icon: FileText },
];

const hrManagerNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Staff', href: '/staff', icon: UserCog },
  { name: 'Departments', href: '/departments', icon: FolderKanban },
];

const medicalRecordsNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Records', href: '/patients', icon: FileText },
];

const inventoryManagerNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Pharmacy', href: '/pharmacy', icon: Pill },
];

const dietitianNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'IPD Patients', href: '/ipd', icon: Bed },
  { name: 'Patients', href: '/patients', icon: Users },
];

const physiotherapistNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'IPD Patients', href: '/ipd', icon: Bed },
  { name: 'Patients', href: '/patients', icon: Users },
];

const settingsNav = [
  { name: 'Departments', href: '/departments', icon: FolderKanban },
  { name: 'Beds', href: '/beds', icon: BedDouble },
  { name: 'Staff', href: '/staff', icon: UserCog },
  { name: 'Master Data', href: '/master-data', icon: Database },
];

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Determine navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    const role = getUserRole(user);

    switch (role) {
      case 'SuperAdmin':
      case 'Administrator':
        return superAdminNav;
      case 'Hospital Admin':
      case 'HospitalAdmin':
        return hospitalAdminNav;
      case 'Doctor':
        return doctorNav;
      case 'Nurse':
        return nurseNav;
      case 'Receptionist':
        return receptionistNav;
      case 'Lab Technician':
      case 'LabTechnician':
        return labTechnicianNav;
      case 'Pharmacist':
        return pharmacistNav;
      case 'Radiology Technician':
      case 'RadiologyTechnician':
      case 'Radiologist':
        return radiologyTechnicianNav;
      case 'Billing':
        return billingNav;
      case 'Accountant':
        return accountantNav;
      case 'HR Manager':
      case 'HRManager':
        return hrManagerNav;
      case 'Medical Records':
      case 'MedicalRecords':
        return medicalRecordsNav;
      case 'Inventory Manager':
      case 'InventoryManager':
        return inventoryManagerNav;
      case 'Dietitian':
        return dietitianNav;
      case 'Physiotherapist':
        return physiotherapistNav;
      default:
        return hospitalAdminNav; // fallback
    }
  };

  const navItems = getNavItems();
  const userRole = getUserRole(user);
  const showSettings = !isSuperAdmin(user) && (userRole === 'Hospital Admin' || userRole === 'HospitalAdmin');

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/superadmin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Hamburger and Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile menu button - Only show on mobile */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <Link
                href={isSuperAdmin(user) ? '/superadmin' : '/dashboard'}
                className="flex-shrink-0 flex items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://novoraplus.com/images/logo.png"
                  alt="NovoraPlus"
                  className="h-7 w-auto sm:h-8"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Settings Dropdown for Hospital Admin Only */}
              {showSettings && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        settingsNav.some((s) => isActive(s.href))
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Settings className="w-4 h-4 mr-1.5" />
                      Settings
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {settingsNav.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link href={item.href} className="cursor-pointer">
                            <Icon className="w-4 h-4 mr-2" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Right side - User Menu */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                        {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 font-medium">{getUserRole(user)}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {showSettings && (
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar - Slides in from left */}
      {/* Backdrop/Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <Link
            href={isSuperAdmin(user) ? '/superadmin' : '/dashboard'}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://novoraplus.com/images/logo.png"
              alt="NovoraPlus"
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info Section */}
        <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-white">
              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              <p className="text-xs text-blue-600 font-medium mt-0.5">{getUserRole(user)}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col px-3 py-4 overflow-y-auto h-[calc(100vh-180px)]">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Settings Section for Hospital Admin Only */}
            {showSettings && (
              <>
                <div className="border-t border-gray-200 my-3 pt-3">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Settings
                  </p>
                </div>
                {settingsNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer - Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-3 bg-gray-50 border-t border-gray-200">
          <div className="space-y-1">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
