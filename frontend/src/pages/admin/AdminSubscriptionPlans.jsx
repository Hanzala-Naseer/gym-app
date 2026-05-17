import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Check,
  Star,
  CreditCard,
  Loader2,
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
    isFeatured: false,
  };
  const emptyPriceForm = {
    interval: "month",
    priceCents: "",
    currency: "pkr",
  };

  const [tierForm, setTierForm] = useState(emptyTierForm);
  const [priceForm, setPriceForm] = useState(emptyPriceForm);

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

  const handleCreateTier = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await adminService.createSubscriptionTier({
        ...tierForm,
        accessTier: parseInt(tierForm.accessTier),
      });
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
      await adminService.updateSubscriptionTier(editingTier.id, {
        name: tierForm.name,
        description: tierForm.description,
        accessTier: parseInt(tierForm.accessTier),
        isFeatured: tierForm.isFeatured,
      });
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

  const openEditTier = (tier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      slug: tier.slug,
      description: tier.description || "",
      accessTier: String(tier.accessTier),
      isFeatured: tier.isFeatured,
    });
    setShowTierForm(true);
  };

  const openAddPrice = (tier) => {
    setSelectedTierForPrice(tier);
    setShowPriceForm(true);
  };

  const tierColors = {
    1: { bg: "bg-slate-100", text: "text-slate-600", star: "text-slate-400" },
    2: { bg: "bg-blue-100", text: "text-blue-600", star: "text-blue-400" },
    3: { bg: "bg-amber-100", text: "text-amber-600", star: "text-amber-400" },
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
                    Manage tiers and Stripe-synced pricing
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
                return (
                  <div
                    key={tier.id}
                    className="rounded-[24px] bg-white border border-[#E9DED3] overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}
                          >
                            <Star className={`w-6 h-6 ${colors.star}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl font-bold text-[#2B160B]">
                                {tier.name}
                              </h3>
                              <span
                                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}
                              >
                                Tier {tier.accessTier}
                              </span>
                              {tier.isFeatured && (
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-600">
                                  Featured
                                </span>
                              )}
                              {!tier.isActive && (
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-red-100 text-red-600">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-[#7A6A5D]">
                              {tier.description || "No description"}
                            </p>
                            <p className="mt-1 text-xs text-[#8A7B70] font-mono">
                              slug: {tier.slug}
                            </p>
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
                        </div>
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="border-t border-[#E9DED3] bg-[#FCFAF8] p-6">
                      <h4 className="text-xs font-semibold text-[#6B625A] uppercase tracking-wider mb-4">
                        Active Prices
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
                                  className={`w-1.5 h-1.5 rounded-full ${price.isActive ? "bg-emerald-400" : "bg-red-400"}`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#2B160B]">
              {editingTier ? "Edit Tier" : "Create New Tier"}
            </h2>
            <form
              onSubmit={editingTier ? handleUpdateTier : handleCreateTier}
              className="mt-5 space-y-4"
            >
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
                <div className="flex items-end">
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
                    <span className="text-sm text-[#4A3F38]">
                      Featured tier
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTierForm(false)}
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
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
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
