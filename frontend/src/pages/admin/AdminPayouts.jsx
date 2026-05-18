// src/pages/admin/AdminPayouts.jsx
import { useEffect, useState } from "react";
import {
  Loader2,
  DollarSign,
  Building2,
  Calendar,
  CheckCircle,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function AdminPayouts() {
  const { toast } = useToast();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllGymsPayoutOverview();
      setOverview(data);
    } catch (err) {
      toast({ title: "Failed to load payouts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayout = async (gymId) => {
    try {
      await adminService.processPayout(gymId, { payoutMethod: "manual" });
      toast({ title: "Payout processed successfully" });
      fetchOverview();
    } catch (err) {
      toast({ title: "Failed to process payout", variant: "destructive" });
    }
  };

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
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2B160B]">Payouts</h1>
              <p className="text-sm text-[#7A6A5D]">
                Total payable: PKR{" "}
                {overview?.summary?.netPayablePKR?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
              <p className="text-xs text-[#7A6A5D] uppercase">Total Gyms</p>
              <p className="text-3xl font-bold text-[#2B160B] mt-1">
                {overview?.summary?.totalGyms || 0}
              </p>
            </div>
            <div className="rounded-[24px] bg-white border border-[#E9DED3] p-6">
              <p className="text-xs text-[#7A6A5D] uppercase">
                Total Paid (PKR)
              </p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {overview?.summary?.totalPaidPKR?.toLocaleString() || 0}
              </p>
            </div>
            <div className="rounded-[24px] bg-white border border-red-200 p-6">
              <p className="text-xs text-red-600 uppercase">
                Total Unpaid (PKR)
              </p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {overview?.summary?.totalUnpaidPKR?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Gyms Table */}
          <div className="rounded-[24px] bg-white border border-[#E9DED3] overflow-hidden">
            <div className="p-6 border-b border-[#E9DED3]">
              <h2 className="text-lg font-bold text-[#2B160B]">Gym Payouts</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FCFAF8]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase">
                      Gym
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
                      Unpaid Visits
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
                      Unpaid (PKR)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
                      Paid (PKR)
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B625A] uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DED3]">
                  {overview?.gyms?.map((gym) => (
                    <tr key={gym.gymId} className="hover:bg-[#FCFAF8]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#8A7B70]" />
                          <div>
                            <p className="text-sm font-medium text-[#2B160B]">
                              {gym.gymName}
                            </p>
                            <p className="text-xs text-[#8A7B70]">
                              {gym.gymTier}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B625A]">
                        {gym.owner?.name || "No owner"}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-red-600">
                        {gym.unpaidVisits}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-[#2B160B]">
                        {gym.unpaidAmountPKR.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-emerald-600">
                        {gym.paidAmountPKR.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {gym.unpaidVisits > 0 ? (
                          <button
                            onClick={() => handleProcessPayout(gym.gymId)}
                            className="h-8 px-3 rounded-lg bg-[#2A1608] text-white text-xs font-medium hover:bg-[#1C0F06] transition-colors"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
