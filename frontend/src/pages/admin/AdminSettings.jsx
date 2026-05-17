// import { useState } from "react";
// import { User, Mail, UserPlus, Eye, EyeOff, Shield } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { adminService } from "@/services/adminService";

// export default function AdminSettings() {
//   const { user } = useAuth();
//   const { toast } = useToast();

//   // ── Register new owner form ───────────────────────────────────────────────
//   const [ownerForm, setOwnerForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [showPw, setShowPw] = useState(false);
//   const [registering, setRegistering] = useState(false);

//   const handleOwnerRegister = async (e) => {
//     e.preventDefault();
//     if (!ownerForm.name || !ownerForm.email || !ownerForm.password) {
//       toast({ title: "All fields required", variant: "destructive" });
//       return;
//     }
//     try {
//       setRegistering(true);
//       const data = await adminService.registerOwner(ownerForm);
//       if (data.success) {
//         toast({
//           title: "Owner registered ✓",
//           description: `${ownerForm.name} can now log in.`,
//         });
//         setOwnerForm({ name: "", email: "", password: "" });
//       }
//     } catch (err) {
//       toast({
//         title: "Registration failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setRegistering(false);
//     }
//   };

//   const displayName = user?.name || user?.fullName || "Admin";

//   return (
//     <AdminLayout>
//       <div className="max-w-2xl mx-auto space-y-8">
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
//           <p className="text-muted-foreground mt-1">
//             Manage your account and register new gym owners.
//           </p>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-card rounded-2xl p-6 shadow-card space-y-5">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
//               <User className="w-5 h-5 text-primary-foreground" />
//             </div>
//             <h2 className="text-base font-semibold">Profile Information</h2>
//           </div>

//           <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40">
//             <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center shrink-0">
//               <span className="text-accent-foreground font-bold text-lg">
//                 {displayName.charAt(0).toUpperCase()}
//               </span>
//             </div>
//             <div>
//               <p className="font-semibold">{displayName}</p>
//               <p className="text-sm text-muted-foreground flex items-center gap-1">
//                 <Mail className="w-3.5 h-3.5" />
//                 {user?.email ?? "—"}
//               </p>
//             </div>
//             <span className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-semibold">
//               <Shield className="w-3.5 h-3.5" />
//               Admin
//             </span>
//           </div>

//           <p className="text-xs text-muted-foreground">
//             Profile editing is not available in this version. Contact your
//             system administrator to update account details.
//           </p>
//         </div>

//         {/* Register Owner Card */}
//         <div className="bg-card rounded-2xl p-6 shadow-card space-y-5">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
//               <UserPlus className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-base font-semibold">Register Gym Owner</h2>
//               <p className="text-xs text-muted-foreground">
//                 Create a new owner account directly.
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleOwnerRegister} className="space-y-4">
//             <div className="space-y-1.5">
//               <Label htmlFor="owner-name">Full Name</Label>
//               <Input
//                 id="owner-name"
//                 value={ownerForm.name}
//                 onChange={(e) =>
//                   setOwnerForm((f) => ({ ...f, name: e.target.value }))
//                 }
//                 placeholder="Jane Smith"
//                 required
//               />
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="owner-email">Email</Label>
//               <Input
//                 id="owner-email"
//                 type="email"
//                 value={ownerForm.email}
//                 onChange={(e) =>
//                   setOwnerForm((f) => ({ ...f, email: e.target.value }))
//                 }
//                 placeholder="jane@gym.com"
//                 required
//               />
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="owner-pw">Temporary Password</Label>
//               <div className="relative">
//                 <Input
//                   id="owner-pw"
//                   type={showPw ? "text" : "password"}
//                   value={ownerForm.password}
//                   onChange={(e) =>
//                     setOwnerForm((f) => ({ ...f, password: e.target.value }))
//                   }
//                   placeholder="••••••••"
//                   className="pr-10"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPw((v) => !v)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   tabIndex={-1}
//                 >
//                   {showPw ? (
//                     <EyeOff className="w-4 h-4" />
//                   ) : (
//                     <Eye className="w-4 h-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="bg-emerald-600 hover:bg-emerald-700 text-white"
//               disabled={registering}
//             >
//               <UserPlus className="w-4 h-4 mr-2" />
//               {registering ? "Registering…" : "Register Owner"}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Key,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";

