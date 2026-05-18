// import { useEffect, useState } from "react";
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   RefreshCw,
//   Check,
//   Star,
//   CreditCard,
//   Loader2,
// } from "lucide-react";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { adminService } from "@/services/adminService";
// import { useToast } from "@/hooks/use-toast";

// export default function AdminSubscriptionPlans() {
//   const { toast } = useToast();
//   const [tiers, setTiers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showTierForm, setShowTierForm] = useState(false);
//   const [showPriceForm, setShowPriceForm] = useState(false);
//   const [editingTier, setEditingTier] = useState(null);
//   const [selectedTierForPrice, setSelectedTierForPrice] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const emptyTierForm = {
//     name: "",
//     slug: "",
//     description: "",
//     accessTier: "1",
//     isFeatured: false,
//   };
//   const emptyPriceForm = {
//     interval: "month",
//     priceCents: "",
//     currency: "pkr",
//   };

//   const [tierForm, setTierForm] = useState(emptyTierForm);
//   const [priceForm, setPriceForm] = useState(emptyPriceForm);

//   useEffect(() => {
//     fetchTiers();
//   }, []);

//   const fetchTiers = async () => {
//     try {
//       setLoading(true);
//       const data = await adminService.listSubscriptionTiers();
//       setTiers(data.tiers || []);
//     } catch (err) {
//       toast({
//         title: "Failed to load tiers",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateTier = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
//       await adminService.createSubscriptionTier({
//         ...tierForm,
//         accessTier: parseInt(tierForm.accessTier),
//       });
//       toast({ title: "Tier created successfully" });
//       setShowTierForm(false);
//       setTierForm(emptyTierForm);
//       fetchTiers();
//     } catch (err) {
//       toast({
//         title: "Failed to create tier",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleUpdateTier = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
//       await adminService.updateSubscriptionTier(editingTier.id, {
//         name: tierForm.name,
//         description: tierForm.description,
//         accessTier: parseInt(tierForm.accessTier),
//         isFeatured: tierForm.isFeatured,
//       });
//       toast({ title: "Tier updated successfully" });
//       setEditingTier(null);
//       setShowTierForm(false);
//       setTierForm(emptyTierForm);
//       fetchTiers();
//     } catch (err) {
//       toast({
//         title: "Failed to update tier",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCreatePrice = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
//       await adminService.createSubscriptionPrice({
//         tierId: selectedTierForPrice.id,
//         interval: priceForm.interval,
//         priceCents: parseInt(priceForm.priceCents) * 100,
//         currency: priceForm.currency,
//       });
//       toast({ title: "Price created in Stripe + Database" });
//       setShowPriceForm(false);
//       setPriceForm(emptyPriceForm);
//       fetchTiers();
//     } catch (err) {
//       toast({
//         title: "Failed to create price",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeactivatePrice = async (priceId) => {
//     if (!confirm("Deactivate this price? Existing subscribers keep access."))
//       return;
//     try {
//       await adminService.deactivateSubscriptionPrice(priceId);
//       toast({ title: "Price deactivated" });
//       fetchTiers();
//     } catch (err) {
//       toast({
//         title: "Failed to deactivate",
//         variant: "destructive",
//       });
//     }
//   };

//   const openEditTier = (tier) => {
//     setEditingTier(tier);
//     setTierForm({
//       name: tier.name,
//       slug: tier.slug,
//       description: tier.description || "",
//       accessTier: String(tier.accessTier),
//       isFeatured: tier.isFeatured,
//     });
//     setShowTierForm(true);
//   };

//   const openAddPrice = (tier) => {
//     setSelectedTierForPrice(tier);
//     setShowPriceForm(true);
//   };

//   const tierColors = {
//     1: { bg: "bg-slate-100", text: "text-slate-600", star: "text-slate-400" },
//     2: { bg: "bg-blue-100", text: "text-blue-600", star: "text-blue-400" },
//     3: { bg: "bg-amber-100", text: "text-amber-600", star: "text-amber-400" },
//   };

