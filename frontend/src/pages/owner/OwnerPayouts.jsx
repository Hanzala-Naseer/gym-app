// import { useEffect, useState } from "react";
// import {
//   Loader2,
//   DollarSign,
//   Building2,
//   Calendar,
//   TrendingUp,
//   TrendingDown,
//   Wallet,
//   ArrowUpRight,
//   Users,
// } from "lucide-react";
// import OwnerLayout from "@/components/layouts/OwnerLayout";
// import { adminService } from "../../services/adminService";
// import { useToast } from "@/hooks/use-toast";

// export default function OwnerPayouts() {
//   const { toast } = useToast();
//   const [gyms, setGyms] = useState([]);
//   const [selectedGym, setSelectedGym] = useState(null);
//   const [payoutData, setPayoutData] = useState(null);
//   const [historyData, setHistoryData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview"); // overview | history

//   useEffect(() => {
//     fetchOwnerGyms();
//   }, []);

//   const fetchOwnerGyms = async () => {
//     try {
//       setLoading(true);
//       // Assuming you have an endpoint to get owner's gyms
//       // If not, adjust to your actual endpoint
//       const response = (await adminService.getOwnerGyms?.()) || { gyms: [] };
//       setGyms(response.gyms || []);
//       if (response.gyms?.length > 0) {
//         setSelectedGym(response.gyms[0]);
//         fetchPayoutSummary(response.gyms[0].id);
//       }
//     } catch (err) {
//       toast({ title: "Failed to load gyms", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPayoutSummary = async (gymId) => {
//     try {
//       const data = await adminService.getGymPayoutSummary(gymId);
//       setPayoutData(data.summary);
//     } catch (err) {
//       toast({ title: "Failed to load payout summary", variant: "destructive" });
//     }
//   };

//   const fetchPayoutHistory = async (gymId) => {
//     try {
//       setLoading(true);
//       const data = await adminService.getPayoutHistory(gymId);
//       setHistoryData(data);
//     } catch (err) {
//       toast({ title: "Failed to load history", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGymChange = (gymId) => {
//     const gym = gyms.find((g) => g.id === gymId);
//     setSelectedGym(gym);
//     setPayoutData(null);
//     setHistoryData(null);
//     fetchPayoutSummary(gymId);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (tab === "history" && selectedGym && !historyData) {
//       fetchPayoutHistory(selectedGym.id);
//     }
//   };

//   if (loading && !payoutData) {
//     return (
//       <OwnerLayout>
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="w-8 h-8 animate-spin text-[#9A5A17]" />
//         </div>
//       </OwnerLayout>
//     );
//   }

//   if (gyms.length === 0) {
//     return (
//       <OwnerLayout>
//         <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
//           <div className="max-w-[1200px] mx-auto">
//             <div className="rounded-[28px] bg-white border border-[#E9DED3] p-12 text-center">
//               <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto">
//                 <Building2 className="w-7 h-7 text-[#8A7B70]" />
//               </div>
//               <h3 className="mt-4 text-lg font-semibold text-[#2B160B]">
//                 No gyms registered
//               </h3>
//               <p className="mt-1 text-sm text-[#7A6A5D]">
//                 Register a gym to start seeing payout data.
//               </p>
//             </div>
//           </div>
//         </div>
//       </OwnerLayout>
//     );
//   }

//   return (
//     <OwnerLayout>
//       <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
//         <div className="max-w-[1200px] mx-auto space-y-6">
//           {/* Header */}
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
//                   <DollarSign className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-[#2B160B]">
//                     Payouts & Revenue
//                   </h1>
//                   <p className="text-sm text-[#7A6A5D]">
//                     Track your gym earnings and payout status
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Gym Selector */}
//             {gyms.length > 1 && (
//               <select
//                 value={selectedGym?.id || ""}
//                 onChange={(e) => handleGymChange(e.target.value)}
//                 className="h-10 px-4 rounded-xl border border-[#D9CDBF] bg-white text-sm text-[#2B160B] outline-none focus:border-[#9A5A17]"
//               >
//                 {gyms.map((gym) => (
//                   <option key={gym.id} value={gym.id}>
//                     {gym.name}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           {selectedGym && payoutData && (
//             <>
//               {/* Summary Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
//                       <Wallet className="w-5 h-5 text-emerald-600" />
//                     </div>
//                     <p className="text-xs text-[#7A6A5D] uppercase">
//                       Total Visits
//                     </p>
//                   </div>
//                   <p className="text-3xl font-bold text-[#2B160B]">
//                     {payoutData.totalVisits?.toLocaleString() || 0}
//                   </p>
//                 </div>

