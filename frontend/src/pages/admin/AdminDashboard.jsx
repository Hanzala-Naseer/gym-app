// import { useEffect, useState } from "react";
// import { Building2, Users, QrCode, Clock } from "lucide-react";

// import AdminLayout from "@/components/layouts/AdminLayout";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";

// export default function AdminDashboard() {
//   const { token } = useAuth();
//   const { toast } = useToast();

//   const [gyms, setGyms] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ---------------- Fetch Dashboard Data ----------------
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

//       setGyms(gymsData.gyms);
//       setUsers(usersData.users);
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

//   // ---------------- Stats ----------------
//   const totalGyms = gyms.length;
//   const pendingGyms = gyms.filter((g) => g.status === "pending").length;
//   const totalMembers = users.filter((u) => u.role === "member").length;

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
//       value: totalMembers,
//       icon: Users,
//       color: "gradient-hero",
//     },
//     {
//       label: "Today's Check-ins",
//       value: "--",
//       icon: QrCode,
//       color: "gradient-accent",
//     },
//   ];

//   // Recent gyms (latest 5)
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
//             Overview of all gyms and users on GymKey.
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
//                   <th className="text-left p-4 text-sm font-medium">
//                     Gym Name
//                   </th>
//                   <th className="text-left p-4 text-sm font-medium">Owner</th>
//                   <th className="text-left p-4 text-sm font-medium">Status</th>
//                   <th className="text-left p-4 text-sm font-medium">Tier</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {recentGyms.map((gym) => (
//                   <tr
//                     key={gym.id}
//                     className="border-t border-border hover:bg-muted/30 transition-colors"
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
//                             ? "bg-accent/10 text-accent"
//                             : "bg-destructive/10 text-destructive"
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
import { Building2, Users, QrCode, Clock, CreditCard } from "lucide-react";

import AdminLayout from "@/components/layouts/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [gyms, setGyms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [gymsRes, usersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/gyms`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const gymsData = await gymsRes.json();
      const usersData = await usersRes.json();

      if (!gymsRes.ok) throw new Error(gymsData.message);
      if (!usersRes.ok) throw new Error(usersData.message);

      setGyms(gymsData.gyms || []);
      setUsers(usersData.users || []);
    } catch (err) {
      toast({
        title: "Dashboard Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- MEMBERS LOGIC ----------------
  const members = users.filter((u) => u.role === "member");

  const subscribedMembers = members.filter(
    (u) => u.subscription?.status === "active"
  );

  const nonSubscribedMembers = members.filter(
    (u) => !u.subscription || u.subscription.status !== "active"
  );

  // ---------------- STATS ----------------
  const totalGyms = gyms.length;
  const pendingGyms = gyms.filter((g) => g.status === "pending").length;

  const stats = [
    {
      label: "Total Gyms",
      value: totalGyms,
      icon: Building2,
      color: "gradient-hero",
    },
    {
      label: "Pending Approvals",
      value: pendingGyms,
      icon: Clock,
      color: "gradient-accent",
    },
    {
      label: "Total Members",
      value: members.length,
      icon: Users,
      color: "gradient-hero",
    },
    {
      label: "Subscribed Members",
      value: subscribedMembers.length,
      icon: CreditCard,
      color: "gradient-accent",
    },
  ];

  // Recent gyms
  const recentGyms = gyms
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of gyms and members on GymKey
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-6 shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                {loading ? "--" : stat.value}
              </p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Gyms */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Recent Gyms</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Gym</th>
                  <th className="text-left p-4 text-sm font-medium">Owner</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Tier</th>
                </tr>
              </thead>

              <tbody>
                {recentGyms.map((gym) => (
                  <tr
                    key={gym.id}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <td className="p-4 font-medium">{gym.name}</td>
                    <td className="p-4 text-muted-foreground">
                      {gym.owner?.name}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          gym.status === "approved"
                            ? "bg-primary/10 text-primary"
                            : gym.status === "pending"
                            ? "bg-accent/10 text-accent"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {gym.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{gym.tier}</td>
                  </tr>
                ))}

                {!loading && recentGyms.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-6 text-center text-muted-foreground"
                    >
                      No gyms found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
