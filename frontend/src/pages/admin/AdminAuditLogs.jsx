// pages/admin/AdminAuditLogs.jsx
import { useEffect, useState } from "react";
import {
  Loader2,
  ScrollText,
  Filter,
  Calendar,
  User,
  Shield,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Download,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function AdminAuditLogs() {
  const { toast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAuditLogs({ limit: 100 });
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      toast({
        title: "Failed to load audit logs",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAuditLogs({
        ...filters,
        limit: 100,
      });
      setLogs(data.logs || []);
    } catch (err) {
      toast({ title: "Failed to apply filters", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "PROCESSED_PAYOUT":
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case "VERIFIED_PAYOUT_ACCOUNT":
        return <Shield className="w-4 h-4 text-blue-600" />;
      case "UPDATED_PAYOUT_RATE":
        return <ScrollText className="w-4 h-4 text-purple-600" />;
      case "APPROVED_GYM":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "REJECTED_GYM":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <ScrollText className="w-4 h-4 text-[#7A6A5D]" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "PROCESSED_PAYOUT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "VERIFIED_PAYOUT_ACCOUNT":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "UPDATED_PAYOUT_RATE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "APPROVED_GYM":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED_GYM":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-[#F5EFE8] text-[#5B3A29] border-[#E9DED3]";
    }
  };

  const formatActionLabel = (action) => {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const exportLogs = () => {
    const csv = [
      ["Date", "Admin", "Action", "Entity Type", "Entity ID", "Details"].join(
        ",",
      ),
      ...logs.map((log) =>
        [
          new Date(log.createdAt).toISOString(),
          log.admin?.name || log.admin?.email || "System",
          log.action,
          log.entityType,
          log.entityId,
          JSON.stringify(log.metadata || {}).replace(/,/g, ";"),
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout active="audit-logs">
      <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A1608] flex items-center justify-center">
                <ScrollText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2B160B]">
                  Audit Logs
                </h1>
                <p className="text-sm text-[#7A6A5D]">
                  Track all admin actions and system events
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                  showFilters
                    ? "bg-[#2A1608] text-white border-[#2A1608]"
                    : "border-[#D8C9BA] bg-white text-[#2B160B] hover:bg-[#F9F5F1]"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={exportLogs}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D8C9BA] bg-white text-sm text-[#2B160B] hover:bg-[#F9F5F1] transition"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="rounded-[24px] bg-white border border-[#E9DED3] p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1.5">
                    Action
                  </label>
                  <select
                    value={filters.action}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, action: e.target.value }))
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#D9CDBF] bg-white text-sm text-[#2B160B] outline-none focus:border-[#9A5A17]"
                  >
                    <option value="">All Actions</option>
                    <option value="PROCESSED_PAYOUT">Processed Payout</option>
                    <option value="VERIFIED_PAYOUT_ACCOUNT">
                      Verified Account
                    </option>
                    <option value="UPDATED_PAYOUT_RATE">Updated Rate</option>
                    <option value="APPROVED_GYM">Approved Gym</option>
                    <option value="REJECTED_GYM">Rejected Gym</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1.5">
                    Entity Type
                  </label>
                  <select
                    value={filters.entityType}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, entityType: e.target.value }))
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#D9CDBF] bg-white text-sm text-[#2B160B] outline-none focus:border-[#9A5A17]"
                  >
                    <option value="">All Types</option>
                    <option value="Gym">Gym</option>
                    <option value="GymPayoutAccount">Payout Account</option>
                    <option value="PayoutRate">Payout Rate</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1.5">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, startDate: e.target.value }))
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#D9CDBF] bg-white text-sm text-[#2B160B] outline-none focus:border-[#9A5A17]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#7A6A5D] uppercase font-semibold block mb-1.5">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, endDate: e.target.value }))
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#D9CDBF] bg-white text-sm text-[#2B160B] outline-none focus:border-[#9A5A17]"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={applyFilters}
                  className="h-10 px-6 rounded-xl bg-[#2A1608] text-white text-sm font-medium hover:bg-[#1C0F06] transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      action: "",
                      entityType: "",
                      startDate: "",
                      endDate: "",
                    });
                    fetchLogs();
                  }}
                  className="h-10 px-6 rounded-xl border border-[#D9CDBF] bg-white text-sm font-medium text-[#6B625A] hover:bg-[#F5F0E8] transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Logs Table */}
          <div className="rounded-[24px] bg-white border border-[#E9DED3] overflow-hidden">
            <div className="p-6 border-b border-[#E9DED3]">
              <h2 className="text-lg font-bold text-[#2B160B]">Activity Log</h2>
              <p className="text-sm text-[#7A6A5D] mt-1">
                {logs.length} records found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FCFAF8]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase">
                      Admin
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase">
                      Entity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B625A] uppercase">
                      Details
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B625A] uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DED3]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FCFAF8] transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getActionColor(log.action)}`}
                          >
                            {getActionIcon(log.action)}
                          </div>
                          <span className="text-sm font-medium text-[#2B160B]">
                            {formatActionLabel(log.action)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#8A7B70]" />
                          <span className="text-sm text-[#6B625A]">
                            {log.admin?.name || log.admin?.email || "System"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#F5EFE8] text-[#5B3A29] font-medium">
                          {log.entityType}
                        </span>
                        <p className="text-xs text-[#8A7B70] mt-1 font-mono">
                          {log.entityId?.slice(0, 12)}…
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <MetadataDisplay metadata={log.metadata} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs text-[#8A7B70]">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <p className="text-xs text-[#8A7B70] mt-0.5">
                          {new Date(log.createdAt).toLocaleTimeString("en-PK", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                    </tr>
                  ))}

                  {logs.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <ScrollText className="w-12 h-12 text-[#D9CDBF] mx-auto mb-3" />
                        <p className="text-sm text-[#7A6A5D]">
                          No audit logs found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {loading && (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-[#9A5A17]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Helper to display metadata nicely
function MetadataDisplay({ metadata }) {
  if (!metadata) return <span className="text-xs text-[#8A7B70]">—</span>;

  const keyLabels = {
    checkInsPaid: "Check-ins",
    totalGymPKR: "Amount",
    payoutMethod: "Method",
    gymName: "Gym",
    accountType: "Account Type",
    memberTierSlug: "Tier",
    gymTier: "Gym Tier",
    gymGets: "Gym Gets",
    platformKeeps: "Platform Keeps",
  };

  const entries = Object.entries(metadata)
    .filter(([key]) => keyLabels[key])
    .slice(0, 3);

  if (entries.length === 0) {
    return <span className="text-xs text-[#8A7B70]">—</span>;
  }

  return (
    <div className="space-y-1">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-1.5 text-xs">
          <span className="text-[#8A7B70]">{keyLabels[key] || key}:</span>
          <span className="text-[#2B160B] font-medium truncate max-w-[150px]">
            {typeof value === "number" ? value.toLocaleString() : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}