//                 <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
//                       <TrendingUp className="w-5 h-5 text-amber-600" />
//                     </div>
//                     <p className="text-xs text-[#7A6A5D] uppercase">
//                       Paid Earnings
//                     </p>
//                   </div>
//                   <p className="text-3xl font-bold text-[#2B160B]">
//                     PKR {payoutData.paid?.amountPKR?.toLocaleString() || 0}
//                   </p>
//                   <p className="text-xs text-[#8A7B70] mt-1">
//                     {payoutData.paid?.visits || 0} visits paid
//                   </p>
//                 </div>

//                 <div className="rounded-[24px] bg-white border border-red-200 p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
//                       <TrendingDown className="w-5 h-5 text-red-600" />
//                     </div>
//                     <p className="text-xs text-red-600 uppercase">Pending</p>
//                   </div>
//                   <p className="text-3xl font-bold text-red-600">
//                     PKR {payoutData.unpaid?.amountPKR?.toLocaleString() || 0}
//                   </p>
//                   <p className="text-xs text-red-400 mt-1">
//                     {payoutData.unpaid?.visits || 0} visits pending
//                   </p>
//                 </div>

//                 <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
//                       <ArrowUpRight className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <p className="text-xs text-[#7A6A5D] uppercase">
//                       Per Visit
//                     </p>
//                   </div>
//                   <p className="text-3xl font-bold text-[#2B160B]">
//                     PKR{" "}
//                     {(payoutData.payoutPerVisit / 100)?.toLocaleString() || 0}
//                   </p>
//                   <p className="text-xs text-[#8A7B70] mt-1">
//                     Current payout rate
//                   </p>
//                 </div>
//               </div>

//               {/* Tabs */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleTabChange("overview")}
//                   className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
//                     activeTab === "overview"
//                       ? "bg-[#2A1608] text-white"
//                       : "bg-white border border-[#D9CDBF] text-[#6B625A] hover:bg-[#F5F0E8]"
//                   }`}
//                 >
//                   Overview
//                 </button>
//                 <button
//                   onClick={() => handleTabChange("history")}
//                   className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
//                     activeTab === "history"
//                       ? "bg-[#2A1608] text-white"
//                       : "bg-white border border-[#D9CDBF] text-[#6B625A] hover:bg-[#F5F0E8]"
//                   }`}
//                 >
//                   Payout History
//                 </button>
//               </div>

//               {/* Overview Tab */}
//               {activeTab === "overview" && (
//                 <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
//                   <h3 className="text-lg font-bold text-[#2B160B] mb-4">
//                     Gym Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-3">
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">Gym Name</span>
//                         <span className="text-sm font-medium text-[#2B160B]">
//                           {payoutData.gymName}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">Gym Tier</span>
//                         <span className="text-sm font-medium text-[#2B160B]">
//                           {payoutData.gymTier}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">
//                           Payout Rate
//                         </span>
//                         <span className="text-sm font-medium text-[#2B160B]">
//                           PKR{" "}
//                           {(payoutData.payoutPerVisit / 100)?.toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">
//                           Total Visits
//                         </span>
//                         <span className="text-sm font-medium text-[#2B160B]">
//                           {payoutData.totalVisits}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">
//                           Paid Visits
//                         </span>
//                         <span className="text-sm font-medium text-emerald-600">
//                           {payoutData.paid?.visits || 0}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">
//                           Unpaid Visits
//                         </span>
//                         <span className="text-sm font-medium text-red-600">
//                           {payoutData.unpaid?.visits || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Pending Alert */}
//                   {payoutData.unpaid?.visits > 0 && (
//                     <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
//                       <div className="flex items-start gap-3">
//                         <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
//                         <div>
//                           <p className="text-sm font-medium text-amber-800">
//                             Pending Payout
//                           </p>
//                           <p className="text-xs text-amber-600 mt-1">
//                             You have {payoutData.unpaid.visits} unpaid visits
//                             worth PKR{" "}
//                             {payoutData.unpaid.amountPKR?.toLocaleString()}.
//                             Admin will process the payout soon.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* History Tab */}
//               {activeTab === "history" && (
//                 <div className="rounded-[24px] bg-white border border-[#E9DED3] overflow-hidden">
//                   <div className="p-6 border-b border-[#E9DED3]">
//                     <h3 className="text-lg font-bold text-[#2B160B]">
//                       Monthly Payout History
//                     </h3>
//                   </div>