//   return (
//     <AdminLayout active="subscriptions">
//       <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
//         <div className="max-w-[1400px] mx-auto space-y-6">
//           {/* Header */}
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
//                   <CreditCard className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-[#2B160B]">
//                     Subscription Plans
//                   </h1>
//                   <p className="text-sm text-[#7A6A5D]">
//                     Manage tiers and Stripe-synced pricing
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={fetchTiers}
//                 disabled={loading}
//                 className="h-10 px-4 rounded-xl border border-[#D9CDBF] bg-white flex items-center gap-2 text-sm hover:bg-[#F5F0E8] transition-colors"
//               >
//                 <RefreshCw
//                   className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
//                 />
//                 Refresh
//               </button>
//               <button
//                 onClick={() => {
//                   setEditingTier(null);
//                   setTierForm(emptyTierForm);
//                   setShowTierForm(true);
//                 }}
//                 className="h-10 px-5 rounded-xl bg-[#2A1608] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#1C0F06] transition-colors"
//               >
//                 <Plus className="w-4 h-4" /> New Tier
//               </button>
//             </div>
//           </div>

//           {/* Loading */}
//           {loading && (
//             <div className="flex items-center justify-center h-64">
//               <Loader2 className="w-8 h-8 animate-spin text-[#9A5A17]" />
//             </div>
//           )}

//           {/* Empty */}
//           {!loading && tiers.length === 0 && (
//             <div className="rounded-[28px] bg-white border border-[#E9DED3] p-12 text-center">
//               <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto">
//                 <CreditCard className="w-7 h-7 text-[#8A7B70]" />
//               </div>
//               <h3 className="mt-4 text-lg font-semibold text-[#2B160B]">
//                 No subscription tiers yet
//               </h3>
//               <p className="mt-1 text-sm text-[#7A6A5D]">
//                 Create your first tier to start offering plans to members.
//               </p>
//               <button
//                 onClick={() => {
//                   setEditingTier(null);
//                   setTierForm(emptyTierForm);
//                   setShowTierForm(true);
//                 }}
//                 className="mt-4 h-10 px-5 rounded-xl bg-[#2A1608] text-white text-sm font-medium"
//               >
//                 Create Tier
//               </button>
//             </div>
//           )}

