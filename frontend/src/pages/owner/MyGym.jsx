import { useEffect, useState, useCallback } from "react";
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
  Phone,
  Globe2,
  FileText,
  Loader2,
  PencilLine,
  X,
  Check,
  UploadCloud,
  ImageIcon,
  Navigation,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { gymService } from "@/services/gymService";
import { useToast } from "@/hooks/use-toast";

/* =========================================================
   MAIN
========================================================= */
export default function MyGym() {
  const { toast } = useToast();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  // which form is open: null | "update" | "resubmit"
  const [openForm, setOpenForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  /* ── text form state — mirrors controller req.body fields exactly ── */
  const emptyForm = {
    name: "",
    description: "",
    businessName: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    phoneNumber: "+92",
    whatsappNumber: "+92",
    instagramHandle: "",
    websiteUrl: "",
    googleMapsLink: "",
    cnicNumber: "",
    openingTime: "",
    closingTime: "",
    is24Hours: false,
  };

  const [form, setForm] = useState(emptyForm);
  const [original, setOriginal] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  /* ── file states (shared between update and resubmit) ── */
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [docFiles, setDocFiles] = useState({
    ownerCnic: null,
    businessLicense: null,
    ownershipProof: null,
    utilityBill: null,
  });

  /* ── fetch gym ── */
  const fetchGym = useCallback(async () => {
    try {
      const data = await gymService.getMyGyms();
      const g = data.gyms?.[0] || null;
      setGym(g);
      if (g) {
        const prefill = {
          name: g.name ?? "",
          description: g.description ?? "",
          businessName: g.businessName ?? "",
          addressLine: g.addressLine ?? "",
          city: g.city ?? "",
          province: g.province ?? "",
          postalCode: g.postalCode ?? "",
          latitude: g.latitude ?? "",
          longitude: g.longitude ?? "",
          phoneNumber: g.phoneNumber || "+92",
          whatsappNumber: g.whatsappNumber || "+92",
          instagramHandle: g.instagramHandle ?? "",
          websiteUrl: g.websiteUrl ?? "",
          googleMapsLink: g.googleMapsLink ?? "",
          cnicNumber: g.cnicNumber ?? "",
          openingTime: g.openingTime ?? "",
          closingTime: g.closingTime ?? "",
          is24Hours: g.is24Hours ?? false,
        };
        setForm(prefill);
        setOriginal(prefill);
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
  }, [toast]);

  useEffect(() => {
    fetchGym();
  }, [fetchGym]);

  /* ── helpers ── */
  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const changed = (key) => form[key] !== original[key];

  const changedTextCount = Object.keys(form).filter(
    (k) => form[k] !== original[k],
  ).length;

  const hasFileChanges =
    coverFile ||
    galleryFiles.length > 0 ||
    Object.values(docFiles).some((f) => f !== null);

  /* ── validation ── */
  const validateForm = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Gym name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.addressLine.trim()) e.addressLine = "Address is required";

    const phoneRegex = /^\+92\d{10}$/;
    if (!phoneRegex.test(form.phoneNumber))
      e.phoneNumber = "Enter valid Pakistani number (+92XXXXXXXXXX)";
    if (form.whatsappNumber && !phoneRegex.test(form.whatsappNumber))
      e.whatsappNumber = "Enter valid WhatsApp number (+92XXXXXXXXXX)";

    const cnicRegex = /^\d{5}-\d{7}-\d$/;
    if (form.cnicNumber && !cnicRegex.test(form.cnicNumber))
      e.cnicNumber = "CNIC format should be 34101-1234567-1";

    if (form.latitude && isNaN(Number(form.latitude)))
      e.latitude = "Latitude must be numeric";
    if (form.longitude && isNaN(Number(form.longitude)))
      e.longitude = "Longitude must be numeric";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── phone formatter (+92 prefix, max 10 digits after) ── */
  const formatPakistanPhone = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("92")) cleaned = cleaned.slice(2);
    cleaned = cleaned.slice(0, 10);
    return `+92${cleaned}`;
  };

  /* ── CNIC formatter (auto-dashes: 34101-1234567-1) ── */
  const formatCNIC = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 13);
    if (cleaned.length <= 5) return cleaned;
    if (cleaned.length <= 12)
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
  };

  const handlePhoneChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: formatPakistanPhone(e.target.value) }));

  const handleCNICChange = (e) =>
    setForm((p) => ({ ...p, cnicNumber: formatCNIC(e.target.value) }));

  /* ── open/close form panel ── */
  const openFormPanel = (mode) => {
    if (openForm !== mode) {
      // Reset file states when switching modes
      setCoverFile(null);
      setCoverPreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setDocFiles({
        ownerCnic: null,
        businessLicense: null,
        ownershipProof: null,
        utilityBill: null,
      });
      setForm(original);
      setErrors({});
    }
    setOpenForm(openForm === mode ? null : mode);
  };

  /* ── GPS ── */
  const fetchLocation = () => {
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p,
          latitude: pos.coords.latitude.toFixed(7),
          longitude: pos.coords.longitude.toFixed(7),
        }));
        toast({ title: "Location fetched" });
        setFetchingLocation(false);
      },
      () => {
        toast({ title: "Permission denied", variant: "destructive" });
        setFetchingLocation(false);
      },
    );
  };

  /* ── cover ── */
  const handleCoverPick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };
  const removeCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
  };

  /* ── gallery ── */
  const handleGalleryPick = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles((p) => [...p, ...files]);
    setGalleryPreviews((p) => [
      ...p,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };
  const removeGalleryItem = (i) => {
    URL.revokeObjectURL(galleryPreviews[i]);
    setGalleryFiles((p) => p.filter((_, idx) => idx !== i));
    setGalleryPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  /* ── docs ── */
  const handleDocPick = (key) => (e) => {
    const file = e.target.files[0];
    if (file) setDocFiles((p) => ({ ...p, [key]: file }));
  };

  /* ── build FormData for submission ── */
  const buildFormData = () => {
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== undefined && v !== null)
        body.append(k, typeof v === "boolean" ? String(v) : v);
    });
    if (coverFile) body.append("coverImage", coverFile);
    galleryFiles.forEach((f) => body.append("photos", f));
    Object.entries(docFiles).forEach(([k, f]) => {
      if (f) body.append(k, f);
    });
    return body;
  };

  /* ── submit update ── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation failed",
        description: "Please correct highlighted fields.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const body = buildFormData();
      const data = await gymService.updateGym(gym.id, body);
      if (!data.success) throw new Error(data.message);

      toast({
        title: "Gym updated successfully",
        description: "All information has been saved.",
      });
      setOpenForm(null);
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

  /* ── submit resubmit (sends complete form with files) ── */
  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation failed",
        description: "Please correct highlighted fields.",
        variant: "destructive",
      });
      return;
    }
    if (changedTextCount === 0 && !hasFileChanges) {
      toast({
        title: "No changes detected",
        description: "Please modify at least one field or upload new files.",
        variant: "destructive",
      });
      return;
    }
    setResubmitting(true);
    try {
      const body = buildFormData();
      // Add flag to indicate this is a resubmission
      body.append("isResubmission", "true");

      const data = await gymService.resubmitGym(gym.id, body);
      if (!data.success) throw new Error(data.message);

      toast({
        title: "Resubmitted successfully",
        description: "Complete updated form submitted to admin for review.",
      });
      setOpenForm(null);
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

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <OwnerLayout active="my-gym">
        <div className="min-h-screen bg-[#F5F0E8] p-6 space-y-4 animate-pulse">
          <div className="h-8 w-48 bg-[#E5DCCF] rounded-xl" />
          <div className="h-20 bg-[#E5DCCF] rounded-[24px]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-44 bg-[#E5DCCF] rounded-[24px]" />
            <div className="h-44 bg-[#E5DCCF] rounded-[24px]" />
          </div>
        </div>
      </OwnerLayout>
    );
  }

  if (!gym) {
    return (
      <OwnerLayout active="my-gym">
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#F1E3D1] flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-[#8A4F18]" />
            </div>
            <p className="text-[#4A3F38] font-semibold text-lg">
              No gym registered yet.
            </p>
            <p className="text-[#7B6F65] text-sm mt-1">
              Register your gym to get started.
            </p>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  const { status } = gym;
  const isApproved = status === "approved";
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const isChangesRequested = status === "changes_requested";
  const canResubmit = isRejected || isChangesRequested;

  return (
    <OwnerLayout active="my-gym">
      <div className="min-h-screen bg-[#F5F0E8] overflow-y-auto">
        {/* TOP BAR */}
        <div className="h-14 border-b border-[#E5DCCF] bg-[#F7F2EA] px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-[17px] font-bold text-[#17120E]">
            GymKey Enterprise
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-sm text-[#6B625A]">Support Portal</button>
            <div className="w-9 h-9 rounded-full bg-[#2A1608]" />
          </div>
        </div>

        <div className="px-6 py-5 max-w-[1400px] mx-auto space-y-5">
          {/* TITLE */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[28px] font-bold text-[#17120E] tracking-[-0.03em] leading-tight">
                My Gym
              </h2>
              <p className="mt-0.5 text-[13px] text-[#655B53]">
                View and manage your facility details.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={fetchGym}
                className="w-9 h-9 rounded-xl border border-[#E5DCCF] bg-[#F7F2EA] flex items-center justify-center text-[#6B625A] hover:bg-[#EDE7DD] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <StatusPill status={status} />
            </div>
          </div>

          {/* BANNERS */}
          {isPending && (
            <StatusBanner
              color="amber"
              icon={Hourglass}
              title="Pending Approval"
              message="Your gym is under admin review. Tier will be assigned after facility assessment. You'll be notified by email once a decision is made."
            />
          )}
          {isApproved && (
            <StatusBanner
              color="green"
              icon={CheckCircle2}
              title="Gym Approved & Live"
              message="Your gym is visible to members and accepting sign-ups."
            />
          )}
          {isChangesRequested && (
            <StatusBanner
              color="orange"
              icon={AlertTriangle}
              title="Changes Requested"
              message={
                <>
                  {gym.rejectionReason && (
                    <span>
                      Admin feedback: <strong>"{gym.rejectionReason}"</strong>{" "}
                      —{" "}
                    </span>
                  )}
                  This will be resubmission #{(gym.resubmissionCount ?? 0) + 1}.
                  Your current tier (if assigned) will be preserved.
                </>
              }
            />
          )}
          {isRejected && (
            <StatusBanner
              color="red"
              icon={AlertTriangle}
              title="Application Rejected"
              message={
                <>
                  {gym.rejectionReason && (
                    <span>
                      Reason: <strong>"{gym.rejectionReason}"</strong> —{" "}
                    </span>
                  )}
                  Update and resubmit for re-review.
                </>
              }
            />
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3">
            {isApproved && (
              <button
                onClick={() => openFormPanel("update")}
                className={`h-10 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 border transition-all
                  ${openForm === "update" ? "bg-[#2A1608] text-white border-[#2A1608]" : "bg-[#FBF9F6] text-[#2A1608] border-[#D9CDBF] hover:bg-[#F1E8DC]"}`}
              >
                {openForm === "update" ? (
                  <X className="w-4 h-4" />
                ) : (
                  <PencilLine className="w-4 h-4" />
                )}
                {openForm === "update" ? "Cancel" : "Update Gym Info"}
              </button>
            )}
            {canResubmit && (
              <button
                onClick={() => openFormPanel("resubmit")}
                className={`h-10 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 border transition-all
                  ${openForm === "resubmit" ? "bg-[#7D4912] text-white border-[#7D4912]" : "bg-[#9A5A17] text-white border-[#9A5A17] hover:bg-[#7D4912]"}`}
              >
                {openForm === "resubmit" ? (
                  <X className="w-4 h-4" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                {openForm === "resubmit" ? "Cancel" : "Update & Resubmit"}
                {openForm === "resubmit" &&
                  (changedTextCount > 0 || hasFileChanges) && (
                    <span className="w-5 h-5 rounded-full bg-white/30 text-white text-[10px] flex items-center justify-center font-bold">
                      {changedTextCount + (hasFileChanges ? 1 : 0)}
                    </span>
                  )}
              </button>
            )}
          </div>

          {/* ══════════════════════════════
              UPDATE FORM
          ══════════════════════════════ */}
          {openForm === "update" && (
            <div className="bg-[#FBF9F6] rounded-[28px] border-2 border-[#E9DED1] p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#F1E3D1] flex items-center justify-center flex-shrink-0">
                  <PencilLine className="w-4 h-4 text-[#9A5A17]" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#17120D]">
                    Update Gym Info
                  </h3>
                  <p className="text-[12px] text-[#6E635B] mt-0.5">
                    All changes save immediately. No re-review needed.
                  </p>
                </div>
              </div>
              <form onSubmit={handleUpdate}>
                <AllFields
                  form={form}
                  setForm={setForm}
                  set={set}
                  isResubmit={false}
                  changed={changed}
                  errors={errors}
                  handlePhoneChange={handlePhoneChange}
                  handleCNICChange={handleCNICChange}
                  fetchingLocation={fetchingLocation}
                  fetchLocation={fetchLocation}
                  coverPreview={coverPreview}
                  existingCover={gym.coverImageUrl}
                  onCoverPick={handleCoverPick}
                  onCoverRemove={removeCover}
                  galleryPreviews={galleryPreviews}
                  existingPhotos={gym.photos ?? []}
                  onGalleryPick={handleGalleryPick}
                  onGalleryRemove={removeGalleryItem}
                  docFiles={docFiles}
                  existingDocs={gym.verificationDocuments ?? []}
                  onDocPick={handleDocPick}
                />
                <div className="mt-6 pt-4 border-t border-[#E9DED1] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setOpenForm(null)}
                    className="h-10 px-5 rounded-xl text-sm font-medium text-[#6A5E55] hover:bg-[#EDE7DD] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-6 rounded-xl bg-[#2A1608] hover:bg-[#1C0F06] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══════════════════════════════
              RESUBMIT FORM — FULL REGISTRATION EXPERIENCE
          ══════════════════════════════ */}
          {openForm === "resubmit" && (
            <div className="bg-[#FBF9F6] rounded-[28px] border-2 border-[#C9833A] p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0E0] flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-4 h-4 text-[#C9833A]" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#17120D]">
                    Update & Resubmit
                  </h3>
                  <p className="text-[12px] text-[#6E635B] mt-0.5">
                    Update any field or upload new documents. Complete form will
                    be sent to admin for re-review.
                  </p>
                </div>
              </div>

              {/* legend */}
              <div className="flex items-center gap-5 mb-5 text-xs text-[#7B6F65] bg-[#F7F1E8] rounded-xl px-4 py-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded border border-[#E3D8CB] bg-[#F3EDE4] inline-block" />
                  Unchanged
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded border border-[#C9833A] bg-[#FFF8F0] ring-1 ring-[#C9833A]/40 inline-block" />
                  Modified — will be sent
                </span>
              </div>

              <form onSubmit={handleResubmit}>
                <AllFields
                  form={form}
                  setForm={setForm}
                  set={set}
                  isResubmit={true}
                  changed={changed}
                  errors={errors}
                  handlePhoneChange={handlePhoneChange}
                  handleCNICChange={handleCNICChange}
                  fetchingLocation={fetchingLocation}
                  fetchLocation={fetchLocation}
                  coverPreview={coverPreview}
                  existingCover={gym.coverImageUrl}
                  onCoverPick={handleCoverPick}
                  onCoverRemove={removeCover}
                  galleryPreviews={galleryPreviews}
                  existingPhotos={gym.photos ?? []}
                  onGalleryPick={handleGalleryPick}
                  onGalleryRemove={removeGalleryItem}
                  docFiles={docFiles}
                  existingDocs={gym.verificationDocuments ?? []}
                  onDocPick={handleDocPick}
                />
                <div className="mt-6 pt-4 border-t border-[#E9DED1] flex items-center justify-between">
                  <div className="text-xs text-[#7B6F65] space-y-1">
                    <p>
                      {changedTextCount === 0
                        ? "No text changes"
                        : `${changedTextCount} text field${changedTextCount > 1 ? "s" : ""} changed`}
                    </p>
                    {hasFileChanges && (
                      <p className="text-[#9A5A17] font-medium">
                        New files attached (cover/gallery/docs)
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={
                      resubmitting ||
                      (changedTextCount === 0 && !hasFileChanges)
                    }
                    className="h-10 px-6 rounded-xl bg-[#9A5A17] hover:bg-[#7D4912] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    {resubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    {resubmitting ? "Resubmitting…" : "Resubmit for Review"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── GYM DETAIL CARDS ── */}
          <div className="grid lg:grid-cols-2 gap-4">
            <DetailCard icon={Building2} title="Basic Information">
              <InfoRow label="Gym Name" value={gym.name} />
              <InfoRow label="Business Name" value={gym.businessName} />
              <InfoRow label="Description" value={gym.description} multiline />
              <InfoRow label="CNIC Number" value={gym.cnicNumber} />
              <InfoRow
                label="Tier"
                value={
                  gym.tier ? `Tier ${gym.tier}` : "Pending admin assignment"
                }
              />
              {gym.resubmissionCount > 0 && (
                <InfoRow
                  label="Times Resubmitted"
                  value={gym.resubmissionCount}
                />
              )}
            </DetailCard>

            <DetailCard icon={MapPin} title="Location">
              <InfoRow label="Address" value={gym.addressLine} />
              <div className="grid grid-cols-3 gap-3">
                <InfoRow label="City" value={gym.city} />
                <InfoRow label="Province" value={gym.province} />
                <InfoRow label="Postal Code" value={gym.postalCode} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Latitude" value={gym.latitude} />
                <InfoRow label="Longitude" value={gym.longitude} />
              </div>
            </DetailCard>

            <DetailCard icon={Clock} title="Operating Hours">
              {gym.is24Hours ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-[14px] font-semibold text-[#1B120D]">
                    Open 24 Hours
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Opening" value={gym.openingTime} />
                  <InfoRow label="Closing" value={gym.closingTime} />
                </div>
              )}
            </DetailCard>

            <DetailCard icon={Phone} title="Contact & Social">
              <InfoRow label="Phone" value={gym.phoneNumber} />
              <InfoRow label="WhatsApp" value={gym.whatsappNumber} />
              <InfoRow label="Instagram" value={gym.instagramHandle} />
              <InfoRow label="Website" value={gym.websiteUrl} />
              <InfoRow label="Google Maps" value={gym.googleMapsLink} />
            </DetailCard>
          </div>

          {/* PHOTOS */}
          {(gym.coverImageUrl || gym.photos?.length > 0) && (
            <SectionBox title="Photos" icon={ImageIcon}>
              <div className="flex flex-wrap gap-3 mt-3">
                {gym.coverImageUrl && (
                  <div className="relative">
                    <img
                      src={gym.coverImageUrl}
                      alt="cover"
                      className="w-44 h-32 rounded-xl object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[10px] bg-[#2A1608]/80 text-white px-2 py-0.5 rounded font-semibold">
                      Cover
                    </span>
                  </div>
                )}
                {gym.photos?.map((p) => (
                  <img
                    key={p.id}
                    src={p.url}
                    alt="gym"
                    className="w-44 h-32 rounded-xl object-cover"
                  />
                ))}
              </div>
            </SectionBox>
          )}

          {/* DOCS */}
          {gym.verificationDocuments?.length > 0 && (
            <SectionBox title="Verification Documents" icon={FileText}>
              <div className="flex flex-wrap gap-3 mt-3">
                {gym.verificationDocuments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5DACE] bg-[#F8F2EA] text-sm font-medium text-[#4A3F38] hover:bg-[#F1E8DC] transition-colors"
                  >
                    {doc.type.replace(/_/g, " ")}
                    <DocStatusBadge status={doc.status} />
                  </a>
                ))}
              </div>
            </SectionBox>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}

/* =========================================================
   ALL FIELDS — shared by update + resubmit (NOW FULLY IDENTICAL)
========================================================= */
function AllFields({
  form,
  setForm,
  set,
  isResubmit,
  changed,
  errors,
  handlePhoneChange,
  handleCNICChange,
  fetchingLocation,
  fetchLocation,
  coverPreview,
  existingCover,
  onCoverPick,
  onCoverRemove,
  galleryPreviews,
  existingPhotos,
  onGalleryPick,
  onGalleryRemove,
  docFiles,
  existingDocs,
  onDocPick,
}) {
  const iS = (key) => {
    const base =
      "h-10 rounded-xl text-[14px] shadow-none focus-visible:ring-2 transition-all";
    if (isResubmit && changed(key))
      return `${base} border-[#C9833A] bg-[#FFF8F0] ring-1 ring-[#C9833A]/30 focus-visible:ring-[#C9833A]/40`;
    return `${base} border-[#E3D8CB] bg-[#F3EDE4] focus-visible:ring-[#9A5A17]/20`;
  };

  const tS = (key) => {
    const base =
      "rounded-xl text-[14px] resize-none shadow-none w-full px-3 py-2 focus:outline-none focus:ring-2 border transition-all";
    if (isResubmit && changed(key))
      return `${base} border-[#C9833A] bg-[#FFF8F0] ring-1 ring-[#C9833A]/30 focus:ring-[#C9833A]/40`;
    return `${base} border-[#E3D8CB] bg-[#F3EDE4] focus:ring-[#9A5A17]/20`;
  };

  return (
    <div className="space-y-5">
      {/* ── CORE DETAILS ── */}
      <Divider icon={Building2} label="Core Details" />
      <TwoCol>
        <FL label="Facility Name *" changed={isResubmit && changed("name")}>
          <Input
            value={form.name}
            onChange={set("name")}
            placeholder="Summit Performance Club"
            className={iS("name")}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </FL>
        <FL
          label="Business Name"
          changed={isResubmit && changed("businessName")}
        >
          <Input
            value={form.businessName}
            onChange={set("businessName")}
            placeholder="Titan Fitness Pvt Ltd"
            className={iS("businessName")}
          />
        </FL>
      </TwoCol>
      <FL
        label="Facility Description"
        changed={isResubmit && changed("description")}
      >
        <textarea
          rows={3}
          value={form.description}
          onChange={set("description")}
          placeholder="Describe your gym atmosphere, equipment & services…"
          className={tS("description")}
        />
      </FL>
      <FL
        label="Owner CNIC Number"
        changed={isResubmit && changed("cnicNumber")}
      >
        <Input
          value={form.cnicNumber}
          onChange={handleCNICChange}
          placeholder="34101-1234567-1"
          className={iS("cnicNumber")}
        />
        {errors.cnicNumber && (
          <p className="text-xs text-red-500">{errors.cnicNumber}</p>
        )}
      </FL>

      {/* ── CONTACT & SOCIAL ── */}
      <Divider icon={Phone} label="Contact & Social" />
      <TwoCol>
        <FL
          label="Phone Number *"
          changed={isResubmit && changed("phoneNumber")}
        >
          <Input
            value={form.phoneNumber}
            onChange={handlePhoneChange("phoneNumber")}
            placeholder="+923001234567"
            className={iS("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500">{errors.phoneNumber}</p>
          )}
        </FL>
        <FL
          label="WhatsApp Number"
          changed={isResubmit && changed("whatsappNumber")}
        >
          <Input
            value={form.whatsappNumber}
            onChange={handlePhoneChange("whatsappNumber")}
            placeholder="+923001234567"
            className={iS("whatsappNumber")}
          />
          {errors.whatsappNumber && (
            <p className="text-xs text-red-500">{errors.whatsappNumber}</p>
          )}
        </FL>
      </TwoCol>
      <TwoCol>
        <FL
          label="Instagram Handle"
          changed={isResubmit && changed("instagramHandle")}
        >
          <Input
            value={form.instagramHandle}
            onChange={set("instagramHandle")}
            placeholder="@gymhandle"
            className={iS("instagramHandle")}
          />
        </FL>
        <FL label="Website URL" changed={isResubmit && changed("websiteUrl")}>
          <Input
            value={form.websiteUrl}
            onChange={set("websiteUrl")}
            placeholder="https://mygym.com"
            className={iS("websiteUrl")}
          />
        </FL>
      </TwoCol>
      <FL
        label="Google Maps Link"
        changed={isResubmit && changed("googleMapsLink")}
      >
        <Input
          value={form.googleMapsLink}
          onChange={set("googleMapsLink")}
          placeholder="https://maps.google.com/…"
          className={iS("googleMapsLink")}
        />
      </FL>

      {/* ── LOCATION ── */}
      <Divider icon={MapPin} label="Location" />
      <FL label="Address Line *" changed={isResubmit && changed("addressLine")}>
        <Input
          value={form.addressLine}
          onChange={set("addressLine")}
          placeholder="123 Fitness Avenue"
          className={iS("addressLine")}
        />
        {errors.addressLine && (
          <p className="text-xs text-red-500">{errors.addressLine}</p>
        )}
      </FL>
      <ThreeCol>
        <FL label="City *" changed={isResubmit && changed("city")}>
          <Input
            value={form.city}
            onChange={set("city")}
            placeholder="Lahore"
            className={iS("city")}
          />
          {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
        </FL>
        <FL label="Province" changed={isResubmit && changed("province")}>
          <Input
            value={form.province}
            onChange={set("province")}
            placeholder="Punjab"
            className={iS("province")}
          />
        </FL>
        <FL label="Postal Code" changed={isResubmit && changed("postalCode")}>
          <Input
            value={form.postalCode}
            onChange={set("postalCode")}
            placeholder="54000"
            className={iS("postalCode")}
          />
        </FL>
      </ThreeCol>

      {/* GPS */}
      <div className="rounded-[22px] border border-[#E5DACE] bg-[#F7F1E8] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[14px] font-semibold text-[#17120E]">
              GPS Coordinates
            </p>
            <p className="text-xs text-[#756B63]">
              Auto-detect or enter manually
            </p>
          </div>
          <button
            type="button"
            onClick={fetchLocation}
            disabled={fetchingLocation}
            className="h-9 px-4 rounded-xl bg-[#2A1608] hover:bg-[#1C0F06] text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60 transition-colors"
          >
            {fetchingLocation ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            {fetchingLocation ? "Fetching…" : "Fetch Location"}
          </button>
        </div>
        <TwoCol>
          <FL label="Latitude" changed={isResubmit && changed("latitude")}>
            <Input
              value={form.latitude}
              onChange={set("latitude")}
              placeholder="31.520370"
              className={iS("latitude")}
            />
            {errors.latitude && (
              <p className="text-xs text-red-500">{errors.latitude}</p>
            )}
          </FL>
          <FL label="Longitude" changed={isResubmit && changed("longitude")}>
            <Input
              value={form.longitude}
              onChange={set("longitude")}
              placeholder="74.358749"
              className={iS("longitude")}
            />
            {errors.longitude && (
              <p className="text-xs text-red-500">{errors.longitude}</p>
            )}
          </FL>
        </TwoCol>
      </div>

      {/* ── OPERATING HOURS ── */}
      <Divider icon={Clock} label="Operating Hours" />
      <TwoCol>
        <FL label="Opening Time" changed={isResubmit && changed("openingTime")}>
          <Input
            type="time"
            value={form.openingTime}
            onChange={set("openingTime")}
            disabled={form.is24Hours}
            className={iS("openingTime")}
          />
        </FL>
        <FL label="Closing Time" changed={isResubmit && changed("closingTime")}>
          <Input
            type="time"
            value={form.closingTime}
            onChange={set("closingTime")}
            disabled={form.is24Hours}
            className={iS("closingTime")}
          />
        </FL>
      </TwoCol>
      <div
        className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-all
        ${isResubmit && changed("is24Hours") ? "border-[#C9833A] bg-[#FFF8F0] ring-1 ring-[#C9833A]/30" : "border-[#E5DACE] bg-[#F8F3EC]"}`}
      >
        <div className="flex items-center gap-2">
          <div>
            <p className="font-semibold text-[#1A120D] text-sm">
              Open 24 Hours
            </p>
            <p className="text-xs text-[#756C64]">
              Enable for round-the-clock gyms
            </p>
          </div>
          {isResubmit && changed("is24Hours") && (
            <span className="text-[9px] bg-[#C9833A] text-white px-2 py-0.5 rounded-full font-bold">
              Changed
            </span>
          )}
        </div>
        <Switch
          checked={form.is24Hours}
          onCheckedChange={(v) => setForm((p) => ({ ...p, is24Hours: v }))}
        />
      </div>

      {/* ── IMAGES & DOCS (now available in BOTH update and resubmit) ── */}
      <>
        {/* COVER IMAGE */}
        <Divider icon={ImageIcon} label="Cover Image" />
        <div className="rounded-[22px] border border-[#E5DACE] bg-[#F8F2EA] p-5">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0">
              {coverPreview || existingCover ? (
                <div className="relative">
                  <img
                    src={coverPreview || existingCover}
                    alt="cover"
                    className={`w-40 h-28 rounded-xl object-cover border-2 ${coverPreview ? "border-[#C9833A]" : "border-[#D9CDBF]"}`}
                  />
                  <span
                    className={`absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded font-bold text-white ${coverPreview ? "bg-[#9A5A17]" : "bg-[#2A1608]/70"}`}
                  >
                    {coverPreview ? "NEW" : "CURRENT"}
                  </span>
                </div>
              ) : (
                <div className="w-40 h-28 rounded-xl bg-[#EDE7DD] border-2 border-dashed border-[#D9CDBF] flex flex-col items-center justify-center gap-1">
                  <ImageIcon className="w-7 h-7 text-[#9A8070]" />
                  <p className="text-[10px] text-[#9A8070]">No image</p>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#17120E]">
                Cover Image
              </p>
              <p className="text-xs text-[#7B6F65] mt-0.5 mb-4">
                {coverPreview
                  ? "New image selected — will replace current on save"
                  : "Main public-facing gym photo. Recommended: 1200×800px."}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={onCoverPick}
                  />
                  <span className="h-9 px-4 rounded-xl border border-[#C9833A] bg-white text-[#7A4816] text-sm font-medium flex items-center gap-2 hover:bg-[#FFF8F0] transition-colors cursor-pointer">
                    <UploadCloud className="w-4 h-4" />
                    {coverPreview ? "Change Image" : "Upload Cover"}
                  </span>
                </label>
                {coverPreview && (
                  <button
                    type="button"
                    onClick={onCoverRemove}
                    className="h-9 px-3 rounded-xl border border-[#E5DACE] text-[#7B6F65] text-sm hover:bg-[#F1E8DC] transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Discard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <Divider icon={Globe2} label="Gallery Photos" />
        <div className="rounded-[22px] border border-[#E5DACE] bg-[#F8F2EA] p-5 space-y-4">
          {existingPhotos.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#7B6F65] mb-2">
                Current Gallery
              </p>
              <div className="flex flex-wrap gap-2">
                {existingPhotos.map((p) => (
                  <img
                    key={p.id}
                    src={p.url}
                    alt="gym"
                    className="w-28 h-20 rounded-xl object-cover border border-[#D9CDBF]"
                  />
                ))}
              </div>
            </div>
          )}
          {galleryPreviews.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#9A5A17] mb-2">
                New Photos — to be added
              </p>
              <div className="flex flex-wrap gap-2">
                {galleryPreviews.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt="new"
                      className="w-28 h-20 rounded-xl object-cover border-2 border-[#C9833A]"
                    />
                    <button
                      type="button"
                      onClick={() => onGalleryRemove(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#2A1608]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[9px] bg-[#9A5A17] text-white px-1 py-0.5 rounded font-bold">
                      NEW
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <label className="cursor-pointer inline-block">
            <input
              hidden
              type="file"
              accept="image/*"
              multiple
              onChange={onGalleryPick}
            />
            <span className="h-9 px-4 rounded-xl border border-dashed border-[#C9833A] bg-[#FFF8F0] text-[#7A4816] text-sm font-medium flex items-center gap-2 hover:bg-[#FFEDD5] transition-colors cursor-pointer w-fit">
              <UploadCloud className="w-4 h-4" /> Add Photos
            </span>
          </label>
        </div>

        {/* DOCS */}
        <Divider icon={FileText} label="Verification Documents" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "ownerCnic", label: "Owner CNIC" },
            { key: "businessLicense", label: "Business License" },
            { key: "ownershipProof", label: "Ownership Proof" },
            { key: "utilityBill", label: "Utility Bill" },
          ].map(({ key, label }) => (
            <DocUploadCard
              key={key}
              label={label}
              existingDoc={existingDocs?.find((d) => d.type === key)}
              newFile={docFiles?.[key]}
              onPick={onDocPick(key)}
            />
          ))}
        </div>
      </>
    </div>
  );
}

/* ── Doc Upload Card ── */
function DocUploadCard({ label, existingDoc, newFile, onPick }) {
  return (
    <div className="rounded-[18px] border border-[#E5DACE] bg-[#F8F2EA] p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#1B120D]">{label}</p>
          {existingDoc ? (
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <DocStatusBadge status={existingDoc.status} />
              <a
                href={existingDoc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#9A5A17] hover:underline flex items-center gap-0.5"
              >
                <Eye className="w-3 h-3" /> View
              </a>
            </div>
          ) : (
            <p className="text-[11px] text-[#9A8070] mt-0.5">
              Not uploaded yet
            </p>
          )}
        </div>
        {newFile && (
          <span className="text-[9px] bg-[#9A5A17] text-white px-2 py-0.5 rounded-full font-bold flex-shrink-0">
            NEW
          </span>
        )}
      </div>
      {newFile && (
        <p className="text-[11px] text-[#4A8A3F] font-medium mb-2 flex items-center gap-1 truncate">
          <Check className="w-3 h-3 flex-shrink-0" />
          {newFile.name}
        </p>
      )}
      <label className="cursor-pointer">
        <input hidden type="file" accept="image/*,.pdf" onChange={onPick} />
        <span className="h-8 px-3 rounded-xl border border-[#D9CDBF] bg-white text-[#7A4816] text-xs font-medium flex items-center gap-1.5 hover:bg-[#F8F0E4] transition-colors cursor-pointer w-fit">
          <UploadCloud className="w-3.5 h-3.5" />
          {newFile ? "Change File" : existingDoc ? "Replace" : "Upload"}
        </span>
      </label>
    </div>
  );
}

/* =========================================================
   SMALL HELPERS
========================================================= */
function Divider({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <div className="w-7 h-7 rounded-lg bg-[#F1E3D1] flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#8A4F18]" />
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6E635B]">
        {label}
      </p>
      <div className="flex-1 h-px bg-[#E9DED1]" />
    </div>
  );
}
function TwoCol({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
  );
}
function ThreeCol({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{children}</div>
  );
}
function FL({ label, changed, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-[10px] uppercase tracking-[0.18em] text-[#746960]">
          {label}
        </Label>
        {changed && (
          <span className="text-[9px] bg-[#C9833A] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
            Changed
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
function DetailCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-[#FBF9F6] rounded-[24px] border border-[#E9DED1] p-5 space-y-3">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-[#F1E3D1] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#8A4F18]" />
        </div>
        <h2 className="text-[16px] font-bold text-[#17120D]">{title}</h2>
      </div>
      {children}
    </div>
  );
}
function InfoRow({ label, value, multiline }) {
  const finalValue =
    value === null || value === undefined || value === "" ? "—" : value;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#7B6F65] mb-0.5">
        {label}
      </p>
      <p
        className={`text-[14px] font-medium text-[#1B120D] ${multiline ? "whitespace-pre-wrap leading-relaxed" : ""}`}
      >
        {String(finalValue)}
      </p>
    </div>
  );
}
function SectionBox({ title, icon: Icon, children }) {
  return (
    <div className="bg-[#FBF9F6] rounded-[24px] border border-[#E9DED1] p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F1E3D1] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#8A4F18]" />
        </div>
        <h2 className="text-[16px] font-bold text-[#17120D]">{title}</h2>
      </div>
      {children}
    </div>
  );
}
function StatusBanner({ color, icon: Icon, title, message }) {
  const s = {
    amber: "bg-[#FFFBF0] border-[#F5D87A] text-[#7A5C00]",
    orange: "bg-[#FFF7F0] border-[#F5A970] text-[#7A3500]",
    red: "bg-[#FFF5F5] border-[#F5A0A0] text-[#7A0000]",
    green: "bg-[#F0FFF6] border-[#7AD5A0] text-[#005A2B]",
  };
  return (
    <div className={`rounded-[22px] border p-4 ${s[color]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div>
          <p className="font-bold text-[15px]">{title}</p>
          <div className="text-[13px] mt-0.5 opacity-90">{message}</div>
        </div>
      </div>
    </div>
  );
}
function StatusPill({ status }) {
  const s = {
    approved: "bg-[#E6F7EE] text-[#1A7A45] border border-[#A8E6C2]",
    pending: "bg-[#FFF8E6] text-[#7A5C00] border border-[#F5D87A]",
    rejected: "bg-[#FFF0F0] text-[#7A0000] border border-[#F5A0A0]",
    changes_requested: "bg-[#FFF3E6] text-[#7A3500] border border-[#F5C080]",
    draft: "bg-[#F0EDE8] text-[#5A5048] border border-[#D9CDBF]",
  };
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${s[status] ?? s.draft}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
}
function DocStatusBadge({ status }) {
  const s = {
    approved: "bg-[#E6F7EE] text-[#1A7A45]",
    rejected: "bg-[#FFF0F0] text-[#7A0000]",
    pending: "bg-[#FFF8E6] text-[#7A5C00]",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s[status] ?? s.pending}`}
    >
      {status}
    </span>
  );
}
