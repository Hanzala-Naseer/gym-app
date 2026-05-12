// import { useEffect, useState } from "react";
// import { Building2, Users, QrCode, Clock, CreditCard } from "lucide-react";

// import AdminLayout from "@/components/layouts/AdminLayout";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";

// export default function AdminDashboard() {
//   const { token } = useAuth();
//   const { toast } = useToast();

//   const [gyms, setGyms] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       const [gymsRes, usersRes] = await Promise.all([
//         fetch(`${import.meta.env.VITE_API_URL}/admin/gyms`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const gymsData = await gymsRes.json();
//       const usersData = await usersRes.json();

//       if (!gymsRes.ok) throw new Error(gymsData.message);
//       if (!usersRes.ok) throw new Error(usersData.message);

//       setGyms(gymsData.gyms || []);
//       setUsers(usersData.users || []);
//     } catch (err) {
//       toast({
//         title: "Dashboard Error",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- MEMBERS LOGIC ----------------
//   const members = users.filter((u) => u.role === "member");

//   const subscribedMembers = members.filter(
//     (u) => u.subscription?.status === "active",
//   );

//   const nonSubscribedMembers = members.filter(
//     (u) => !u.subscription || u.subscription.status !== "active",
//   );

//   // ---------------- STATS ----------------
//   const totalGyms = gyms.length;
//   const pendingGyms = gyms.filter((g) => g.status === "pending").length;

//   const stats = [
//     {
//       label: "Total Gyms",
//       value: totalGyms,
//       icon: Building2,
//       color: "gradient-hero",
//     },
//     {
//       label: "Pending Approvals",
//       value: pendingGyms,
//       icon: Clock,
//       color: "gradient-accent",
//     },
//     {
//       label: "Total Members",
//       value: members.length,
//       icon: Users,
//       color: "gradient-hero",
//     },
//     {
//       label: "Subscribed Members",
//       value: subscribedMembers.length,
//       icon: CreditCard,
//       color: "gradient-accent",
//     },
//   ];

//   // Recent gyms
//   const recentGyms = gyms
//     .slice()
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);

//   return (
//     <AdminLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
//           <p className="text-muted-foreground">
//             Overview of gyms and members on GymKey
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <div
//               key={stat.label}
//               className="bg-card rounded-2xl p-6 shadow-card animate-fade-in"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div
//                   className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
//                 >
//                   <stat.icon className="w-6 h-6 text-primary-foreground" />
//                 </div>
//               </div>
//               <p className="text-3xl font-bold">
//                 {loading ? "--" : stat.value}
//               </p>
//               <p className="text-muted-foreground">{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Recent Gyms */}
//         <div className="bg-card rounded-2xl shadow-card overflow-hidden">
//           <div className="p-6 border-b border-border">
//             <h2 className="text-lg font-semibold">Recent Gyms</h2>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-muted/50">
//                 <tr>
//                   <th className="text-left p-4 text-sm font-medium">Gym</th>
//                   <th className="text-left p-4 text-sm font-medium">Owner</th>
//                   <th className="text-left p-4 text-sm font-medium">Status</th>
//                   <th className="text-left p-4 text-sm font-medium">Tier</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {recentGyms.map((gym) => (
//                   <tr
//                     key={gym.id}
//                     className="border-t border-border hover:bg-muted/30"
//                   >
//                     <td className="p-4 font-medium">{gym.name}</td>
//                     <td className="p-4 text-muted-foreground">
//                       {gym.owner?.name}
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           gym.status === "approved"
//                             ? "bg-primary/10 text-primary"
//                             : gym.status === "pending"
//                               ? "bg-accent/10 text-accent"
//                               : "bg-destructive/10 text-destructive"
//                         }`}
//                       >
//                         {gym.status.toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="p-4 font-medium">{gym.tier}</td>
//                   </tr>
//                 ))}

