// import { useEffect, useMemo, useState } from "react";

// import {
//   Building2,
//   CheckCircle2,
//   XCircle,
//   MapPin,
//   Clock3,
//   FileText,
//   ChevronDown,
//   ChevronUp,
//   ExternalLink,
//   RefreshCw,
//   Sparkles,
//   ShieldCheck,
//   AlertTriangle,
//   Eye,
//   Phone,
//   MessageCircle,
//   Star,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { useToast } from "@/hooks/use-toast";
// import { adminService } from "@/services/adminService";

// // ─────────────────────────────────────────────────────────────────────────────
// // FALLBACK MOCK DATA (ONLY IF API FAILS)
// // ─────────────────────────────────────────────────────────────────────────────

// const mockGyms = [
//   {
//     id: "gym_001",
//     name: "Iron Forge Fitness",
//     city: "Lahore",
//     addressLine: "DHA Phase 6",
//     tier: null, // ⬅️ Changed: admin assigns tier, not owner
//     status: "pending",

//     owner: {
//       name: "Ahmed Khan",
//       email: "ahmed@ironforge.pk",
//     },

//     submittedAt: new Date(),

//     is24Hours: true,

//     phoneNumber: "+92 300 1111111",

//     whatsappNumber: "+92 300 1111111",

//     description: "Premium strength training and bodybuilding facility.",

//     resubmissionCount: 1,

//     coverImageUrl:
//       "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",

//     photos: [
//       {
//         id: 1,
//         url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
//       },
//       {
//         id: 2,
//         url: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
//       },
//     ],

//     verificationDocuments: [
//       {
//         id: 1,
//         type: "business_license",
//         status: "approved",
//         fileUrl: "#",
//       },

//       {
//         id: 2,
//         type: "tax_certificate",
//         status: "pending",
//         fileUrl: "#",
//       },
//     ],
//   },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // STATUS BADGE
// // ─────────────────────────────────────────────────────────────────────────────

// function StatusBadge({ status }) {
//   const styles = {
//     approved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",

//     pending: "bg-amber-500/10 text-amber-300 border border-amber-500/20",

//     rejected: "bg-red-500/10 text-red-300 border border-red-500/20",

//     changes_requested:
//       "bg-orange-500/10 text-orange-300 border border-orange-500/20",
//   };

//   return (
//     <div
//       className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
//         styles[status]
//       }`}
//     >
//       {status.replace("_", " ")}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // TIER SELECTOR COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────

// function TierSelector({ value, onChange, disabled }) {
//   const tiers = [
//     { value: 1, label: "Tier 1 — Basic", color: "bg-slate-500" },
//     { value: 2, label: "Tier 2 — Standard", color: "bg-blue-500" },
//     { value: 3, label: "Tier 3 — Premium", color: "bg-amber-500" },
//   ];

//   return (
//     <div className="flex items-center gap-2">
//       <Star className="h-4 w-4 text-amber-400" />
//       <select
//         value={value || ""}
//         onChange={(e) =>
//           onChange(e.target.value ? parseInt(e.target.value) : null)
//         }
//         disabled={disabled}
//         className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white outline-none focus:border-amber-400"
//       >
//         <option value="">Assign Tier...</option>
//         {tiers.map((t) => (
//           <option key={t.value} value={t.value}>
//             {t.label}
//           </option>
//         ))}
//       </select>
//       {value && (
//         <span
//           className={`h-2.5 w-2.5 rounded-full ${tiers.find((t) => t.value === value)?.color}`}
//         />
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // REJECT / CHANGES REQUESTED MODAL
// // ─────────────────────────────────────────────────────────────────────────────

// function RejectModal({ gym, loading, onClose, onConfirm }) {
//   const [reason, setReason] = useState("");

//   const tooShort = reason.trim().length < 10;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm">
//       <div className="w-full max-w-xl rounded-[32px] border border-[#3B2417] bg-[#24160F] p-7 text-white shadow-2xl">
//         <div className="flex items-start gap-4">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
//             <AlertTriangle className="h-6 w-6 text-orange-400" />
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold">Request Changes</h2>

//             <p className="mt-1 text-sm text-[#CBB6A6]">{gym.name}</p>
//           </div>
//         </div>

