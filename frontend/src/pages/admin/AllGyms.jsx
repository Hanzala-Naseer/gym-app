// import { useEffect, useState } from "react";
// import { Building2, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";

// export default function AllGyms() {
//   const { token } = useAuth();
//   const { toast } = useToast();

//   const [gyms, setGyms] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchGyms();
//   }, []);

//   const fetchGyms = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/gyms`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch gyms");
//       }

//       setGyms(data.gyms);
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

//   const filteredGyms = gyms.filter((gym) =>
//     gym.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <AdminLayout>
//       <div className="space-y-8">
//         <h1 className="text-2xl lg:text-3xl font-bold">All Gyms</h1>

//         {/* Search */}
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//           <Input
//             placeholder="Search gyms..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         {/* Table */}
//         <div className="bg-card rounded-2xl shadow-card overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-muted/50">
//               <tr>
//                 <th className="p-4 text-left text-sm">Gym</th>
//                 <th className="p-4 text-left text-sm">Owner</th>
//                 <th className="p-4 text-left text-sm">Status</th>
//                 <th className="p-4 text-left text-sm">Address</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="4" className="p-6 text-center">
//                     Loading gyms...
//                   </td>
//                 </tr>
//               ) : filteredGyms.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="p-6 text-center">
//                     No gyms found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredGyms.map((gym) => (
//                   <tr key={gym.id} className="border-t hover:bg-muted/30">
//                     <td className="p-4 font-medium flex items-center gap-2">
//                       <Building2 className="w-4 h-4 text-muted-foreground" />
//                       {gym.name}
//                     </td>

//                     <td className="p-4 text-muted-foreground">
//                       {gym.owner?.name || "—"}
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

//                     <td className="p-4 text-muted-foreground">
//                       {gym.addressLine}
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

import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Search,
  Filter,
  Archive,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

const STATUS_OPTIONS = ["", "pending", "approved", "rejected"];
const STATUS_LABELS = {
  "": "All Statuses",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

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

export default function AllGyms() {
  const { toast } = useToast();

  const [gyms, setGyms] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [archivingId, setArchivingId] = useState(null);

  const LIMIT = 12;

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchGyms = useCallback(
    async (p = page) => {
      try {
        setLoading(true);
        const data = await adminService.getAllGyms({
          status,
          city,
          search,
          page: p,
          limit: LIMIT,
        });
        if (data.success) {
          setGyms(data.gyms ?? []);
          setMeta({ total: data.meta.total, totalPages: data.meta.totalPages });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err.response?.data?.message || err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [status, city, search, page],
  );

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setPage(1);
        fetchGyms(1);
      },
      search ? 400 : 0,
    );
    return () => clearTimeout(timer);
  }, [search, status, city]);

  useEffect(() => {
    fetchGyms(page);
  }, [page]);

  // ── archive ───────────────────────────────────────────────────────────────
  const handleArchive = async (gymId, gymName) => {
    if (
      !confirm(
        `Archive "${gymName}"? It will no longer appear in public listings.`,
      )
    )
      return;
    try {
      setArchivingId(gymId);
      await adminService.archiveGym(gymId);
      toast({
        title: "Gym archived",
        description: `"${gymName}" has been archived.`,
      });
      fetchGyms(page);
    } catch (err) {
      toast({
        title: "Archive failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setArchivingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-7">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">All Gyms</h1>
          <p className="text-muted-foreground mt-1">
            {meta.total} gym{meta.total !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>

            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-32"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  {[
                    "Gym",
                    "Owner",
                    "City",
                    "Status",
                    "Tier",
                    "Created",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-t border-border">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 rounded bg-muted animate-pulse w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : gyms.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-14 text-center text-muted-foreground text-sm"
                    >
                      No gyms found matching your filters
                    </td>
                  </tr>
                ) : (
                  gyms.map((gym) => (
                    <tr
                      key={gym.id}
                      className="border-t border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="font-medium text-sm">
                            {gym.name}
                          </span>
                          {gym.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {gym.owner?.name ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {gym.city}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={gym.status} />
                      </td>
                      <td className="px-5 py-4 text-sm font-medium">
                        {gym.tier}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(gym.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleArchive(gym.id, gym.name)}
                          disabled={archivingId === gym.id}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                          title="Archive gym"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          {archivingId === gym.id ? "…" : "Archive"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= meta.totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