//                 {!loading && recentGyms.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="p-6 text-center text-muted-foreground"
//                     >
//                       No gyms found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Clock,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, colorClass, loading, sub }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClass}`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        {sub && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {sub}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight">
          {loading ? (
            <span className="animate-pulse text-muted-foreground">—</span>
          ) : (
            value
          )}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    approved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [recentGyms, setRecentGyms] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ── fetch analytics ──────────────────────────────────────────────────────
  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoadingAnalytics(true);

      const data = await adminService.getAnalytics();
      if (data.success) setAnalytics(data.analytics);
    } catch (err) {
      toast({
        title: "Analytics error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAnalytics(false);
      setRefreshing(false);
    }
  };

  // ── fetch recent gyms ────────────────────────────────────────────────────
  const fetchRecentGyms = async () => {
    try {
      setLoadingGyms(true);
      const data = await adminService.getAllGyms({ page: 1, limit: 6 });
      if (data.success) setRecentGyms(data.gyms || []);
    } catch (err) {
      // silent — not critical
    } finally {
      setLoadingGyms(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchRecentGyms();
  }, []);

  // ── derived stats ────────────────────────────────────────────────────────
  const a = analytics;

  const stats = [
    {
      label: "Total Gyms",
      value: a?.gyms.total ?? 0,
      icon: Building2,
      colorClass: "bg-blue-500",
      sub: `${a?.gyms.pending ?? 0} pending`,
    },
    {
      label: "Total Users",
      value: a?.users.total ?? 0,
      icon: Users,
      colorClass: "bg-violet-500",
      sub: `${a?.users.owners ?? 0} owners`,
    },
    {
      label: "Active Subscriptions",
      value: a?.subscriptions.active ?? 0,
      icon: CreditCard,
      colorClass: "bg-emerald-500",
    },
    {
      label: "Total Revenue",
      value: a ? `PKR ${a.revenue.totalPkr.toLocaleString()}` : "—",
      icon: TrendingUp,
      colorClass: "bg-orange-500",
    },
    {
      label: "Total Check-ins",
      value: a?.checkins.total ?? 0,
      icon: CalendarCheck,
      colorClass: "bg-pink-500",
    },
    {
      label: "Approved Gyms",
      value: a?.gyms.approved ?? 0,
      icon: Building2,
      colorClass: "bg-teal-500",
      sub: `${a?.gyms.rejected ?? 0} rejected`,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Platform-wide overview for GymKey
            </p>
          </div>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} loading={loadingAnalytics} />
          ))}
        </div>

        {/* Pending Gyms Alert */}
        {!loadingAnalytics && (a?.gyms.pending ?? 0) > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                {a.gyms.pending} gym{a.gyms.pending > 1 ? "s" : ""} awaiting
                approval
              </p>
              <p className="text-xs mt-0.5 opacity-80">
                Review them under <strong>Pending Gyms</strong> in the sidebar.
              </p>
            </div>
          </div>
        )}

        {/* Recent Gyms Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Gyms</h2>
            <span className="text-xs text-muted-foreground">Latest 6</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  {["Name", "Owner", "City", "Status", "Tier"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingGyms ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-t border-border">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 rounded bg-muted animate-pulse w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentGyms.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-muted-foreground text-sm"
                    >
                      No gyms registered yet
                    </td>
                  </tr>
                ) : (
                  recentGyms.map((gym) => (
                    <tr
                      key={gym.id}
                      className="border-t border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-sm">
                        {gym.name}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {gym.owner?.name ?? "—"}
                        {gym.owner?.email && (
                          <span className="block text-xs opacity-60">
                            {gym.owner.email}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {gym.city}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={gym.status} />
                      </td>
                      <td className="px-5 py-4 text-sm font-medium">
                        Tier {gym.tier}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users breakdown mini-cards */}
        {!loadingAnalytics && a && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Members",
                value: a.users.members,
                color:
                  "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
              },
              {
                label: "Gym Owners",
                value: a.users.owners,
                color:
                  "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300",
              },
              {
                label: "Total Users",
                value: a.users.total,
                color: "bg-muted text-muted-foreground",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl p-4 flex items-center justify-between ${item.color}`}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-2xl font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
