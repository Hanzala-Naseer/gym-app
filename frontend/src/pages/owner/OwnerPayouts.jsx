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
//   AlertCircle,
//   Receipt,
//   Clock,
//   CheckCircle2,
// } from "lucide-react";
// import OwnerLayout from "@/components/layouts/OwnerLayout";
// import { gymService } from "@/services/gymService";
// import { useToast } from "@/hooks/use-toast";

// export default function OwnerPayouts() {
//   const { toast } = useToast();
//   const [gyms, setGyms] = useState([]);
//   const [selectedGym, setSelectedGym] = useState(null);
//   const [payoutData, setPayoutData] = useState(null);
//   const [historyData, setHistoryData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     fetchOwnerGyms();
//   }, []);

//   const fetchOwnerGyms = async () => {
//     try {
//       setLoading(true);
//       const response = await gymService.getMyGyms();
//       const gymsList = response?.gyms || response?.data?.gyms || response || [];
//       const normalizedGyms = Array.isArray(gymsList) ? gymsList : [];

//       setGyms(normalizedGyms);

//       if (normalizedGyms.length > 0) {
//         setSelectedGym(normalizedGyms[0]);
//         await fetchPayoutSummary(normalizedGyms[0].id);
//       }
//     } catch (err) {
//       console.error("Error fetching gyms:", err);
//       toast({
//         title: "Failed to load gyms",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPayoutSummary = async (gymId) => {
//     try {
//       const data = await gymService.getGymPayoutSummary(gymId);
//       setPayoutData(data.summary || data);
//     } catch (err) {
//       console.error("Error fetching payout:", err);
//       toast({
//         title: "Failed to load payout summary",
//         variant: "destructive",
//       });
//     }
//   };

//   const fetchPayoutHistory = async (gymId) => {
//     try {
//       setLoading(true);
//       const data = await gymService.getPayoutHistory(gymId);
//       setHistoryData(data);
//     } catch (err) {
//       console.error("Error fetching history:", err);
//       toast({
//         title: "Failed to load history",
//         variant: "destructive",
//       });
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

//   // FIXED: Use payoutRate from backend, fallback to calculated from visits
//   const getPayoutPerVisit = () => {
//     if (!payoutData) return 0;

//     // Priority 1: Use configured rate from backend (works even with 0 visits)
//     if (payoutData.payoutRate && payoutData.payoutRate > 0) {
//       return payoutData.payoutRate;
//     }

//     // Priority 2: Calculate from paid visits
//     const totalPaid = payoutData.paid?.amountPKR || 0;
//     const totalPaidVisits = payoutData.paid?.visits || 0;
//     if (totalPaidVisits > 0) {
//       return Math.round(totalPaid / totalPaidVisits);
//     }

//     // Priority 3: Calculate from unpaid visits
//     const totalUnpaid = payoutData.unpaid?.amountPKR || 0;
//     const totalUnpaidVisits = payoutData.unpaid?.visits || 0;
//     if (totalUnpaidVisits > 0) {
//       return Math.round(totalUnpaid / totalUnpaidVisits);
//     }

//     return 0;
//   };

//   // Get label for payout rate source
//   const getPayoutRateLabel = () => {
//     if (!payoutData) return "";
//     if (payoutData.payoutRate && payoutData.payoutRate > 0) {
//       return "Configured rate";
//     }
//     if (
//       (payoutData.paid?.visits || 0) > 0 ||
//       (payoutData.unpaid?.visits || 0) > 0
//     ) {
//       return "Calculated from payouts";
//     }
//     return "No rate configured";
//   };

//   if (loading && gyms.length === 0) {
//     return (
//       <OwnerLayout>
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="w-8 h-8 animate-spin text-[#9A5A17]" />
//         </div>
//       </OwnerLayout>
//     );
//   }

