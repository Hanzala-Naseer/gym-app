// import { useEffect, useState, useCallback } from "react";
// import {
//   Building2,
//   Search,
//   Filter,
//   Archive,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { useToast } from "@/hooks/use-toast";
// import { adminService } from "@/services/adminService";

// const STATUS_OPTIONS = ["", "pending", "approved", "rejected"];
// const STATUS_LABELS = {
//   "": "All Statuses",
//   pending: "Pending",
//   approved: "Approved",
//   rejected: "Rejected",
// };

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

// export default function AllGyms() {
//   const { toast } = useToast();

//   const [gyms, setGyms] = useState([]);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");
//   const [city, setCity] = useState("");
//   const [page, setPage] = useState(1);
//   const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
//   const [loading, setLoading] = useState(true);
//   const [archivingId, setArchivingId] = useState(null);

//   const LIMIT = 12;

//   // ── fetch ─────────────────────────────────────────────────────────────────
//   const fetchGyms = useCallback(
//     async (p = page) => {
//       try {
//         setLoading(true);
//         const data = await adminService.getAllGyms({
//           status,
//           city,
//           search,
//           page: p,
//           limit: LIMIT,
//         });
//         if (data.success) {
//           setGyms(data.gyms ?? []);
//           setMeta({ total: data.meta.total, totalPages: data.meta.totalPages });
//         }
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: err.response?.data?.message || err.message,
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [status, city, search, page],
//   );

//   useEffect(() => {
//     const timer = setTimeout(
//       () => {
//         setPage(1);
//         fetchGyms(1);
//       },
//       search ? 400 : 0,
//     );
//     return () => clearTimeout(timer);
//   }, [search, status, city]);

//   useEffect(() => {
//     fetchGyms(page);
//   }, [page]);

//   // ── archive ───────────────────────────────────────────────────────────────
//   const handleArchive = async (gymId, gymName) => {
//     if (
//       !confirm(
//         `Archive "${gymName}"? It will no longer appear in public listings.`,
//       )
//     )
//       return;
//     try {
//       setArchivingId(gymId);
//       await adminService.archiveGym(gymId);
//       toast({
//         title: "Gym archived",
//         description: `"${gymName}" has been archived.`,
//       });
//       fetchGyms(page);
//     } catch (err) {
//       toast({
//         title: "Archive failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setArchivingId(null);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-7">
//         {/* Header */}
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold">All Gyms</h1>
//           <p className="text-muted-foreground mt-1">
//             {meta.total} gym{meta.total !== 1 ? "s" : ""} total
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//             <Input
//               placeholder="Search name or city…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-9"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
//             <select
//               value={status}
//               onChange={(e) => {
//                 setStatus(e.target.value);
//                 setPage(1);
//               }}
//               className="px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
//             >
//               {STATUS_OPTIONS.map((s) => (
//                 <option key={s} value={s}>
//                   {STATUS_LABELS[s]}
//                 </option>
//               ))}
//             </select>

//             <Input
//               placeholder="City"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               className="w-32"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-card rounded-2xl shadow-card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-muted/40">
//                 <tr>
//                   {[
//                     "Gym",
//                     "Owner",
//                     "City",
//                     "Status",
//                     "Tier",
//                     "Created",
//                     "",
//                   ].map((h) => (
//                     <th
//                       key={h}
//                       className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   [...Array(6)].map((_, i) => (
//                     <tr key={i} className="border-t border-border">
//                       {[...Array(7)].map((_, j) => (
//                         <td key={j} className="px-5 py-4">
//                           <div className="h-4 rounded bg-muted animate-pulse w-20" />
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 ) : gyms.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="7"
//                       className="px-5 py-14 text-center text-muted-foreground text-sm"
//                     >
//                       No gyms found matching your filters
//                     </td>
//                   </tr>
//                 ) : (
//                   gyms.map((gym) => (
//                     <tr
//                       key={gym.id}
//                       className="border-t border-border hover:bg-muted/20 transition-colors"
//                     >
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-2">
//                           <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
//                           <span className="font-medium text-sm">
//                             {gym.name}
//                           </span>
//                           {gym.isFeatured && (
//                             <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
//                               Featured
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-5 py-4 text-sm text-muted-foreground">
//                         {gym.owner?.name ?? "—"}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-muted-foreground">
//                         {gym.city}
//                       </td>
//                       <td className="px-5 py-4">
//                         <StatusBadge status={gym.status} />
//                       </td>
//                       <td className="px-5 py-4 text-sm font-medium">
//                         {gym.tier}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
//                         {new Date(gym.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-5 py-4">
//                         <button
//                           onClick={() => handleArchive(gym.id, gym.name)}
//                           disabled={archivingId === gym.id}
//                           className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
//                           title="Archive gym"
//                         >
//                           <Archive className="w-3.5 h-3.5" />
//                           {archivingId === gym.id ? "…" : "Archive"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {meta.totalPages > 1 && (
//             <div className="flex items-center justify-between px-5 py-4 border-t border-border">
//               <p className="text-sm text-muted-foreground">
//                 Page {page} of {meta.totalPages} ({meta.total} total)
//               </p>
//               <div className="flex gap-2">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   disabled={page <= 1 || loading}
//                   onClick={() => setPage((p) => p - 1)}
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                   Prev
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   disabled={page >= meta.totalPages || loading}
//                   onClick={() => setPage((p) => p + 1)}
//                 >
//                   Next
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
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
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  AlertTriangle,
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