//         <div className="mt-6 rounded-2xl bg-white/5 p-4">
//           <p className="text-sm leading-relaxed text-[#D7C5B8]">
//             The gym owner will receive your feedback and may update their
//             registration before resubmitting for review.
//           </p>
//         </div>

//         <div className="mt-6">
//           <label className="mb-2 block text-sm font-medium">
//             Feedback / Change Request Reason
//           </label>

//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             rows={5}
//             placeholder="Explain missing documents, invalid information, compliance issues..."
//             className="w-full rounded-2xl border border-[#4A3022] bg-[#1A100B] px-4 py-3 text-sm text-white outline-none transition focus:border-[#8B5E46]"
//           />

//           {reason.length > 0 && tooShort && (
//             <p className="mt-2 text-xs text-red-400">
//               Minimum 10 characters required.
//             </p>
//           )}
//         </div>

//         <div className="mt-7 flex justify-end gap-3">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             disabled={loading}
//             className="border-[#4A3022] bg-transparent text-white hover:bg-white/5"
//           >
//             Cancel
//           </Button>

//           <Button
//             disabled={tooShort || loading}
//             onClick={() => onConfirm(reason.trim())}
//             className="bg-orange-600 hover:bg-orange-700"
//           >
//             {loading ? "Sending..." : "Request Changes"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // ENTERPRISE GYM CARD
// // ─────────────────────────────────────────────────────────────────────────────

// function GymCard({ gym, loadingId, onApprove, onRequestChanges }) {
//   const [expanded, setExpanded] = useState(false);
//   const [selectedTier, setSelectedTier] = useState(gym.tier);

//   const busy = loadingId === gym.id;

//   return (
//     <div className="overflow-hidden rounded-[32px] border border-[#E9DED3] bg-white shadow-sm transition hover:shadow-xl">
//       {/* HEADER */}

//       <div className="relative overflow-hidden border-b border-[#F3EBE4] bg-gradient-to-r from-[#24160F] to-[#3A2418] p-6">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%)]" />

//         <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
//           {/* LEFT */}

//           <div className="flex items-start gap-5">
//             {gym.coverImageUrl ? (
//               <img
//                 src={gym.coverImageUrl}
//                 alt={gym.name}
//                 className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/10"
//               />
//             ) : (
//               <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
//                 <Building2 className="h-8 w-8 text-white" />
//               </div>
//             )}

//             <div>
//               <div className="flex flex-wrap items-center gap-2">
//                 <h2 className="text-2xl font-bold text-white">{gym.name}</h2>

//                 <StatusBadge status={gym.status} />
//               </div>

//               <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#D8C7B8]">
//                 <div className="flex items-center gap-1.5">
//                   <MapPin className="h-4 w-4" />
//                   {gym.addressLine}, {gym.city}
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                   <Clock3 className="h-4 w-4" />
//                   Submitted{" "}
//                   {new Date(
//                     gym.submittedAt || gym.createdAt,
//                   ).toLocaleDateString()}
//                 </div>

//                 {/* ⬇️ TIER SELECTOR — admin assigns before approval */}
//                 <TierSelector
//                   value={selectedTier}
//                   onChange={setSelectedTier}
//                   disabled={busy}
//                 />

//                 {gym.is24Hours && (
//                   <div className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200">
//                     24 Hours
//                   </div>
//                 )}

//                 {gym.resubmissionCount > 0 && (
//                   <div className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">
//                     Resubmitted {gym.resubmissionCount}×
//                   </div>
//                 )}
//               </div>

//               <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
//                 <div>
//                   <p className="text-[#BFA998]">Owner</p>

//                   <p className="font-medium text-white">
//                     {gym.owner?.name || "—"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[#BFA998]">Email</p>

//                   <p className="font-medium text-white">
//                     {gym.owner?.email || "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT ACTIONS */}

//           <div className="flex flex-wrap items-center gap-3">
//             <button
//               onClick={() => setExpanded((v) => !v)}
//               className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
//             >
//               <Eye className="h-4 w-4" />

//               {expanded ? "Hide Details" : "Review Details"}

//               {expanded ? (
//                 <ChevronUp className="h-4 w-4" />
//               ) : (
//                 <ChevronDown className="h-4 w-4" />
//               )}
//             </button>

