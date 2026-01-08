// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Building2,
//   Users,
//   QrCode,
//   Plus,
//   Clock,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import OwnerLayout from "@/components/layouts/OwnerLayout";
// import { useAuth } from "@/contexts/AuthContext";

// export default function OwnerDashboard() {
//   const { token } = useAuth();

//   const [gym, setGym] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMyGym();
//   }, []);

//   const fetchMyGym = async () => {
//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/owners/my-gyms`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       // Owner can have max ONE gym
//       setGym(data.gyms?.[0] || null);
//     } catch (err) {
//       console.error("Owner dashboard fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <OwnerLayout>
//         <p className="text-muted-foreground">Loading dashboard...</p>
//       </OwnerLayout>
//     );
//   }

//   const hasGym = Boolean(gym);
//   const status = gym?.status; // pending | approved | rejected
//   const isApproved = status === "approved";
//   const isRejected = status === "rejected";

//   return (
//     <OwnerLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
//             <p className="text-muted-foreground">
//               Manage your gym and track activity
//             </p>
//           </div>

//           {!hasGym && (
//             <Link to="/dashboard/owner/register-gym">
//               <Button className="gradient-hero">
//                 <Plus className="w-5 h-5 mr-2" />
//                 Register Gym
//               </Button>
//             </Link>
//           )}
//         </div>

//         {/* ================= HAS GYM ================= */}
//         {hasGym ? (
//           <>
//             {/* STATUS BANNER */}
//             {status === "pending" && (
//               <StatusBanner
//                 icon={Clock}
//                 text="Your gym is pending admin approval"
//                 color="text-yellow-500"
//               />
//             )}

//             {status === "approved" && (
//               <StatusBanner
//                 icon={CheckCircle2}
//                 text="Your gym has been approved 🎉"
//                 color="text-green-600"
//               />
//             )}

//             {status === "rejected" && (
//               <StatusBanner
//                 icon={XCircle}
//                 text="Your gym was rejected. Please contact support."
//                 color="text-red-600"
//               />
//             )}

//             {/* STATS (only if approved) */}
//             {isApproved && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <StatCard label="Total Members" value={0} icon={Users} active />
//                 <StatCard label="Today's Check-ins" value={0} icon={QrCode} />
//                 <StatCard
//                   label="Gym Status"
//                   value="Active"
//                   icon={CheckCircle2}
//                   active
//                 />
//               </div>
//             )}

//             {/* GYM CARD */}
//             <div className="bg-card rounded-2xl p-6 shadow-card">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold">Your Gym</h2>

//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     status === "approved"
//                       ? "bg-primary/10 text-primary"
//                       : status === "pending"
//                       ? "bg-accent/10 text-accent"
//                       : "bg-destructive/10 text-destructive"
//                   }`}
//                 >
//                   {status.toUpperCase()}
//                 </span>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="w-16 h-16 rounded-xl gradient-hero flex items-center justify-center">
//                   <Building2 className="w-8 h-8 text-primary-foreground" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold">{gym.name}</h3>
//                   <p className="text-muted-foreground">
//                     {gym.addressLine}, {gym.city}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* CHECK-INS LOCKED UNTIL APPROVED */}
//             {!isApproved && (
//               <p className="text-muted-foreground text-sm">
//                 QR check-ins will unlock after admin approval.
//               </p>
//             )}
//           </>
//         ) : (
//           /* ================= NO GYM ================= */
//           <div className="bg-card rounded-2xl p-12 shadow-card text-center">
//             <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
//               <Building2 className="w-10 h-10 text-primary-foreground" />
//             </div>
//             <h2 className="text-2xl font-bold mb-2">No Gym Registered</h2>
//             <p className="text-muted-foreground mb-8">
//               Register your gym to get started.
//             </p>
//             <Link to="/dashboard/owner/register-gym">
//               <Button className="gradient-hero">
//                 <Plus className="w-5 h-5 mr-2" />
//                 Register Your Gym
//               </Button>
//             </Link>
//           </div>
//         )}
//       </div>
//     </OwnerLayout>
//   );
// }

// /* ---------------- Helper Components ---------------- */

