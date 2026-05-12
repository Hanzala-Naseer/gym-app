// import { useEffect, useState } from "react";
// import {
//   Building2,
//   MapPin,
//   Clock,
//   CheckCircle2,
//   AlertTriangle,
//   Hourglass,
// } from "lucide-react";

// import OwnerLayout from "@/components/layouts/OwnerLayout";
// import { useAuth } from "@/contexts/AuthContext";

// export default function MyGym() {
//   const { token } = useAuth();
//   const [gym, setGym] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchGym();
//   }, [token]);

//   const fetchGym = async () => {
//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/owners/my-gyms`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Failed to fetch gym");

//       const data = await res.json();

//       // ✅ BACKEND RETURNS ARRAY
//       const myGym = data.gyms?.[0] || null;
//       setGym(myGym);
//     } catch (err) {
//       console.error("Fetch gym error:", err);
//       setGym(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <OwnerLayout>
//         <p className="text-muted-foreground">Loading gym details...</p>
//       </OwnerLayout>
//     );
//   }

//   if (!gym) {
//     return (
//       <OwnerLayout>
//         <p className="text-muted-foreground">No gym registered yet.</p>
//       </OwnerLayout>
//     );
//   }

//   // ✅ NORMALIZE STATUS
//   const status = gym.status?.toLowerCase();

//   const isApproved = status === "approved";
//   const isPending = status === "pending";
//   const isRejected = status === "rejected";

//   return (
//     <OwnerLayout>
//       <div className="space-y-8">
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold">My Gym</h1>
//             <p className="text-muted-foreground">
//               View and manage your gym details
//             </p>
//           </div>

//           <span
//             className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
//               isApproved
//                 ? "bg-primary/10 text-primary"
//                 : isRejected
//                 ? "bg-destructive/10 text-destructive"
//                 : "bg-accent/10 text-accent"
//             }`}
//           >
//             {isApproved && <CheckCircle2 className="w-4 h-4" />}
//             {isPending && <Hourglass className="w-4 h-4" />}
//             {isRejected && <AlertTriangle className="w-4 h-4" />}

//             {isApproved && "Active"}
//             {isPending && "Pending Approval"}
//             {isRejected && "Rejected"}
//           </span>
//         </div>

//         {/* STATUS BANNER */}
//         <div
//           className={`rounded-2xl p-5 border ${
//             isApproved
//               ? "bg-primary/10 border-primary text-primary"
//               : isRejected
//               ? "bg-destructive/10 border-destructive text-destructive"
//               : "bg-accent/10 border-accent text-accent"
//           }`}
//         >
//           <div className="flex items-start gap-3">
//             {isApproved && <CheckCircle2 className="w-6 h-6 mt-1" />}
//             {isPending && <Hourglass className="w-6 h-6 mt-1" />}
//             {isRejected && <AlertTriangle className="w-6 h-6 mt-1" />}

//             <div>
//               <h3 className="font-semibold text-lg">
//                 {isApproved && "Gym Approved"}
//                 {isPending && "Approval Pending"}
//                 {isRejected && "Gym Rejected"}
//               </h3>

//               <p className="text-sm opacity-90">
//                 {isApproved && "Your gym has been approved and is now live."}
//                 {isPending && "Your gym is under admin review."}
//                 {isRejected && "Your gym was rejected. Please update details."}
//               </p>

//               {isRejected && gym.rejectionReason && (
//                 <p className="mt-2 text-sm font-medium">
//                   Reason: {gym.rejectionReason}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* BASIC INFO */}
//         <div className="grid lg:grid-cols-2 gap-6">
//           <Card icon={Building2} title="Basic Information">
//             <Info label="Gym Name" value={gym.name} />

//             <div>
//               <p className="text-sm text-muted-foreground mb-1">Address</p>
//               <div className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4 text-muted-foreground" />
//                 <p>{gym.addressLine || gym.address}</p>
//               </div>
//             </div>

//             <Info label="City" value={gym.city} />

