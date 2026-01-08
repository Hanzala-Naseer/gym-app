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
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
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

//       setCheckins(data.checkins);
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

//   // 🔍 Search + Date filter
//   const filteredCheckins = checkins.filter((c) => {
//     const matchesSearch =
//       c.member?.name.toLowerCase().includes(search.toLowerCase()) ||
//       c.gym?.name.toLowerCase().includes(search.toLowerCase());

//     const matchesDate = c.createdAt.split("T")[0] === selectedDate;

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
//                     <td className="p-4 font-medium">{c.member?.name}</td>

//                     <td className="p-4">
//                       <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
//                         {c.gym?.name}
//                       </span>
//                     </td>

//                     <td className="p-4 text-muted-foreground">
//                       {new Date(c.createdAt).toLocaleTimeString()}
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
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AdminCheckins() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [checkins, setCheckins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // all-time
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/checkins`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch check-ins");
      }

      setCheckins(data.checkins || []);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     🧠 SAFE NAME RESOLVER (member / user / admin)
  ====================================================== */
  const getPersonName = (c) =>
    c.member?.name || c.user?.name || c.admin?.name || "Unknown";

  /* ======================================================
     🔍 SEARCH + OPTIONAL DATE FILTER
  ====================================================== */
  const filteredCheckins = checkins.filter((c) => {
    const name = getPersonName(c).toLowerCase();
    const gymName = c.gym?.name?.toLowerCase() || "";

    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      gymName.includes(search.toLowerCase());

    const matchesDate = selectedDate
      ? c.createdAt.startsWith(selectedDate)
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Check-ins
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search member or gym..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm text-muted-foreground">
                  Member
                </th>
                <th className="p-4 text-left text-sm text-muted-foreground">
                  Gym
                </th>
                <th className="p-4 text-left text-sm text-muted-foreground">
                  Time
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center">
                    Loading check-ins...
                  </td>
                </tr>
              ) : filteredCheckins.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center">
                    No check-ins found
                  </td>
                </tr>
              ) : (
                filteredCheckins.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <td className="p-4 font-medium">{getPersonName(c)}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {c.gym?.name || "-"}
                      </span>
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
