// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Building2, MapPin, Clock, Image, ArrowRight } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import OwnerLayout from "@/components/layouts/OwnerLayout";
// import { useAuth } from "@/contexts/AuthContext";

// const daysOfWeek = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// export default function RegisterGym() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { token } = useAuth();

//   const [isLoading, setIsLoading] = useState(false);
//   const [coverImage, setCoverImage] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     city: "",
//     latitude: "",
//     longitude: "",
//     tier: "",
//     operatingHours: {},
//   });

//   const updateHours = (day, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       operatingHours: {
//         ...prev.operatingHours,
//         [day]: value,
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const body = new FormData();
//       body.append("name", formData.name);
//       body.append("address", formData.address);
//       body.append("city", formData.city);
//       body.append("tier", Number(formData.tier));
//       body.append("latitude", Number(formData.latitude));
//       body.append("longitude", Number(formData.longitude));
//       body.append("operatingHours", JSON.stringify(formData.operatingHours));

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
//                 value={formData.address}
//                 onChange={(e) =>
//                   setFormData({ ...formData, address: e.target.value })
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
//             {daysOfWeek.map((day) => (
//               <div key={day} className="flex gap-4 items-center">
//                 <span className="w-24">{day}</span>
//                 <Input
//                   placeholder="6:00 AM - 10:00 PM"
//                   onChange={(e) => updateHours(day, e.target.value)}
//                 />
//               </div>
//             ))}
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

// /* ---------- Small UI helpers ---------- */

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
import { Building2, Clock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterGym() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    addressLine: "",
    city: "",
    latitude: "",
    longitude: "",
    tier: "",
    openingTime: "",
    closingTime: "",
    is24Hours: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = new FormData();

      body.append("name", formData.name);
      body.append("addressLine", formData.addressLine);
      body.append("city", formData.city);
      body.append("latitude", formData.latitude);
      body.append("longitude", formData.longitude);
      body.append("tier", formData.tier);

      body.append("openingTime", formData.openingTime || "");
      body.append("closingTime", formData.closingTime || "");
      body.append("is24Hours", formData.is24Hours);

      if (coverImage) {
        body.append("coverImage", coverImage);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/gyms/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gym registration failed");
      }

      toast({
        title: "Gym registered!",
        description: "Your gym is pending admin approval.",
      });

      navigate("/dashboard/owner/my-gym");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Register Your Gym</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <Section icon={Building2} title="Basic Information">
            <Field label="Gym Name">
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Field>

            <Field label="Address">
              <Input
                required
                value={formData.addressLine}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine: e.target.value })
                }
              />
            </Field>

            <Field label="City">
              <Input
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude">
                <Input
                  type="number"
                  step="any"
                  required
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                />
              </Field>

              <Field label="Longitude">
                <Input
                  type="number"
                  step="any"
                  required
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                />
              </Field>
            </div>

            <Field label="Tier (1 / 2 / 3)">
              <Input
                type="number"
                min="1"
                max="3"
                required
                value={formData.tier}
                onChange={(e) =>
                  setFormData({ ...formData, tier: e.target.value })
                }
              />
            </Field>

            <Field label="Cover Image">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </Field>
          </Section>

          {/* OPERATING HOURS */}
          <Section icon={Clock} title="Operating Hours">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Opening Time">
                <Input
                  type="time"
                  disabled={formData.is24Hours}
                  value={formData.openingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, openingTime: e.target.value })
                  }
                />
              </Field>

              <Field label="Closing Time">
                <Input
                  type="time"
                  disabled={formData.is24Hours}
                  value={formData.closingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closingTime: e.target.value })
                  }
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={formData.is24Hours}
                onChange={(e) =>
                  setFormData({ ...formData, is24Hours: e.target.checked })
                }
              />
              Open 24 Hours
            </label>
          </Section>

          <Button
            type="submit"
            className="w-full gradient-hero py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Gym"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </div>
    </OwnerLayout>
  );
}

/* ---------- UI helpers ---------- */

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-card space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
