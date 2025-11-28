'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Shield, Database, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SystemSettings {
  systemName: string;
  supportEmail: string;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
}

const defaultSettings: SystemSettings = {
  systemName: 'Hospital SaaS',
  supportEmail: 'support@novoraplus.com',
  emailNotifications: true,
  whatsappNotifications: false,
  twoFactorAuth: false,
  sessionTimeout: 30,
  smtpHost: '',
  smtpPort: 587,
  smtpUsername: '',
  smtpPassword: '',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('systemSettings', JSON.stringify(settings));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">System-wide configuration</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
            <CardDescription>Configure basic system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>System Name</Label>
                <Input
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                />
              </div>
              <div>
                <Label>Support Email</Label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Send email alerts for important events</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">WhatsApp Notifications</p>
                <p className="text-sm text-gray-500">Send WhatsApp messages to patients</p>
              </div>
              <Switch
                checked={settings.whatsappNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, whatsappNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Security and access settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout (minutes)</p>
                <p className="text-sm text-gray-500">Auto logout after inactivity</p>
              </div>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })}
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>SMTP settings for sending emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SMTP Host</Label>
                <Input
                  placeholder="smtp.example.com"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                />
              </div>
              <div>
                <Label>SMTP Port</Label>
                <Input
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })}
                />
              </div>
              <div>
                <Label>SMTP Username</Label>
                <Input
                  placeholder="username"
                  value={settings.smtpUsername}
                  onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                />
              </div>
              <div>
                <Label>SMTP Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
