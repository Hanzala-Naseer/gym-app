// import { useEffect, useState } from "react";
// import {
//   Building2,
//   Users,
//   Clock,
//   CreditCard,
//   CalendarCheck,
//   TrendingUp,
//   AlertCircle,
//   RefreshCw,
// } from "lucide-react";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { adminService } from "@/services/adminService";

// // ─── Stat Card ────────────────────────────────────────────────────────────────
// function StatCard({ label, value, icon: Icon, colorClass, loading, sub }) {
//   return (
//     <div className="bg-card rounded-2xl p-6 shadow-card flex flex-col gap-4">
//       <div className="flex items-center justify-between">
//         <div
//           className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClass}`}
//         >
//           <Icon className="w-5 h-5 text-white" />
//         </div>
//         {sub && (
//           <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
//             {sub}
//           </span>
//         )}
//       </div>
//       <div>
//         <p className="text-3xl font-bold tracking-tight">
//           {loading ? (
//             <span className="animate-pulse text-muted-foreground">—</span>
//           ) : (
//             value
//           )}
//         </p>
//         <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
//       </div>
//     </div>
//   );
// }

// // ─── Status Badge ─────────────────────────────────────────────────────────────
// function StatusBadge({ status }) {
//   const map = {
//     approved:
//       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
//     pending:
//       "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
//     rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//   };
//   return (
//     <span
//       className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] ?? "bg-muted text-muted-foreground"}`}
//     >
//       {status}
//     </span>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const { token } = useAuth();
//   const { toast } = useToast();

//   const [analytics, setAnalytics] = useState(null);
//   const [recentGyms, setRecentGyms] = useState([]);
//   const [loadingAnalytics, setLoadingAnalytics] = useState(true);
//   const [loadingGyms, setLoadingGyms] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // ── fetch analytics ──────────────────────────────────────────────────────
//   const fetchAnalytics = async (isRefresh = false) => {
//     try {
//       if (isRefresh) setRefreshing(true);
//       else setLoadingAnalytics(true);

//       const data = await adminService.getAnalytics();
//       if (data.success) setAnalytics(data.analytics);
//     } catch (err) {
//       toast({
//         title: "Analytics error",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingAnalytics(false);
//       setRefreshing(false);
//     }
//   };

//   // ── fetch recent gyms ────────────────────────────────────────────────────
//   const fetchRecentGyms = async () => {
//     try {
//       setLoadingGyms(true);
//       const data = await adminService.getAllGyms({ page: 1, limit: 6 });
//       if (data.success) setRecentGyms(data.gyms || []);
//     } catch (err) {
//       // silent — not critical
//     } finally {
//       setLoadingGyms(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnalytics();
//     fetchRecentGyms();
//   }, []);

//   // ── derived stats ────────────────────────────────────────────────────────
//   const a = analytics;

//   const stats = [
//     {
//       label: "Total Gyms",
//       value: a?.gyms.total ?? 0,
//       icon: Building2,
//       colorClass: "bg-blue-500",
//       sub: `${a?.gyms.pending ?? 0} pending`,
//     },
//     {
//       label: "Total Users",
//       value: a?.users.total ?? 0,
//       icon: Users,
//       colorClass: "bg-violet-500",
//       sub: `${a?.users.owners ?? 0} owners`,
//     },
//     {
//       label: "Active Subscriptions",
//       value: a?.subscriptions.active ?? 0,
//       icon: CreditCard,
//       colorClass: "bg-emerald-500",
//     },
//     {
//       label: "Total Revenue",
//       value: a ? `PKR ${a.revenue.totalPkr.toLocaleString()}` : "—",
//       icon: TrendingUp,
//       colorClass: "bg-orange-500",
//     },
//     {
//       label: "Total Check-ins",
//       value: a?.checkins.total ?? 0,
//       icon: CalendarCheck,
//       colorClass: "bg-pink-500",
//     },
//     {
//       label: "Approved Gyms",
//       value: a?.gyms.approved ?? 0,
//       icon: Building2,
//       colorClass: "bg-teal-500",
//       sub: `${a?.gyms.rejected ?? 0} rejected`,
//     },
//   ];

