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
//   AlertTriangle,
//   RefreshCw,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import OwnerLayout from "@/components/layouts/OwnerLayout";
// import { gymService } from "@/services/gymService";
// import { useToast } from "@/hooks/use-toast";

// export default function OwnerDashboard() {
//   const { toast } = useToast();
//   const [gym, setGym] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchMyGym = async () => {
//     try {
//       const data = await gymService.getMyGyms();
//       // Backend returns { success, gyms: [...] } — owner may have one gym
//       setGym(data.gyms?.[0] || null);
//     } catch (err) {
//       toast({
//         title: "Could not load gym data",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyGym();
//   }, []);

//   if (loading) {
//     return (
//       <OwnerLayout>
//         <div className="space-y-6 animate-pulse">
//           <div className="h-10 w-48 bg-muted rounded-xl" />
//           <div className="grid grid-cols-3 gap-6">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="h-32 bg-muted rounded-2xl" />
//             ))}
//           </div>
//         </div>
//       </OwnerLayout>
//     );
//   }

//   const hasGym = Boolean(gym);
//   const status = gym?.status; // pending | approved | rejected | changes_requested | draft

//   const isApproved = status === "approved";
//   const isPending = status === "pending";
//   const isRejected = status === "rejected";
//   const isChangesRequested = status === "changes_requested";

//   return (
//     <OwnerLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
//               Dashboard
//             </h1>
//             <p className="text-muted-foreground">
//               Manage your gym and track activity.
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={fetchMyGym}
//               className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
//               title="Refresh"
//             >
//               <RefreshCw className="w-4 h-4" />
//             </button>

//             {!hasGym && (
//               <Link to="/dashboard/owner/register-gym">
//                 <Button className="gradient-hero text-primary-foreground">
//                   <Plus className="w-5 h-5 mr-2" />
//                   Register Gym
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>

//         {hasGym ? (
//           <>
//             {/* ── Status banner ── */}
//             {isPending && (
//               <StatusBanner
//                 icon={Clock}
//                 color="amber"
//                 title="Pending Approval"
//                 message="Your gym is under admin review. We'll notify you by email once it's approved."
//               />
//             )}

//             {isChangesRequested && (
//               <StatusBanner
//                 icon={AlertTriangle}
//                 color="orange"
//                 title="Changes Requested"
//                 message={
//                   gym.rejectionReason
//                     ? `Admin feedback: "${gym.rejectionReason}"`
//                     : "Admin has requested changes to your gym listing."
//                 }
//                 action={
//                   <Link to="/dashboard/owner/my-gym">
//                     <Button
//                       size="sm"
//                       className="gradient-hero text-primary-foreground mt-2"
//                     >
//                       Update & Resubmit
//                     </Button>
//                   </Link>
//                 }
//               />
//             )}

//             {isRejected && (
//               <StatusBanner
//                 icon={XCircle}
//                 color="red"
//                 title="Gym Rejected"
//                 message={
//                   gym.rejectionReason
//                     ? `Reason: ${gym.rejectionReason}`
//                     : "Your gym registration was rejected."
//                 }
//                 action={
//                   <Link to="/dashboard/owner/my-gym">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="mt-2 border-red-400 text-red-600"
//                     >
//                       View Details & Resubmit
//                     </Button>
//                   </Link>
//                 }
//               />
//             )}

//             {isApproved && (
//               <StatusBanner
//                 icon={CheckCircle2}
//                 color="green"
//                 title="Gym Approved"
//                 message="Your gym is live and accepting members."
//               />
//             )}

//             {/* ── Stats (approved only) ── */}
//             {isApproved && (
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

//             {/* ── Gym info card ── */}
//             <div className="bg-card rounded-2xl p-6 shadow-card">
//               <div className="flex items-center justify-between mb-5">
//                 <h2 className="text-lg font-semibold text-foreground">
//                   Your Gym
//                 </h2>
//                 <StatusPill status={status} />
//               </div>

