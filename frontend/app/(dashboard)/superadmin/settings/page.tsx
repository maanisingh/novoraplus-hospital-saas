'use client';

import { useState, useEffect } from 'react';
import { SuperAdminSettings, getItems, updateItemRecord, createItemRecord } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, Settings, CreditCard, MessageSquare, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    platformName: 'Hospital SaaS',
    platformLogo: '',
    supportEmail: '',
    supportPhone: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpFromEmail: '',
    smtpFromName: '',
    paymentGateway: 'razorpay',
    paymentApiKey: '',
    paymentSecretKey: '',
    currency: 'USD',
    taxRate: 0,
    trialDays: 14,
    maintenanceMode: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const result = await getItems<SuperAdminSettings>('superadmin_settings', { limit: 1 });

    if (result.success && result.data && result.data.length > 0) {
      const s = result.data[0];
      setSettingsId(s.id);
      setFormData({
        platformName: s.platformName || 'Hospital SaaS',
        platformLogo: s.platformLogo || '',
        supportEmail: s.supportEmail || '',
        supportPhone: s.supportPhone || '',
        smtpHost: s.smtpHost || '',
        smtpPort: s.smtpPort || 587,
        smtpUser: s.smtpUser || '',
        smtpPassword: s.smtpPassword || '',
        smtpFromEmail: s.smtpFromEmail || '',
        smtpFromName: s.smtpFromName || '',
        paymentGateway: s.paymentGateway || 'razorpay',
        paymentApiKey: s.paymentApiKey || '',
        paymentSecretKey: s.paymentSecretKey || '',
        currency: s.currency || 'USD',
        taxRate: s.taxRate || 0,
        trialDays: s.trialDays || 14,
        maintenanceMode: s.maintenanceMode || false,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const result = settingsId
      ? await updateItemRecord<SuperAdminSettings>('superadmin_settings', settingsId, formData)
      : await createItemRecord<SuperAdminSettings>('superadmin_settings', formData);

    if (result.success) {
      toast.success('Settings saved successfully');
      loadSettings();
    } else {
      toast.error('Failed to save settings: ' + result.error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform-wide settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save All'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">
            <Settings className="mr-2 h-4 w-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="email">
            <MessageSquare className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Globe className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Basic Settings Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure basic platform information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={formData.platformName}
                    onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                    placeholder="Hospital SaaS"
                  />
                </div>
                <div>
                  <Label htmlFor="platformLogo">Platform Logo URL</Label>
                  <Input
                    id="platformLogo"
                    value={formData.platformLogo}
                    onChange={(e) => setFormData({ ...formData, platformLogo: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    placeholder="support@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={formData.supportPhone}
                    onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onCheckedChange={(checked) => setFormData({ ...formData, maintenanceMode: checked })}
                />
                <Label htmlFor="maintenanceMode" className="cursor-pointer">
                  Enable Maintenance Mode
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email settings for notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={formData.smtpHost}
                    onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={formData.smtpPort}
                    onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) })}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={formData.smtpUser}
                    onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={formData.smtpPassword}
                    onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpFromEmail">From Email</Label>
                  <Input
                    id="smtpFromEmail"
                    type="email"
                    value={formData.smtpFromEmail}
                    onChange={(e) => setFormData({ ...formData, smtpFromEmail: e.target.value })}
                    placeholder="noreply@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpFromName">From Name</Label>
                  <Input
                    id="smtpFromName"
                    value={formData.smtpFromName}
                    onChange={(e) => setFormData({ ...formData, smtpFromName: e.target.value })}
                    placeholder="Hospital SaaS"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway</CardTitle>
              <CardDescription>Configure payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="paymentGateway">Payment Gateway</Label>
                <Select
                  value={formData.paymentGateway}
                  onValueChange={(value) => setFormData({ ...formData, paymentGateway: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentApiKey">API Key / Public Key</Label>
                  <Input
                    id="paymentApiKey"
                    value={formData.paymentApiKey}
                    onChange={(e) => setFormData({ ...formData, paymentApiKey: e.target.value })}
                    placeholder="pk_..."
                  />
                </div>
                <div>
                  <Label htmlFor="paymentSecretKey">Secret Key</Label>
                  <Input
                    id="paymentSecretKey"
                    type="password"
                    value={formData.paymentSecretKey}
                    onChange={(e) => setFormData({ ...formData, paymentSecretKey: e.target.value })}
                    placeholder="sk_..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Configuration</CardTitle>
              <CardDescription>Configure billing and subscription settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="trialDays">Trial Days</Label>
                  <Input
                    id="trialDays"
                    type="number"
                    min="0"
                    value={formData.trialDays}
                    onChange={(e) => setFormData({ ...formData, trialDays: parseInt(e.target.value) })}
                    placeholder="14"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
