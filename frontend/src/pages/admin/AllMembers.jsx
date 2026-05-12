// import { useEffect, useState } from "react";
// import { Users, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";

// export default function AllMembers() {
//   const { token } = useAuth();
//   const { toast } = useToast();

//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch users");
//       }

//       setUsers(data.users);
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔍 Frontend search
//   const filteredUsers = users.filter(
//     (u) =>
//       u.name.toLowerCase().includes(search.toLowerCase()) ||
//       u.email.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <AdminLayout>
//       <div className="space-y-8">
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
//             All Members
//           </h1>
//         </div>

//         {/* SEARCH */}
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//           <Input
//             placeholder="Search member..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         {/* TABLE */}
//         <div className="bg-card rounded-2xl shadow-card overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-muted/50">
//               <tr>
//                 <th className="text-left p-4 text-sm font-medium text-muted-foreground">
//                   Name
//                 </th>
//                 <th className="text-left p-4 text-sm font-medium text-muted-foreground">
//                   Email
//                 </th>
//                 <th className="text-left p-4 text-sm font-medium text-muted-foreground">
//                   Role
//                 </th>
//                 <th className="text-left p-4 text-sm font-medium text-muted-foreground">
//                   Joined
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="4" className="p-6 text-center">
//                     Loading users...
//                   </td>
//                 </tr>
//               ) : filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="p-6 text-center">
//                     No users found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((user) => (
//                   <tr
//                     key={user.id}
//                     className="border-t border-border hover:bg-muted/30 transition-colors"
//                   >
//                     <td className="p-4 font-medium text-foreground">
//                       {user.name}
//                     </td>
//                     <td className="p-4 text-muted-foreground">{user.email}</td>
//                     <td className="p-4">
//                       <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="p-4 text-muted-foreground">
//                       {new Date(user.createdAt).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
import { useEffect, useState } from "react";
import {
  Users,
  Search,
  UserX,
  Trash2,
  ShieldAlert,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

const ROLE_OPTIONS = ["", "user", "owner", "admin"];
const ROLE_LABELS = {
  "": "All Roles",
  user: "Members",
  owner: "Owners",
  admin: "Admins",
};

function RoleBadge({ role }) {
  const map = {
    admin:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    owner: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    user: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[role] ?? "bg-muted text-muted-foreground"}`}
    >
      {role}
    </span>
  );
}

// ─── Confirm Dialog ────────────────────────────────────────────────────────
function ConfirmDialog({
  title,
  description,
  confirmLabel,
  confirmClass,
  onConfirm,
  onClose,
  loading,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className={confirmClass}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AllMembers() {
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // Confirm dialog state
  const [confirm, setConfirm] = useState(null); // { type: 'suspend'|'delete', user }

  // ── fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      if (data.success) setUsers(data.users ?? []);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── filter ───────────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  // ── suspend ───────────────────────────────────────────────────────────────
  const handleSuspend = async () => {
    if (!confirm) return;
    try {
      setActionId(confirm.user.id);
      await adminService.suspendUser(confirm.user.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === confirm.user.id ? { ...u, isSuspended: true } : u,
        ),
      );
      toast({
        title: "User suspended",
        description: `${confirm.user.name} has been suspended.`,
      });
      setConfirm(null);
    } catch (err) {
      toast({
        title: "Failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setActionId(null);
    }
  };

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm) return;
    try {
      setActionId(confirm.user.id);
      await adminService.deleteUser(confirm.user.id);
      setUsers((prev) => prev.filter((u) => u.id !== confirm.user.id));
      toast({
        title: "User deleted",
        description: `${confirm.user.name} has been removed.`,
      });
      setConfirm(null);
    } catch (err) {
      toast({
        title: "Failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-7">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">All Users</h1>
          <p className="text-muted-foreground mt-1">
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-t border-border">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 rounded bg-muted animate-pulse w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-14 text-center text-muted-foreground text-sm"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr
                      key={user.id}
                      className={`border-t border-border hover:bg-muted/20 transition-colors ${user.isSuspended ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-5 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-4">
                        {user.isSuspended ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Suspended
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        {user.role !== "admin" && (
                          <div className="flex items-center gap-2">
                            {!user.isSuspended && (
                              <button
                                onClick={() =>
                                  setConfirm({ type: "suspend", user })
                                }
                                disabled={actionId === user.id}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-600 transition-colors disabled:opacity-40"
                                title="Suspend user"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                Suspend
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setConfirm({ type: "delete", user })
                              }
                              disabled={actionId === user.id}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirm?.type === "suspend" && (
        <ConfirmDialog
          title="Suspend User"
          description={`Suspend "${confirm.user.name}"? They will lose access to the platform.`}
          confirmLabel="Suspend"
          confirmClass="bg-amber-600 hover:bg-amber-700 text-white"
          loading={actionId === confirm.user.id}
          onConfirm={handleSuspend}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm?.type === "delete" && (
        <ConfirmDialog
          title="Delete User"
          description={`Permanently delete "${confirm.user.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          confirmClass="bg-destructive hover:bg-destructive/90 text-white"
          loading={actionId === confirm.user.id}
          onConfirm={handleDelete}
          onClose={() => setConfirm(null)}
        />
      )}
    </AdminLayout>
  );
}