const TIER_OPTIONS = [
  { value: 1, label: "Tier 1 - Basic" },
  { value: 2, label: "Tier 2 - Pro" },
  { value: 3, label: "Tier 3 - Elite" },
];

// ── Color Tokens from Design System ─────────────────────────────────────────
const COLORS = {
  chocolate: "#2C1A0E",
  caramel: "#C68642",
  cream: "#FDF6EC",
  white: "#FFFFFF",
  truffleMuted: "#7B4F2E",
  truffleLight: "#9D806F",
  surface: "#fff8f0",
  surfaceContainer: "#f4ede3",
  error: "#ba1a1a",
  errorBg: "#ffdad6",
  success: "#1a7a4a",
  successBg: "#d4edda",
  warning: "#885210",
  warningBg: "#ffdcbe",
};

function StatusBadge({ status }) {
  const styles = {
    approved: {
      bg: COLORS.successBg,
      text: COLORS.success,
      border: "#b8d4c0",
    },
    pending: {
      bg: COLORS.warningBg,
      text: COLORS.warning,
      border: "#e8c9a0",
    },
    rejected: {
      bg: COLORS.errorBg,
      text: COLORS.error,
      border: "#e8c0c0",
    },
  };

  const style = styles[status] || {
    bg: COLORS.surfaceContainer,
    text: COLORS.truffleMuted,
    border: COLORS.cream,
  };

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold border"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {status}
    </span>
  );
}