//             <Button
//               variant="outline"
//               disabled={busy}
//               onClick={() => onRequestChanges(gym)}
//               className="rounded-2xl border-orange-500/20 bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white"
//             >
//               <AlertTriangle className="mr-2 h-4 w-4" />
//               Request Changes
//             </Button>

//             <Button
//               disabled={busy || !selectedTier}
//               onClick={() => onApprove(gym.id, selectedTier)}
//               className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
//               title={!selectedTier ? "Select a tier first" : ""}
//             >
//               <CheckCircle2 className="mr-2 h-4 w-4" />

//               {busy ? "Approving..." : "Approve Gym"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* DETAILS */}

//       {expanded && (
//         <div className="grid gap-6 p-6 lg:grid-cols-2">
//           {/* DESCRIPTION */}

//           <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
//             <div className="mb-4 flex items-center gap-2">
//               <Sparkles className="h-5 w-5 text-[#8B5E46]" />

//               <h3 className="font-semibold text-[#2B160B]">Gym Overview</h3>
//             </div>

//             <p className="text-sm leading-relaxed text-[#6C5E54]">
//               {gym.description || "No description provided"}
//             </p>

//             <div className="mt-5 grid gap-4 sm:grid-cols-2">
//               <div className="rounded-2xl bg-white p-4">
//                 <p className="text-xs text-[#8A7B70]">Phone Number</p>

//                 <div className="mt-1 flex items-center gap-2">
//                   <Phone className="h-4 w-4 text-[#8B5E46]" />

//                   <p className="text-sm font-medium text-[#2B160B]">
//                     {gym.phoneNumber || "—"}
//                   </p>
//                 </div>
//               </div>

//               <div className="rounded-2xl bg-white p-4">
//                 <p className="text-xs text-[#8A7B70]">WhatsApp</p>

//                 <div className="mt-1 flex items-center gap-2">
//                   <MessageCircle className="h-4 w-4 text-[#8B5E46]" />

//                   <p className="text-sm font-medium text-[#2B160B]">
//                     {gym.whatsappNumber || "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* VERIFICATION */}

//           <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
//             <div className="mb-4 flex items-center gap-2">
//               <ShieldCheck className="h-5 w-5 text-[#8B5E46]" />

//               <h3 className="font-semibold text-[#2B160B]">
//                 Verification Documents
//               </h3>
//             </div>

//             <div className="space-y-3">
//               {(gym.verificationDocuments || []).map((doc) => (
//                 <a
//                   key={doc.id}
//                   href={doc.fileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-between rounded-2xl border border-[#EFE6DE] bg-white p-4 transition hover:border-[#DCC6B4]"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EEE7]">
//                       <FileText className="h-5 w-5 text-[#8B5E46]" />
//                     </div>

//                     <div>
//                       <p className="text-sm font-medium text-[#2B160B]">
//                         {doc.type.replace(/_/g, " ")}
//                       </p>

//                       <p className="text-xs text-[#8A7B70]">
//                         Verification document
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <StatusBadge status={doc.status} />

//                     <ExternalLink className="h-4 w-4 text-[#8A7B70]" />
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* PHOTOS */}

//           {(gym.photos || []).length > 0 && (
//             <div className="lg:col-span-2">
//               <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
//                 <div className="mb-5 flex items-center justify-between">
//                   <div>
//                     <h3 className="font-semibold text-[#2B160B]">
//                       Facility Gallery
//                     </h3>

//                     <p className="mt-1 text-sm text-[#8A7B70]">
//                       Uploaded gym verification photos
//                     </p>
//                   </div>