export default function AdminSettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsAlerts: false,
    darkMode: false,
    language: "en",
    twoFactorAuth: false,
    autoApproveTiers: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const displayName = user?.name || user?.fullName || "Admin";

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // API call to save settings would go here
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: "Settings saved ✓",
        description: "Your preferences have been updated.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: "Could not update settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Minimum 8 characters required.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password updated ✓",
      description: "Your password has been changed successfully.",
    });
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#3E2723]">
            Settings
          </h1>
          <p className="text-[#8D6E63] mt-1">
            Manage your account, security, and system preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D7CCC8] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8D6E63] to-[#5D4037] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-base font-semibold text-[#3E2723]">
              Profile Information
            </h2>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F0EB]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A1887F] to-[#6D4C41] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-[#3E2723]">{displayName}</p>
              <p className="text-sm text-[#8D6E63] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user?.email ?? "—"}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </span>
          </div>
        </div>

        {/* Notifications & Preferences */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D7CCC8] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9800] flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#3E2723]">
                Notifications
              </h2>
              <p className="text-xs text-[#8D6E63]">
                Configure how you receive alerts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F0EB]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#8D6E63]" />
                <div>
                  <p className="text-sm font-medium text-[#3E2723]">
                    Email Notifications
                  </p>
                  <p className="text-xs text-[#8D6E63]">
                    Gym approvals, rejections, reports
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
                className="data-[state=checked]:bg-[#4CAF50]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F0EB]">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#8D6E63]" />
                <div>
                  <p className="text-sm font-medium text-[#3E2723]">
                    SMS Alerts
                  </p>
                  <p className="text-xs text-[#8D6E63]">
                    Critical system alerts
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.smsAlerts}
                onCheckedChange={() => handleToggle("smsAlerts")}
                className="data-[state=checked]:bg-[#4CAF50]"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D7CCC8] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#673AB7] flex items-center justify-center">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-white" />
              ) : (
                <Sun className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#3E2723]">
                Appearance
              </h2>
              <p className="text-xs text-[#8D6E63]">
                Customize your dashboard look.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F0EB]">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon className="w-4 h-4 text-[#8D6E63]" />
                ) : (
                  <Sun className="w-4 h-4 text-[#8D6E63]" />
                )}
                <div>
                  <p className="text-sm font-medium text-[#3E2723]">
                    Dark Mode
                  </p>
                  <p className="text-xs text-[#8D6E63]">Toggle dark theme</p>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle("darkMode")}
                className="data-[state=checked]:bg-[#673AB7]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F0EB]">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#8D6E63]" />
                <div>
                  <p className="text-sm font-medium text-[#3E2723]">Language</p>
                  <p className="text-xs text-[#8D6E63]">Dashboard language</p>
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, language: e.target.value }))
                }
                className="text-sm border border-[#D7CCC8] rounded-lg px-3 py-1.5 bg-white text-[#3E2723] focus:outline-none focus:border-[#8D6E63]"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D7CCC8] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F44336] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#3E2723]">
                Security
              </h2>
              <p className="text-xs text-[#8D6E63]">
                Password and authentication.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F0EB]">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-[#8D6E63]" />
                <div>
                  <p className="text-sm font-medium text-[#3E2723]">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-[#8D6E63]">Require OTP on login</p>
                </div>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={() => handleToggle("twoFactorAuth")}
                className="data-[state=checked]:bg-[#4CAF50]"
              />
            </div>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
              <p className="text-sm font-medium text-[#3E2723]">
                Change Password
              </p>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#8D6E63]">
                  Current Password
                </Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="border-[#D7CCC8] focus:border-[#8D6E63]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#8D6E63]">New Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((f) => ({
                        ...f,
                        newPassword: e.target.value,
                      }))
                    }
                    className="border-[#D7CCC8] focus:border-[#8D6E63]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#8D6E63]">Confirm</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((f) => ({
                        ...f,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="border-[#D7CCC8] focus:border-[#8D6E63]"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="outline"
                className="border-[#8D6E63] text-[#3E2723] hover:bg-[#F5F0EB]"
              >
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </form>
          </div>
        </div>

        {/* Admin Preferences */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D7CCC8] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2196F3] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#3E2723]">
                Admin Preferences
              </h2>
              <p className="text-xs text-[#8D6E63]">
                System-wide automation settings.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F0EB]">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#8D6E63]" />
              <div>
                <p className="text-sm font-medium text-[#3E2723]">
                  Auto-Approve Standard Tiers
                </p>
                <p className="text-xs text-[#8D6E63]">
                  Skip manual review for Tier 1 gyms
                </p>
              </div>
            </div>
            <Switch
              checked={settings.autoApproveTiers}
              onCheckedChange={() => handleToggle("autoApproveTiers")}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-[#4CAF50] hover:bg-[#388E3C] text-white px-6"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