//                   {loading ? (
//                     <div className="flex items-center justify-center h-32">
//                       <Loader2 className="w-6 h-6 animate-spin text-[#9A5A17]" />
//                     </div>
//                   ) : historyData?.monthlyBreakdown &&
//                     Object.keys(historyData.monthlyBreakdown).length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-[#FCFAF8]">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase">
//                               Month
//                             </th>
//                             <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
//                               Visits
//                             </th>
//                             <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
//                               Amount (PKR)
//                             </th>
//                             <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
//                               Status
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-[#E9DED3]">
//                           {Object.entries(historyData.monthlyBreakdown)
//                             .sort((a, b) => b[0].localeCompare(a[0]))
//                             .map(([month, data]) => (
//                               <tr key={month} className="hover:bg-[#FCFAF8]">
//                                 <td className="px-6 py-4 text-sm font-medium text-[#2B160B]">
//                                   {new Date(month + "-01").toLocaleDateString(
//                                     "en-US",
//                                     { month: "long", year: "numeric" },
//                                   )}
//                                 </td>
//                                 <td className="px-6 py-4 text-right text-sm text-[#6B625A]">
//                                   {data.visits}
//                                 </td>
//                                 <td className="px-6 py-4 text-right text-sm font-bold text-[#2B160B]">
//                                   {data.amountPKR.toLocaleString()}
//                                 </td>
//                                 <td className="px-6 py-4 text-right">
//                                   <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-600">
//                                     <Wallet className="w-3 h-3" />
//                                     Paid
//                                   </span>
//                                 </td>
//                               </tr>
//                             ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="p-12 text-center">
//                       <div className="w-12 h-12 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto">
//                         <Calendar className="w-5 h-5 text-[#8A7B70]" />
//                       </div>
//                       <p className="mt-3 text-sm text-[#7A6A5D]">
//                         No payout history yet
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </OwnerLayout>
//   );
// }
import { useEffect, useState } from "react";
import {
  Loader2,
  DollarSign,
  Building2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  Users,
  AlertCircle,
} from "lucide-react";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { gymService } from "@/services/gymService";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function OwnerPayouts() {
  const { toast } = useToast();
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [payoutData, setPayoutData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchOwnerGyms();
  }, []);

  const fetchOwnerGyms = async () => {
    try {
      setLoading(true);
      // Use gymService instead of adminService for owner gyms
      const response = await gymService.getMyGyms();
      console.log("Owner gyms response:", response); // Debug log

      // Handle different response structures
      const gymsList = response?.gyms || response?.data?.gyms || response || [];
      const normalizedGyms = Array.isArray(gymsList) ? gymsList : [];

      setGyms(normalizedGyms);

      if (normalizedGyms.length > 0) {
        setSelectedGym(normalizedGyms[0]);
        await fetchPayoutSummary(normalizedGyms[0].id);
      }
    } catch (err) {
      console.error("Error fetching gyms:", err);
      toast({
        title: "Failed to load gyms",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPayoutSummary = async (gymId) => {
    try {
      const data = await adminService.getGymPayoutSummary(gymId);
      console.log("Payout summary:", data); // Debug log
      setPayoutData(data.summary || data);
    } catch (err) {
      console.error("Error fetching payout:", err);
      toast({
        title: "Failed to load payout summary",
        variant: "destructive",
      });
    }
  };

  const fetchPayoutHistory = async (gymId) => {
    try {
      setLoading(true);
      const data = await adminService.getPayoutHistory(gymId);
      console.log("Payout history:", data); // Debug log
      setHistoryData(data);
    } catch (err) {
      console.error("Error fetching history:", err);
      toast({
        title: "Failed to load history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGymChange = (gymId) => {
    const gym = gyms.find((g) => g.id === gymId);
    setSelectedGym(gym);
    setPayoutData(null);
    setHistoryData(null);
    fetchPayoutSummary(gymId);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "history" && selectedGym && !historyData) {
      fetchPayoutHistory(selectedGym.id);
    }
  };

  // Loading state
  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#9A5A17]" />
        </div>
      </OwnerLayout>
    );
  }

  // No gyms registered
  if (!loading && gyms.length === 0) {
    return (
      <OwnerLayout>
        <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="rounded-[28px] bg-white border border-[#E9DED3] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#2B160B]">
                No gyms registered yet
              </h3>
              <p className="mt-2 text-sm text-[#7A6A5D] max-w-md mx-auto">
                You need to register a gym first before you can view payout
                data. Complete your gym registration to start tracking earnings.
              </p>
              <button
                onClick={() =>
                  (window.location.href = "/dashboard/owner/register-gym")
                }
                className="mt-6 h-11 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors"
              >
                Register Your Gym
              </button>
            </div>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  // Has gyms - show payout data
  return (
    <OwnerLayout>
      <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#2B160B]">
                    Payouts & Revenue
                  </h1>
                  <p className="text-sm text-[#7A6A5D]">
                    Track your gym earnings and payout status
                  </p>
                </div>
              </div>
            </div>

            {/* Gym Selector */}
            {gyms.length > 1 && (
              <select
                value={selectedGym?.id || ""}
                onChange={(e) => handleGymChange(e.target.value)}
                className="h-10 px-4 rounded-xl border border-[#D9CDBF] bg-white text-sm text-[#2B160B] outline-none focus:border-[#9A5A17]"
              >
                {gyms.map((gym) => (
                  <option key={gym.id} value={gym.id}>
                    {gym.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedGym && payoutData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-xs text-[#7A6A5D] uppercase">
                      Total Visits
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-[#2B160B]">
                    {(payoutData.totalVisits || 0).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-xs text-[#7A6A5D] uppercase">
                      Paid Earnings
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-[#2B160B]">
                    PKR {(payoutData.paid?.amountPKR || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-[#8A7B70] mt-1">
                    {(payoutData.paid?.visits || 0).toLocaleString()} visits
                    paid
                  </p>
                </div>

                <div className="rounded-[24px] bg-white border border-red-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-xs text-red-600 uppercase">Pending</p>
                  </div>
                  <p className="text-3xl font-bold text-red-600">
                    PKR {(payoutData.unpaid?.amountPKR || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-red-400 mt-1">
                    {(payoutData.unpaid?.visits || 0).toLocaleString()} visits
                    pending
                  </p>
                </div>

                <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-[#7A6A5D] uppercase">
                      Per Visit
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-[#2B160B]">
                    PKR{" "}
                    {((payoutData.payoutPerVisit || 0) / 100).toLocaleString()}
                  </p>
                  <p className="text-xs text-[#8A7B70] mt-1">
                    Current payout rate
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleTabChange("overview")}
                  className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-[#2A1608] text-white"
                      : "bg-white border border-[#D9CDBF] text-[#6B625A] hover:bg-[#F5F0E8]"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleTabChange("history")}
                  className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === "history"
                      ? "bg-[#2A1608] text-white"
                      : "bg-white border border-[#D9CDBF] text-[#6B625A] hover:bg-[#F5F0E8]"
                  }`}
                >
                  Payout History
                </button>
              </div>

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
                  <h3 className="text-lg font-bold text-[#2B160B] mb-4">
                    Gym Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
                        <span className="text-sm text-[#7A6A5D]">Gym Name</span>
                        <span className="text-sm font-medium text-[#2B160B]">
                          {payoutData.gymName || selectedGym?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
                        <span className="text-sm text-[#7A6A5D]">Gym Tier</span>
                        <span className="text-sm font-medium text-[#2B160B]">
                          {payoutData.gymTier ||
                            selectedGym?.gymTier ||
                            "BASIC"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
                        <span className="text-sm text-[#7A6A5D]">
                          Payout Rate
                        </span>
                        <span className="text-sm font-medium text-[#2B160B]">
                          PKR{" "}
                          {(
                            (payoutData.payoutPerVisit || 70) / 100
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
                        <span className="text-sm text-[#7A6A5D]">
                          Total Visits
                        </span>
                        <span className="text-sm font-medium text-[#2B160B]">
                          {(payoutData.totalVisits || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
                        <span className="text-sm text-[#7A6A5D]">
                          Paid Visits
                        </span>
                        <span className="text-sm font-medium text-emerald-600">
                          {(payoutData.paid?.visits || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
                        <span className="text-sm text-[#7A6A5D]">
                          Unpaid Visits
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {(payoutData.unpaid?.visits || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pending Alert */}
                  {(payoutData.unpaid?.visits || 0) > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            Pending Payout
                          </p>
                          <p className="text-xs text-amber-600 mt-1">
                            You have{" "}
                            {(payoutData.unpaid?.visits || 0).toLocaleString()}{" "}
                            unpaid visits worth PKR{" "}
                            {(
                              payoutData.unpaid?.amountPKR || 0
                            ).toLocaleString()}
                            . Admin will process the payout soon.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div className="rounded-[24px] bg-white border border-[#E9DED3] overflow-hidden">
                  <div className="p-6 border-b border-[#E9DED3]">
                    <h3 className="text-lg font-bold text-[#2B160B]">
                      Monthly Payout History
                    </h3>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin text-[#9A5A17]" />
                    </div>
                  ) : historyData?.monthlyBreakdown &&
                    Object.keys(historyData.monthlyBreakdown).length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#FCFAF8]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase">
                              Month
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
                              Visits
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
                              Amount (PKR)
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E9DED3]">
                          {Object.entries(historyData.monthlyBreakdown)
                            .sort((a, b) => b[0].localeCompare(a[0]))
                            .map(([month, data]) => (
                              <tr key={month} className="hover:bg-[#FCFAF8]">
                                <td className="px-6 py-4 text-sm font-medium text-[#2B160B]">
                                  {new Date(month + "-01").toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "long",
                                      year: "numeric",
                                    },
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-[#6B625A]">
                                  {data.visits || 0}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-bold text-[#2B160B]">
                                  {(data.amountPKR || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-600">
                                    <Wallet className="w-3 h-3" />
                                    Paid
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto">
                        <Calendar className="w-5 h-5 text-[#8A7B70]" />
                      </div>
                      <p className="mt-3 text-sm text-[#7A6A5D]">
                        No payout history yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
