import { User, Mail, Lock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layouts/AdminLayout';

export default function AdminSettings() {
  const { user } = useAuth();
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div><h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1></div>
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center"><User className="w-5 h-5 text-primary-foreground" /></div><h2 className="text-lg font-semibold text-foreground">Profile Information</h2></div>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" defaultValue={user?.fullName || ''} /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue={user?.email || ''} disabled /></div>
          </div>
        </div>
        <Button className="gradient-hero text-primary-foreground shadow-primary"><Save className="w-5 h-5 mr-2" />Save Changes</Button>
      </div>
    </AdminLayout>
  );
}