//   if (!loading && gyms.length === 0) {
//     return (
//       <OwnerLayout>
//         <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
//           <div className="max-w-[1200px] mx-auto">
//             <div className="rounded-[28px] bg-white border border-[#E9DED3] p-12 text-center">
//               <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
//                 <AlertCircle className="w-8 h-8 text-amber-600" />
//               </div>
//               <h3 className="mt-4 text-lg font-semibold text-[#2B160B]">
//                 No gyms registered yet
//               </h3>
//               <p className="mt-2 text-sm text-[#7A6A5D] max-w-md mx-auto">
//                 You need to register a gym first before you can view payout
//                 data. Complete your gym registration to start tracking earnings.
//               </p>
//               <button
//                 onClick={() =>
//                   (window.location.href = "/dashboard/owner/register-gym")
//                 }
//                 className="mt-6 h-11 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors"
//               >
//                 Register Your Gym
//               </button>
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
//                     <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
//                       <Users className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <p className="text-xs text-[#7A6A5D] uppercase">
//                       Total Visits
//                     </p>
//                   </div>
//                   <p className="text-3xl font-bold text-[#2B160B]">
//                     {(payoutData.totalVisits || 0).toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
//                       <Wallet className="w-5 h-5 text-emerald-600" />
//                     </div>
//                     <p className="text-xs text-[#7A6A5D] uppercase">
//                       Paid Earnings
//                     </p>
//                   </div>
//                   <p className="text-3xl font-bold text-[#2B160B]">
//                     PKR {(payoutData.paid?.amountPKR || 0).toLocaleString()}
//                   </p>
//                   <p className="text-xs text-[#8A7B70] mt-1">
//                     {(payoutData.paid?.visits || 0).toLocaleString()} visits
//                     paid
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
//                     PKR {(payoutData.unpaid?.amountPKR || 0).toLocaleString()}
//                   </p>
//                   <p className="text-xs text-red-400 mt-1">
//                     {(payoutData.unpaid?.visits || 0).toLocaleString()} visits
//                     pending
//                   </p>
//                 </div>

//                 <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
//                       <Receipt className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <p className="text-xs text-[#7A6A5D] uppercase">
//                       Per Visit
//                     </p>
//                   </div>
//                   <p className="text-3xl font-bold text-[#2B160B]">
//                     PKR {getPayoutPerVisit().toLocaleString()}
//                   </p>
//                   <p className="text-xs text-[#8A7B70] mt-1">
//                     {getPayoutRateLabel()}
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
//                           {payoutData.gymName || selectedGym?.name || "N/A"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">Gym Tier</span>
//                         <span className="text-sm font-medium text-[#2B160B]">
//                           {payoutData.gymTier || selectedGym?.gymTier || "N/A"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">
//                           Payout Rate
//                         </span>
//                         <span className="text-sm font-medium text-[#2B160B]">
//                           PKR {getPayoutPerVisit().toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">
//                           Total Visits
//                         </span>
//                         <span className="text-sm font-medium text-[#2B160B]">
//                           {(payoutData.totalVisits || 0).toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">
//                           Paid Visits
//                         </span>
//                         <span className="text-sm font-medium text-emerald-600">
//                           {(payoutData.paid?.visits || 0).toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
//                         <span className="text-sm text-[#7A6A5D]">
//                           Unpaid Visits
//                         </span>
//                         <span className="text-sm font-medium text-red-600">
//                           {(payoutData.unpaid?.visits || 0).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Pending Alert */}
//                   {(payoutData.unpaid?.visits || 0) > 0 && (
//                     <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
//                       <div className="flex items-start gap-3">
//                         <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
//                         <div>
//                           <p className="text-sm font-medium text-amber-800">
//                             Pending Payout
//                           </p>
//                           <p className="text-xs text-amber-600 mt-1">
//                             You have{" "}
//                             {(payoutData.unpaid?.visits || 0).toLocaleString()}{" "}
//                             unpaid visits worth PKR{" "}
//                             {(
//                               payoutData.unpaid?.amountPKR || 0
//                             ).toLocaleString()}
//                             . Admin will process the payout soon.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* All Paid Alert */}
//                   {(payoutData.unpaid?.visits || 0) === 0 &&
//                     (payoutData.paid?.visits || 0) > 0 && (
//                       <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
//                         <div className="flex items-start gap-3">
//                           <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
//                           <div>
//                             <p className="text-sm font-medium text-emerald-800">
//                               All Caught Up!
//                             </p>
//                             <p className="text-xs text-emerald-600 mt-1">
//                               All your visits have been paid. Total earnings:
//                               PKR{" "}
//                               {(
//                                 payoutData.paid?.amountPKR || 0
//                               ).toLocaleString()}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
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
//                               Gym Amount (PKR)
//                             </th>
//                             <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
//                               Platform (PKR)
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
//                                     {
//                                       month: "long",
//                                       year: "numeric",
//                                     },
//                                   )}
//                                 </td>
//                                 <td className="px-6 py-4 text-right text-sm text-[#6B625A]">
//                                   {data.visits || 0}
//                                 </td>
//                                 <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">
//                                   {(data.gymAmountPKR || 0).toLocaleString()}
//                                 </td>
//                                 <td className="px-6 py-4 text-right text-sm text-purple-600">
//                                   {(
//                                     data.platformAmountPKR || 0
//                                   ).toLocaleString()}
//                                 </td>
//                                 <td className="px-6 py-4 text-right">
//                                   <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-600">
//                                     <CheckCircle2 className="w-3 h-3" />
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
//                       <p className="mt-1 text-xs text-[#8A7B70]">
//                         Completed payouts will appear here
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
  TrendingDown,
  Wallet,
  Users,
  AlertCircle,
  Receipt,
  Clock,
  CheckCircle2,
  Landmark,
  Smartphone,
  CreditCard,
  Edit3,
  Save,
  X,
  Shield,
  ShieldCheck,
  Copy,
  Check,
  User,
  Phone,
  Building,
  Hash,
  CreditCard as CardIcon,
  Calendar,
} from "lucide-react";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { gymService } from "@/services/gymService";
import { useToast } from "@/hooks/use-toast";