function TierBadge({ tier }) {
  const colors = {
    1: { bg: "#e8f0fe", text: "#1a5fb4", border: "#bcd4f7" },
    2: { bg: "#f3e8ff", text: "#7c3aed", border: "#d4c4f7" },
    3: { bg: "#fff3e0", text: "#e65100", border: "#ffd8a8" },
  };

  const style = colors[tier] || {
    bg: COLORS.surfaceContainer,
    text: COLORS.truffleMuted,
    border: COLORS.cream,
  };

  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      Tier {tier ?? "—"}
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
  const [actionId, setActionId] = useState(null);
  const [editingGym, setEditingGym] = useState(null);

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

  // ── remove (hard delete) ───────────────────────────────────────────────────
  const handleRemove = async (gymId, gymName) => {
    if (
      !confirm(
        `⚠️ PERMANENTLY DELETE "${gymName}"?\n\nThis will:\n• Delete all gym data permanently\n• Remove all check-in history\n• Delete all photos & documents\n\nThis action CANNOT be undone!`,
      )
    )
      return;

    // Double confirmation for destructive action
    if (
      !confirm(
        `FINAL CONFIRMATION:\nPermanently remove "${gymName}"\n\nThis is irreversible!`,
      )
    )
      return;

    try {
      setActionId(gymId);
      await adminService.deleteGym(gymId); // Backend handles related deletions
      toast({
        title: "Gym deleted permanently",
        description: `"${gymName}" and all associated data have been removed.`,
        variant: "destructive",
      });
      fetchGyms(page);
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setActionId(null);
    }
  };

  // ── update tier ────────────────────────────────────────────────────────────
  const handleUpdateTier = async (gymId, newTier) => {
    try {
      setActionId(gymId);
      await adminService.updateGymTier(gymId, { tier: newTier });
      toast({
        title: "Tier updated",
        description: `Gym tier changed to Tier ${newTier}.`,
      });
      setEditingGym(null);
      fetchGyms(page);
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <AdminLayout>
      <div
        className="space-y-6"
        style={{ backgroundColor: COLORS.surface, minHeight: "100vh" }}
      >
        {/* Header */}
        <div className="space-y-1">
          <h1
            className="text-2xl lg:text-3xl font-bold"
            style={{ color: COLORS.chocolate, fontFamily: "Inter, sans-serif" }}
          >
            All Gyms
          </h1>
          <p style={{ color: COLORS.truffleMuted, fontSize: "14px" }}>
            {meta.total} gym{meta.total !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Filters */}
        <div
          className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl"
          style={{
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.cream}`,
          }}
        >
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: COLORS.truffleMuted }}
            />
            <Input
              placeholder="Search name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              style={{
                backgroundColor: COLORS.cream,
                borderColor: "rgba(123, 79, 46, 0.2)",
                borderRadius: "8px",
                color: COLORS.chocolate,
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter
              className="w-4 h-4 shrink-0"
              style={{ color: COLORS.truffleMuted }}
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: COLORS.cream,
                border: `1px solid rgba(123, 79, 46, 0.2)`,
                borderRadius: "8px",
                color: COLORS.chocolate,
              }}
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
              style={{
                backgroundColor: COLORS.cream,
                borderColor: "rgba(123, 79, 46, 0.2)",
                borderRadius: "8px",
                color: COLORS.chocolate,
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: COLORS.white,
            boxShadow: "0 4px 20px -2px rgba(123, 79, 46, 0.08)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: COLORS.cream }}>
                <tr>
                  {[
                    "Gym",
                    "Owner",
                    "City",
                    "Status",
                    "Tier",
                    "Created",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                      style={{
                        color: COLORS.truffleMuted,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr
                      key={i}
                      style={{ borderTop: `1px solid ${COLORS.cream}` }}
                    >
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div
                            className="h-4 rounded animate-pulse w-20"
                            style={{ backgroundColor: COLORS.surfaceContainer }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : gyms.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-14 text-center text-sm"
                      style={{ color: COLORS.truffleMuted }}
                    >
                      No gyms found matching your filters
                    </td>
                  </tr>
                ) : (
                  gyms.map((gym) => (
                    <tr
                      key={gym.id}
                      className="transition-colors hover:bg-opacity-50"
                      style={{
                        borderTop: `1px solid ${COLORS.cream}`,
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          COLORS.surfaceContainer)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: COLORS.cream }}
                          >
                            <Building2
                              className="w-5 h-5"
                              style={{ color: COLORS.caramel }}
                            />
                          </div>
                          <div>
                            <span
                              className="font-medium text-sm block"
                              style={{ color: COLORS.chocolate }}
                            >
                              {gym.name}
                            </span>
                            {gym.isFeatured && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[10px] font-bold inline-block mt-1"
                                style={{
                                  backgroundColor: COLORS.warningBg,
                                  color: COLORS.warning,
                                }}
                              >
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-5 py-4 text-sm"
                        style={{ color: COLORS.truffleMuted }}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5" />
                          {gym.owner?.name ?? "—"}
                        </div>
                      </td>
                      <td
                        className="px-5 py-4 text-sm"
                        style={{ color: COLORS.truffleMuted }}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" />
                          {gym.city}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={gym.status} />
                      </td>
                      <td className="px-5 py-4">
                        {editingGym === gym.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={gym.tier ?? 1}
                              onChange={(e) =>
                                handleUpdateTier(gym.id, Number(e.target.value))
                              }
                              className="px-2 py-1 text-xs rounded border"
                              style={{
                                backgroundColor: COLORS.cream,
                                borderColor: "rgba(123, 79, 46, 0.2)",
                                color: COLORS.chocolate,
                              }}
                              disabled={actionId === gym.id}
                            >
                              {TIER_OPTIONS.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => setEditingGym(null)}
                              className="text-xs hover:opacity-70 transition-opacity"
                              style={{ color: COLORS.truffleMuted }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <TierBadge tier={gym.tier} />
                            <button
                              onClick={() => setEditingGym(gym.id)}
                              className="transition-opacity hover:opacity-70"
                              style={{ color: COLORS.truffleMuted }}
                              title="Edit tier"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td
                        className="px-5 py-4 text-sm whitespace-nowrap"
                        style={{ color: COLORS.truffleMuted }}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(gym.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {/* Remove (Hard Delete) - Only action now */}
                        <button
                          onClick={() => handleRemove(gym.id, gym.name)}
                          disabled={actionId === gym.id}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all disabled:opacity-40"
                          style={{
                            color: COLORS.error,
                            backgroundColor: "transparent",
                            border: `1px solid ${COLORS.errorBg}`,
                          }}
                          onMouseEnter={(e) => {
                            if (actionId !== gym.id) {
                              e.currentTarget.style.backgroundColor =
                                COLORS.errorBg;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                          title="Permanently delete gym"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {actionId === gym.id ? "Deleting…" : "Remove"}
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
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderTop: `1px solid ${COLORS.cream}` }}
            >
              <p className="text-sm" style={{ color: COLORS.truffleMuted }}>
                Page {page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                  style={{
                    borderColor: "rgba(123, 79, 46, 0.2)",
                    color: COLORS.chocolate,
                    borderRadius: "8px",
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= meta.totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    borderColor: "rgba(123, 79, 46, 0.2)",
                    color: COLORS.chocolate,
                    borderRadius: "8px",
                  }}
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
