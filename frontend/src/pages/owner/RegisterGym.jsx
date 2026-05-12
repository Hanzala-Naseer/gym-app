// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Building2, Clock, ArrowRight } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import OwnerLayout from "@/components/layouts/OwnerLayout";
// import { useAuth } from "@/contexts/AuthContext";

// export default function RegisterGym() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { token } = useAuth();

//   const [isLoading, setIsLoading] = useState(false);
//   const [coverImage, setCoverImage] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     addressLine: "",
//     city: "",
//     latitude: "",
//     longitude: "",
//     tier: "",
//     openingTime: "",
//     closingTime: "",
//     is24Hours: false,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const body = new FormData();

//       body.append("name", formData.name);
//       body.append("addressLine", formData.addressLine);
//       body.append("city", formData.city);
//       body.append("latitude", formData.latitude);
//       body.append("longitude", formData.longitude);
//       body.append("tier", formData.tier);

//       body.append("openingTime", formData.openingTime || "");
//       body.append("closingTime", formData.closingTime || "");
//       body.append("is24Hours", formData.is24Hours);

//       if (coverImage) {
//         body.append("coverImage", coverImage);
//       }

//       const res = await fetch(`${import.meta.env.VITE_API_URL}/gyms/register`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Gym registration failed");
//       }

//       toast({
//         title: "Gym registered!",
//         description: "Your gym is pending admin approval.",
//       });

//       navigate("/dashboard/owner/my-gym");
//     } catch (err) {
//       toast({
//         title: "Registration failed",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <OwnerLayout>
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Register Your Gym</h1>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* BASIC INFO */}
//           <Section icon={Building2} title="Basic Information">
//             <Field label="Gym Name">
//               <Input
//                 required
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//               />
//             </Field>

//             <Field label="Address">
//               <Input
//                 required
//                 value={formData.addressLine}
//                 onChange={(e) =>
//                   setFormData({ ...formData, addressLine: e.target.value })
//                 }
//               />
//             </Field>

//             <Field label="City">
//               <Input
//                 required
//                 value={formData.city}
//                 onChange={(e) =>
//                   setFormData({ ...formData, city: e.target.value })
//                 }
//               />
//             </Field>

//             <div className="grid grid-cols-2 gap-4">
//               <Field label="Latitude">
//                 <Input
//                   type="number"
//                   step="any"
//                   required
//                   value={formData.latitude}
//                   onChange={(e) =>
//                     setFormData({ ...formData, latitude: e.target.value })
//                   }
//                 />
//               </Field>

//               <Field label="Longitude">
//                 <Input
//                   type="number"
//                   step="any"
//                   required
//                   value={formData.longitude}
//                   onChange={(e) =>
//                     setFormData({ ...formData, longitude: e.target.value })
//                   }
//                 />
//               </Field>
//             </div>

//             <Field label="Tier (1 / 2 / 3)">
//               <Input
//                 type="number"
//                 min="1"
//                 max="3"
//                 required
//                 value={formData.tier}
//                 onChange={(e) =>
//                   setFormData({ ...formData, tier: e.target.value })
//                 }
//               />
//             </Field>

//             <Field label="Cover Image">
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setCoverImage(e.target.files[0])}
//               />
//             </Field>
//           </Section>

//           {/* OPERATING HOURS */}
//           <Section icon={Clock} title="Operating Hours">
//             <div className="grid grid-cols-2 gap-4">
//               <Field label="Opening Time">
//                 <Input
//                   type="time"
//                   disabled={formData.is24Hours}
//                   value={formData.openingTime}
//                   onChange={(e) =>
//                     setFormData({ ...formData, openingTime: e.target.value })
//                   }
//                 />
//               </Field>

//               <Field label="Closing Time">
//                 <Input
//                   type="time"
//                   disabled={formData.is24Hours}
//                   value={formData.closingTime}
//                   onChange={(e) =>
//                     setFormData({ ...formData, closingTime: e.target.value })
//                   }
//                 />
//               </Field>
//             </div>

//             <label className="flex items-center gap-2 mt-2">
//               <input
//                 type="checkbox"
//                 checked={formData.is24Hours}
//                 onChange={(e) =>
//                   setFormData({ ...formData, is24Hours: e.target.checked })
//                 }
//               />
//               Open 24 Hours
//             </label>
//           </Section>

