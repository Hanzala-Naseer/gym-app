// import { User, Mail, Lock, Save } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useAuth } from '@/contexts/AuthContext';
// import AdminLayout from '@/components/layouts/AdminLayout';

// export default function AdminSettings() {
//   const { user } = useAuth();
//   return (
//     <AdminLayout>
//       <div className="max-w-2xl mx-auto space-y-8">
//         <div><h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1></div>
//         <div className="bg-card rounded-2xl p-6 shadow-card">
//           <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center"><User className="w-5 h-5 text-primary-foreground" /></div><h2 className="text-lg font-semibold text-foreground">Profile Information</h2></div>
//           <div className="space-y-4">
//             <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" defaultValue={user?.fullName || ''} /></div>
//             <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue={user?.email || ''} disabled /></div>
//           </div>
//         </div>
//         <Button className="gradient-hero text-primary-foreground shadow-primary"><Save className="w-5 h-5 mr-2" />Save Changes</Button>
//       </div>
//     </AdminLayout>
//   );
// }

import { useState } from "react";
import { User, Mail, UserPlus, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminService } from "@/services/adminService";

export default function AdminSettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  // ── Register new owner form ───────────────────────────────────────────────
  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleOwnerRegister = async (e) => {
    e.preventDefault();
    if (!ownerForm.name || !ownerForm.email || !ownerForm.password) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    try {
      setRegistering(true);
      const data = await adminService.registerOwner(ownerForm);
      if (data.success) {
        toast({
          title: "Owner registered ✓",
          description: `${ownerForm.name} can now log in.`,
        });
        setOwnerForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const displayName = user?.name || user?.fullName || "Admin";

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and register new gym owners.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 shadow-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-base font-semibold">Profile Information</h2>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center shrink-0">
              <span className="text-accent-foreground font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold">{displayName}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user?.email ?? "—"}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Profile editing is not available in this version. Contact your
            system administrator to update account details.
          </p>
        </div>

        {/* Register Owner Card */}
        <div className="bg-card rounded-2xl p-6 shadow-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Register Gym Owner</h2>
              <p className="text-xs text-muted-foreground">
                Create a new owner account directly.
              </p>
            </div>
          </div>

          <form onSubmit={handleOwnerRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="owner-name">Full Name</Label>
              <Input
                id="owner-name"
                value={ownerForm.name}
                onChange={(e) =>
                  setOwnerForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Jane Smith"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="owner-email">Email</Label>
              <Input
                id="owner-email"
                type="email"
                value={ownerForm.email}
                onChange={(e) =>
                  setOwnerForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="jane@gym.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="owner-pw">Temporary Password</Label>
              <div className="relative">
                <Input
                  id="owner-pw"
                  type={showPw ? "text" : "password"}
                  value={ownerForm.password}
                  onChange={(e) =>
                    setOwnerForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={registering}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {registering ? "Registering…" : "Register Owner"}
            </Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