export default function OwnerPayouts() {
  const { toast } = useToast();
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [payoutData, setPayoutData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [accountLoading, setAccountLoading] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const [accountForm, setAccountForm] = useState({
    accountType: "bank",
    bankName: "",
    accountTitle: "",
    accountNumber: "",
    iban: "",
    mobileNumber: "",
    accountHolderName: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchOwnerGyms();
  }, []);

  const fetchOwnerGyms = async () => {
    try {
      setLoading(true);
      const response = await gymService.getMyGyms();
      const gymsList = response?.gyms || response?.data?.gyms || response || [];
      const normalizedGyms = Array.isArray(gymsList) ? gymsList : [];

      setGyms(normalizedGyms);

      if (normalizedGyms.length > 0) {
        setSelectedGym(normalizedGyms[0]);
        await Promise.all([
          fetchPayoutSummary(normalizedGyms[0].id),
          fetchPayoutAccount(normalizedGyms[0].id),
        ]);
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
      const data = await gymService.getGymPayoutSummary(gymId);
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
      const data = await gymService.getPayoutHistory(gymId);
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

  const fetchPayoutAccount = async (gymId) => {
    try {
      setAccountLoading(true);
      const data = await gymService.getPayoutAccount(gymId);
      setAccountData(data.account || data);
      if (data.account) {
        setAccountForm({
          accountType: data.account.accountType || "bank",
          bankName: data.account.bankName || "",
          accountTitle: data.account.accountTitle || "",
          accountNumber: data.account.accountNumber || "",
          iban: data.account.iban || "",
          mobileNumber: data.account.mobileNumber || "",
          accountHolderName:
            data.account.accountType !== "bank"
              ? data.account.accountTitle || ""
              : "",
        });
      }
    } catch (err) {
      console.error("Error fetching payout account:", err);
      setAccountData(null);
    } finally {
      setAccountLoading(false);
    }
  };

  const handleGymChange = (gymId) => {
    const gym = gyms.find((g) => g.id === gymId);
    setSelectedGym(gym);
    setPayoutData(null);
    setHistoryData(null);
    setAccountData(null);
    setShowAccountForm(false);
    setFormErrors({});
    fetchPayoutSummary(gymId);
    fetchPayoutAccount(gymId);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "history" && selectedGym && !historyData) {
      fetchPayoutHistory(selectedGym.id);
    }
    if (tab === "account" && selectedGym && !accountData && !accountLoading) {
      fetchPayoutAccount(selectedGym.id);
    }
  };

  const validateForm = () => {
    const errors = {};
    const {
      accountType,
      bankName,
      accountTitle,
      accountNumber,
      iban,
      mobileNumber,
      accountHolderName,
    } = accountForm;

    const nameToValidate =
      accountType === "bank" ? accountTitle : accountHolderName;
    if (!nameToValidate || nameToValidate.trim().length < 2) {
      errors.accountHolderName =
        "Account holder name must be at least 2 characters";
    } else if (nameToValidate.trim().length > 100) {
      errors.accountHolderName =
        "Account holder name must not exceed 100 characters";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(nameToValidate.trim())) {
      errors.accountHolderName =
        "Name can only contain letters, spaces, periods, apostrophes, and hyphens";
    }

    if (accountType === "bank") {
      if (!bankName || bankName.trim().length < 2) {
        errors.bankName = "Bank name is required";
      }
      if (!accountNumber) {
        errors.accountNumber = "Account number is required";
      } else {
        const cleaned = accountNumber.replace(/\s/g, "").replace(/-/g, "");
        if (!/^\d{8,20}$/.test(cleaned)) {
          errors.accountNumber = "Account number must be 8-20 digits";
        }
      }
      if (iban && iban.trim()) {
        const cleanedIBAN = iban.replace(/\s/g, "").toUpperCase();
        if (!/^PK\d{2}[A-Z0-9]{4}\d{16}$/.test(cleanedIBAN)) {
          errors.iban =
            "Invalid IBAN. Format: PK00ABCD1234567890123456 (26 chars)";
        }
      }
    } else {
      if (!mobileNumber) {
        errors.mobileNumber = "Mobile number is required";
      } else {
        const cleaned = mobileNumber.replace(/\s/g, "").replace(/-/g, "");
        if (!/^03\d{9}$/.test(cleaned)) {
          errors.mobileNumber =
            "Must be 11 digits starting with 03 (e.g., 03001234567)";
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some fields have invalid values",
        variant: "destructive",
      });
      return;
    }

    try {
      setAccountLoading(true);

      const payload = {
        accountType: accountForm.accountType,
      };

      if (accountForm.accountType === "bank") {
        payload.bankName = accountForm.bankName.trim();
        payload.accountTitle = accountForm.accountTitle.trim();
        payload.accountNumber = accountForm.accountNumber
          .replace(/\s/g, "")
          .replace(/-/g, "");
        payload.iban = accountForm.iban
          ? accountForm.iban.replace(/\s/g, "").toUpperCase()
          : "";
      } else {
        payload.accountHolderName = accountForm.accountHolderName.trim();
        payload.mobileNumber = accountForm.mobileNumber
          .replace(/\s/g, "")
          .replace(/-/g, "");
      }

      const response = await gymService.updatePayoutAccount(
        selectedGym.id,
        payload,
      );
      setAccountData(response.account || response);
      setShowAccountForm(false);
      setFormErrors({});
      toast({
        title: "Account updated",
        description:
          "Your payout account details have been saved successfully.",
      });
    } catch (err) {
      console.error("Error updating payout account:", err);
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        toast({
          title: "Validation failed",
          description: backendErrors.join(", "),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to update account",
          description: err.response?.data?.message || err.message,
          variant: "destructive",
        });
      }
    } finally {
      setAccountLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const getPayoutPerVisit = () => {
    if (!payoutData) return 0;
    if (payoutData.payoutRate && payoutData.payoutRate > 0) {
      return payoutData.payoutRate;
    }
    const totalPaid = payoutData.paid?.amountPKR || 0;
    const totalPaidVisits = payoutData.paid?.visits || 0;
    if (totalPaidVisits > 0) return Math.round(totalPaid / totalPaidVisits);
    const totalUnpaid = payoutData.unpaid?.amountPKR || 0;
    const totalUnpaidVisits = payoutData.unpaid?.visits || 0;
    if (totalUnpaidVisits > 0)
      return Math.round(totalUnpaid / totalUnpaidVisits);
    return 0;
  };

  const getPayoutRateLabel = () => {
    if (!payoutData) return "";
    if (payoutData.payoutRate && payoutData.payoutRate > 0)
      return "Configured rate";
    if (
      (payoutData.paid?.visits || 0) > 0 ||
      (payoutData.unpaid?.visits || 0) > 0
    ) {
      return "Calculated from payouts";
    }
    return "No rate configured";
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case "bank":
        return <Landmark className="w-5 h-5" />;
      case "easypaisa":
        return <Smartphone className="w-5 h-5" />;
      case "jazzcash":
        return <Smartphone className="w-5 h-5" />;
      case "sadapay":
        return <CreditCard className="w-5 h-5" />;
      case "nayapay":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Landmark className="w-5 h-5" />;
    }
  };

  const getAccountTypeLabel = (type) => {
    const labels = {
      bank: "Bank Account",
      easypaisa: "Easypaisa",
      jazzcash: "JazzCash",
      sadapay: "SadaPay",
      nayapay: "NayaPay",
    };
    return labels[type] || type;
  };

  const formatIBAN = (iban) => {
    if (!iban) return "";
    const cleaned = iban.replace(/\s/g, "").toUpperCase();
    return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
  };

  const formatMobile = (number) => {
    if (!number) return "";
    const cleaned = number.replace(/\s/g, "").replace(/-/g, "");
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    return cleaned;
  };

  if (loading && gyms.length === 0) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#9A5A17]" />
        </div>
      </OwnerLayout>
    );
  }

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
                data.
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
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
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
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-emerald-600" />
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
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-[#7A6A5D] uppercase">
                      Per Visit
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-[#2B160B]">
                    PKR {getPayoutPerVisit().toLocaleString()}
                  </p>
                  <p className="text-xs text-[#8A7B70] mt-1">
                    {getPayoutRateLabel()}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 flex-wrap">
                {["overview", "history", "account"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors capitalize ${
                      activeTab === tab
                        ? "bg-[#2A1608] text-white"
                        : "bg-white border border-[#D9CDBF] text-[#6B625A] hover:bg-[#F5F0E8]"
                    }`}
                  >
                    {tab === "account" ? "Payout Account" : tab}
                  </button>
                ))}
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
                          {payoutData.gymTier || selectedGym?.gymTier || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F0EAE3]">
                        <span className="text-sm text-[#7A6A5D]">
                          Payout Rate
                        </span>
                        <span className="text-sm font-medium text-[#2B160B]">
                          PKR {getPayoutPerVisit().toLocaleString()}
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

                  {/* Account Preview Card */}
                  <div className="mt-6 p-4 rounded-xl bg-[#FCFAF8] border border-[#E9DED3]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
                          {accountData ? (
                            getAccountTypeIcon(accountData.accountType)
                          ) : (
                            <Landmark className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2B160B]">
                            Payout Account
                          </p>
                          <p className="text-xs text-[#7A6A5D]">
                            {accountData
                              ? `${getAccountTypeLabel(accountData.accountType)} • ${
                                  accountData.isVerified
                                    ? "Verified"
                                    : "Unverified"
                                }`
                              : "Not configured yet"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTabChange("account")}
                        className="h-9 px-4 rounded-lg bg-[#2A1608] text-white text-xs font-medium hover:bg-[#1C0F06] transition-colors"
                      >
                        {accountData ? "Manage" : "Setup"}
                      </button>
                    </div>
                  </div>

                  {/* Pending Alert */}
                  {(payoutData.unpaid?.visits || 0) > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
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

                  {/* All Paid Alert */}
                  {(payoutData.unpaid?.visits || 0) === 0 &&
                    (payoutData.paid?.visits || 0) > 0 && (
                      <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-emerald-800">
                              All Caught Up!
                            </p>
                            <p className="text-xs text-emerald-600 mt-1">
                              All your visits have been paid. Total earnings:
                              PKR{" "}
                              {(
                                payoutData.paid?.amountPKR || 0
                              ).toLocaleString()}
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
                              Gym Amount (PKR)
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
                              Platform (PKR)
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
                                <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">
                                  {(data.gymAmountPKR || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-purple-600">
                                  {(
                                    data.platformAmountPKR || 0
                                  ).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-600">
                                    <CheckCircle2 className="w-3 h-3" />
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
                      <p className="mt-1 text-xs text-[#8A7B70]">
                        Completed payouts will appear here
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#2B160B]">
                        Payout Account
                      </h3>
                      <p className="text-sm text-[#7A6A5D]">
                        Manage where you receive your gym payouts
                      </p>
                    </div>
                    {accountData && !showAccountForm && (
                      <button
                        onClick={() => setShowAccountForm(true)}
                        className="h-10 px-4 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Account
                      </button>
                    )}
                  </div>

                  {accountLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin text-[#9A5A17]" />
                    </div>
                  ) : showAccountForm ? (
                    /* Account Form */
                    <form onSubmit={handleAccountSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Account Type */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-[#2B160B] mb-2">
                            Account Type
                          </label>
                          <div className="flex gap-3 flex-wrap">
                            {[
                              {
                                value: "bank",
                                label: "Bank Account",
                                icon: Landmark,
                              },
                              {
                                value: "easypaisa",
                                label: "Easypaisa",
                                icon: Smartphone,
                              },
                              {
                                value: "jazzcash",
                                label: "JazzCash",
                                icon: Smartphone,
                              },
                              {
                                value: "sadapay",
                                label: "SadaPay",
                                icon: CreditCard,
                              },
                              {
                                value: "nayapay",
                                label: "NayaPay",
                                icon: CreditCard,
                              },
                            ].map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => {
                                  setAccountForm((prev) => ({
                                    ...prev,
                                    accountType: type.value,
                                  }));
                                  setFormErrors({});
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                                  accountForm.accountType === type.value
                                    ? "bg-[#2A1608] text-white border-[#2A1608]"
                                    : "bg-white text-[#6B625A] border-[#D9CDBF] hover:bg-[#F5F0E8]"
                                }`}
                              >
                                <type.icon className="w-4 h-4" />
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Account Holder Name — REQUIRED FOR ALL TYPES */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-[#2B160B] mb-2">
                            <span className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              Account Holder Name *
                            </span>
                          </label>
                          <input
                            type="text"
                            required
                            value={
                              accountForm.accountType === "bank"
                                ? accountForm.accountTitle
                                : accountForm.accountHolderName
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              if (accountForm.accountType === "bank") {
                                setAccountForm((prev) => ({
                                  ...prev,
                                  accountTitle: value,
                                }));
                              } else {
                                setAccountForm((prev) => ({
                                  ...prev,
                                  accountHolderName: value,
                                }));
                              }
                              if (formErrors.accountHolderName) {
                                setFormErrors((prev) => ({
                                  ...prev,
                                  accountHolderName: undefined,
                                }));
                              }
                            }}
                            placeholder="Full name as on account"
                            className={`w-full h-11 px-4 rounded-xl border bg-white text-sm text-[#2B160B] outline-none transition-colors ${
                              formErrors.accountHolderName
                                ? "border-red-400 focus:border-red-500"
                                : "border-[#D9CDBF] focus:border-[#9A5A17]"
                            }`}
                          />
                          {formErrors.accountHolderName && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {formErrors.accountHolderName}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-[#8A7B70]">
                            Enter the exact name registered on this account
                          </p>
                        </div>

                        {/* Bank Fields */}
                        {accountForm.accountType === "bank" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-[#2B160B] mb-2">
                                <span className="flex items-center gap-1.5">
                                  <Building className="w-4 h-4" />
                                  Bank Name *
                                </span>
                              </label>
                              <input
                                type="text"
                                required
                                value={accountForm.bankName}
                                onChange={(e) => {
                                  setAccountForm((prev) => ({
                                    ...prev,
                                    bankName: e.target.value,
                                  }));
                                  if (formErrors.bankName) {
                                    setFormErrors((prev) => ({
                                      ...prev,
                                      bankName: undefined,
                                    }));
                                  }
                                }}
                                placeholder="e.g. HBL, Meezan Bank, Allied Bank"
                                className={`w-full h-11 px-4 rounded-xl border bg-white text-sm text-[#2B160B] outline-none transition-colors ${
                                  formErrors.bankName
                                    ? "border-red-400 focus:border-red-500"
                                    : "border-[#D9CDBF] focus:border-[#9A5A17]"
                                }`}
                              />
                              {formErrors.bankName && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {formErrors.bankName}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[#2B160B] mb-2">
                                <span className="flex items-center gap-1.5">
                                  <Hash className="w-4 h-4" />
                                  Account Number *
                                </span>
                              </label>
                              <input
                                type="text"
                                required
                                inputMode="numeric"
                                value={accountForm.accountNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^\d\s-]/g,
                                    "",
                                  );
                                  setAccountForm((prev) => ({
                                    ...prev,
                                    accountNumber: value,
                                  }));
                                  if (formErrors.accountNumber) {
                                    setFormErrors((prev) => ({
                                      ...prev,
                                      accountNumber: undefined,
                                    }));
                                  }
                                }}
                                placeholder="8-20 digits"
                                className={`w-full h-11 px-4 rounded-xl border bg-white text-sm text-[#2B160B] outline-none transition-colors font-mono ${
                                  formErrors.accountNumber
                                    ? "border-red-400 focus:border-red-500"
                                    : "border-[#D9CDBF] focus:border-[#9A5A17]"
                                }`}
                              />
                              {formErrors.accountNumber && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {formErrors.accountNumber}
                                </p>
                              )}
                              <p className="mt-1 text-xs text-[#8A7B70]">
                                8-20 digits, spaces and hyphens allowed
                              </p>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-[#2B160B] mb-2">
                                <span className="flex items-center gap-1.5">
                                  <CardIcon className="w-4 h-4" />
                                  IBAN{" "}
                                  <span className="text-[#8A7B70] font-normal">
                                    (Optional)
                                  </span>
                                </span>
                              </label>
                              <input
                                type="text"
                                value={accountForm.iban}
                                onChange={(e) => {
                                  let value = e.target.value
                                    .toUpperCase()
                                    .replace(/[^A-Z0-9]/g, "");
                                  const formatted =
                                    value.match(/.{1,4}/g)?.join(" ") || value;
                                  setAccountForm((prev) => ({
                                    ...prev,
                                    iban: formatted,
                                  }));
                                  if (formErrors.iban) {
                                    setFormErrors((prev) => ({
                                      ...prev,
                                      iban: undefined,
                                    }));
                                  }
                                }}
                                placeholder="PK00 ABCD 1234 5678 9012 3456"
                                maxLength={31}
                                className={`w-full h-11 px-4 rounded-xl border bg-white text-sm text-[#2B160B] outline-none transition-colors font-mono tracking-wide ${
                                  formErrors.iban
                                    ? "border-red-400 focus:border-red-500"
                                    : "border-[#D9CDBF] focus:border-[#9A5A17]"
                                }`}
                              />
                              {formErrors.iban && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {formErrors.iban}
                                </p>
                              )}
                              <p className="mt-1 text-xs text-[#8A7B70]">
                                Pakistani IBAN: PK + 2 digits + 4 letters + 16
                                digits (26 total)
                              </p>
                            </div>
                          </>
                        )}

                        {/* Wallet Fields */}
                        {accountForm.accountType !== "bank" && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#2B160B] mb-2">
                              <span className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4" />
                                Mobile Number *
                              </span>
                            </label>
                            <input
                              type="tel"
                              required
                              inputMode="numeric"
                              value={accountForm.mobileNumber}
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 11);
                                setAccountForm((prev) => ({
                                  ...prev,
                                  mobileNumber: value,
                                }));
                                if (formErrors.mobileNumber) {
                                  setFormErrors((prev) => ({
                                    ...prev,
                                    mobileNumber: undefined,
                                  }));
                                }
                              }}
                              placeholder="03001234567"
                              maxLength={11}
                              className={`w-full h-11 px-4 rounded-xl border bg-white text-sm text-[#2B160B] outline-none transition-colors font-mono ${
                                formErrors.mobileNumber
                                  ? "border-red-400 focus:border-red-500"
                                  : "border-[#D9CDBF] focus:border-[#9A5A17]"
                              }`}
                            />
                            {formErrors.mobileNumber && (
                              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {formErrors.mobileNumber}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-[#8A7B70]">
                              11 digits starting with 03 (e.g., 0300-1234567)
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={accountLoading}
                          className="h-11 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {accountLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save Account
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountForm(false);
                            setFormErrors({});
                            if (accountData) {
                              setAccountForm({
                                accountType: accountData.accountType || "bank",
                                bankName: accountData.bankName || "",
                                accountTitle: accountData.accountTitle || "",
                                accountNumber: accountData.accountNumber || "",
                                iban: accountData.iban || "",
                                mobileNumber: accountData.mobileNumber || "",
                                accountHolderName:
                                  accountData.accountType !== "bank"
                                    ? accountData.accountTitle || ""
                                    : "",
                              });
                            }
                          }}
                          className="h-11 px-6 rounded-xl border border-[#D9CDBF] bg-white text-sm font-medium text-[#6B625A] hover:bg-[#F5F0E8] transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : accountData ? (
                    /* Account Details View */
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FCFAF8] border border-[#E9DED3]">
                        <div className="w-12 h-12 rounded-xl bg-[#2A1608] flex items-center justify-center text-white">
                          {getAccountTypeIcon(accountData.accountType)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2B160B]">
                            {getAccountTypeLabel(accountData.accountType)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {accountData.isVerified ? (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-medium">
                                <Shield className="w-3.5 h-3.5" />
                                Pending Verification
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Account Holder Name — Always shown */}
                        <DetailRow
                          label="Account Holder Name"
                          value={accountData.accountTitle}
                          icon={<User className="w-4 h-4" />}
                          onCopy={() =>
                            copyToClipboard(
                              accountData.accountTitle,
                              "holderName",
                            )
                          }
                          copied={copiedField === "holderName"}
                        />

                        {accountData.accountType === "bank" ? (
                          <>
                            <DetailRow
                              label="Bank Name"
                              value={accountData.bankName}
                              icon={<Building className="w-4 h-4" />}
                              onCopy={() =>
                                copyToClipboard(
                                  accountData.bankName,
                                  "bankName",
                                )
                              }
                              copied={copiedField === "bankName"}
                            />
                            <DetailRow
                              label="Account Number"
                              value={accountData.accountNumber}
                              icon={<Hash className="w-4 h-4" />}
                              onCopy={() =>
                                copyToClipboard(
                                  accountData.accountNumber,
                                  "accNumber",
                                )
                              }
                              copied={copiedField === "accNumber"}
                            />
                            {accountData.iban && (
                              <DetailRow
                                label="IBAN"
                                value={formatIBAN(accountData.iban)}
                                icon={<CardIcon className="w-4 h-4" />}
                                onCopy={() =>
                                  copyToClipboard(accountData.iban, "iban")
                                }
                                copied={copiedField === "iban"}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <DetailRow
                              label="Wallet Provider"
                              value={getAccountTypeLabel(
                                accountData.accountType,
                              )}
                              icon={<Smartphone className="w-4 h-4" />}
                            />
                            <DetailRow
                              label="Mobile Number"
                              value={formatMobile(accountData.mobileNumber)}
                              icon={<Phone className="w-4 h-4" />}
                              onCopy={() =>
                                copyToClipboard(
                                  accountData.mobileNumber,
                                  "mobile",
                                )
                              }
                              copied={copiedField === "mobile"}
                            />
                          </>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Account Security
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Your payout account is{" "}
                              {accountData.isVerified
                                ? "verified"
                                : "pending verification"}
                              . Admin reviews all account changes before
                              processing payouts.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* No Account State */
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto">
                        <Landmark className="w-8 h-8 text-[#8A7B70]" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-[#2B160B]">
                        No payout account configured
                      </h3>
                      <p className="mt-2 text-sm text-[#7A6A5D] max-w-md mx-auto">
                        Add your bank or mobile wallet details so admin can
                        process your payouts.
                      </p>
                      <button
                        onClick={() => setShowAccountForm(true)}
                        className="mt-6 h-11 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors"
                      >
                        Add Payout Account
                      </button>
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

// Helper component for account detail rows
function DetailRow({ label, value, icon, onCopy, copied }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#FCFAF8] border border-[#E9DED3]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-[#8A7B70]">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs text-[#7A6A5D] uppercase">{label}</p>
          <p className="text-sm font-medium text-[#2B160B] mt-0.5 truncate">
            {value || "—"}
          </p>
        </div>
      </div>
      {value && onCopy && (
        <button
          onClick={onCopy}
          className="p-2 rounded-lg hover:bg-[#E9DED3] transition-colors shrink-0"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4 text-[#8A7B70]" />
          )}
        </button>
      )}
    </div>
  );
}
