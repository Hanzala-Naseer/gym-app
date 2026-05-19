// import { useEffect, useState, useRef } from "react";
// import {
//   Loader2,
//   DollarSign,
//   Building2,
//   CheckCircle,
//   Upload,
//   FileText,
//   X,
//   Landmark,
//   CreditCard,
// } from "lucide-react";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { adminService } from "@/services/adminService";
// import { useToast } from "@/hooks/use-toast";
// import api from "@/services/api"; // direct api for file upload

// export default function AdminPayouts() {
//   const { toast } = useToast();
//   const [overview, setOverview] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Modal state for payout
//   const [payoutModal, setPayoutModal] = useState({ open: false, gym: null });
//   const [payoutNotes, setPayoutNotes] = useState("");
//   const [transactionRef, setTransactionRef] = useState("");
//   const [screenshot, setScreenshot] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     fetchOverview();
//   }, []);

//   const fetchOverview = async () => {
//     try {
//       setLoading(true);
//       const data = await adminService.getAllGymsPayoutOverview();
//       setOverview(data);
//     } catch (err) {
//       console.error("Fetch overview error:", err);
//       toast({
//         title: "Failed to load payouts",
//         description: err.response?.data?.message || "Network error",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast({ title: "Only image files allowed", variant: "destructive" });
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast({ title: "File too large (max 5MB)", variant: "destructive" });
//       return;
//     }

//     setScreenshot(file);
//   };

//   const handleProcessPayout = async () => {
//     const gym = payoutModal.gym;
//     if (!gym) return;

//     try {
//       setProcessing(true);

//       const formData = new FormData();
//       formData.append("payoutMethod", "manual");
//       formData.append("notes", payoutNotes);
//       formData.append("transactionRef", transactionRef);
//       if (screenshot) {
//         formData.append("screenshot", screenshot);
//       }

//       // Use direct api for multipart/form-data
//       const res = await api.post(`/payout/gym/${gym.gymId}/process`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast({
//         title: "✅ Payout processed",
//         description: `PKR ${res.data.payout?.totalGymPKR?.toLocaleString() || 0} paid to ${gym.gymName}. Email sent to owner.`,
//       });

//       // Reset modal
//       setPayoutModal({ open: false, gym: null });
//       setPayoutNotes("");
//       setTransactionRef("");
//       setScreenshot(null);

//       // Refresh data
//       fetchOverview();
//     } catch (err) {
//       console.error("=== PAYOUT ERROR ===");
//       console.error("Status:", err.response?.status);
//       console.error("Message:", err.response?.data?.message);
//       console.error("Data:", err.response?.data);

//       toast({
//         title: `❌ Error ${err.response?.status || ""}`,
//         description: err.response?.data?.message || "Failed to process payout",
//         variant: "destructive",
//       });
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // ── helpers ─────────────────────────────────────────────────────────────
//   const fmtPKR = (n) =>
//     typeof n === "number" ? `PKR ${n.toLocaleString("en-PK")}` : "PKR —";