//               <div className="flex items-center gap-4">
//                 {gym.coverImageUrl ? (
//                   <img
//                     src={gym.coverImageUrl}
//                     alt={gym.name}
//                     className="w-16 h-16 rounded-xl object-cover"
//                   />
//                 ) : (
//                   <div className="w-16 h-16 rounded-xl gradient-hero flex items-center justify-center">
//                     <Building2 className="w-8 h-8 text-primary-foreground" />
//                   </div>
//                 )}
//                 <div>
//                   <h3 className="text-lg font-semibold text-foreground">
//                     {gym.name}
//                   </h3>
//                   <p className="text-muted-foreground text-sm">
//                     {gym.addressLine}, {gym.city}
//                   </p>
//                   {gym.resubmissionCount > 0 && (
//                     <p className="text-xs text-muted-foreground mt-1">
//                       Resubmitted {gym.resubmissionCount}×
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Quick link to My Gym page */}
//               <div className="mt-5 pt-4 border-t border-border">
//                 <Link
//                   to="/dashboard/owner/my-gym"
//                   className="text-sm text-primary font-medium hover:underline"
//                 >
//                   View & manage gym details →
//                 </Link>
//               </div>
//             </div>

//             {/* QR locked message */}
//             {!isApproved && (
//               <p className="text-muted-foreground text-sm text-center">
//                 QR check-ins unlock after admin approval.
//               </p>
//             )}
//           </>
//         ) : (
//           /* No gym registered yet */
//           <div className="bg-card rounded-2xl p-14 shadow-card text-center">
//             <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
//               <Building2 className="w-10 h-10 text-primary-foreground" />
//             </div>
//             <h2 className="text-2xl font-bold text-foreground mb-2">
//               No Gym Registered
//             </h2>
//             <p className="text-muted-foreground mb-8">
//               Register your gym to start accepting members and tracking
//               check-ins.
//             </p>
//             <Link to="/dashboard/owner/register-gym">
//               <Button className="gradient-hero text-primary-foreground">
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

// /* ── Helpers ── */

// function StatCard({ label, value, icon: Icon, active }) {
//   return (
//     <div className="bg-card rounded-2xl p-6 shadow-card">
//       <div
//         className={`w-12 h-12 rounded-xl ${active ? "gradient-hero" : "gradient-accent"} flex items-center justify-center mb-4`}
//       >
//         <Icon className="w-6 h-6 text-primary-foreground" />
//       </div>
//       <p className="text-3xl font-bold text-foreground">{value}</p>
//       <p className="text-muted-foreground">{label}</p>
//     </div>
//   );
// }