//                   <div className="rounded-full bg-[#EFE2D6] px-3 py-1 text-xs font-semibold text-[#7A5039]">
//                     {gym.photos.length} Photos
//                   </div>
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                   {gym.photos.map((photo) => (
//                     <div
//                       key={photo.id}
//                       className="group relative overflow-hidden rounded-2xl"
//                     >
//                       <img
//                         src={photo.url}
//                         alt="gym"
//                         className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PAGE
// // ─────────────────────────────────────────────────────────────────────────────

// export default function PendingGyms() {
//   const { toast } = useToast();

//   const [gyms, setGyms] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [loadingId, setLoadingId] = useState(null);

//   const [rejectTarget, setRejectTarget] = useState(null);

//   const [rejectLoading, setRejectLoading] = useState(false);

//   // ───────────────────────────────────────────────────────────────────────────

//   async function fetchPendingGyms() {
//     try {
//       setLoading(true);

//       const data = await adminService.getAllGyms({
//         status: "pending",
//         limit: 50,
//       });

//       if (data?.success && data?.gyms?.length > 0) {
//         setGyms(data.gyms);
//       } else {
//         setGyms(mockGyms);
//       }
//     } catch (err) {
//       setGyms(mockGyms);

//       toast({
//         title: "Using fallback preview data",
//         description: "Real API unavailable — showing enterprise mock data.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchPendingGyms();
//   }, []);

//   // ───────────────────────────────────────────────────────────────────────────
//   // APPROVE — now sends tier with approval
//   // ───────────────────────────────────────────────────────────────────────────

//   async function handleApprove(gymId, tier) {
//     if (!tier) {
//       toast({
//         title: "Tier Required",
//         description: "Please assign a tier before approving.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setLoadingId(gymId);

//       // Use the new reviewGym endpoint
//       await adminService.reviewGym(gymId, {
//         status: "approved",
//         tier,
//         approvalNotes: "Approved after facility assessment.",
//       });

//       setGyms((prev) => prev.filter((g) => g.id !== gymId));

//       toast({
//         title: "Gym Approved",
//         description: `Gym assigned Tier ${tier} and owner has been notified.`,
//       });
//     } catch (err) {
//       toast({
//         title: "Approval Failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingId(null);
//     }
//   }

//   // ───────────────────────────────────────────────────────────────────────────
//   // REQUEST CHANGES — uses reviewGym with changes_requested status
//   // ───────────────────────────────────────────────────────────────────────────

//   async function handleRequestChangesConfirm(reason) {
//     if (!rejectTarget) return;

//     try {
//       setRejectLoading(true);

//       await adminService.reviewGym(rejectTarget.id, {
//         status: "changes_requested",
//         rejectionReason: reason,
//       });

//       setGyms((prev) => prev.filter((g) => g.id !== rejectTarget.id));

//       toast({
//         title: "Changes Requested",
//         description: "Gym owner can now revise and resubmit.",
//       });

//       setRejectTarget(null);
//     } catch (err) {
//       toast({
//         title: "Failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setRejectLoading(false);
//     }
//   }

//   // ───────────────────────────────────────────────────────────────────────────

//   const stats = useMemo(() => {
//     return {
//       total: gyms.length,

//       resubmitted: gyms.filter((g) => g.resubmissionCount > 0).length,

//       tierUnassigned: gyms.filter((g) => !g.tier).length,
//     };
//   }, [gyms]);

//   // ───────────────────────────────────────────────────────────────────────────

//   return (
//     <AdminLayout>
//       <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
//         <div className="space-y-7">
//           {/* HEADER */}

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               <h1 className="text-4xl font-bold tracking-tight text-[#2B160B]">
//                 Gym Approval Center
//               </h1>

//               <p className="mt-2 text-[#7A6A5D]">
//                 Review facilities and assign tiers before approval
//               </p>
//             </div>

//             <Button
//               onClick={fetchPendingGyms}
//               className="h-12 rounded-2xl bg-[#24160F] px-5 hover:bg-[#3A2418]"
//             >
//               <RefreshCw className="mr-2 h-4 w-4" />
//               Refresh Queue
//             </Button>
//           </div>

//           {/* KPI STRIP */}

//           <div className="grid gap-5 md:grid-cols-3">
//             <div className="rounded-[28px] bg-[#24160F] p-6 text-white">
//               <p className="text-sm text-[#CBB6A6]">Pending Reviews</p>

//               <h3 className="mt-3 text-4xl font-bold">
//                 {loading ? "—" : stats.total}
//               </h3>
//             </div>

//             <div className="rounded-[28px] bg-white p-6">
//               <p className="text-sm text-[#8A7B70]">Resubmissions</p>

//               <h3 className="mt-3 text-4xl font-bold text-[#2B160B]">
//                 {loading ? "—" : stats.resubmitted}
//               </h3>
//             </div>

//             <div className="rounded-[28px] bg-white p-6">
//               <p className="text-sm text-[#8A7B70]">Awaiting Tier Assignment</p>

//               <h3 className="mt-3 text-4xl font-bold text-[#2B160B]">
//                 {loading ? "—" : stats.tierUnassigned}
//               </h3>
//             </div>
//           </div>

//           {/* LOADING */}

//           {loading && (
//             <div className="space-y-5">
//               {[...Array(3)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-44 animate-pulse rounded-[32px] bg-white"
//                 />
//               ))}
//             </div>
//           )}

//           {/* EMPTY */}

//           {!loading && gyms.length === 0 && (
//             <div className="rounded-[36px] bg-white p-16 text-center shadow-sm">
//               <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
//                 <CheckCircle2 className="h-10 w-10 text-emerald-600" />
//               </div>

//               <h2 className="mt-6 text-2xl font-bold text-[#2B160B]">
//                 All approvals completed
//               </h2>

//               <p className="mt-2 text-[#7A6A5D]">
//                 No gyms currently waiting for verification.
//               </p>
//             </div>
//           )}

//           {/* LIST */}

//           {!loading && gyms.length > 0 && (
//             <div className="space-y-6">
//               {gyms.map((gym) => (
//                 <GymCard
//                   key={gym.id}
//                   gym={gym}
//                   loadingId={loadingId}
//                   onApprove={handleApprove}
//                   onRequestChanges={(g) => setRejectTarget(g)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODAL */}

//       {rejectTarget && (
//         <RejectModal
//           gym={rejectTarget}
//           loading={rejectLoading}
//           onClose={() => setRejectTarget(null)}
//           onConfirm={handleRequestChangesConfirm}
//         />
//       )}
//     </AdminLayout>
//   );
// }

import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock3,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Eye,
  Phone,
  MessageCircle,
  Star,
  User, // ← ADD THIS
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK MOCK DATA (ONLY IF API FAILS)
// ─────────────────────────────────────────────────────────────────────────────

const mockGyms = [
  {
    id: "gym_001",
    name: "Iron Forge Fitness",
    city: "Lahore",
    addressLine: "DHA Phase 6",
    tier: null, // ⬅️ Changed: admin assigns tier, not owner
    status: "pending",

    owner: {
      name: "Ahmed Khan",
      email: "ahmed@ironforge.pk",
    },

    submittedAt: new Date(),

    is24Hours: true,

    phoneNumber: "+92 300 1111111",

    whatsappNumber: "+92 300 1111111",

    description: "Premium strength training and bodybuilding facility.",

    resubmissionCount: 1,

    coverImageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",

    photos: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
      },
    ],

    verificationDocuments: [
      {
        id: 1,
        type: "business_license",
        status: "approved",
        fileUrl: "#",
      },

      {
        id: 2,
        type: "tax_certificate",
        status: "pending",
        fileUrl: "#",
      },
    ],
  },
];

function InfoRow({ label, value, fullWidth, isLink }) {
  if (!value || value === "—") {
    return (
      <div
        className={`rounded-xl bg-white p-3 ${fullWidth ? "sm:col-span-2" : ""}`}
      >
        <p className="text-[10px] uppercase tracking-[0.15em] text-[#8A7B70]">
          {label}
        </p>
        <p className="mt-1 text-sm text-[#B0A49A] italic">Not provided</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl bg-white p-3 ${fullWidth ? "sm:col-span-2" : ""}`}
    >
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#8A7B70]">
        {label}
      </p>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-sm font-medium text-[#2B160B] break-all hover:text-[#9A5A17] hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm font-medium text-[#2B160B] break-words">
          {value}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",

    pending: "bg-amber-500/10 text-amber-300 border border-amber-500/20",

    rejected: "bg-red-500/10 text-red-300 border border-red-500/20",

    changes_requested:
      "bg-orange-500/10 text-orange-300 border border-orange-500/20",
  };

  return (
    <div
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[status]
      }`}
    >
      {status.replace("_", " ")}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER SELECTOR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function TierSelector({ value, onChange, disabled }) {
  const tiers = [
    { value: 1, label: "Tier 1 — Basic", color: "bg-slate-500" },
    { value: 2, label: "Tier 2 — Standard", color: "bg-blue-500" },
    { value: 3, label: "Tier 3 — Premium", color: "bg-amber-500" },
  ];

  return (
    <div className="flex items-center gap-2">
      <Star className="h-4 w-4 text-amber-400" />
      <select
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value ? parseInt(e.target.value) : null)
        }
        disabled={disabled}
        className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white outline-none focus:border-amber-400"
      >
        <option value="">Assign Tier...</option>
        {tiers.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      {value && (
        <span
          className={`h-2.5 w-2.5 rounded-full ${tiers.find((t) => t.value === value)?.color}`}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REJECT / CHANGES REQUESTED MODAL
// ─────────────────────────────────────────────────────────────────────────────

function RejectModal({ gym, loading, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  const tooShort = reason.trim().length < 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[32px] border border-[#3B2417] bg-[#24160F] p-7 text-white shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
            <AlertTriangle className="h-6 w-6 text-orange-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Request Changes</h2>

            <p className="mt-1 text-sm text-[#CBB6A6]">{gym.name}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="text-sm leading-relaxed text-[#D7C5B8]">
            The gym owner will receive your feedback and may update their
            registration before resubmitting for review.
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Feedback / Change Request Reason
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            placeholder="Explain missing documents, invalid information, compliance issues..."
            className="w-full rounded-2xl border border-[#4A3022] bg-[#1A100B] px-4 py-3 text-sm text-white outline-none transition focus:border-[#8B5E46]"
          />

          {reason.length > 0 && tooShort && (
            <p className="mt-2 text-xs text-red-400">
              Minimum 10 characters required.
            </p>
          )}
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-[#4A3022] bg-transparent text-white hover:bg-white/5"
          >
            Cancel
          </Button>

          <Button
            disabled={tooShort || loading}
            onClick={() => onConfirm(reason.trim())}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? "Sending..." : "Request Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTERPRISE GYM CARD
// ─────────────────────────────────────────────────────────────────────────────

function GymCard({ gym, loadingId, onApprove, onRequestChanges }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedTier, setSelectedTier] = useState(gym.tier);

  const busy = loadingId === gym.id;

  return (
    <div className="overflow-hidden rounded-[32px] border border-[#E9DED3] bg-white shadow-sm transition hover:shadow-xl">
      {/* HEADER */}

      <div className="relative overflow-hidden border-b border-[#F3EBE4] bg-gradient-to-r from-[#24160F] to-[#3A2418] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%)]" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}

          <div className="flex items-start gap-5">
            {gym.coverImageUrl ? (
              <img
                src={gym.coverImageUrl}
                alt={gym.name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-white">{gym.name}</h2>

                <StatusBadge status={gym.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#D8C7B8]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {gym.addressLine}, {gym.city}
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  Submitted{" "}
                  {new Date(
                    gym.submittedAt || gym.createdAt,
                  ).toLocaleDateString()}
                </div>

                {/* ⬇️ TIER SELECTOR — admin assigns before approval */}
                <TierSelector
                  value={selectedTier}
                  onChange={setSelectedTier}
                  disabled={busy}
                />

                {gym.is24Hours && (
                  <div className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200">
                    24 Hours
                  </div>
                )}

                {gym.resubmissionCount > 0 && (
                  <div className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">
                    Resubmitted {gym.resubmissionCount}×
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <p className="text-[#BFA998]">Owner</p>

                  <p className="font-medium text-white">
                    {gym.owner?.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[#BFA998]">Email</p>

                  <p className="font-medium text-white">
                    {gym.owner?.email || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT ACTIONS */}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Eye className="h-4 w-4" />

              {expanded ? "Hide Details" : "Review Details"}

              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            <Button
              variant="outline"
              disabled={busy}
              onClick={() => onRequestChanges(gym)}
              className="rounded-2xl border-orange-500/20 bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Request Changes
            </Button>

            <Button
              disabled={busy || !selectedTier}
              onClick={() => onApprove(gym.id, selectedTier)}
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              title={!selectedTier ? "Select a tier first" : ""}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />

              {busy ? "Approving..." : "Approve Gym"}
            </Button>
          </div>
        </div>
      </div>

      {/* DETAILS */}

      {expanded && (
        <div className="grid gap-6 p-6 lg:grid-cols-2">
          {/* ── BASIC INFO ── */}
          <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#8B5E46]" />
              <h3 className="font-semibold text-[#2B160B]">
                Basic Information
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Gym Name" value={gym.name} />
              <InfoRow label="Business Name" value={gym.businessName} />
              <InfoRow label="Description" value={gym.description} fullWidth />
              <InfoRow label="Phone" value={gym.phoneNumber} />
              <InfoRow label="WhatsApp" value={gym.whatsappNumber} />
              <InfoRow label="CNIC" value={gym.cnicNumber} />
              <InfoRow label="Instagram" value={gym.instagramHandle} />
              <InfoRow label="Website" value={gym.websiteUrl} />
              <InfoRow label="Google Maps" value={gym.googleMapsLink} isLink />
            </div>
          </div>

          {/* ── LOCATION & OPERATIONS ── */}
          <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#8B5E46]" />
              <h3 className="font-semibold text-[#2B160B]">
                Location & Operations
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Address" value={gym.addressLine} fullWidth />
              <InfoRow label="City" value={gym.city} />
              <InfoRow label="Province" value={gym.province} />
              <InfoRow label="Postal Code" value={gym.postalCode} />
              <InfoRow label="Latitude" value={gym.latitude} />
              <InfoRow label="Longitude" value={gym.longitude} />
              <InfoRow label="Opening Time" value={gym.openingTime} />
              <InfoRow label="Closing Time" value={gym.closingTime} />
              <InfoRow label="24 Hours" value={gym.is24Hours ? "Yes" : "No"} />
            </div>
          </div>

          {/* ── OWNER INFO ── */}
          <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#8B5E46]" />
              <h3 className="font-semibold text-[#2B160B]">Owner Details</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Owner Name" value={gym.owner?.name} />
              <InfoRow label="Owner Email" value={gym.owner?.email} />
            </div>
          </div>

          {/* ── VERIFICATION DOCUMENTS ── */}
          <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#8B5E46]" />
              <h3 className="font-semibold text-[#2B160B]">
                Verification Documents
              </h3>
            </div>
            <div className="space-y-3">
              {(gym.verificationDocuments || []).map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-[#EFE6DE] bg-white p-4 transition hover:border-[#DCC6B4]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EEE7]">
                      <FileText className="h-5 w-5 text-[#8B5E46]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2B160B]">
                        {doc.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-[#8A7B70]">
                        Verification document
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={doc.status} />
                    <ExternalLink className="h-4 w-4 text-[#8A7B70]" />
                  </div>
                </a>
              ))}
              {(!gym.verificationDocuments ||
                gym.verificationDocuments.length === 0) && (
                <p className="text-sm text-[#8A7B70] italic">
                  No documents uploaded
                </p>
              )}
            </div>
          </div>

          {/* ── PHOTOS ── */}
          {(gym.photos || []).length > 0 && (
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2B160B]">
                      Facility Gallery
                    </h3>
                    <p className="mt-1 text-sm text-[#8A7B70]">
                      Uploaded gym verification photos
                    </p>
                  </div>
                  <div className="rounded-full bg-[#EFE2D6] px-3 py-1 text-xs font-semibold text-[#7A5039]">
                    {gym.photos.length} Photos
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {gym.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-2xl"
                    >
                      <img
                        src={photo.url}
                        alt="gym"
                        className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COVER IMAGE ── */}
          {gym.coverImageUrl && (
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
                <h3 className="font-semibold text-[#2B160B] mb-3">
                  Cover Image
                </h3>
                <img
                  src={gym.coverImageUrl}
                  alt={gym.name}
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
            </div>
          )}

          {/* ── META INFO ── */}
          <div className="lg:col-span-2 rounded-3xl border border-[#EFE6DE] bg-[#FCFAF8] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-[#8B5E46]" />
              <h3 className="font-semibold text-[#2B160B]">
                Submission Metadata
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <InfoRow
                label="Submitted"
                value={new Date(
                  gym.submittedAt || gym.createdAt,
                ).toLocaleString()}
              />
              <InfoRow
                label="Resubmissions"
                value={gym.resubmissionCount?.toString()}
              />
              <InfoRow label="Status" value={gym.status} />
              <InfoRow label="Gym ID" value={gym.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function PendingGyms() {
  const { toast } = useToast();

  const [gyms, setGyms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingId, setLoadingId] = useState(null);

  const [rejectTarget, setRejectTarget] = useState(null);

  const [rejectLoading, setRejectLoading] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────

  async function fetchPendingGyms() {
    try {
      setLoading(true);

      const data = await adminService.getAllGyms({
        status: "pending",
        limit: 50,
      });

      if (data?.success && data?.gyms?.length > 0) {
        setGyms(data.gyms);
      } else {
        setGyms(mockGyms);
      }
    } catch (err) {
      setGyms(mockGyms);

      toast({
        title: "Using fallback preview data",
        description: "Real API unavailable — showing enterprise mock data.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPendingGyms();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // APPROVE — now sends tier with approval
  // ───────────────────────────────────────────────────────────────────────────

  async function handleApprove(gymId, tier) {
    if (!tier) {
      toast({
        title: "Tier Required",
        description: "Please assign a tier before approving.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingId(gymId);

      // Use the new reviewGym endpoint
      await adminService.reviewGym(gymId, {
        status: "approved",
        tier,
        approvalNotes: "Approved after facility assessment.",
      });

      setGyms((prev) => prev.filter((g) => g.id !== gymId));

      toast({
        title: "Gym Approved",
        description: `Gym assigned Tier ${tier} and owner has been notified.`,
      });
    } catch (err) {
      toast({
        title: "Approval Failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // REQUEST CHANGES — uses reviewGym with changes_requested status
  // ───────────────────────────────────────────────────────────────────────────

  async function handleRequestChangesConfirm(reason) {
    if (!rejectTarget) return;

    try {
      setRejectLoading(true);

      await adminService.reviewGym(rejectTarget.id, {
        status: "changes_requested",
        rejectionReason: reason,
      });

      setGyms((prev) => prev.filter((g) => g.id !== rejectTarget.id));

      toast({
        title: "Changes Requested",
        description: "Gym owner can now revise and resubmit.",
      });

      setRejectTarget(null);
    } catch (err) {
      toast({
        title: "Failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setRejectLoading(false);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    return {
      total: gyms.length,

      resubmitted: gyms.filter((g) => g.resubmissionCount > 0).length,

      tierUnassigned: gyms.filter((g) => !g.tier).length,
    };
  }, [gyms]);

  // ───────────────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
        <div className="space-y-7">
          {/* HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#2B160B]">
                Gym Approval Center
              </h1>

              <p className="mt-2 text-[#7A6A5D]">
                Review facilities and assign tiers before approval
              </p>
            </div>

            <Button
              onClick={fetchPendingGyms}
              className="h-12 rounded-2xl bg-[#24160F] px-5 hover:bg-[#3A2418]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Queue
            </Button>
          </div>

          {/* KPI STRIP */}

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[28px] bg-[#24160F] p-6 text-white">
              <p className="text-sm text-[#CBB6A6]">Pending Reviews</p>

              <h3 className="mt-3 text-4xl font-bold">
                {loading ? "—" : stats.total}
              </h3>
            </div>

            <div className="rounded-[28px] bg-white p-6">
              <p className="text-sm text-[#8A7B70]">Resubmissions</p>

              <h3 className="mt-3 text-4xl font-bold text-[#2B160B]">
                {loading ? "—" : stats.resubmitted}
              </h3>
            </div>

            <div className="rounded-[28px] bg-white p-6">
              <p className="text-sm text-[#8A7B70]">Awaiting Tier Assignment</p>

              <h3 className="mt-3 text-4xl font-bold text-[#2B160B]">
                {loading ? "—" : stats.tierUnassigned}
              </h3>
            </div>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-[32px] bg-white"
                />
              ))}
            </div>
          )}

          {/* EMPTY */}

          {!loading && gyms.length === 0 && (
            <div className="rounded-[36px] bg-white p-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-[#2B160B]">
                All approvals completed
              </h2>

              <p className="mt-2 text-[#7A6A5D]">
                No gyms currently waiting for verification.
              </p>
            </div>
          )}

          {/* LIST */}

          {!loading && gyms.length > 0 && (
            <div className="space-y-6">
              {gyms.map((gym) => (
                <GymCard
                  key={gym.id}
                  gym={gym}
                  loadingId={loadingId}
                  onApprove={handleApprove}
                  onRequestChanges={(g) => setRejectTarget(g)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}

      {rejectTarget && (
        <RejectModal
          gym={rejectTarget}
          loading={rejectLoading}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRequestChangesConfirm}
        />
      )}
    </AdminLayout>
  );
}