//           <Button
//             type="submit"
//             className="w-full gradient-hero py-6 text-lg"
//             disabled={isLoading}
//           >
//             {isLoading ? "Registering..." : "Register Gym"}
//             <ArrowRight className="ml-2 w-5 h-5" />
//           </Button>
//         </form>
//       </div>
//     </OwnerLayout>
//   );
// }

// /* ---------- UI helpers ---------- */

// function Section({ icon: Icon, title, children }) {
//   return (
//     <div className="bg-card p-6 rounded-2xl shadow-card space-y-4">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
//           <Icon className="w-5 h-5 text-primary-foreground" />
//         </div>
//         <h2 className="text-lg font-semibold">{title}</h2>
//       </div>
//       {children}
//     </div>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <div className="space-y-2">
//       <Label>{label}</Label>
//       {children}
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Clock,
  MapPin,
  Phone,
  FileText,
  ArrowRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { gymService } from "@/services/gymService";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterGym() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateGymId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // ── File state ──────────────────────────────────────────────────────────────
  const [coverImage, setCoverImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [ownerCnic, setOwnerCnic] = useState(null);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [ownershipProof, setOwnershipProof] = useState(null);
  const [utilityBill, setUtilityBill] = useState(null);

  // ── Form fields ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    description: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    phoneNumber: "",
    whatsappNumber: "",
    instagramHandle: "",
    websiteUrl: "",
    googleMapsLink: "",
    cnicNumber: "",
    businessName: "",
    openingTime: "",
    closingTime: "",
    is24Hours: false,
    tier: "1",
  });

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setCheck = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.checked }));

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.addressLine ||
      !form.city ||
      !form.latitude ||
      !form.longitude ||
      !form.tier
    ) {
      toast({ title: "Missing required fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const body = new FormData();

      // Required fields
      body.append("name", form.name);
      body.append("addressLine", form.addressLine);
      body.append("city", form.city);
      body.append("latitude", form.latitude);
      body.append("longitude", form.longitude);
      body.append("tier", form.tier);

      // Optional text fields
      if (form.description) body.append("description", form.description);
      if (form.province) body.append("province", form.province);
      if (form.postalCode) body.append("postalCode", form.postalCode);
      if (form.phoneNumber) body.append("phoneNumber", form.phoneNumber);
      if (form.whatsappNumber)
        body.append("whatsappNumber", form.whatsappNumber);
      if (form.instagramHandle)
        body.append("instagramHandle", form.instagramHandle);
      if (form.websiteUrl) body.append("websiteUrl", form.websiteUrl);
      if (form.googleMapsLink)
        body.append("googleMapsLink", form.googleMapsLink);
      if (form.cnicNumber) body.append("cnicNumber", form.cnicNumber);
      if (form.businessName) body.append("businessName", form.businessName);
      if (form.openingTime) body.append("openingTime", form.openingTime);
      if (form.closingTime) body.append("closingTime", form.closingTime);
      body.append("is24Hours", form.is24Hours ? "true" : "false");

      // Files
      if (coverImage) body.append("coverImage", coverImage);
      if (ownerCnic) body.append("ownerCnic", ownerCnic);
      if (businessLicense) body.append("businessLicense", businessLicense);
      if (ownershipProof) body.append("ownershipProof", ownershipProof);
      if (utilityBill) body.append("utilityBill", utilityBill);
      photos.forEach((p) => body.append("photos", p));

      const data = await gymService.registerGym(body);

      if (!data.success) throw new Error(data.message || "Registration failed");

      // Save the new gym's id into AuthContext so other pages can use it
      if (data.gym?.id) updateGymId(data.gym.id);

      toast({
        title: "Gym registered!",
        description: "Your gym is pending admin approval.",
      });

      navigate("/dashboard/owner/my-gym");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Register Your Gym
          </h1>
          <p className="text-muted-foreground">
            Fill in the details to register your gym on GymKey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── BASIC INFORMATION ── */}
          <Section icon={Building2} title="Basic Information">
            <Field label="Gym Name *">
              <Input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="FitZone Gym"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={3}
                placeholder="Tell members what makes your gym special…"
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Field>

            <Field label="Business Name (if registered)">
              <Input
                value={form.businessName}
                onChange={set("businessName")}
                placeholder="FitZone Pvt Ltd"
              />
            </Field>

            <Field label="Tier *">
              <select
                required
                value={form.tier}
                onChange={set("tier")}
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="1">Tier 1 — Basic</option>
                <option value="2">Tier 2 — Standard</option>
                <option value="3">Tier 3 — Premium</option>
              </select>
            </Field>
          </Section>

          {/* ── LOCATION ── */}
          <Section icon={MapPin} title="Location">
            <Field label="Address *">
              <Input
                required
                value={form.addressLine}
                onChange={set("addressLine")}
                placeholder="123 Fitness Street"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="City *">
                <Input
                  required
                  value={form.city}
                  onChange={set("city")}
                  placeholder="Lahore"
                />
              </Field>
              <Field label="Province">
                <Input
                  value={form.province}
                  onChange={set("province")}
                  placeholder="Punjab"
                />
              </Field>
            </div>

            <Field label="Postal Code">
              <Input
                value={form.postalCode}
                onChange={set("postalCode")}
                placeholder="54000"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Latitude *">
                <Input
                  required
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={set("latitude")}
                  placeholder="31.5204"
                />
              </Field>
              <Field label="Longitude *">
                <Input
                  required
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={set("longitude")}
                  placeholder="74.3587"
                />
              </Field>
            </div>

            <Field label="Google Maps Link">
              <Input
                value={form.googleMapsLink}
                onChange={set("googleMapsLink")}
                placeholder="https://maps.google.com/…"
              />
            </Field>
          </Section>

          {/* ── CONTACT ── */}
          <Section icon={Phone} title="Contact Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone Number">
                <Input
                  value={form.phoneNumber}
                  onChange={set("phoneNumber")}
                  placeholder="+92 300 0000000"
                />
              </Field>
              <Field label="WhatsApp Number">
                <Input
                  value={form.whatsappNumber}
                  onChange={set("whatsappNumber")}
                  placeholder="+92 300 0000000"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Instagram Handle">
                <Input
                  value={form.instagramHandle}
                  onChange={set("instagramHandle")}
                  placeholder="@fitzonegym"
                />
              </Field>
              <Field label="Website URL">
                <Input
                  value={form.websiteUrl}
                  onChange={set("websiteUrl")}
                  placeholder="https://fitzone.pk"
                />
              </Field>
            </div>
          </Section>

          {/* ── OPERATING HOURS ── */}
          <Section icon={Clock} title="Operating Hours">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Opening Time">
                <Input
                  type="time"
                  disabled={form.is24Hours}
                  value={form.openingTime}
                  onChange={set("openingTime")}
                />
              </Field>
              <Field label="Closing Time">
                <Input
                  type="time"
                  disabled={form.is24Hours}
                  value={form.closingTime}
                  onChange={set("closingTime")}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded"
                checked={form.is24Hours}
                onChange={setCheck("is24Hours")}
              />
              <span className="text-sm font-medium">Open 24 Hours</span>
            </label>
          </Section>

          {/* ── IMAGES ── */}
          <Section icon={Globe} title="Photos">
            <Field label="Cover Image">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Main image shown in listings.
              </p>
            </Field>

            <Field label="Gallery Photos (up to 5)">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setPhotos(Array.from(e.target.files).slice(0, 5))
                }
              />
            </Field>
          </Section>

          {/* ── VERIFICATION DOCUMENTS ── */}
          <Section icon={FileText} title="Verification Documents">
            <p className="text-sm text-muted-foreground -mt-2">
              Upload documents so our team can verify your gym. At least one is
              recommended.
            </p>

            <Field label="Owner CNIC (front)">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setOwnerCnic(e.target.files[0])}
              />
            </Field>

            <Field label="Business License">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setBusinessLicense(e.target.files[0])}
              />
            </Field>

            <Field label="Ownership Proof">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setOwnershipProof(e.target.files[0])}
              />
            </Field>

            <Field label="Utility Bill">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setUtilityBill(e.target.files[0])}
              />
            </Field>
          </Section>

          {/* ── CNIC NUMBER ── */}
          <Section icon={FileText} title="Identity">
            <Field label="Owner CNIC Number">
              <Input
                value={form.cnicNumber}
                onChange={set("cnicNumber")}
                placeholder="12345-1234567-1"
                maxLength={15}
              />
            </Field>
          </Section>

          <Button
            type="submit"
            className="w-full gradient-hero text-primary-foreground py-6 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Registering…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Register Gym
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </OwnerLayout>
  );
}

/* ── UI helpers ── */

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-card space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