// function StatusBanner({ icon: Icon, color, title, message, action }) {
//   const colorMap = {
//     amber:
//       "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300",
//     orange:
//       "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300",
//     red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300",
//     green:
//       "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300",
//   };
//   return (
//     <div className={`rounded-2xl border p-4 ${colorMap[color]}`}>
//       <div className="flex items-start gap-3">
//         <Icon className="w-5 h-5 mt-0.5 shrink-0" />
//         <div>
//           <p className="font-semibold">{title}</p>
//           <p className="text-sm opacity-90 mt-0.5">{message}</p>
//           {action}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatusPill({ status }) {
//   const map = {
//     approved:
//       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
//     pending:
//       "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
//     rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//     changes_requested:
//       "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
//     draft: "bg-muted text-muted-foreground",
//   };
//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}
//     >
//       {status?.replace("_", " ")}
//     </span>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Wallet,
  Activity,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

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
      setLoading(true);

      const data = await gymService.getMyGyms();

      setGym(data?.gyms?.[0] || null);
    } catch (err) {
      toast({
        title: "Could not load dashboard",
        description:
          err?.response?.data?.message || err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGym();
  }, []);

  const stats = useMemo(() => {
    const members = gym?.memberCount || 186;
    const monthlyFee = gym?.monthlyFee || 4500;

    return {
      totalMembers: members,
      todayCheckins: 64,
      estimatedRevenue: members * monthlyFee,
      growth: "+18.2%",
    };
  }, [gym]);

  const revenueData = [
    { month: "Jan", revenue: 320000 },
    { month: "Feb", revenue: 360000 },
    { month: "Mar", revenue: 410000 },
    { month: "Apr", revenue: 390000 },
    { month: "May", revenue: 480000 },
    { month: "Jun", revenue: 520000 },
  ];

  if (loading) {
    return (
      <OwnerLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-12 w-60 rounded-2xl bg-[#ede4d9]" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 rounded-[28px] bg-[#ede4d9]" />
            ))}
          </div>

          <div className="h-[340px] rounded-[32px] bg-[#ede4d9]" />
        </div>
      </OwnerLayout>
    );
  }

  const hasGym = Boolean(gym);

  const status = gym?.status;

  const isApproved = status === "approved";
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const isChangesRequested = status === "changes_requested";

  return (
    <OwnerLayout>
      <div className="space-y-7">
        {/* ───────────────── HEADER ───────────────── */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-[#885210] mb-2">
              OWNER DASHBOARD
            </p>

            <h1 className="text-3xl lg:text-4xl font-black text-[#2c1a0e] leading-tight">
              Welcome back 👋
            </h1>

            <p className="text-[#7d6e63] mt-2 text-sm sm:text-base">
              Monitor gym performance, member growth, revenue and operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyGym}
              className="w-12 h-12 rounded-2xl border border-[#eadfce] bg-white hover:bg-[#fff8f0] flex items-center justify-center transition-all"
            >
              <RefreshCw className="w-5 h-5 text-[#885210]" />
            </button>

            {hasGym && (
              <div className="bg-white border border-[#eadfce] rounded-2xl px-4 py-3 shadow-sm">
                <p className="text-xs text-[#8b7b70] mb-1">Active Gym</p>

                <p className="font-bold text-[#2c1a0e] truncate max-w-[220px]">
                  {gym.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ───────────────── STATUS ───────────────── */}
        {hasGym && (
          <>
            {isPending && (
              <StatusBanner
                icon={Clock3}
                color="amber"
                title="Approval Pending"
                message="Your gym is currently under review by the admin team."
              />
            )}

            {isChangesRequested && (
              <StatusBanner
                icon={AlertTriangle}
                color="orange"
                title="Changes Requested"
                message={
                  gym.rejectionReason ||
                  "Admin requested updates before approval."
                }
              />
            )}

            {isRejected && (
              <StatusBanner
                icon={XCircle}
                color="red"
                title="Gym Rejected"
                message={
                  gym.rejectionReason || "Your gym registration was rejected."
                }
              />
            )}

            {isApproved && (
              <StatusBanner
                icon={CheckCircle2}
                color="green"
                title="Gym Approved"
                message="Your gym is live and actively accepting members."
              />
            )}
          </>
        )}

        {/* ───────────────── NO GYM ───────────────── */}
        {!hasGym ? (
          <div className="bg-white border border-[#eadfce] rounded-[32px] shadow-xl p-10 lg:p-14 text-center">
            <div className="w-24 h-24 rounded-[28px] bg-[#2c1a0e] flex items-center justify-center mx-auto mb-7 shadow-lg">
              <Building2 className="w-12 h-12 text-[#fdb56c]" />
            </div>

            <h2 className="text-3xl font-black text-[#2c1a0e] mb-3">
              Setup Your Gym
            </h2>

            <p className="text-[#7d6e63] max-w-lg mx-auto mb-8 leading-relaxed">
              Complete your gym registration to unlock memberships, check-ins,
              analytics, QR access and operational tools.
            </p>

            <Link to="/dashboard/owner/register-gym">
              <Button className="h-14 px-8 rounded-2xl bg-[#885210] hover:bg-[#6f420d] text-white font-bold shadow-lg">
                <Building2 className="w-5 h-5 mr-2" />
                Complete Gym Setup
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* ───────────────── STATS ───────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <MetricCard
                title="Total Members"
                value={stats.totalMembers}
                growth="+12%"
                icon={Users}
              />

              <MetricCard
                title="Today's Check-ins"
                value={stats.todayCheckins}
                growth="+8%"
                icon={QrCode}
              />

              <MetricCard
                title="Estimated Revenue"
                value={`Rs ${stats.estimatedRevenue.toLocaleString()}`}
                growth="+18%"
                icon={Wallet}
              />

              <MetricCard
                title="Growth Rate"
                value={stats.growth}
                growth="This month"
                icon={TrendingUp}
              />
            </div>

            {/* ───────────────── MAIN GRID ───────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_0.9fr] gap-6">
              {/* Revenue Graph */}
              <div className="bg-white border border-[#eadfce] rounded-[32px] p-6 lg:p-7 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm font-semibold text-[#885210] mb-1">
                      REVENUE ANALYTICS
                    </p>

                    <h2 className="text-2xl font-black text-[#2c1a0e]">
                      Revenue Overview
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    +18.4%
                  </div>
                </div>

                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient
                          id="gymRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#885210"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#885210"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1e6d8"
                      />

                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#8b7b70", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fill: "#8b7b70", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#885210"
                        fillOpacity={1}
                        fill="url(#gymRevenue)"
                        strokeWidth={4}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gym Card */}
              <div className="space-y-6">
                <div className="bg-white border border-[#eadfce] rounded-[32px] p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-[#2c1a0e]">
                      Gym Profile
                    </h3>

                    <StatusPill status={status} />
                  </div>

                  <div className="flex items-center gap-4">
                    {gym.coverImageUrl ? (
                      <img
                        src={gym.coverImageUrl}
                        alt={gym.name}
                        className="w-20 h-20 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-[#2c1a0e] flex items-center justify-center">
                        <Building2 className="w-9 h-9 text-[#fdb56c]" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="font-black text-lg text-[#2c1a0e] truncate">
                        {gym.name}
                      </h4>

                      <p className="text-sm text-[#7d6e63] mt-1">
                        {gym.addressLine}, {gym.city}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-7">
                    <MiniInfo label="Members" value={stats.totalMembers} />

                    <MiniInfo label="Status" value={status} />

                    <MiniInfo label="Plan" value="Premium" />

                    <MiniInfo label="Check-ins" value="2.4k" />
                  </div>

                  <Link to="/dashboard/owner/my-gym">
                    <Button className="w-full mt-7 h-13 rounded-2xl bg-[#885210] hover:bg-[#6f420d] text-white font-bold">
                      Manage Gym
                    </Button>
                  </Link>
                </div>

                {/* Insights */}
                <div className="bg-[#2c1a0e] rounded-[32px] p-6 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#fdb56c]/10 blur-3xl" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#fdb56c] flex items-center justify-center mb-5">
                      <Activity className="w-7 h-7 text-[#2c1a0e]" />
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3">
                      Performance Insights
                    </h3>

                    <p className="text-[#f6e8d7]/70 text-sm leading-relaxed">
                      Your gym performance improved significantly this month.
                      Member engagement and retention metrics are increasing.
                    </p>

                    <div className="mt-6 space-y-3">
                      <Insight text="Peak gym traffic between 6PM–9PM" />
                      <Insight text="Revenue increased 18% this month" />
                      <Insight text="Member retention rate reached 92%" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </OwnerLayout>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

function MetricCard({ title, value, growth, icon: Icon }) {
  return (
    <div className="bg-white border border-[#eadfce] rounded-[28px] p-5 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl bg-[#fff3e4] flex items-center justify-center">
          <Icon className="w-7 h-7 text-[#885210]" />
        </div>

        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
          <ArrowUpRight className="w-4 h-4" />
          {growth}
        </div>
      </div>

      <h3 className="text-3xl font-black text-[#2c1a0e]">{value}</h3>

      <p className="text-[#7d6e63] mt-1 text-sm">{title}</p>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#fff8f0] border border-[#f1e6d8] p-4">
      <p className="text-xs text-[#8b7b70] mb-1">{label}</p>

      <p className="font-black text-[#2c1a0e] capitalize">{value}</p>
    </div>
  );
}

function Insight({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-[#fdb56c]" />

      <p className="text-sm text-[#f6e8d7]/80">{text}</p>
    </div>
  );
}

function StatusBanner({ icon: Icon, color, title, message }) {
  const colors = {
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    red: "bg-red-50 border-red-200 text-red-800",
    green: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };

  return (
    <div className={`rounded-[28px] border p-5 ${colors[color]}`}>
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-white/70 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-black">{title}</h3>

          <p className="text-sm mt-1 opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
    changes_requested: "bg-orange-100 text-orange-700",
    draft: "bg-[#f4ede3] text-[#7d6e63]",
  };

  return (
    <div
      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
        map[status] || "bg-[#f4ede3] text-[#7d6e63]"
      }`}
    >
      {status?.replace("_", " ")}
    </div>
  );
}