// function StatCard({ label, value, icon: Icon, active }) {
//   return (
//     <div className="bg-card rounded-2xl p-6 shadow-card">
//       <div
//         className={`w-12 h-12 rounded-xl ${
//           active ? "gradient-hero" : "gradient-accent"
//         } flex items-center justify-center mb-4`}
//       >
//         <Icon className="w-6 h-6 text-primary-foreground" />
//       </div>
//       <p className="text-3xl font-bold">{value}</p>
//       <p className="text-muted-foreground">{label}</p>
//     </div>
//   );
// }

// function StatusBanner({ icon: Icon, text, color }) {
//   return (
//     <div className="bg-card p-4 rounded-xl shadow-card flex items-center gap-3">
//       <Icon className={`w-5 h-5 ${color}`} />
//       <span className={`font-medium ${color}`}>{text}</span>
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  QrCode,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function OwnerDashboard() {
  const { token } = useAuth();

  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  const pollerRef = useRef(null);

  // ---------------- FETCH GYM ----------------
  const fetchMyGym = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/owners/my-gyms`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setGym(data.gyms?.[0] || null);
    } catch (err) {
      console.error("Owner dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- POLLING LOGIC ----------------
  useEffect(() => {
    fetchMyGym();

    pollerRef.current = setInterval(() => {
      if (!gym || gym.status === "pending") {
        fetchMyGym();
      }
    }, 4000); // 4 sec polling

    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
      }
    };
  }, [gym?.status]);

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <OwnerLayout>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </OwnerLayout>
    );
  }

  const hasGym = Boolean(gym);
  const status = gym?.status; // pending | approved | rejected
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <OwnerLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your gym and track activity
            </p>
          </div>

          {!hasGym && (
            <Link to="/dashboard/owner/register-gym">
              <Button className="gradient-hero">
                <Plus className="w-5 h-5 mr-2" />
                Register Gym
              </Button>
            </Link>
          )}
        </div>

        {/* ================= HAS GYM ================= */}
        {hasGym ? (
          <>
            {/* STATUS BANNER */}
            {status === "pending" && (
              <StatusBanner
                icon={Clock}
                text="Your gym is pending admin approval. You’ll be notified automatically."
                color="text-yellow-500"
                pulse
              />
            )}

            {status === "approved" && (
              <StatusBanner
                icon={CheckCircle2}
                text="Your gym has been approved 🎉"
                color="text-green-600"
              />
            )}

            {status === "rejected" && (
              <StatusBanner
                icon={XCircle}
                text="Your gym was rejected. Please contact support."
                color="text-red-600"
              />
            )}

            {/* STATS (ONLY IF APPROVED) */}
            {isApproved && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Total Members" value={0} icon={Users} active />
                <StatCard label="Today's Check-ins" value={0} icon={QrCode} />
                <StatCard
                  label="Gym Status"
                  value="Active"
                  icon={CheckCircle2}
                  active
                />
              </div>
            )}

            {/* GYM CARD */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Your Gym</h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === "approved"
                      ? "bg-primary/10 text-primary"
                      : status === "pending"
                      ? "bg-accent/10 text-accent"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl gradient-hero flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{gym.name}</h3>
                  <p className="text-muted-foreground">
                    {gym.addressLine}, {gym.city}
                  </p>
                </div>
              </div>
            </div>

            {/* LOCKED MESSAGE */}
            {!isApproved && !isRejected && (
              <p className="text-muted-foreground text-sm animate-pulse">
                QR check-ins will unlock after admin approval.
              </p>
            )}
          </>
        ) : (
          /* ================= NO GYM ================= */
          <div className="bg-card rounded-2xl p-12 shadow-card text-center">
            <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>

            <h2 className="text-2xl font-bold mb-2">No Gym Registered</h2>
            <p className="text-muted-foreground mb-8">
              Register your gym to get started.
            </p>

            <Link to="/dashboard/owner/register-gym">
              <Button className="gradient-hero">
                <Plus className="w-5 h-5 mr-2" />
                Register Your Gym
              </Button>
            </Link>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function StatCard({ label, value, icon: Icon, active }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card">
      <div
        className={`w-12 h-12 rounded-xl ${
          active ? "gradient-hero" : "gradient-accent"
        } flex items-center justify-center mb-4`}
      >
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusBanner({ icon: Icon, text, color, pulse }) {
  return (
    <div
      className={`bg-card p-4 rounded-xl shadow-card flex items-center gap-3 ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      <Icon className={`w-5 h-5 ${color}`} />
      <span className={`font-medium ${color}`}>{text}</span>
    </div>
  );
}