//             <div className="grid grid-cols-2 gap-4">
//               <Info label="Latitude" value={gym.latitude} />
//               <Info label="Longitude" value={gym.longitude} />
//             </div>
//           </Card>

//           {/* OPERATING HOURS */}
//           <Card icon={Clock} title="Operating Hours">
//             <div className="space-y-3">
//               {Object.entries(gym.operatingHours || {}).map(([day, hours]) => (
//                 <div
//                   key={day}
//                   className="flex justify-between py-2 border-b last:border-0"
//                 >
//                   <span className="font-medium">{day}</span>
//                   <span className="text-muted-foreground">{hours}</span>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//     </OwnerLayout>
//   );
// }

// /* ---------- UI HELPERS ---------- */

// function Card({ icon: Icon, title, children }) {
//   return (
//     <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
//           <Icon className="w-5 h-5 text-primary-foreground" />
//         </div>
//         <h2 className="text-lg font-semibold">{title}</h2>
//       </div>
//       {children}
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <div>
//       <p className="text-sm text-muted-foreground mb-1">{label}</p>
//       <p className="font-medium">{value || "-"}</p>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  RefreshCw,
  Save,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { gymService } from "@/services/gymService";
import { useToast } from "@/hooks/use-toast";

export default function MyGym() {
  const { toast } = useToast();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── sub-form states ──────────────────────────────────────────────────────
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showResubmitForm, setShowResubmitForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);

  // ── update form ──────────────────────────────────────────────────────────
  const [updateForm, setUpdateForm] = useState({});

  // ── resubmit form ────────────────────────────────────────────────────────
  const [resubmitForm, setResubmitForm] = useState({});

  const fetchGym = async () => {
    try {
      const data = await gymService.getMyGyms();
      const myGym = data.gyms?.[0] || null;
      setGym(myGym);
      if (myGym) {
        // Pre-fill both forms with current values
        const prefill = {
          name: myGym.name ?? "",
          description: myGym.description ?? "",
          addressLine: myGym.addressLine ?? "",
          city: myGym.city ?? "",
          province: myGym.province ?? "",
          postalCode: myGym.postalCode ?? "",
          phoneNumber: myGym.phoneNumber ?? "",
          whatsappNumber: myGym.whatsappNumber ?? "",
          openingTime: myGym.openingTime ?? "",
          closingTime: myGym.closingTime ?? "",
        };
        setUpdateForm(prefill);
        setResubmitForm(prefill);
      }
    } catch (err) {
      toast({
        title: "Could not load gym",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGym();
  }, []);

  // ── UPDATE (approved gym) ────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(updateForm).forEach(([k, v]) => {
        if (v !== undefined && v !== null) body.append(k, v);
      });
      // Cover image file
      if (updateForm._coverImage)
        body.append("coverImage", updateForm._coverImage);

      const data = await gymService.updateGym(gym.id, body);
      if (!data.success) throw new Error(data.message);

      toast({
        title: "Gym updated!",
        description: "Your changes have been saved.",
      });
      setShowUpdateForm(false);
      fetchGym();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── RESUBMIT (rejected / changes_requested) ──────────────────────────────
  const handleResubmit = async (e) => {
    e.preventDefault();
    setResubmitting(true);
    try {
      // Only send non-empty changed fields — backend merges with existing values
      const payload = {};
      Object.entries(resubmitForm).forEach(([k, v]) => {
        if (v !== "") payload[k] = v;
      });

      const data = await gymService.resubmitGym(gym.id, payload);
      if (!data.success) throw new Error(data.message);

      toast({
        title: "Resubmitted!",
        description: "Your gym is pending admin review again.",
      });
      setShowResubmitForm(false);
      fetchGym();
    } catch (err) {
      toast({
        title: "Resubmission failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setResubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <OwnerLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-40 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-2xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </OwnerLayout>
    );
  }

  if (!gym) {
    return (
      <OwnerLayout>
        <p className="text-muted-foreground">No gym registered yet.</p>
      </OwnerLayout>
    );
  }

  const status = gym.status;
  const isApproved = status === "approved";
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const isChangesRequested = status === "changes_requested";
  const canResubmit = isRejected || isChangesRequested;

  return (
    <OwnerLayout>
      <div className="space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              My Gym
            </h1>
            <p className="text-muted-foreground">
              View and manage your gym details.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchGym}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <StatusPill status={status} />
          </div>
        </div>

        {/* ── Status banner ── */}
        {isPending && (
          <Banner color="amber" icon={Hourglass} title="Pending Approval">
            Your gym is under admin review. You'll be notified by email.
          </Banner>
        )}

        {isApproved && (
          <Banner color="green" icon={CheckCircle2} title="Gym Approved">
            Your gym is live and accepting members.
          </Banner>
        )}

        {isChangesRequested && (
          <Banner color="orange" icon={AlertTriangle} title="Changes Requested">
            <span>Admin has requested changes.</span>
            {gym.rejectionReason && (
              <p className="mt-1 font-medium text-sm">
                Feedback: &quot;{gym.rejectionReason}&quot;
              </p>
            )}
            <p className="mt-2 text-sm">
              Update the fields below and resubmit. This is resubmission #
              {(gym.resubmissionCount ?? 0) + 1}.
            </p>
          </Banner>
        )}

        {isRejected && (
          <Banner color="red" icon={AlertTriangle} title="Gym Rejected">
            {gym.rejectionReason && (
              <p className="font-medium">
                Reason: &quot;{gym.rejectionReason}&quot;
              </p>
            )}
            <p className="text-sm mt-1">
              You can update your details and resubmit.
            </p>
          </Banner>
        )}

        {/* ── Action buttons ── */}
        <div className="flex flex-wrap gap-3">
          {isApproved && (
            <Button
              variant="outline"
              onClick={() => {
                setShowUpdateForm((v) => !v);
                setShowResubmitForm(false);
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              {showUpdateForm ? "Cancel Update" : "Update Gym Info"}
            </Button>
          )}

          {canResubmit && (
            <Button
              className="gradient-hero text-primary-foreground"
              onClick={() => {
                setShowResubmitForm((v) => !v);
                setShowUpdateForm(false);
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {showResubmitForm ? "Cancel" : "Update & Resubmit"}
            </Button>
          )}
        </div>

        {/* ── UPDATE FORM (approved gyms) ── */}
        {showUpdateForm && (
          <form
            onSubmit={handleUpdate}
            className="bg-card rounded-2xl p-6 shadow-card space-y-5"
          >
            <h2 className="text-lg font-semibold text-foreground">
              Update Gym Info
            </h2>
            <p className="text-sm text-muted-foreground -mt-3">
              Changes are saved immediately. No re-review needed for approved
              gyms.
            </p>

            <EditGrid
              form={updateForm}
              setForm={setUpdateForm}
              showCoverImage
            />

            <Button
              type="submit"
              className="gradient-hero text-primary-foreground"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </form>
        )}

        {/* ── RESUBMIT FORM (rejected / changes_requested) ── */}
        {showResubmitForm && (
          <form
            onSubmit={handleResubmit}
            className="bg-card rounded-2xl p-6 shadow-card space-y-5 border-2 border-orange-300 dark:border-orange-700"
          >
            <h2 className="text-lg font-semibold text-foreground">
              Update & Resubmit
            </h2>
            <p className="text-sm text-muted-foreground -mt-3">
              Make the requested changes below, then click Resubmit. The admin
              will review again.
            </p>

            <EditGrid form={resubmitForm} setForm={setResubmitForm} />

            <Button
              type="submit"
              className="gradient-hero text-primary-foreground w-full"
              disabled={resubmitting}
            >
              {resubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Resubmitting…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Resubmit for Review
                </span>
              )}
            </Button>
          </form>
        )}

        {/* ── GYM DETAILS ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic info */}
          <Card icon={Building2} title="Basic Information">
            <Info label="Gym Name" value={gym.name} />
            <Info label="Description" value={gym.description} />
            <Info label="Business Name" value={gym.businessName} />
            <Info label="Tier" value={`Tier ${gym.tier}`} />
            {gym.resubmissionCount > 0 && (
              <Info label="Times Resubmitted" value={gym.resubmissionCount} />
            )}
          </Card>

          {/* Location */}
          <Card icon={MapPin} title="Location">
            <Info label="Address" value={gym.addressLine} />
            <Info label="City" value={gym.city} />
            <Info label="Province" value={gym.province} />
            <div className="grid grid-cols-2 gap-4">
              <Info label="Latitude" value={gym.latitude} />
              <Info label="Longitude" value={gym.longitude} />
            </div>
          </Card>

          {/* Hours */}
          <Card icon={Clock} title="Operating Hours">
            {gym.is24Hours ? (
              <p className="text-foreground font-medium">Open 24 Hours</p>
            ) : (
              <div className="flex gap-8">
                <Info label="Opening" value={gym.openingTime ?? "—"} />
                <Info label="Closing" value={gym.closingTime ?? "—"} />
              </div>
            )}
          </Card>

          {/* Contact */}
          <Card icon={CheckCircle2} title="Contact">
            <Info label="Phone" value={gym.phoneNumber} />
            <Info label="WhatsApp" value={gym.whatsappNumber} />
            <Info label="Instagram" value={gym.instagramHandle} />
            <Info label="Website" value={gym.websiteUrl} />
          </Card>
        </div>

        {/* Photos */}
        {gym.photos?.length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Photos
            </h2>
            <div className="flex flex-wrap gap-3">
              {gym.coverImageUrl && (
                <div className="relative">
                  <img
                    src={gym.coverImageUrl}
                    alt="cover"
                    className="w-40 h-28 rounded-xl object-cover"
                  />
                  <span className="absolute top-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                    Cover
                  </span>
                </div>
              )}
              {gym.photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt="gym"
                  className="w-40 h-28 rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Verification Documents */}
        {gym.verificationDocuments?.length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Verification Documents
            </h2>
            <div className="flex flex-wrap gap-3">
              {gym.verificationDocuments.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-sm font-medium hover:bg-muted/70 transition-colors"
                >
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
    </OwnerLayout>
  );
}

/* ── Shared editable form grid (used by both update & resubmit) ── */
function EditGrid({ form, setForm, showCoverImage }) {
  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Gym Name">
        <Input value={form.name ?? ""} onChange={set("name")} />
      </Field>
      <Field label="City">
        <Input value={form.city ?? ""} onChange={set("city")} />
      </Field>
      <Field label="Address Line">
        <Input value={form.addressLine ?? ""} onChange={set("addressLine")} />
      </Field>
      <Field label="Province">
        <Input value={form.province ?? ""} onChange={set("province")} />
      </Field>
      <Field label="Phone Number">
        <Input value={form.phoneNumber ?? ""} onChange={set("phoneNumber")} />
      </Field>
      <Field label="WhatsApp Number">
        <Input
          value={form.whatsappNumber ?? ""}
          onChange={set("whatsappNumber")}
        />
      </Field>
      <Field label="Opening Time">
        <Input
          type="time"
          value={form.openingTime ?? ""}
          onChange={set("openingTime")}
        />
      </Field>
      <Field label="Closing Time">
        <Input
          type="time"
          value={form.closingTime ?? ""}
          onChange={set("closingTime")}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea
            value={form.description ?? ""}
            onChange={set("description")}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </Field>
      </div>
      {showCoverImage && (
        <div className="sm:col-span-2">
          <Field label="Replace Cover Image">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, _coverImage: e.target.files[0] }))
              }
            />
          </Field>
        </div>
      )}
    </div>
  );
}

/* ── Small UI helpers ── */

function Card({ icon: Icon, title, children }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground">{value ?? "—"}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Banner({ color, icon: Icon, title, children }) {
  const colors = {
    amber:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300",
    green:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">{title}</p>
          <div className="text-sm mt-0.5 opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    approved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    changes_requested:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    draft: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
}