//   if (loading) {
//     return (
//       <AdminLayout active="payouts">
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="w-8 h-8 animate-spin text-[#9A5A17]" />
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout active="payouts">
//       <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
//         <div className="max-w-[1400px] mx-auto space-y-6">
//           {/* HEADER */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
//                 <DollarSign className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-[#2B160B]">Payouts</h1>
//                 <p className="text-sm text-[#7A6A5D]">
//                   Manage gym payouts and track payment status
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={fetchOverview}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D8C9BA] bg-white text-sm text-[#2B160B] hover:bg-[#F9F5F1] transition"
//             >
//               <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//               Refresh
//             </button>
//           </div>

//           {/* SUMMARY CARDS — REAL DATA */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <Building2 className="w-4 h-4 text-[#7A6A5D]" />
//                 <p className="text-xs text-[#7A6A5D] uppercase font-semibold">
//                   Total Gyms
//                 </p>
//               </div>
//               <p className="text-3xl font-bold text-[#2B160B]">
//                 {overview?.summary?.totalGyms ?? "—"}
//               </p>
//             </div>

//             <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <Landmark className="w-4 h-4 text-emerald-600" />
//                 <p className="text-xs text-emerald-600 uppercase font-semibold">
//                   Total Paid (Gym)
//                 </p>
//               </div>
//               <p className="text-3xl font-bold text-emerald-600">
//                 {fmtPKR(overview?.summary?.totalPaidPKR)}
//               </p>
//             </div>

//             <div className="rounded-[24px] bg-white border border-red-200 p-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <CreditCard className="w-4 h-4 text-red-600" />
//                 <p className="text-xs text-red-600 uppercase font-semibold">
//                   Unpaid Liability
//                 </p>
//               </div>
//               <p className="text-3xl font-bold text-red-600">
//                 {fmtPKR(overview?.summary?.totalUnpaidPKR)}
//               </p>
//             </div>

//             <div className="rounded-[24px] bg-white border border-purple-200 p-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <DollarSign className="w-4 h-4 text-purple-600" />
//                 <p className="text-xs text-purple-600 uppercase font-semibold">
//                   Platform Earnings
//                 </p>
//               </div>
//               <p className="text-3xl font-bold text-purple-600">
//                 {fmtPKR(overview?.summary?.totalPaidPlatformPKR)}
//               </p>
//               <p className="text-xs text-[#7A6A5D] mt-1">
//                 + {fmtPKR(overview?.summary?.totalUnpaidPlatformPKR)} pending
//               </p>
//             </div>
//           </div>

//           {/* GYMS TABLE — REAL DATA */}
//           <div className="rounded-[24px] bg-white border border-[#E9DED3] overflow-hidden">
//             <div className="p-6 border-b border-[#E9DED3] flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-bold text-[#2B160B]">
//                   Gym Payouts
//                 </h2>
//                 <p className="text-sm text-[#7A6A5D] mt-1">
//                   {overview?.gyms?.length || 0} gyms with payout data
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-[#7A6A5D]">Net Payable</p>
//                 <p className="text-lg font-bold text-red-600">
//                   {fmtPKR(overview?.summary?.netPayablePKR)}
//                 </p>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-[#FCFAF8]">
//                   <tr>
//                     {[
//                       "Gym",
//                       "Tier",
//                       "Owner",
//                       "Paid Visits",
//                       "Paid Gym",
//                       "Paid Platform",
//                       "Unpaid Visits",
//                       "Unpaid Gym",
//                       "Unpaid Platform",
//                       "Action",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         className="px-4 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase whitespace-nowrap"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#E9DED3]">
//                   {overview?.gyms?.map((gym) => (
//                     <tr
//                       key={gym.gymId}
//                       className="hover:bg-[#FCFAF8] transition"
//                     >
//                       <td className="px-4 py-4">
//                         <div>
//                           <p className="text-sm font-medium text-[#2B160B]">
//                             {gym.gymName}
//                           </p>
//                           <p className="text-xs text-[#8A7B70]">
//                             ID {gym.gymId?.slice(0, 8)}…
//                           </p>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4">
//                         <span
//                           className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
//                             gym.gymTier === "BASIC"
//                               ? "bg-[#F5EFE8] text-[#5B3A29]"
//                               : gym.gymTier === "ULTIMATE"
//                                 ? "bg-purple-100 text-purple-700"
//                                 : "bg-amber-100 text-amber-700"
//                           }`}
//                         >
//                           {gym.gymTier}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-[#6B625A]">
//                         {gym.owner?.name || "—"}
//                       </td>
//                       <td className="px-4 py-4 text-right text-sm font-medium text-emerald-700">
//                         {gym.paidVisits ?? 0}
//                       </td>
//                       <td className="px-4 py-4 text-right text-sm font-semibold text-emerald-700">
//                         {fmtPKR(gym.paidAmountPKR)}
//                       </td>
//                       <td className="px-4 py-4 text-right text-sm font-semibold text-purple-700">
//                         {fmtPKR(gym.paidPlatformAmountPKR)}
//                       </td>
//                       <td className="px-4 py-4 text-right text-sm font-medium text-red-600">
//                         {gym.unpaidVisits ?? 0}
//                       </td>
//                       <td className="px-4 py-4 text-right text-sm font-semibold text-red-600">
//                         {fmtPKR(gym.unpaidAmountPKR)}
//                       </td>
//                       <td className="px-4 py-4 text-right text-sm font-semibold text-purple-600">
//                         {fmtPKR(gym.unpaidPlatformAmountPKR)}
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         {gym.unpaidVisits > 0 ? (
//                           <button
//                             onClick={() => setPayoutModal({ open: true, gym })}
//                             className="h-8 px-3 rounded-lg bg-[#2A1608] text-white text-xs font-medium hover:bg-[#1C0F06] transition-colors"
//                           >
//                             Pay Now
//                           </button>
//                         ) : gym.paidVisits > 0 ? (
//                           <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
//                             <CheckCircle className="w-3 h-3" /> Settled
//                           </span>
//                         ) : (
//                           <span className="text-xs text-[#7A6A5D]">
//                             No visits
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}

//                   {(!overview?.gyms || overview.gyms.length === 0) && (
//                     <tr>
//                       <td
//                         colSpan={10}
//                         className="px-6 py-16 text-center text-sm text-[#7A6A5D]"
//                       >
//                         No gym payout data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ─── PAYOUT MODAL ─────────────────────────────────────────────────── */}
//       {payoutModal.open && payoutModal.gym && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-[24px] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-lg font-bold text-[#2B160B]">
//                   Process Payout
//                 </h3>
//                 <p className="text-sm text-[#7A6A5D]">
//                   {payoutModal.gym.gymName}
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   setPayoutModal({ open: false, gym: null });
//                   setPayoutNotes("");
//                   setTransactionRef("");
//                   setScreenshot(null);
//                 }}
//                 className="p-2 rounded-lg hover:bg-[#F5EFE8] transition"
//               >
//                 <X className="w-5 h-5 text-[#7A6A5D]" />
//               </button>
//             </div>

//             {/* Payout Summary */}
//             <div className="bg-[#FAF7F4] rounded-xl p-4 mb-6 space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-[#7A6A5D]">Unpaid Visits</span>
//                 <span className="font-semibold text-[#2B160B]">
//                   {payoutModal.gym.unpaidVisits}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-[#7A6A5D]">Amount to Pay (Gym)</span>
//                 <span className="font-bold text-emerald-700">
//                   {fmtPKR(payoutModal.gym.unpaidAmountPKR)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-[#7A6A5D]">Platform Keeps</span>
//                 <span className="font-semibold text-purple-700">
//                   {fmtPKR(payoutModal.gym.unpaidPlatformAmountPKR)}
//                 </span>
//               </div>
//             </div>

//             {/* Transaction Reference */}
//             <div className="mb-4">
//               <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1">
//                 Transaction Reference *
//               </label>
//               <input
//                 type="text"
//                 value={transactionRef}
//                 onChange={(e) => setTransactionRef(e.target.value)}
//                 placeholder="e.g. TRX-123456789 or Bank Ref"
//                 className="w-full px-3 py-2 rounded-xl border border-[#E7DDD3] text-sm focus:outline-none focus:border-[#5B3A29]"
//                 required
//               />
//             </div>

//             {/* Admin Notes */}
//             <div className="mb-4">
//               <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1">
//                 Notes for Owner
//               </label>
//               <textarea
//                 value={payoutNotes}
//                 onChange={(e) => setPayoutNotes(e.target.value)}
//                 placeholder="Optional message sent to gym owner via email..."
//                 rows={3}
//                 className="w-full px-3 py-2 rounded-xl border border-[#E7DDD3] text-sm resize-none focus:outline-none focus:border-[#5B3A29]"
//               />
//             </div>

//             {/* Screenshot Upload */}
//             <div className="mb-6">
//               <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1">
//                 Payment Screenshot
//               </label>
//               <div className="mt-1">
//                 {screenshot ? (
//                   <div className="flex items-center gap-2 p-3 bg-[#F5EFE8] rounded-xl">
//                     <FileText className="w-4 h-4 text-[#5B3A29]" />
//                     <span className="text-sm text-[#2B160B] flex-1 truncate">
//                       {screenshot.name}
//                     </span>
//                     <button
//                       onClick={() => setScreenshot(null)}
//                       className="p-1 rounded hover:bg-red-100 text-red-500 transition"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-full py-4 border-2 border-dashed border-[#E7DDD3] rounded-xl text-[#7A6A5D] text-sm hover:border-[#5B3A29] hover:text-[#5B3A29] transition flex flex-col items-center gap-2"
//                   >
//                     <Upload className="w-5 h-5" />
//                     <span>Click to upload screenshot</span>
//                     <span className="text-xs opacity-60">
//                       PNG, JPG up to 5MB
//                     </span>
//                   </button>
//                 )}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/png,image/jpeg,image/jpg"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setPayoutModal({ open: false, gym: null });
//                   setPayoutNotes("");
//                   setTransactionRef("");
//                   setScreenshot(null);
//                 }}
//                 className="flex-1 py-2.5 rounded-xl border border-[#E7DDD3] text-[#7A6A5D] text-sm font-medium hover:bg-[#F9F5F1] transition"
//                 disabled={processing}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleProcessPayout}
//                 disabled={!transactionRef.trim() || processing}
//                 className="flex-1 py-2.5 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {processing ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   "Confirm & Send"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </AdminLayout>
//   );
// }
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Loader2,
  DollarSign,
  Building2,
  CheckCircle,
  Upload,
  FileText,
  X,
  Landmark,
  CreditCard,
  Smartphone,
  Copy,
  Check,
  ShieldCheck,
  Shield,
  Banknote,
  User,
  Phone,
  Hash,
  Building,
  AlertTriangle,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminService } from "@/services/adminService";
import { gymService } from "@/services/gymService";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

export default function AdminPayouts() {
  const { toast } = useToast();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [payoutModal, setPayoutModal] = useState({ open: false, gym: null });
  const [payoutNotes, setPayoutNotes] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);
  const fileInputRef = useRef(null);

  const [accountModal, setAccountModal] = useState({
    open: false,
    gym: null,
    account: null,
  });
  const [accountLoading, setAccountLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllGymsPayoutOverview();
      setOverview(data);
    } catch (err) {
      console.error("Fetch overview error:", err);
      toast({
        title: "Failed to load payouts",
        description: err.response?.data?.message || "Network error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGymAccount = async (gymId, gym) => {
    try {
      setAccountLoading(true);
      const data = await gymService.getPayoutAccount(gymId);
      setAccountModal({ open: true, gym, account: data.account || data });
    } catch (err) {
      console.error("Fetch account error:", err);
      toast({
        title: "No payout account",
        description: "This gym has not configured a payout account yet.",
        variant: "destructive",
      });
    } finally {
      setAccountLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Only image files allowed", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large (max 5MB)", variant: "destructive" });
      return;
    }

    setScreenshot(file);
  };

  const resetModal = useCallback(() => {
    setPayoutModal({ open: false, gym: null });
    setPayoutNotes("");
    setTransactionRef("");
    setScreenshot(null);
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const handleProcessPayout = async () => {
    const gym = payoutModal.gym;
    if (!gym) return;

    if (processingRef.current) return;
    processingRef.current = true;

    try {
      setProcessing(true);

      const formData = new FormData();
      formData.append("payoutMethod", "manual");
      formData.append("notes", payoutNotes);
      formData.append("transactionRef", transactionRef);
      if (screenshot) {
        formData.append("screenshot", screenshot);
      }

      const res = await api.post(`/payout/gym/${gym.gymId}/process`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data.payout) {
        toast({
          title: "ℹ️ Already processed",
          description: res.data.message || "This payout was already processed.",
        });
        resetModal();
        fetchOverview();
        return;
      }

      toast({
        title: "✅ Payout processed",
        description: `PKR ${res.data.payout?.totalGymPKR?.toLocaleString() || 0} paid to ${gym.gymName}. Email sent to owner.`,
      });

      resetModal();
      fetchOverview();
    } catch (err) {
      console.error("=== PAYOUT ERROR ===", err);
      toast({
        title: `❌ Error ${err.response?.status || ""}`,
        description: err.response?.data?.message || "Failed to process payout",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      processingRef.current = false;
    }
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case "bank":
        return <Landmark className="w-4 h-4" />;
      case "easypaisa":
      case "jazzcash":
        return <Smartphone className="w-4 h-4" />;
      case "sadapay":
      case "nayapay":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Landmark className="w-4 h-4" />;
    }
  };

  const getAccountTypeLabel = (type) => {
    const labels = {
      bank: "Bank",
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

  const fmtPKR = (n) =>
    typeof n === "number" ? `PKR ${n.toLocaleString("en-PK")}` : "PKR —";

  if (loading) {
    return (
      <AdminLayout active="payouts">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#9A5A17]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="payouts">
      <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2B160B]">Payouts</h1>
                <p className="text-sm text-[#7A6A5D]">
                  Manage gym payouts and track payment status
                </p>
              </div>
            </div>
            <button
              onClick={fetchOverview}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D8C9BA] bg-white text-sm text-[#2B160B] hover:bg-[#F9F5F1] transition"
            >
              <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-[#7A6A5D]" />
                <p className="text-xs text-[#7A6A5D] uppercase font-semibold">
                  Total Gyms
                </p>
              </div>
              <p className="text-3xl font-bold text-[#2B160B]">
                {overview?.summary?.totalGyms ?? "—"}
              </p>
            </div>

            <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <p className="text-xs text-emerald-600 uppercase font-semibold">
                  Total Paid (Gym)
                </p>
              </div>
              <p className="text-3xl font-bold text-emerald-600">
                {fmtPKR(overview?.summary?.totalPaidPKR)}
              </p>
            </div>

            <div className="rounded-[24px] bg-white border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-red-600" />
                <p className="text-xs text-red-600 uppercase font-semibold">
                  Unpaid Liability
                </p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {fmtPKR(overview?.summary?.totalUnpaidPKR)}
              </p>
            </div>

            <div className="rounded-[24px] bg-white border border-purple-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <p className="text-xs text-purple-600 uppercase font-semibold">
                  Platform Earnings
                </p>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {fmtPKR(overview?.summary?.totalPaidPlatformPKR)}
              </p>
              <p className="text-xs text-[#7A6A5D] mt-1">
                + {fmtPKR(overview?.summary?.totalUnpaidPlatformPKR)} pending
              </p>
            </div>
          </div>

          {/* GYMS TABLE */}
          <div className="rounded-[24px] bg-white border border-[#E9DED3] overflow-hidden">
            <div className="p-6 border-b border-[#E9DED3] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#2B160B]">
                  Gym Payouts
                </h2>
                <p className="text-sm text-[#7A6A5D] mt-1">
                  {overview?.gyms?.length || 0} gyms with payout data
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#7A6A5D]">Net Payable</p>
                <p className="text-lg font-bold text-red-600">
                  {fmtPKR(overview?.summary?.netPayablePKR)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FCFAF8]">
                  <tr>
                    {[
                      "Gym",
                      "Tier",
                      "Owner",
                      "Payout Account",
                      "Paid Visits",
                      "Paid Gym",
                      "Paid Platform",
                      "Unpaid Visits",
                      "Unpaid Gym",
                      "Unpaid Platform",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DED3]">
                  {overview?.gyms?.map((gym) => (
                    <tr
                      key={gym.gymId}
                      className="hover:bg-[#FCFAF8] transition"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#2B160B]">
                            {gym.gymName}
                          </p>
                          <p className="text-xs text-[#8A7B70]">
                            ID {gym.gymId?.slice(0, 8)}…
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            gym.gymTier === "BASIC"
                              ? "bg-[#F5EFE8] text-[#5B3A29]"
                              : gym.gymTier === "ULTIMATE"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {gym.gymTier}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#6B625A]">
                        {gym.owner?.name || "—"}
                      </td>
                      {/* Payout Account Column with Status */}
                      <td className="px-4 py-4">
                        {gym.hasPayoutAccount ? (
                          <button
                            onClick={() => fetchGymAccount(gym.gymId, gym)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              gym.payoutAccountVerified
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            }`}
                          >
                            {getAccountTypeIcon(gym.payoutAccountType)}
                            <span className="capitalize">
                              {getAccountTypeLabel(gym.payoutAccountType)}
                            </span>
                            {gym.payoutAccountVerified ? (
                              <ShieldCheck className="w-3 h-3" />
                            ) : (
                              <AlertTriangle className="w-3 h-3" />
                            )}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            Not Set
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-emerald-700">
                        {gym.paidVisits ?? 0}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-semibold text-emerald-700">
                        {fmtPKR(gym.paidAmountPKR)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-semibold text-purple-700">
                        {fmtPKR(gym.paidPlatformAmountPKR)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-red-600">
                        {gym.unpaidVisits ?? 0}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-semibold text-red-600">
                        {fmtPKR(gym.unpaidAmountPKR)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-semibold text-purple-600">
                        {fmtPKR(gym.unpaidPlatformAmountPKR)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {gym.unpaidVisits > 0 ? (
                          <button
                            onClick={() => setPayoutModal({ open: true, gym })}
                            className="h-8 px-3 rounded-lg bg-[#2A1608] text-white text-xs font-medium hover:bg-[#1C0F06] transition-colors"
                          >
                            Pay Now
                          </button>
                        ) : gym.paidVisits > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle className="w-3 h-3" /> Settled
                          </span>
                        ) : (
                          <span className="text-xs text-[#7A6A5D]">
                            No visits
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {(!overview?.gyms || overview.gyms.length === 0) && (
                    <tr>
                      <td
                        colSpan={11}
                        className="px-6 py-16 text-center text-sm text-[#7A6A5D]"
                      >
                        No gym payout data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PAYOUT MODAL */}
      {payoutModal.open && payoutModal.gym && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#2B160B]">
                  Process Payout
                </h3>
                <p className="text-sm text-[#7A6A5D]">
                  {payoutModal.gym.gymName}
                </p>
              </div>
              <button
                onClick={resetModal}
                className="p-2 rounded-lg hover:bg-[#F5EFE8] transition"
              >
                <X className="w-5 h-5 text-[#7A6A5D]" />
              </button>
            </div>

            {/* Payout Account Quick View */}
            <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">
                    Need payout account details?
                  </span>
                </div>
                <button
                  onClick={() => {
                    resetModal();
                    fetchGymAccount(payoutModal.gym.gymId, payoutModal.gym);
                  }}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  View Account →
                </button>
              </div>
            </div>

            <div className="bg-[#FAF7F4] rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#7A6A5D]">Unpaid Visits</span>
                <span className="font-semibold text-[#2B160B]">
                  {payoutModal.gym.unpaidVisits}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7A6A5D]">Amount to Pay (Gym)</span>
                <span className="font-bold text-emerald-700">
                  {fmtPKR(payoutModal.gym.unpaidAmountPKR)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7A6A5D]">Platform Keeps</span>
                <span className="font-semibold text-purple-700">
                  {fmtPKR(payoutModal.gym.unpaidPlatformAmountPKR)}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1">
                Transaction Reference *
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. TRX-123456789 or Bank Ref"
                className="w-full px-3 py-2 rounded-xl border border-[#E7DDD3] text-sm focus:outline-none focus:border-[#5B3A29]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1">
                Notes for Owner
              </label>
              <textarea
                value={payoutNotes}
                onChange={(e) => setPayoutNotes(e.target.value)}
                placeholder="Optional message sent to gym owner via email..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-[#E7DDD3] text-sm resize-none focus:outline-none focus:border-[#5B3A29]"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1">
                Payment Screenshot
              </label>
              <div className="mt-1">
                {screenshot ? (
                  <div className="flex items-center gap-2 p-3 bg-[#F5EFE8] rounded-xl">
                    <FileText className="w-4 h-4 text-[#5B3A29]" />
                    <span className="text-sm text-[#2B160B] flex-1 truncate">
                      {screenshot.name}
                    </span>
                    <button
                      onClick={() => setScreenshot(null)}
                      className="p-1 rounded hover:bg-red-100 text-red-500 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-[#E7DDD3] rounded-xl text-[#7A6A5D] text-sm hover:border-[#5B3A29] hover:text-[#5B3A29] transition flex flex-col items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Click to upload screenshot</span>
                    <span className="text-xs opacity-60">
                      PNG, JPG up to 5MB
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetModal}
                className="flex-1 py-2.5 rounded-xl border border-[#E7DDD3] text-[#7A6A5D] text-sm font-medium hover:bg-[#F9F5F1] transition"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayout}
                disabled={!transactionRef.trim() || processing}
                className="flex-1 py-2.5 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm & Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT DETAIL MODAL */}
      {accountModal.open && accountModal.gym && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
                  {accountModal.account ? (
                    getAccountTypeIcon(accountModal.account.accountType)
                  ) : (
                    <Landmark className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2B160B]">
                    Payout Account
                  </h3>
                  <p className="text-sm text-[#7A6A5D]">
                    {accountModal.gym.gymName}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setAccountModal({ open: false, gym: null, account: null })
                }
                className="p-2 rounded-lg hover:bg-[#F5EFE8] transition"
              >
                <X className="w-5 h-5 text-[#7A6A5D]" />
              </button>
            </div>

            {accountLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-[#9A5A17]" />
              </div>
            ) : accountModal.account ? (
              <div className="space-y-4">
                {/* Account Type & Verification */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#FCFAF8] border border-[#E9DED3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center text-white">
                      {getAccountTypeIcon(accountModal.account.accountType)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2B160B]">
                        {getAccountTypeLabel(accountModal.account.accountType)}
                      </p>
                      <p className="text-xs text-[#7A6A5D]">
                        {accountModal.account.accountType === "bank"
                          ? "Bank Transfer"
                          : "Mobile Wallet"}
                      </p>
                    </div>
                  </div>
                  {accountModal.account.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-600 font-medium">
                      <Shield className="w-3.5 h-3.5" />
                      Unverified
                    </span>
                  )}
                </div>

                {/* Account Details */}
                <div className="space-y-3">
                  {/* Account Holder Name — Always shown */}
                  <AdminDetailRow
                    label="Account Holder Name"
                    value={accountModal.account.accountTitle}
                    icon={<User className="w-4 h-4" />}
                    onCopy={() =>
                      copyToClipboard(
                        accountModal.account.accountTitle,
                        "holderName",
                      )
                    }
                    copied={copiedField === "holderName"}
                  />

                  {accountModal.account.accountType === "bank" ? (
                    <>
                      <AdminDetailRow
                        label="Bank Name"
                        value={accountModal.account.bankName}
                        icon={<Building className="w-4 h-4" />}
                        onCopy={() =>
                          copyToClipboard(
                            accountModal.account.bankName,
                            "bankName",
                          )
                        }
                        copied={copiedField === "bankName"}
                      />
                      <AdminDetailRow
                        label="Account Title"
                        value={accountModal.account.accountTitle}
                        icon={<User className="w-4 h-4" />}
                        onCopy={() =>
                          copyToClipboard(
                            accountModal.account.accountTitle,
                            "accTitle",
                          )
                        }
                        copied={copiedField === "accTitle"}
                      />
                      <AdminDetailRow
                        label="Account Number"
                        value={accountModal.account.accountNumber}
                        icon={<Hash className="w-4 h-4" />}
                        onCopy={() =>
                          copyToClipboard(
                            accountModal.account.accountNumber,
                            "accNumber",
                          )
                        }
                        copied={copiedField === "accNumber"}
                      />
                      {accountModal.account.iban && (
                        <AdminDetailRow
                          label="IBAN"
                          value={formatIBAN(accountModal.account.iban)}
                          icon={<CreditCard className="w-4 h-4" />}
                          onCopy={() =>
                            copyToClipboard(accountModal.account.iban, "iban")
                          }
                          copied={copiedField === "iban"}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <AdminDetailRow
                        label="Wallet Provider"
                        value={getAccountTypeLabel(
                          accountModal.account.accountType,
                        )}
                        icon={<Smartphone className="w-4 h-4" />}
                      />
                      <AdminDetailRow
                        label="Mobile Number"
                        value={formatMobile(accountModal.account.mobileNumber)}
                        icon={<Phone className="w-4 h-4" />}
                        onCopy={() =>
                          copyToClipboard(
                            accountModal.account.mobileNumber,
                            "mobile",
                          )
                        }
                        copied={copiedField === "mobile"}
                      />
                    </>
                  )}
                </div>

                {/* Owner Info */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-600 uppercase font-semibold mb-2">
                    Gym Owner
                  </p>
                  <p className="text-sm font-medium text-[#2B160B]">
                    {accountModal.gym.owner?.name || "—"}
                  </p>
                  <p className="text-xs text-[#7A6A5D] mt-0.5">
                    {accountModal.gym.owner?.email || "—"}
                  </p>
                </div>

                {/* Admin Actions */}
                <div className="flex gap-3">
                  {!accountModal.account.isVerified && (
                    <button
                      onClick={async () => {
                        try {
                          await gymService.verifyPayoutAccount(
                            accountModal.gym.gymId,
                          );
                          toast({ title: "Account verified successfully" });
                          setAccountModal((prev) => ({
                            ...prev,
                            account: {
                              ...prev.account,
                              isVerified: true,
                              verifiedAt: new Date(),
                            },
                          }));
                          fetchOverview(); // Refresh to update table status
                        } catch (err) {
                          toast({
                            title: "Failed to verify",
                            description:
                              err.response?.data?.message || err.message,
                            variant: "destructive",
                          });
                        }
                      }}
                      className="flex-1 h-11 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Verify Account
                    </button>
                  )}

                  {accountModal.gym.unpaidVisits > 0 && (
                    <button
                      onClick={() => {
                        setAccountModal({
                          open: false,
                          gym: null,
                          account: null,
                        });
                        setPayoutModal({ open: true, gym: accountModal.gym });
                      }}
                      className="flex-1 h-11 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Process Payout
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto">
                  <Landmark className="w-8 h-8 text-[#8A7B70]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#2B160B]">
                  No account configured
                </h3>
                <p className="mt-2 text-sm text-[#7A6A5D]">
                  This gym hasn't set up a payout account yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Helper component for admin account detail rows
function AdminDetailRow({ label, value, icon, onCopy, copied }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#FCFAF8] border border-[#E9DED3]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-[#8A7B70]">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs text-[#7A6A5D] uppercase">{label}</p>
          <p className="text-sm font-medium text-[#2B160B] mt-0.5 truncate font-mono">
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
