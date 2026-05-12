// import { useEffect, useState } from "react";
// import { Calendar, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";

// export default function AdminCheckins() {
//   const { token } = useAuth();
//   const { toast } = useToast();

//   const [checkins, setCheckins] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedDate, setSelectedDate] = useState(""); // all-time
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCheckins();
//   }, []);

//   const fetchCheckins = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/admin/checkins`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch check-ins");
//       }

//       setCheckins(data.checkins || []);
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

//   /* ======================================================
//      🧠 SAFE NAME RESOLVER (member / user / admin)
//   ====================================================== */
//   const getPersonName = (c) =>
//     c.member?.name || c.user?.name || c.admin?.name || "Unknown";

//   /* ======================================================
//      🔍 SEARCH + OPTIONAL DATE FILTER
//   ====================================================== */
//   const filteredCheckins = checkins.filter((c) => {
//     const name = getPersonName(c).toLowerCase();
//     const gymName = c.gym?.name?.toLowerCase() || "";

//     const matchesSearch =
//       name.includes(search.toLowerCase()) ||
//       gymName.includes(search.toLowerCase());

//     const matchesDate = selectedDate
//       ? c.createdAt.startsWith(selectedDate)
//       : true;

//     return matchesSearch && matchesDate;
//   });

//   return (
//     <AdminLayout>
//       <div className="space-y-8">
//         <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
//           Check-ins
//         </h1>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//             <Input
//               placeholder="Search member or gym..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <Calendar className="w-5 h-5 text-muted-foreground" />
//             <Input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="w-auto"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-card rounded-2xl shadow-card overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-muted/50">
//               <tr>
//                 <th className="p-4 text-left text-sm text-muted-foreground">
//                   Member
//                 </th>
//                 <th className="p-4 text-left text-sm text-muted-foreground">
//                   Gym
//                 </th>
//                 <th className="p-4 text-left text-sm text-muted-foreground">
//                   Time
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="3" className="p-6 text-center">
//                     Loading check-ins...
//                   </td>
//                 </tr>
//               ) : filteredCheckins.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="p-6 text-center">
//                     No check-ins found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCheckins.map((c) => (
//                   <tr
//                     key={c.id}
//                     className="border-t border-border hover:bg-muted/30"
//                   >
//                     <td className="p-4 font-medium">{getPersonName(c)}</td>

//                     <td className="p-4">
//                       <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
//                         {c.gym?.name || "-"}
//                       </span>
//                     </td>

//                     <td className="p-4 text-muted-foreground">
//                       {new Date(c.createdAt).toLocaleString()}
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
import { Calendar, Search, RefreshCw, CalendarCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

export default function AdminCheckins() {
  const { toast } = useToast();

  const [checkins, setCheckins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  // ── fetch: re-runs when date changes (server-side date filter) ────────────
  const fetchCheckins = async (date = selectedDate) => {
    try {
      setLoading(true);
      const data = await adminService.getCheckins(date);
      if (data.success) setCheckins(data.checkins ?? []);
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

  useEffect(() => {
    fetchCheckins("");
  }, []); // initial: all
  // re-fetch when date changes
  useEffect(() => {
    if (selectedDate !== undefined) fetchCheckins(selectedDate);
  }, [selectedDate]);

  // ── client-side search filter (name / gym) ────────────────────────────────
  const filtered = checkins.filter((c) => {
    const name = (c.user?.name ?? "").toLowerCase();
    const gymName = (c.gym?.name ?? "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || gymName.includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Check-ins</h1>
            <p className="text-muted-foreground mt-1">
              {loading
                ? "Loading…"
                : `${filtered.length} check-in${filtered.length !== 1 ? "s" : ""}${selectedDate ? ` on ${selectedDate}` : " total"}`}
            </p>
          </div>
          <button
            onClick={() => fetchCheckins(selectedDate)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search member or gym…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  {["Member", "Email", "Gym", "City", "Checked In At"].map(
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
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-t border-border">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 rounded bg-muted animate-pulse w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center">
                      <CalendarCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <p className="text-muted-foreground text-sm">
                        {selectedDate
                          ? `No check-ins on ${selectedDate}`
                          : "No check-ins found"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                            {(c.user?.name ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">
                            {c.user?.name ?? "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {c.user?.email ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {c.gym?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {c.gym?.city ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(c.checkedInAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
