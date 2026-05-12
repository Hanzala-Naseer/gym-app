// import { useEffect, useRef, useState } from "react";
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

//   const pollerRef = useRef(null);

//   // ---------------- FETCH GYM ----------------
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
//       setGym(data.gyms?.[0] || null);
//     } catch (err) {
//       console.error("Owner dashboard fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- POLLING LOGIC ----------------
//   useEffect(() => {
//     fetchMyGym();

//     pollerRef.current = setInterval(() => {
//       if (!gym || gym.status === "pending") {
//         fetchMyGym();
//       }
//     }, 4000); // 4 sec polling

//     return () => {
//       if (pollerRef.current) {
//         clearInterval(pollerRef.current);
//       }
//     };
//   }, [gym?.status]);

//   // ---------------- LOADING ----------------
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
//         {/* HEADER */}
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
//                 text="Your gym is pending admin approval. You’ll be notified automatically."
//                 color="text-yellow-500"
//                 pulse
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

//             {/* STATS (ONLY IF APPROVED) */}
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

//             {/* LOCKED MESSAGE */}
//             {!isApproved && !isRejected && (
//               <p className="text-muted-foreground text-sm animate-pulse">
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

// /* ---------------- HELPER COMPONENTS ---------------- */

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

// function StatusBanner({ icon: Icon, text, color, pulse }) {
//   return (
//     <div
//       className={`bg-card p-4 rounded-xl shadow-card flex items-center gap-3 ${
//         pulse ? "animate-pulse" : ""
//       }`}
//     >
//       <Icon className={`w-5 h-5 ${color}`} />
//       <span className={`font-medium ${color}`}>{text}</span>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  QrCode,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { gymService } from "@/services/gymService";
import { useToast } from "@/hooks/use-toast";

export default function OwnerDashboard() {
  const { toast } = useToast();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyGym = async () => {
    try {
      const data = await gymService.getMyGyms();
      // Backend returns { success, gyms: [...] } — owner may have one gym
      setGym(data.gyms?.[0] || null);
    } catch (err) {
      toast({
        title: "Could not load gym data",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGym();
  }, []);

  if (loading) {
    return (
      <OwnerLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-48 bg-muted rounded-xl" />
          <div className="grid grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </OwnerLayout>
    );
  }

  const hasGym = Boolean(gym);
  const status = gym?.status; // pending | approved | rejected | changes_requested | draft

  const isApproved = status === "approved";
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const isChangesRequested = status === "changes_requested";

  return (
    <OwnerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your gym and track activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMyGym}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {!hasGym && (
              <Link to="/dashboard/owner/register-gym">
                <Button className="gradient-hero text-primary-foreground">
                  <Plus className="w-5 h-5 mr-2" />
                  Register Gym
                </Button>
              </Link>
            )}
          </div>
        </div>

        {hasGym ? (
          <>
            {/* ── Status banner ── */}
            {isPending && (
              <StatusBanner
                icon={Clock}
                color="amber"
                title="Pending Approval"
                message="Your gym is under admin review. We'll notify you by email once it's approved."
              />
            )}

            {isChangesRequested && (
              <StatusBanner
                icon={AlertTriangle}
                color="orange"
                title="Changes Requested"
                message={
                  gym.rejectionReason
                    ? `Admin feedback: "${gym.rejectionReason}"`
                    : "Admin has requested changes to your gym listing."
                }
                action={
                  <Link to="/dashboard/owner/my-gym">
                    <Button
                      size="sm"
                      className="gradient-hero text-primary-foreground mt-2"
                    >
                      Update & Resubmit
                    </Button>
                  </Link>
                }
              />
            )}

            {isRejected && (
              <StatusBanner
                icon={XCircle}
                color="red"
                title="Gym Rejected"
                message={
                  gym.rejectionReason
                    ? `Reason: ${gym.rejectionReason}`
                    : "Your gym registration was rejected."
                }
                action={
                  <Link to="/dashboard/owner/my-gym">
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 border-red-400 text-red-600"
                    >
                      View Details & Resubmit
                    </Button>
                  </Link>
                }
              />
            )}

            {isApproved && (
              <StatusBanner
                icon={CheckCircle2}
                color="green"
                title="Gym Approved"
                message="Your gym is live and accepting members."
              />
            )}

            {/* ── Stats (approved only) ── */}
            {isApproved && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

            {/* ── Gym info card ── */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">
                  Your Gym
                </h2>
                <StatusPill status={status} />
              </div>

              <div className="flex items-center gap-4">
                {gym.coverImageUrl ? (
                  <img
                    src={gym.coverImageUrl}
                    alt={gym.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl gradient-hero flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {gym.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {gym.addressLine}, {gym.city}
                  </p>
                  {gym.resubmissionCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Resubmitted {gym.resubmissionCount}×
                    </p>
                  )}
                </div>
              </div>

              {/* Quick link to My Gym page */}
              <div className="mt-5 pt-4 border-t border-border">
                <Link
                  to="/dashboard/owner/my-gym"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  View & manage gym details →
                </Link>
              </div>
            </div>

            {/* QR locked message */}
            {!isApproved && (
              <p className="text-muted-foreground text-sm text-center">
                QR check-ins unlock after admin approval.
              </p>
            )}
          </>
        ) : (
          /* No gym registered yet */
          <div className="bg-card rounded-2xl p-14 shadow-card text-center">
            <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Gym Registered
            </h2>
            <p className="text-muted-foreground mb-8">
              Register your gym to start accepting members and tracking
              check-ins.
            </p>
            <Link to="/dashboard/owner/register-gym">
              <Button className="gradient-hero text-primary-foreground">
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

/* ── Helpers ── */

function StatCard({ label, value, icon: Icon, active }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card">
      <div
        className={`w-12 h-12 rounded-xl ${active ? "gradient-hero" : "gradient-accent"} flex items-center justify-center mb-4`}
      >
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusBanner({ icon: Icon, color, title, message, action }) {
  const colorMap = {
    amber:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300",
    green:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm opacity-90 mt-0.5">{message}</p>
          {action}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    approved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    changes_requested:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    draft: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
}
