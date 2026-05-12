// import { useEffect, useState } from "react";
// import {
//   Building2,
//   CheckCircle,
//   XCircle,
//   MapPin,
//   Clock,
//   FileText,
//   ChevronDown,
//   ChevronUp,
//   ExternalLink,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { adminService } from "@/services/adminService";

// // ─── Rejection Modal ──────────────────────────────────────────────────────────
// function RejectModal({ gym, onClose, onConfirm, loading }) {
//   const [reason, setReason] = useState("");
//   const tooShort = reason.trim().length < 10;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
//             <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-base">Reject Gym</h3>
//             <p className="text-xs text-muted-foreground">{gym.name}</p>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium">
//             Rejection reason <span className="text-destructive">*</span>
//           </label>
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             placeholder="Explain why this gym is being rejected (min. 10 characters)…"
//             rows={4}
//             className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
//           />
//           {reason.length > 0 && tooShort && (
//             <p className="text-xs text-destructive">
//               At least 10 characters required.
//             </p>
//           )}
//         </div>

//         <div className="flex gap-3 justify-end">
//           <Button variant="outline" onClick={onClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             variant="destructive"
//             disabled={tooShort || loading}
//             onClick={() => onConfirm(reason)}
//           >
//             {loading ? "Rejecting…" : "Confirm Rejection"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Gym Detail Expander ──────────────────────────────────────────────────────
// function GymCard({ gym, onApprove, onReject, loadingId }) {
//   const [expanded, setExpanded] = useState(false);
//   const busy = loadingId === gym.id;

//   return (
//     <div className="bg-card rounded-2xl shadow-card overflow-hidden">
//       {/* Main row */}
//       <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
//         <div className="flex items-start gap-4">
//           {gym.coverImageUrl ? (
//             <img
//               src={gym.coverImageUrl}
//               alt={gym.name}
//               className="w-14 h-14 rounded-xl object-cover shrink-0"
//             />
//           ) : (
//             <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center shrink-0">
//               <Building2 className="w-7 h-7 text-white" />
//             </div>
//           )}

//           <div className="min-w-0">
//             <h3 className="text-base font-semibold truncate">{gym.name}</h3>
//             <p className="text-sm text-muted-foreground mt-0.5">
//               Owner:{" "}
//               <span className="font-medium text-foreground">
//                 {gym.owner?.name ?? "—"}
//               </span>
//               {gym.owner?.email && (
//                 <span className="ml-1 opacity-60 text-xs">
//                   ({gym.owner.email})
//                 </span>
//               )}
//             </p>
//             <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
//               <span className="flex items-center gap-1">
//                 <MapPin className="w-3.5 h-3.5" />
//                 {gym.addressLine}, {gym.city}
//               </span>
//               <span className="flex items-center gap-1">
//                 <Clock className="w-3.5 h-3.5" />
//                 {new Date(gym.createdAt).toLocaleDateString()}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
//                 Tier {gym.tier}
//               </span>
//               {gym.is24Hours && (
//                 <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
//                   24h
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 shrink-0">
//           <button
//             onClick={() => setExpanded((v) => !v)}
//             className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted/50 transition-colors"
//           >
//             <FileText className="w-3.5 h-3.5" />
//             Details
//             {expanded ? (
//               <ChevronUp className="w-3.5 h-3.5" />
//             ) : (
//               <ChevronDown className="w-3.5 h-3.5" />
//             )}
//           </button>

//           <Button
//             size="sm"
//             variant="outline"
//             className="border-destructive text-destructive hover:bg-destructive hover:text-white"
//             onClick={() => onReject(gym)}
//             disabled={busy}
//           >
//             <XCircle className="w-4 h-4 mr-1.5" />
//             Reject
//           </Button>

//           <Button
//             size="sm"
//             className="bg-emerald-600 hover:bg-emerald-700 text-white"
//             onClick={() => onApprove(gym.id)}
//             disabled={busy}
//           >
//             <CheckCircle className="w-4 h-4 mr-1.5" />
//             {busy ? "Approving…" : "Approve"}
//           </Button>
//         </div>
//       </div>

//       {/* Expanded details */}
//       {expanded && (
//         <div className="border-t border-border px-6 pb-6 pt-4 grid sm:grid-cols-2 gap-4 text-sm">
//           <div className="space-y-1">
//             <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//               Hours
//             </p>
//             <p>
//               {gym.is24Hours
//                 ? "Open 24 hours"
//                 : `${gym.openingTime ?? "—"} – ${gym.closingTime ?? "—"}`}
//             </p>
//           </div>

//           <div className="space-y-1">
//             <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//               Location
//             </p>
//             <p>{gym.addressLine}</p>
//             <p className="text-muted-foreground">
//               {gym.city}
//               {gym.province ? `, ${gym.province}` : ""}
//             </p>
//           </div>

