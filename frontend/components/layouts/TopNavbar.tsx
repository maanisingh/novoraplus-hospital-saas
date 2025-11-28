'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, isSuperAdmin } from '@/lib/auth-store';
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
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const superAdminNav = [
  { name: 'Dashboard', href: '/superadmin', icon: LayoutDashboard },
  { name: 'Hospitals', href: '/superadmin/hospitals', icon: Building2 },
  { name: 'Users', href: '/superadmin/users', icon: Users },
  { name: 'Settings', href: '/superadmin/settings', icon: Settings },
];

const hospitalNav = [
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
    router.push('/login');
  };

  const navItems = isSuperAdmin(user) ? superAdminNav : hospitalNav;

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/superadmin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Nav Links */}
          <div className="flex">
            {/* Logo */}
            <Link href={isSuperAdmin(user) ? '/superadmin' : '/dashboard'} className="flex-shrink-0 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://novoraplus.com/images/logo.png"
                alt="NovoraPlus"
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
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

              {/* Settings Dropdown for Hospital Users */}
              {!isSuperAdmin(user) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
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
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
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
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col space-y-1 mt-6">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}

                  {/* Settings Section for Hospital Users */}
                  {!isSuperAdmin(user) && (
                    <>
                      <div className="border-t border-gray-200 my-2 pt-2">
                        <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">
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
                            className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                              isActive(item.href)
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