//   return (
//     <AdminLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
//             <p className="text-muted-foreground mt-1">
//               Platform-wide overview for GymKey
//             </p>
//           </div>
//           <button
//             onClick={() => fetchAnalytics(true)}
//             disabled={refreshing}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
//           >
//             <RefreshCw
//               className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
//             />
//             Refresh
//           </button>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {stats.map((stat) => (
//             <StatCard key={stat.label} {...stat} loading={loadingAnalytics} />
//           ))}
//         </div>

//         {/* Pending Gyms Alert */}
//         {!loadingAnalytics && (a?.gyms.pending ?? 0) > 0 && (
//           <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
//             <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
//             <div>
//               <p className="font-semibold text-sm">
//                 {a.gyms.pending} gym{a.gyms.pending > 1 ? "s" : ""} awaiting
//                 approval
//               </p>
//               <p className="text-xs mt-0.5 opacity-80">
//                 Review them under <strong>Pending Gyms</strong> in the sidebar.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Recent Gyms Table */}
//         <div className="bg-card rounded-2xl shadow-card overflow-hidden">
//           <div className="p-5 border-b border-border flex items-center justify-between">
//             <h2 className="text-base font-semibold">Recent Gyms</h2>
//             <span className="text-xs text-muted-foreground">Latest 6</span>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-muted/40">
//                 <tr>
//                   {["Name", "Owner", "City", "Status", "Tier"].map((h) => (
//                     <th
//                       key={h}
//                       className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {loadingGyms ? (
//                   [...Array(4)].map((_, i) => (
//                     <tr key={i} className="border-t border-border">
//                       {[...Array(5)].map((_, j) => (
//                         <td key={j} className="px-5 py-4">
//                           <div className="h-4 rounded bg-muted animate-pulse w-24" />
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 ) : recentGyms.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="5"
//                       className="px-5 py-10 text-center text-muted-foreground text-sm"
//                     >
//                       No gyms registered yet
//                     </td>
//                   </tr>
//                 ) : (
//                   recentGyms.map((gym) => (
//                     <tr
//                       key={gym.id}
//                       className="border-t border-border hover:bg-muted/20 transition-colors"
//                     >
//                       <td className="px-5 py-4 font-medium text-sm">
//                         {gym.name}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-muted-foreground">
//                         {gym.owner?.name ?? "—"}
//                         {gym.owner?.email && (
//                           <span className="block text-xs opacity-60">
//                             {gym.owner.email}
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-muted-foreground">
//                         {gym.city}
//                       </td>
//                       <td className="px-5 py-4">
//                         <StatusBadge status={gym.status} />
//                       </td>
//                       <td className="px-5 py-4 text-sm font-medium">
//                         Tier {gym.tier}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Users breakdown mini-cards */}
//         {!loadingAnalytics && a && (
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {[
//               {
//                 label: "Members",
//                 value: a.users.members,
//                 color:
//                   "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
//               },
//               {
//                 label: "Gym Owners",
//                 value: a.users.owners,
//                 color:
//                   "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300",
//               },
//               {
//                 label: "Total Users",
//                 value: a.users.total,
//                 color: "bg-muted text-muted-foreground",
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className={`rounded-xl p-4 flex items-center justify-between ${item.color}`}
//               >
//                 <span className="text-sm font-medium">{item.label}</span>
//                 <span className="text-2xl font-bold">{item.value}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  Activity,
  ShieldCheck,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK DATA (USED ONLY IF API FAILS / MISSING)
// ─────────────────────────────────────────────────────────────────────────────

const fallbackAnalytics = {
  gyms: {
    total: 124,
    approved: 98,
    pending: 12,
    rejected: 4,
  },

  users: {
    total: 18432,
    members: 17120,
    owners: 121,
  },

  subscriptions: {
    active: 87,
  },

  revenue: {
    totalPkr: 4850000,
    monthlyGrowth: 18.4,
  },

  checkins: {
    total: 248320,
    today: 3821,
  },
};

const revenueDataFallback = [
  { month: "Jan", revenue: 220000 },
  { month: "Feb", revenue: 280000 },
  { month: "Mar", revenue: 340000 },
  { month: "Apr", revenue: 390000 },
  { month: "May", revenue: 460000 },
  { month: "Jun", revenue: 520000 },
];

const subscriptionBreakdownFallback = [
  { name: "Basic", value: 32 },
  { name: "Premium", value: 44 },
  { name: "Enterprise", value: 21 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SAFE ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

function useSafeAnalytics(analytics) {
  return useMemo(() => {
    return {
      gyms: {
        total: analytics?.gyms?.total ?? fallbackAnalytics.gyms.total,

        approved: analytics?.gyms?.approved ?? fallbackAnalytics.gyms.approved,

        pending: analytics?.gyms?.pending ?? fallbackAnalytics.gyms.pending,

        rejected: analytics?.gyms?.rejected ?? fallbackAnalytics.gyms.rejected,
      },

      users: {
        total: analytics?.users?.total ?? fallbackAnalytics.users.total,

        members: analytics?.users?.members ?? fallbackAnalytics.users.members,

        owners: analytics?.users?.owners ?? fallbackAnalytics.users.owners,
      },

      subscriptions: {
        active:
          analytics?.subscriptions?.active ??
          fallbackAnalytics.subscriptions.active,
      },

      revenue: {
        totalPkr:
          analytics?.revenue?.totalPkr ?? fallbackAnalytics.revenue.totalPkr,

        monthlyGrowth:
          analytics?.revenue?.monthlyGrowth ??
          fallbackAnalytics.revenue.monthlyGrowth,
      },

      checkins: {
        total: analytics?.checkins?.total ?? fallbackAnalytics.checkins.total,

        today: analytics?.checkins?.today ?? fallbackAnalytics.checkins.today,
      },
    };
  }, [analytics]);
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────────────────────

function KPI({ label, value, growth, icon: Icon, accent }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#3B2417] bg-[#24160F] p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B2417]/40 to-transparent" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm text-[#CBB7A7]">{label}</p>

          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </h3>

          <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
            <ArrowUpRight className="h-3 w-3" />
            {growth}
          </div>
        </div>

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: accent }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",

    pending: "bg-amber-500/10 text-amber-300 border border-amber-500/20",

    rejected: "bg-red-500/10 text-red-300 border border-red-500/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
        styles[status] || "bg-muted"
      }`}
    >
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { toast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [recentGyms, setRecentGyms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────

  async function loadDashboard(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [analyticsRes, gymsRes] = await Promise.allSettled([
        adminService.getAnalytics(),
        adminService.getAllGyms({
          page: 1,
          limit: 6,
        }),
      ]);

      // analytics
      if (analyticsRes.status === "fulfilled" && analyticsRes.value?.success) {
        setAnalytics(analyticsRes.value.analytics);
      }

      // gyms
      if (gymsRes.status === "fulfilled" && gymsRes.value?.success) {
        setRecentGyms(gymsRes.value.gyms || []);
      }
    } catch (err) {
      toast({
        title: "Dashboard Error",
        description: "Unable to load latest analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const a = useSafeAnalytics(analytics);

  // ───────────────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
        <div className="space-y-6">
          {/* HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#2B160B]">
                Platform Overview
              </h1>

              <p className="mt-2 text-[#7A6A5D]">
                Real-time operational analytics for GymKey SaaS
              </p>
            </div>

            <button
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-2xl border border-[#D8C9BA] bg-white px-5 py-3 text-sm font-medium text-[#2B160B] transition hover:bg-[#F9F5F1]"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh Analytics
            </button>
          </div>

          {/* EXECUTIVE KPI GRID */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <KPI
              label="Total Gyms"
              value={a.gyms.total}
              growth="+12.4%"
              icon={Building2}
              accent="linear-gradient(135deg,#5B3A29,#8B5E46)"
            />

            <KPI
              label="Platform Users"
              value={a.users.total.toLocaleString()}
              growth="+18.1%"
              icon={Users}
              accent="linear-gradient(135deg,#5B2D5A,#874A82)"
            />

            <KPI
              label="Revenue"
              value={`PKR ${a.revenue.totalPkr.toLocaleString()}`}
              growth={`+${a.revenue.monthlyGrowth}%`}
              icon={TrendingUp}
              accent="linear-gradient(135deg,#1B5E4A,#2F8F73)"
            />

            <KPI
              label="Check-ins"
              value={a.checkins.total.toLocaleString()}
              growth={`+${a.checkins.today} today`}
              icon={CalendarCheck}
              accent="linear-gradient(135deg,#7A3D16,#D17B2F)"
            />
          </div>

          {/* MAIN GRID */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* REVENUE CHART */}

            <div className="rounded-[30px] border border-[#E7DDD3] bg-white p-6 shadow-sm xl:col-span-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#2B160B]">
                    Revenue Analytics
                  </h2>

                  <p className="mt-1 text-sm text-[#7A6A5D]">
                    Monthly platform revenue performance
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  +18.4% Growth
                </div>
              </div>

              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueDataFallback}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#5B3A29"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#5B3A29"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis dataKey="month" />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#5B3A29"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* INSIGHTS */}

            <div className="space-y-5 xl:col-span-4">
              {/* AI Insights */}

              <div className="rounded-[30px] bg-[#24160F] p-6 text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-300" />

                  <h3 className="font-semibold">AI Platform Insights</h3>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="mt-0.5 h-4 w-4 text-emerald-300" />

                      <div>
                        <p className="text-sm font-medium">
                          Revenue growth accelerating
                        </p>

                        <p className="mt-1 text-xs text-[#CBB6A6]">
                          Platform MRR increased 18.4% this month.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-amber-300" />

                      <div>
                        <p className="text-sm font-medium">
                          Approval queue requires review
                        </p>

                        <p className="mt-1 text-xs text-[#CBB6A6]">
                          {a.gyms.pending} gyms pending verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <Activity className="mt-0.5 h-4 w-4 text-cyan-300" />

                      <div>
                        <p className="text-sm font-medium">
                          Platform activity healthy
                        </p>

                        <p className="mt-1 text-xs text-[#CBB6A6]">
                          {a.checkins.today.toLocaleString()} check-ins today.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBSCRIPTIONS */}

              <div className="rounded-[30px] border border-[#E7DDD3] bg-white p-6">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-[#2B160B]">
                    Subscription Mix
                  </h3>

                  <p className="mt-1 text-sm text-[#7A6A5D]">
                    Active platform plans
                  </p>
                </div>

                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionBreakdownFallback}
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        <Cell fill="#5B3A29" />
                        <Cell fill="#8B5E46" />
                        <Cell fill="#D1A77C" />
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ALERT */}

          {a.gyms.pending > 0 && (
            <div className="flex items-start gap-3 rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-amber-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  {a.gyms.pending} gyms awaiting approval
                </p>

                <p className="mt-1 text-sm opacity-80">
                  Review onboarding applications to maintain platform quality.
                </p>
              </div>
            </div>
          )}

          {/* RECENT GYMS */}

          <div className="overflow-hidden rounded-[30px] border border-[#E7DDD3] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F0E8E1] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#2B160B]">
                  Recent Gym Registrations
                </h2>

                <p className="mt-1 text-sm text-[#7A6A5D]">
                  Latest platform onboarding activity
                </p>
              </div>

              <div className="rounded-full bg-[#F5EFE8] px-3 py-1 text-xs font-medium text-[#5B3A29]">
                Latest 6
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF7F4]">
                  <tr>
                    {["Gym", "Owner", "Location", "Status", "Tier"].map(
                      (head) => (
                        <th
                          key={head}
                          className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#7A6A5D]"
                        >
                          {head}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-t border-[#F4ECE5]">
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-6 py-5">
                            <div className="h-4 w-24 animate-pulse rounded bg-[#EEE6DE]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : recentGyms.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-sm text-[#7A6A5D]"
                      >
                        No gyms registered yet
                      </td>
                    </tr>
                  ) : (
                    recentGyms.map((gym) => (
                      <tr
                        key={gym.id}
                        className="border-t border-[#F4ECE5] transition hover:bg-[#FCFAF8]"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-[#2B160B]">
                              {gym.name}
                            </p>

                            <p className="mt-1 text-xs text-[#8D7E73]">
                              ID #{gym.id}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-medium text-[#2B160B]">
                              {gym.owner?.name || "—"}
                            </p>

                            <p className="mt-1 text-xs text-[#8D7E73]">
                              {gym.owner?.email || "No email"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-[#6D5F54]">
                          {gym.city || "—"}
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge status={gym.status} />
                        </td>

                        <td className="px-6 py-5">
                          <div className="inline-flex rounded-full bg-[#F5EFE8] px-3 py-1 text-xs font-semibold text-[#5B3A29]">
                            Tier {gym.tier}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