//           {/* Photos */}
//           {gym.photos?.length > 0 && (
//             <div className="sm:col-span-2 space-y-2">
//               <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                 Photos ({gym.photos.length})
//               </p>
//               <div className="flex gap-2 overflow-x-auto pb-1">
//                 {gym.photos.map((photo) => (
//                   <img
//                     key={photo.id}
//                     src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}${photo.url}`}
//                     alt="gym"
//                     className="w-24 h-16 rounded-lg object-cover shrink-0"
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Verification docs */}
//           {gym.verificationDocuments?.length > 0 && (
//             <div className="sm:col-span-2 space-y-2">
//               <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                 Verification Documents
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {gym.verificationDocuments.map((doc) => (
//                   <a
//                     key={doc.id}
//                     href={doc.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/70 transition-colors"
//                   >
//                     <ExternalLink className="w-3.5 h-3.5" />
//                     {doc.type.replace(/_/g, " ")}
//                     <span
//                       className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
//                         doc.status === "approved"
//                           ? "bg-emerald-100 text-emerald-700"
//                           : doc.status === "rejected"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-amber-100 text-amber-700"
//                       }`}
//                     >
//                       {doc.status}
//                     </span>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function PendingGyms() {
//   const { toast } = useToast();

//   const [gyms, setGyms] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [rejectTarget, setRejectTarget] = useState(null); // gym object
//   const [rejectLoading, setRejectLoading] = useState(false);

//   // ── fetch pending gyms ────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchPendingGyms();
//   }, []);

//   const fetchPendingGyms = async () => {
//     try {
//       setLoading(true);
//       const data = await adminService.getAllGyms({
//         status: "pending",
//         limit: 50,
//       });
//       if (data.success) setGyms(data.gyms ?? []);
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── approve ───────────────────────────────────────────────────────────────
//   const handleApprove = async (gymId) => {
//     try {
//       setLoadingId(gymId);
//       await adminService.approveGym(gymId);
//       setGyms((prev) => prev.filter((g) => g.id !== gymId));
//       toast({
//         title: "Gym Approved ✓",
//         description: "Owner has been notified by email.",
//       });
//     } catch (err) {
//       toast({
//         title: "Approval failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   // ── reject ────────────────────────────────────────────────────────────────
//   const handleRejectConfirm = async (reason) => {
//     if (!rejectTarget) return;
//     try {
//       setRejectLoading(true);
//       await adminService.rejectGym(rejectTarget.id, reason);
//       setGyms((prev) => prev.filter((g) => g.id !== rejectTarget.id));
//       toast({
//         title: "Gym Rejected",
//         description: "Owner has been notified by email.",
//       });
//       setRejectTarget(null);
//     } catch (err) {
//       toast({
//         title: "Rejection failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setRejectLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-7">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold">Pending Gyms</h1>
//             <p className="text-muted-foreground mt-1">
//               Review and approve gym registrations.
//             </p>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 self-start sm:self-auto">
//             <Clock className="w-4 h-4" />
//             <span className="text-sm font-semibold">
//               {loading ? "…" : gyms.length} Pending
//             </span>
//           </div>
//         </div>

//         {/* Loading skeletons */}
//         {loading && (
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-card rounded-2xl p-6 h-28 animate-pulse"
//               />
//             ))}
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && gyms.length === 0 && (
//           <div className="bg-card rounded-2xl p-14 shadow-card text-center">
//             <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
//             <h3 className="text-lg font-semibold">All caught up!</h3>
//             <p className="text-muted-foreground text-sm mt-1">
//               No gyms awaiting approval right now.
//             </p>
//           </div>
//         )}

//         {/* Gym cards */}
//         {!loading && gyms.length > 0 && (
//           <div className="space-y-4">
//             {gyms.map((gym) => (
//               <GymCard
//                 key={gym.id}
//                 gym={gym}
//                 loadingId={loadingId}
//                 onApprove={handleApprove}
//                 onReject={(g) => setRejectTarget(g)}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Rejection modal */}
//       {rejectTarget && (
//         <RejectModal
//           gym={rejectTarget}
//           loading={rejectLoading}
//           onClose={() => setRejectTarget(null)}
//           onConfirm={handleRejectConfirm}
//         />
//       )}
//     </AdminLayout>
//   );
// }

import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminService } from "@/services/adminService";

// ─── Rejection reason modal ───────────────────────────────────────────────────
function RejectModal({ gym, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");
  const tooShort = reason.trim().length < 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Request Changes</h3>
            <p className="text-xs text-muted-foreground">{gym.name}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          This will set the gym to <strong>changes_requested</strong> and email
          the owner your feedback. The owner can update and resubmit.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Reason / feedback <span className="text-destructive">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain what needs to be fixed (min. 10 characters)…"
            rows={4}
            className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {reason.length > 0 && tooShort && (
            <p className="text-xs text-destructive">
              At least 10 characters required.
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={tooShort || loading}
            onClick={() => onConfirm(reason.trim())}
          >
            {loading ? "Sending…" : "Send Feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Single gym card ──────────────────────────────────────────────────────────
function GymCard({ gym, onApprove, onReject, loadingId }) {
  const [expanded, setExpanded] = useState(false);
  const busy = loadingId === gym.id;

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden">
      {/* Main row */}
      <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          {gym.coverImageUrl ? (
            <img
              src={gym.coverImageUrl}
              alt={gym.name}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-white" />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate">{gym.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Owner:{" "}
              <span className="font-medium text-foreground">
                {gym.owner?.name ?? "—"}
              </span>
              {gym.owner?.email && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({gym.owner.email})
                </span>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {gym.addressLine}, {gym.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Submitted{" "}
                {new Date(
                  gym.submittedAt ?? gym.createdAt,
                ).toLocaleDateString()}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                Tier {gym.tier}
              </span>
              {gym.resubmissionCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                  Resubmitted {gym.resubmissionCount}×
                </span>
              )}
              {gym.is24Hours && (
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium">
                  24h
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Details
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <Button
            size="sm"
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={() => onReject(gym)}
            disabled={busy}
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            Request Changes
          </Button>

          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => onApprove(gym.id)}
            disabled={busy}
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            {busy ? "Approving…" : "Approve"}
          </Button>
        </div>
      </div>

      {/* Expanded detail pane */}
      {expanded && (
        <div className="border-t border-border px-6 pb-6 pt-4 grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Hours
            </p>
            <p>
              {gym.is24Hours
                ? "Open 24 hours"
                : `${gym.openingTime ?? "—"} – ${gym.closingTime ?? "—"}`}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contact
            </p>
            <p>{gym.phoneNumber || "—"}</p>
            {gym.whatsappNumber && <p>WhatsApp: {gym.whatsappNumber}</p>}
          </div>

          {gym.description && (
            <div className="sm:col-span-2 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="text-muted-foreground">{gym.description}</p>
            </div>
          )}

          {/* Photos */}
          {gym.photos?.length > 0 && (
            <div className="sm:col-span-2 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Photos ({gym.photos.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gym.coverImageUrl && (
                  <div className="relative shrink-0">
                    <img
                      src={gym.coverImageUrl}
                      alt="cover"
                      className="w-24 h-16 rounded-lg object-cover"
                    />
                    <span className="absolute top-0.5 left-0.5 text-[9px] bg-black/60 text-white px-1 rounded">
                      Cover
                    </span>
                  </div>
                )}
                {gym.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt="gym"
                    className="w-24 h-16 rounded-lg object-cover shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Verification docs */}
          {gym.verificationDocuments?.length > 0 && (
            <div className="sm:col-span-2 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Verification Documents
              </p>
              <div className="flex flex-wrap gap-2">
                {gym.verificationDocuments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/70 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {doc.type.replace(/_/g, " ")}
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : doc.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PendingGyms() {
  const { toast } = useToast();

  const [gyms, setGyms] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  // ── Fetch pending gyms ────────────────────────────────────────────────────
  const fetchPendingGyms = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllGyms({
        status: "pending",
        limit: 50,
      });
      if (data.success) setGyms(data.gyms ?? []);
    } catch (err) {
      toast({
        title: "Error loading gyms",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingGyms();
  }, []);

  // ── Approve ───────────────────────────────────────────────────────────────
  const handleApprove = async (gymId) => {
    try {
      setLoadingId(gymId);
      await adminService.approveGym(gymId);
      setGyms((prev) => prev.filter((g) => g.id !== gymId));
      toast({
        title: "Gym Approved ✓",
        description: "Owner has been notified by email.",
      });
    } catch (err) {
      toast({
        title: "Approval failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // ── Reject / request changes ──────────────────────────────────────────────
  // Backend adminController.rejectGym sets status to "changes_requested" — not "rejected"
  const handleRejectConfirm = async (reason) => {
    if (!rejectTarget) return;
    try {
      setRejectLoading(true);
      await adminService.rejectGym(rejectTarget.id, reason);
      setGyms((prev) => prev.filter((g) => g.id !== rejectTarget.id));
      toast({
        title: "Feedback sent",
        description: "Owner has been notified and can now resubmit.",
      });
      setRejectTarget(null);
    } catch (err) {
      toast({
        title: "Failed to send feedback",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Pending Gyms
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and approve gym registrations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchPendingGyms}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {loading ? "…" : gyms.length} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-6 h-28 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && gyms.length === 0 && (
          <div className="bg-card rounded-2xl p-14 shadow-card text-center">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground">
              All caught up!
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              No gyms awaiting approval right now.
            </p>
          </div>
        )}

        {/* Gym cards */}
        {!loading && gyms.length > 0 && (
          <div className="space-y-4">
            {gyms.map((gym) => (
              <GymCard
                key={gym.id}
                gym={gym}
                loadingId={loadingId}
                onApprove={handleApprove}
                onReject={(g) => setRejectTarget(g)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rejection modal */}
      {rejectTarget && (
        <RejectModal
          gym={rejectTarget}
          loading={rejectLoading}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
        />
      )}
    </AdminLayout>
  );
}
