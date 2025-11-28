'use client';

import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, Key } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="text-2xl bg-blue-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
              <Button variant="outline" className="mt-4">
                Change Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" defaultValue={user?.first_name || ''} />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" defaultValue={user?.last_name || ''} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Update Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" type="password" />
              </div>
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input id="confirm_password" type="password" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