//           {/* Tiers */}
//           {!loading && tiers.length > 0 && (
//             <div className="space-y-6">
//               {tiers.map((tier) => {
//                 const colors = tierColors[tier.accessTier] || tierColors[1];
//                 return (
//                   <div
//                     key={tier.id}
//                     className="rounded-[24px] bg-white border border-[#E9DED3] overflow-hidden"
//                   >
//                     <div className="p-6">
//                       <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//                         <div className="flex items-start gap-4">
//                           <div
//                             className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}
//                           >
//                             <Star className={`w-6 h-6 ${colors.star}`} />
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <h3 className="text-xl font-bold text-[#2B160B]">
//                                 {tier.name}
//                               </h3>
//                               <span
//                                 className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}
//                               >
//                                 Tier {tier.accessTier}
//                               </span>
//                               {tier.isFeatured && (
//                                 <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-600">
//                                   Featured
//                                 </span>
//                               )}
//                               {!tier.isActive && (
//                                 <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-red-100 text-red-600">
//                                   Inactive
//                                 </span>
//                               )}
//                             </div>
//                             <p className="mt-1 text-sm text-[#7A6A5D]">
//                               {tier.description || "No description"}
//                             </p>
//                             <p className="mt-1 text-xs text-[#8A7B70] font-mono">
//                               slug: {tier.slug}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => openEditTier(tier)}
//                             className="h-9 px-3 rounded-xl border border-[#E5DACE] bg-[#F8F2EA] text-sm text-[#6B625A] hover:bg-[#F1E8DC] transition-colors flex items-center gap-1.5"
//                           >
//                             <Edit2 className="w-3.5 h-3.5" /> Edit
//                           </button>
//                           <button
//                             onClick={() => openAddPrice(tier)}
//                             className="h-9 px-3 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors flex items-center gap-1.5"
//                           >
//                             <Plus className="w-3.5 h-3.5" /> Add Price
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Prices */}
//                     <div className="border-t border-[#E9DED3] bg-[#FCFAF8] p-6">
//                       <h4 className="text-xs font-semibold text-[#6B625A] uppercase tracking-wider mb-4">
//                         Active Prices
//                       </h4>
//                       {tier.prices?.length === 0 ? (
//                         <div className="rounded-xl border border-dashed border-[#D9CDBF] bg-white p-6 text-center">
//                           <p className="text-sm text-[#8A7B70]">
//                             No prices set. Click "Add Price" to create a Stripe
//                             price.
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//                           {tier.prices.map((price) => (
//                             <div
//                               key={price.id}
//                               className="rounded-xl border border-[#E5DACE] bg-white p-4"
//                             >
//                               <div className="flex items-start justify-between">
//                                 <div>
//                                   <p className="text-2xl font-bold text-[#2B160B]">
//                                     PKR{" "}
//                                     {(price.priceCents / 100).toLocaleString()}
//                                   </p>
//                                   <p className="text-sm text-[#7A6A5D]">
//                                     per {price.interval}
//                                   </p>
//                                 </div>
//                                 <button
//                                   onClick={() =>
//                                     handleDeactivatePrice(price.id)
//                                   }
//                                   className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
//                                   title="Deactivate price"
//                                 >
//                                   <Trash2 className="w-3.5 h-3.5 text-red-400" />
//                                 </button>
//                               </div>
//                               <div className="mt-3 pt-3 border-t border-[#F0EAE3]">
//                                 <p className="text-[10px] text-[#8A7B70] uppercase tracking-wider">
//                                   Stripe Price ID
//                                 </p>
//                                 <p className="text-xs font-mono text-[#6B625A] mt-0.5 truncate">
//                                   {price.stripePriceId}
//                                 </p>
//                               </div>
//                               <div className="mt-2 flex items-center gap-1.5">
//                                 <div
//                                   className={`w-1.5 h-1.5 rounded-full ${price.isActive ? "bg-emerald-400" : "bg-red-400"}`}
//                                 />
//                                 <span className="text-[10px] text-[#8A7B70]">
//                                   {price.isActive ? "Active" : "Inactive"}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tier Modal */}
//       {showTierForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
//             <h2 className="text-xl font-bold text-[#2B160B]">
//               {editingTier ? "Edit Tier" : "Create New Tier"}
//             </h2>
//             <form
//               onSubmit={editingTier ? handleUpdateTier : handleCreateTier}
//               className="mt-5 space-y-4"
//             >
//               <div>
//                 <label className="text-xs font-medium text-[#6B625A]">
//                   Tier Name *
//                 </label>
//                 <input
//                   value={tierForm.name}
//                   onChange={(e) =>
//                     setTierForm((p) => ({ ...p, name: e.target.value }))
//                   }
//                   className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
//                   placeholder="Basic"
//                   required
//                 />
//               </div>

//               {!editingTier && (
//                 <div>
//                   <label className="text-xs font-medium text-[#6B625A]">
//                     Slug (unique) *
//                   </label>
//                   <input
//                     value={tierForm.slug}
//                     onChange={(e) =>
//                       setTierForm((p) => ({ ...p, slug: e.target.value }))
//                     }
//                     className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
//                     placeholder="basic"
//                     required
//                   />
//                   <p className="mt-1 text-[10px] text-[#8A7B70]">
//                     Used in URLs and API references
//                   </p>
//                 </div>
//               )}

//               <div>
//                 <label className="text-xs font-medium text-[#6B625A]">
//                   Description
//                 </label>
//                 <input
//                   value={tierForm.description}
//                   onChange={(e) =>
//                     setTierForm((p) => ({ ...p, description: e.target.value }))
//                   }
//                   className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
//                   placeholder="Access to basic gym facilities"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-xs font-medium text-[#6B625A]">
//                     Access Level *
//                   </label>
//                   <select
//                     value={tierForm.accessTier}
//                     onChange={(e) =>
//                       setTierForm((p) => ({ ...p, accessTier: e.target.value }))
//                     }
//                     className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
//                   >
//                     <option value="1">1 — Basic</option>
//                     <option value="2">2 — Standard</option>
//                     <option value="3">3 — Premium</option>
//                   </select>
//                 </div>
//                 <div className="flex items-end">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={tierForm.isFeatured}
//                       onChange={(e) =>
//                         setTierForm((p) => ({
//                           ...p,
//                           isFeatured: e.target.checked,
//                         }))
//                       }
//                       className="w-4 h-4 rounded border-[#E3D8CB]"
//                     />
//                     <span className="text-sm text-[#4A3F38]">
//                       Featured tier
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowTierForm(false)}
//                   className="h-10 px-5 rounded-xl border border-[#D9CDBF] text-sm text-[#6B625A] hover:bg-[#F5F0E8] transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="h-10 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors disabled:opacity-60 flex items-center gap-2"
//                 >
//                   {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
//                   {editingTier ? "Update Tier" : "Create Tier"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Price Modal */}
//       {showPriceForm && selectedTierForPrice && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
//             <h2 className="text-xl font-bold text-[#2B160B]">
//               Add Price for {selectedTierForPrice.name}
//             </h2>
//             <p className="mt-1 text-sm text-[#7A6A5D]">
//               Creates a new product & price in Stripe
//             </p>
//             <form onSubmit={handleCreatePrice} className="mt-5 space-y-4">
//               <div>
//                 <label className="text-xs font-medium text-[#6B625A]">
//                   Price (PKR) *
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={priceForm.priceCents}
//                   onChange={(e) =>
//                     setPriceForm((p) => ({ ...p, priceCents: e.target.value }))
//                   }
//                   className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
//                   placeholder="5000"
//                   required
//                 />
//                 <p className="mt-1 text-[10px] text-[#8A7B70]">
//                   Enter amount in PKR (e.g., 5000 for ₨5,000)
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-xs font-medium text-[#6B625A]">
//                     Billing Interval *
//                   </label>
//                   <select
//                     value={priceForm.interval}
//                     onChange={(e) =>
//                       setPriceForm((p) => ({ ...p, interval: e.target.value }))
//                     }
//                     className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
//                   >
//                     <option value="month">Monthly</option>
//                     <option value="year">Yearly</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium text-[#6B625A]">
//                     Currency
//                   </label>
//                   <select
//                     value={priceForm.currency}
//                     onChange={(e) =>
//                       setPriceForm((p) => ({ ...p, currency: e.target.value }))
//                     }
//                     className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
//                   >
//                     <option value="pkr">PKR</option>
//                     <option value="usd">USD</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowPriceForm(false)}
//                   className="h-10 px-5 rounded-xl border border-[#D9CDBF] text-sm text-[#6B625A] hover:bg-[#F5F0E8] transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="h-10 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors disabled:opacity-60 flex items-center gap-2"
//                 >
//                   {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
//                   Create in Stripe
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </AdminLayout>
//   );
// }
import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Star,
  CreditCard,
  Loader2,
  Dumbbell,
  Infinity,
  Calendar,
  Gift,
  Check,
  X,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function AdminSubscriptionPlans() {
  const { toast } = useToast();
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTierForm, setShowTierForm] = useState(false);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [selectedTierForPrice, setSelectedTierForPrice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emptyTierForm = {
    name: "",
    slug: "",
    description: "",
    accessTier: "1",
    gymTierAccess: "BASIC",
    monthlyVisitLimit: "",
    isUnlimited: false,
    perks: {},
    isFeatured: false,
    isActive: true,
  };

  const emptyPriceForm = {
    interval: "monthly",
    priceCents: "",
    currency: "pkr",
  };

  const [tierForm, setTierForm] = useState(emptyTierForm);
  const [priceForm, setPriceForm] = useState(emptyPriceForm);
  const [perkInput, setPerkInput] = useState({ key: "", value: "" });

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const data = await adminService.listSubscriptionTiers();
      setTiers(data.tiers || []);
    } catch (err) {
      toast({
        title: "Failed to load tiers",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Build perks object from array or existing object
  const buildPerksObject = (perks) => {
    if (!perks) return {};
    if (typeof perks === "object" && !Array.isArray(perks)) return perks;
    if (Array.isArray(perks)) {
      return perks.reduce((acc, perk, idx) => {
        acc[`perk_${idx + 1}`] = perk;
        return acc;
      }, {});
    }
    return {};
  };

  const handleCreateTier = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...tierForm,
        accessTier: parseInt(tierForm.accessTier),
        monthlyVisitLimit: tierForm.isUnlimited
          ? null
          : tierForm.monthlyVisitLimit
            ? parseInt(tierForm.monthlyVisitLimit)
            : null,
        perks: Object.keys(tierForm.perks).length > 0 ? tierForm.perks : null,
      };

      await adminService.createSubscriptionTier(payload);
      toast({ title: "Tier created successfully" });
      setShowTierForm(false);
      setTierForm(emptyTierForm);
      fetchTiers();
    } catch (err) {
      toast({
        title: "Failed to create tier",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTier = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: tierForm.name,
        description: tierForm.description,
        accessTier: parseInt(tierForm.accessTier),
        gymTierAccess: tierForm.gymTierAccess,
        monthlyVisitLimit: tierForm.isUnlimited
          ? null
          : tierForm.monthlyVisitLimit
            ? parseInt(tierForm.monthlyVisitLimit)
            : null,
        isUnlimited: tierForm.isUnlimited,
        perks: Object.keys(tierForm.perks).length > 0 ? tierForm.perks : null,
        isFeatured: tierForm.isFeatured,
        isActive: tierForm.isActive,
      };

      await adminService.updateSubscriptionTier(editingTier.id, payload);
      toast({ title: "Tier updated successfully" });
      setEditingTier(null);
      setShowTierForm(false);
      setTierForm(emptyTierForm);
      fetchTiers();
    } catch (err) {
      toast({
        title: "Failed to update tier",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePrice = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await adminService.createSubscriptionPrice({
        tierId: selectedTierForPrice.id,
        interval: priceForm.interval,
        priceCents: parseInt(priceForm.priceCents) * 100,
        currency: priceForm.currency,
      });
      toast({ title: "Price created in Stripe + Database" });
      setShowPriceForm(false);
      setPriceForm(emptyPriceForm);
      fetchTiers();
    } catch (err) {
      toast({
        title: "Failed to create price",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivatePrice = async (priceId) => {
    if (!confirm("Deactivate this price? Existing subscribers keep access."))
      return;
    try {
      await adminService.deactivateSubscriptionPrice(priceId);
      toast({ title: "Price deactivated" });
      fetchTiers();
    } catch (err) {
      toast({
        title: "Failed to deactivate",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateTier = async (tierId) => {
    if (
      !confirm(
        "Deactivate this tier? It will no longer be available for new subscriptions.",
      )
    )
      return;
    try {
      await adminService.deactivateSubscriptionTier(tierId);
      toast({ title: "Tier deactivated" });
      fetchTiers();
    } catch (err) {
      toast({
        title: "Failed to deactivate tier",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  const openEditTier = (tier) => {
    setEditingTier(tier);
    const perksObj = buildPerksObject(tier.perks);
    setTierForm({
      name: tier.name,
      slug: tier.slug,
      description: tier.description || "",
      accessTier: String(tier.accessTier),
      gymTierAccess: tier.gymTierAccess || "BASIC",
      monthlyVisitLimit: tier.monthlyVisitLimit || "",
      isUnlimited: tier.isUnlimited || false,
      perks: perksObj,
      isFeatured: tier.isFeatured,
      isActive: tier.isActive,
    });
    setShowTierForm(true);
  };

  const openAddPrice = (tier) => {
    setSelectedTierForPrice(tier);
    setShowPriceForm(true);
  };

  const addPerk = () => {
    if (!perkInput.key.trim() || !perkInput.value.trim()) return;
    setTierForm((p) => ({
      ...p,
      perks: { ...p.perks, [perkInput.key.trim()]: perkInput.value.trim() },
    }));
    setPerkInput({ key: "", value: "" });
  };

  const removePerk = (key) => {
    setTierForm((p) => {
      const newPerks = { ...p.perks };
      delete newPerks[key];
      return { ...p, perks: newPerks };
    });
  };

  const tierColors = {
    1: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      star: "text-slate-400",
      border: "border-slate-200",
    },
    2: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      star: "text-blue-400",
      border: "border-blue-200",
    },
    3: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      star: "text-amber-400",
      border: "border-amber-200",
    },
  };

  const gymTierColors = {
    BASIC: "bg-stone-100 text-stone-600",
    ULTIMATE: "bg-indigo-100 text-indigo-600",
    ELITE: "bg-purple-100 text-purple-600",
  };

  return (
    <AdminLayout active="subscriptions">
      <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#2B160B]">
                    Subscription Plans
                  </h1>
                  <p className="text-sm text-[#7A6A5D]">
                    Manage tiers, gym access levels, visit limits & Stripe
                    pricing
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchTiers}
                disabled={loading}
                className="h-10 px-4 rounded-xl border border-[#D9CDBF] bg-white flex items-center gap-2 text-sm hover:bg-[#F5F0E8] transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={() => {
                  setEditingTier(null);
                  setTierForm(emptyTierForm);
                  setShowTierForm(true);
                }}
                className="h-10 px-5 rounded-xl bg-[#2A1608] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#1C0F06] transition-colors"
              >
                <Plus className="w-4 h-4" /> New Tier
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#9A5A17]" />
            </div>
          )}

          {/* Empty */}
          {!loading && tiers.length === 0 && (
            <div className="rounded-[28px] bg-white border border-[#E9DED3] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto">
                <CreditCard className="w-7 h-7 text-[#8A7B70]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#2B160B]">
                No subscription tiers yet
              </h3>
              <p className="mt-1 text-sm text-[#7A6A5D]">
                Create your first tier to start offering plans to members.
              </p>
              <button
                onClick={() => {
                  setEditingTier(null);
                  setTierForm(emptyTierForm);
                  setShowTierForm(true);
                }}
                className="mt-4 h-10 px-5 rounded-xl bg-[#2A1608] text-white text-sm font-medium"
              >
                Create Tier
              </button>
            </div>
          )}

          {/* Tiers */}
          {!loading && tiers.length > 0 && (
            <div className="space-y-6">
              {tiers.map((tier) => {
                const colors = tierColors[tier.accessTier] || tierColors[1];
                const perksObj = buildPerksObject(tier.perks);
                return (
                  <div
                    key={tier.id}
                    className={`rounded-[24px] bg-white border overflow-hidden ${
                      !tier.isActive
                        ? "border-red-200 opacity-75"
                        : "border-[#E9DED3]"
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}
                          >
                            <Star className={`w-6 h-6 ${colors.star}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl font-bold text-[#2B160B]">
                                {tier.name}
                              </h3>
                              <span
                                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}
                              >
                                Tier {tier.accessTier}
                              </span>
                              <span
                                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                                  gymTierColors[tier.gymTierAccess] ||
                                  gymTierColors.BASIC
                                }`}
                              >
                                <Dumbbell className="w-3 h-3 inline mr-1" />
                                {tier.gymTierAccess}
                              </span>
                              {tier.isFeatured && (
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-600">
                                  <Star className="w-3 h-3 inline mr-1" />
                                  Featured
                                </span>
                              )}
                              {!tier.isActive && (
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-red-100 text-red-600">
                                  Inactive
                                </span>
                              )}
                              {tier.isUnlimited && (
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-600">
                                  <Infinity className="w-3 h-3 inline mr-1" />
                                  Unlimited
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-[#7A6A5D]">
                              {tier.description || "No description"}
                            </p>
                            <p className="mt-1 text-xs text-[#8A7B70] font-mono">
                              slug: {tier.slug}
                            </p>

                            {/* Visit Limit & Perks */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {!tier.isUnlimited && tier.monthlyVisitLimit && (
                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#F5F0E8] text-[#6B625A]">
                                  <Calendar className="w-3 h-3" />
                                  {tier.monthlyVisitLimit} visits/month
                                </span>
                              )}
                              {tier.isUnlimited && (
                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                                  <Infinity className="w-3 h-3" />
                                  Unlimited visits
                                </span>
                              )}
                              {Object.entries(perksObj).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#F5F0E8] text-[#6B625A]"
                                >
                                  <Gift className="w-3 h-3" />
                                  {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditTier(tier)}
                            className="h-9 px-3 rounded-xl border border-[#E5DACE] bg-[#F8F2EA] text-sm text-[#6B625A] hover:bg-[#F1E8DC] transition-colors flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => openAddPrice(tier)}
                            className="h-9 px-3 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Price
                          </button>
                          {tier.isActive && (
                            <button
                              onClick={() => handleDeactivateTier(tier.id)}
                              className="h-9 px-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors flex items-center gap-1.5"
                              title="Deactivate tier"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="border-t border-[#E9DED3] bg-[#FCFAF8] p-6">
                      <h4 className="text-xs font-semibold text-[#6B625A] uppercase tracking-wider mb-4">
                        Active Prices ({tier.prices?.length || 0})
                      </h4>
                      {tier.prices?.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#D9CDBF] bg-white p-6 text-center">
                          <p className="text-sm text-[#8A7B70]">
                            No prices set. Click "Add Price" to create a Stripe
                            price.
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {tier.prices.map((price) => (
                            <div
                              key={price.id}
                              className="rounded-xl border border-[#E5DACE] bg-white p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-[#2B160B]">
                                    PKR{" "}
                                    {(price.priceCents / 100).toLocaleString()}
                                  </p>
                                  <p className="text-sm text-[#7A6A5D]">
                                    per {price.interval}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeactivatePrice(price.id)
                                  }
                                  className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                                  title="Deactivate price"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                              </div>
                              <div className="mt-3 pt-3 border-t border-[#F0EAE3]">
                                <p className="text-[10px] text-[#8A7B70] uppercase tracking-wider">
                                  Stripe Price ID
                                </p>
                                <p className="text-xs font-mono text-[#6B625A] mt-0.5 truncate">
                                  {price.stripePriceId}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center gap-1.5">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    price.isActive
                                      ? "bg-emerald-400"
                                      : "bg-red-400"
                                  }`}
                                />
                                <span className="text-[10px] text-[#8A7B70]">
                                  {price.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tier Modal */}
      {showTierForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl my-8">
            <h2 className="text-xl font-bold text-[#2B160B]">
              {editingTier ? "Edit Tier" : "Create New Tier"}
            </h2>
            <form
              onSubmit={editingTier ? handleUpdateTier : handleCreateTier}
              className="mt-5 space-y-4"
            >
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-[#6B625A]">
                  Tier Name *
                </label>
                <input
                  value={tierForm.name}
                  onChange={(e) =>
                    setTierForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
                  placeholder="Basic"
                  required
                />
              </div>

              {/* Slug (create only) */}
              {!editingTier && (
                <div>
                  <label className="text-xs font-medium text-[#6B625A]">
                    Slug (unique) *
                  </label>
                  <input
                    value={tierForm.slug}
                    onChange={(e) =>
                      setTierForm((p) => ({ ...p, slug: e.target.value }))
                    }
                    className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
                    placeholder="basic"
                    required
                  />
                  <p className="mt-1 text-[10px] text-[#8A7B70]">
                    Used in URLs and API references
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-[#6B625A]">
                  Description
                </label>
                <input
                  value={tierForm.description}
                  onChange={(e) =>
                    setTierForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
                  placeholder="Access to basic gym facilities"
                />
              </div>

              {/* Access Tier & Gym Tier Access */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#6B625A]">
                    Access Level *
                  </label>
                  <select
                    value={tierForm.accessTier}
                    onChange={(e) =>
                      setTierForm((p) => ({ ...p, accessTier: e.target.value }))
                    }
                    className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
                  >
                    <option value="1">1 — Basic</option>
                    <option value="2">2 — Standard</option>
                    <option value="3">3 — Premium</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6B625A]">
                    Gym Tier Access *
                  </label>
                  <select
                    value={tierForm.gymTierAccess}
                    onChange={(e) =>
                      setTierForm((p) => ({
                        ...p,
                        gymTierAccess: e.target.value,
                      }))
                    }
                    className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
                  >
                    <option value="BASIC">BASIC Gyms</option>
                    <option value="ULTIMATE">ULTIMATE Gyms</option>
                    <option value="ELITE">ELITE Gyms</option>
                  </select>
                </div>
              </div>

              {/* Visit Limit & Unlimited Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#6B625A]">
                    Monthly Visit Limit
                  </label>
                  <select
                    value={
                      tierForm.isUnlimited ? "" : tierForm.monthlyVisitLimit
                    }
                    onChange={(e) =>
                      setTierForm((p) => ({
                        ...p,
                        monthlyVisitLimit: e.target.value,
                        isUnlimited: !e.target.value,
                      }))
                    }
                    disabled={tierForm.isUnlimited}
                    className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors disabled:opacity-50"
                  >
                    <option value="">Select limit...</option>
                    <option value="16">16 visits/month</option>
                    <option value="30">30 visits/month</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tierForm.isUnlimited}
                      onChange={(e) =>
                        setTierForm((p) => ({
                          ...p,
                          isUnlimited: e.target.checked,
                          monthlyVisitLimit: e.target.checked
                            ? ""
                            : p.monthlyVisitLimit,
                        }))
                      }
                      className="w-4 h-4 rounded border-[#E3D8CB]"
                    />
                    <span className="text-sm text-[#4A3F38] flex items-center gap-1">
                      <Infinity className="w-4 h-4" />
                      Unlimited visits
                    </span>
                  </label>
                </div>
              </div>

              {/* Perks */}
              <div>
                <label className="text-xs font-medium text-[#6B625A]">
                  Perks / Features
                </label>
                <div className="mt-2 space-y-2">
                  {Object.entries(tierForm.perks).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F5F0E8] text-sm"
                    >
                      <span className="text-[#4A3F38]">
                        <span className="font-medium">{key}:</span> {value}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePerk(key)}
                        className="w-5 h-5 rounded hover:bg-red-100 flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      value={perkInput.key}
                      onChange={(e) =>
                        setPerkInput((p) => ({ ...p, key: e.target.value }))
                      }
                      placeholder="Key (e.g. 'free_shake')"
                      className="flex-1 h-9 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-xs outline-none focus:border-[#9A5A17]"
                    />
                    <input
                      value={perkInput.value}
                      onChange={(e) =>
                        setPerkInput((p) => ({ ...p, value: e.target.value }))
                      }
                      placeholder="Value (e.g. '1 per day')"
                      className="flex-1 h-9 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-xs outline-none focus:border-[#9A5A17]"
                    />
                    <button
                      type="button"
                      onClick={addPerk}
                      className="h-9 px-3 rounded-xl bg-[#2A1608] text-white text-xs font-medium hover:bg-[#1C0F06]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#8A7B70]">
                    Add perks like "free_shake", "personal_trainer",
                    "sauna_access"
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tierForm.isFeatured}
                    onChange={(e) =>
                      setTierForm((p) => ({
                        ...p,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-[#E3D8CB]"
                  />
                  <span className="text-sm text-[#4A3F38] flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured tier
                  </span>
                </label>
                {editingTier && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tierForm.isActive}
                      onChange={(e) =>
                        setTierForm((p) => ({
                          ...p,
                          isActive: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-[#E3D8CB]"
                    />
                    <span className="text-sm text-[#4A3F38] flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  </label>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E9DED3]">
                <button
                  type="button"
                  onClick={() => {
                    setShowTierForm(false);
                    setPerkInput({ key: "", value: "" });
                  }}
                  className="h-10 px-5 rounded-xl border border-[#D9CDBF] text-sm text-[#6B625A] hover:bg-[#F5F0E8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingTier ? "Update Tier" : "Create Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Price Modal */}
      {showPriceForm && selectedTierForPrice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#2B160B]">
              Add Price for {selectedTierForPrice.name}
            </h2>
            <p className="mt-1 text-sm text-[#7A6A5D]">
              Creates a new product & price in Stripe
            </p>
            <form onSubmit={handleCreatePrice} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#6B625A]">
                  Price (PKR) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={priceForm.priceCents}
                  onChange={(e) =>
                    setPriceForm((p) => ({ ...p, priceCents: e.target.value }))
                  }
                  className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
                  placeholder="5000"
                  required
                />
                <p className="mt-1 text-[10px] text-[#8A7B70]">
                  Enter amount in PKR (e.g., 5000 for ₨5,000)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#6B625A]">
                    Billing Interval *
                  </label>
                  <select
                    value={priceForm.interval}
                    onChange={(e) =>
                      setPriceForm((p) => ({ ...p, interval: e.target.value }))
                    }
                    className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
                  >
                    <option value="monthly">monthly</option>
                    <option value="yearly">yearly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6B625A]">
                    Currency
                  </label>
                  <select
                    value={priceForm.currency}
                    onChange={(e) =>
                      setPriceForm((p) => ({ ...p, currency: e.target.value }))
                    }
                    className="mt-1 w-full h-10 rounded-xl border border-[#E3D8CB] bg-[#F3EDE4] px-3 text-sm outline-none focus:border-[#9A5A17] transition-colors"
                  >
                    <option value="pkr">PKR</option>
                    <option value="usd">USD</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPriceForm(false)}
                  className="h-10 px-5 rounded-xl border border-[#D9CDBF] text-sm text-[#6B625A] hover:bg-[#F5F0E8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create in Stripe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
