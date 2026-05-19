import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Building2,
  Users,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  Activity,
  ShieldCheck,
  DollarSign,
  Landmark,
  Loader2,
} from "lucide-react";

import {
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-PK", { maximumFractionDigits: 0 })
    : "—";

const fmtPKR = (n) =>
  typeof n === "number"
    ? `PKR ${n.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`
    : "PKR —";

/**
 * Build chart data from payout overview — now includes real platform earnings per gym
 */
const buildMonthlyRevenue = (payoutOverview) => {
  if (!payoutOverview?.gyms) return [];
  return payoutOverview.gyms
    .slice()
    .sort((a, b) => b.unpaidAmountPKR - a.unpaidAmountPKR)
    .slice(0, 8)
    .map((g) => ({
      name: g.gymName.length > 14 ? g.gymName.slice(0, 12) + "…" : g.gymName,
      gymPKR: g.paidAmountPKR,
      platformPKR: g.paidPlatformAmountPKR ?? 0, // ← REAL data from backend
      unpaidPKR: g.unpaidAmountPKR,
    }));
};

// ─────────────────────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────────────────────

function KPI({ label, value, sub, icon: Icon, accent, loading }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#3B2417] bg-[#24160F] p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B2417]/40 to-transparent" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm text-[#CBB7A7]">{label}</p>
          {loading ? (
            <div className="mt-3 h-8 w-28 animate-pulse rounded-lg bg-white/10" />
          ) : (
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
              {value}
            </h3>
          )}
          {sub && (
            <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
              <ArrowUpRight className="h-3 w-3" />
              {sub}
            </div>
          )}
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: accent }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
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
    draft: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
    changes_requested:
      "bg-purple-500/10 text-purple-300 border border-purple-500/20",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
        styles[status] || "bg-muted"
      }`}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER BADGE
// ─────────────────────────────────────────────────────────────────────────────

function TierBadge({ tier }) {
  const colors = {
    BASIC: "bg-[#F5EFE8] text-[#5B3A29]",
    ULTIMATE: "bg-purple-100 text-purple-700",
    ELITE: "bg-amber-100 text-amber-700",
  };
  return (
    <div
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        colors[tier] || "bg-muted"
      }`}
    >
      {tier || "—"}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E7DDD3] bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-[#2B160B] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {fmtPKR(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { toast } = useToast();

  // ── state ──────────────────────────────────────────────────────────────────
  const [analytics, setAnalytics] = useState(null);
  const [recentGyms, setRecentGyms] = useState([]);
  const [payoutOverview, setPayoutOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [payoutRates, setPayoutRates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ── derived platform earnings ──────────────────────────────────────────────
  /**
   * Platform earnings — exact from backend, no estimates
   * Source priority:
   *   1. analytics.revenue.platformEarnings (from getDashboardAnalytics)
   *   2. payoutOverview.summary.totalPaidPlatformPKR (from getAllGymsPayoutOverview)
   *   3. null if neither available
   */
  const platformEarnings = useMemo(() => {
    if (analytics?.revenue?.platformEarnings != null)
      return analytics.revenue.platformEarnings;
    if (payoutOverview?.summary?.totalPaidPlatformPKR != null)
      return payoutOverview.summary.totalPaidPlatformPKR;
    return null;
  }, [analytics, payoutOverview]);

  /**
   * Total gym payouts (paid so far, across all gyms)
   */
  const totalGymPayouts = useMemo(() => {
    if (!payoutOverview?.gyms) return null;
    return payoutOverview.gyms.reduce((s, g) => s + g.paidAmountPKR, 0);
  }, [payoutOverview]);

  /**
   * Total unpaid liability (gym side)
   */
  const totalUnpaid = useMemo(() => {
    return payoutOverview?.summary?.totalUnpaidPKR ?? null;
  }, [payoutOverview]);

  /**
   * Total unpaid platform liability
   */
  const totalUnpaidPlatform = useMemo(() => {
    return payoutOverview?.summary?.totalUnpaidPlatformPKR ?? null;
  }, [payoutOverview]);

  // ── load ───────────────────────────────────────────────────────────────────
  const loadDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const [analyticsRes, gymsRes, overviewRes, logsRes, ratesRes] =
          await Promise.allSettled([
            adminService.getAnalytics(),
            adminService.getAllGyms({ page: 1, limit: 6 }),
            adminService.getAllGymsPayoutOverview(),
            adminService.getPayoutAuditLogs(),
            adminService.getPayoutRates?.() ?? Promise.resolve(null),
          ]);

        if (
          analyticsRes.status === "fulfilled" &&
          analyticsRes.value?.success
        ) {
          setAnalytics(analyticsRes.value.analytics);
        }

        if (gymsRes.status === "fulfilled" && gymsRes.value?.success) {
          setRecentGyms(gymsRes.value.gyms || []);
        }

        if (overviewRes.status === "fulfilled" && overviewRes.value?.success) {
          setPayoutOverview(overviewRes.value);
        }

        if (logsRes.status === "fulfilled" && logsRes.value?.success) {
          setAuditLogs(logsRes.value.logs?.slice(0, 5) || []);
        }

        if (ratesRes.status === "fulfilled" && ratesRes.value?.success) {
          setPayoutRates(ratesRes.value.rates || []);
        }
      } catch (err) {
        toast({
          title: "Dashboard Error",
          description: "Unable to load latest analytics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ── chart data ─────────────────────────────────────────────────────────────
  const gymPayoutChartData = useMemo(
    () => buildMonthlyRevenue(payoutOverview),
    [payoutOverview],
  );

  const PIE_COLORS = ["#5B3A29", "#8B5E46", "#D1A77C", "#F5D0A9"];

  // ── gym tier breakdown from overview ──────────────────────────────────────
  const gymTierData = useMemo(() => {
    if (!payoutOverview?.gyms) return [];
    const counts = { BASIC: 0, ULTIMATE: 0, ELITE: 0 };
    payoutOverview.gyms.forEach((g) => {
      counts[g.gymTier] = (counts[g.gymTier] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [payoutOverview]);

  // ── subscription breakdown from analytics ─────────────────────────────────
  const subscriptionBreakdown = useMemo(() => {
    return analytics?.subscriptions?.breakdown ?? [];
  }, [analytics]);

  // ── safe values ────────────────────────────────────────────────────────────
  const totalGyms =
    analytics?.gyms?.total ?? payoutOverview?.summary?.totalGyms ?? "—";
  const pendingGyms = analytics?.gyms?.pending ?? "—";
  const approvedGyms = analytics?.gyms?.approved ?? "—";
  const totalUsers = analytics?.users?.total ?? "—";
  const totalCheckins = analytics?.checkins?.total ?? "—";
  const todayCheckins = analytics?.checkins?.today ?? null;
  const totalRevenuePKR = analytics?.revenue?.totalPkr ?? null;
  const monthlyGrowth = analytics?.revenue?.monthlyGrowth ?? null;

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F6F1EB] p-6 lg:p-8">
        <div className="space-y-6">
          {/* HEADER */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#2B160B]">
                Platform Overview
              </h1>
              <p className="mt-2 text-[#7A6A5D]">
                Real-time operational analytics for GymKey SaaS
              </p>
            </div>

            <button
              onClick={() => loadDashboard(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 rounded-2xl border border-[#D8C9BA] bg-white px-5 py-3 text-sm font-medium text-[#2B160B] transition hover:bg-[#F9F5F1] disabled:opacity-50"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh Analytics
            </button>
          </div>

          {/* EXECUTIVE KPI GRID */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <KPI
              label="Total Gyms"
              value={typeof totalGyms === "number" ? fmt(totalGyms) : totalGyms}
              sub={
                approvedGyms !== "—"
                  ? `${fmt(approvedGyms)} approved`
                  : undefined
              }
              icon={Building2}
              accent="linear-gradient(135deg,#5B3A29,#8B5E46)"
              loading={loading}
            />
            <KPI
              label="Platform Users"
              value={
                typeof totalUsers === "number" ? fmt(totalUsers) : totalUsers
              }
              sub={
                analytics?.users?.members
                  ? `${fmt(analytics.users.members)} members`
                  : undefined
              }
              icon={Users}
              accent="linear-gradient(135deg,#5B2D5A,#874A82)"
              loading={loading}
            />
            <KPI
              label="Platform Revenue"
              value={totalRevenuePKR != null ? fmtPKR(totalRevenuePKR) : "—"}
              sub={
                monthlyGrowth != null
                  ? `+${monthlyGrowth}% this month`
                  : undefined
              }
              icon={TrendingUp}
              accent="linear-gradient(135deg,#1B5E4A,#2F8F73)"
              loading={loading}
            />
            <KPI
              label="Total Check-ins"
              value={
                typeof totalCheckins === "number"
                  ? fmt(totalCheckins)
                  : totalCheckins
              }
              sub={
                todayCheckins != null
                  ? `${fmt(todayCheckins)} today`
                  : undefined
              }
              icon={CalendarCheck}
              accent="linear-gradient(135deg,#7A3D16,#D17B2F)"
              loading={loading}
            />
          </div>

          {/* PAYOUT KPI GRID */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <KPI
              label="Total Gym Payouts (Paid)"
              value={totalGymPayouts != null ? fmtPKR(totalGymPayouts) : "—"}
              sub={
                payoutOverview?.gyms
                  ? `across ${payoutOverview.gyms.length} gyms`
                  : undefined
              }
              icon={Landmark}
              accent="linear-gradient(135deg,#1A3A5C,#2E6DA4)"
              loading={loading}
            />
            <KPI
              label="Unpaid Liability"
              value={totalUnpaid != null ? fmtPKR(totalUnpaid) : "—"}
              sub={
                payoutOverview?.gyms
                  ? `${payoutOverview.gyms.reduce(
                      (s, g) => s + g.unpaidVisits,
                      0,
                    )} visits pending`
                  : undefined
              }
              icon={CreditCard}
              accent="linear-gradient(135deg,#7A2417,#C04030)"
              loading={loading}
            />
            <KPI
              label="Platform Earnings (Paid)"
              value={platformEarnings != null ? fmtPKR(platformEarnings) : "—"}
              sub={
                analytics?.revenue?.platformEarnings != null
                  ? "exact from analytics"
                  : payoutOverview?.summary?.totalPaidPlatformPKR != null
                    ? "from payout overview"
                    : undefined
              }
              icon={DollarSign}
              accent="linear-gradient(135deg,#3A1B5C,#6B35A4)"
              loading={loading}
            />
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* GYM PAYOUT BAR CHART — NOW WITH 3 BARS */}
            <div className="rounded-[30px] border border-[#E7DDD3] bg-white p-6 shadow-sm xl:col-span-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#2B160B]">
                    Gym Payout Breakdown
                  </h2>
                  <p className="mt-1 text-sm text-[#7A6A5D]">
                    Gym paid vs platform earnings vs unpaid per gym (top 8 by
                    liability)
                  </p>
                </div>
                {payoutOverview?.summary && (
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    {fmt(payoutOverview.summary.totalGyms)} active gyms
                  </div>
                )}
              </div>

              {loading ? (
                <div className="h-[320px] animate-pulse rounded-2xl bg-[#F5EFE8]" />
              ) : gymPayoutChartData.length === 0 ? (
                <div className="flex h-[320px] items-center justify-center text-[#7A6A5D]">
                  No payout data available
                </div>
              ) : (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gymPayoutChartData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "#7A6A5D" }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#7A6A5D" }}
                        tickFormatter={(v) =>
                          v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="gymPKR"
                        name="Paid to Gym (PKR)"
                        fill="#5B3A29"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="platformPKR"
                        name="Platform Earnings (PKR)"
                        fill="#6B35A4"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="unpaidPKR"
                        name="Unpaid (PKR)"
                        fill="#D1A77C"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5 xl:col-span-4">
              {/* AI INSIGHTS */}
              <div className="rounded-[30px] bg-[#24160F] p-6 text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <h3 className="font-semibold">Platform Insights</h3>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-amber-300" />
                      <div>
                        <p className="text-sm font-medium">Pending reviews</p>
                        <p className="mt-1 text-xs text-[#CBB6A6]">
                          {pendingGyms !== "—"
                            ? `${fmt(pendingGyms)} gyms awaiting approval.`
                            : "No data available."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <Landmark className="mt-0.5 h-4 w-4 text-red-300" />
                      <div>
                        <p className="text-sm font-medium">
                          Unpaid gym liability
                        </p>
                        <p className="mt-1 text-xs text-[#CBB6A6]">
                          {totalUnpaid != null
                            ? `${fmtPKR(totalUnpaid)} owed to gyms.`
                            : "Loading…"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="mt-0.5 h-4 w-4 text-purple-300" />
                      <div>
                        <p className="text-sm font-medium">
                          Unpaid platform earnings
                        </p>
                        <p className="mt-1 text-xs text-[#CBB6A6]">
                          {totalUnpaidPlatform != null
                            ? `${fmtPKR(totalUnpaidPlatform)} pending platform revenue.`
                            : "Loading…"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <Activity className="mt-0.5 h-4 w-4 text-cyan-300" />
                      <div>
                        <p className="text-sm font-medium">Today's check-ins</p>
                        <p className="mt-1 text-xs text-[#CBB6A6]">
                          {todayCheckins != null
                            ? `${fmt(todayCheckins)} check-ins recorded.`
                            : "No real-time data."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GYM TIER PIE */}
              <div className="rounded-[30px] border border-[#E7DDD3] bg-white p-6">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-[#2B160B]">
                    Gym Tier Mix
                  </h3>
                  <p className="mt-1 text-sm text-[#7A6A5D]">
                    Distribution across BASIC / ULTIMATE / ELITE
                  </p>
                </div>

                {loading ? (
                  <div className="h-[200px] animate-pulse rounded-2xl bg-[#F5EFE8]" />
                ) : gymTierData.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-[#7A6A5D] text-sm">
                    No gym tier data
                  </div>
                ) : (
                  <>
                    <div className="h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={gymTierData}
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {gymTierData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={PIE_COLORS[i % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                      {gymTierData.map((d, i) => (
                        <span
                          key={d.name}
                          className="flex items-center gap-1.5 text-xs text-[#5B4A40]"
                        >
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-sm"
                            style={{
                              background: PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                          {d.name} ({d.value})
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* SUBSCRIPTION TIER BREAKDOWN — NEW */}
              {subscriptionBreakdown.length > 0 && (
                <div className="rounded-[30px] border border-[#E7DDD3] bg-white p-6">
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-[#2B160B]">
                      Active Subscriptions
                    </h3>
                    <p className="mt-1 text-sm text-[#7A6A5D]">
                      By member tier
                    </p>
                  </div>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subscriptionBreakdown}
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {subscriptionBreakdown.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {subscriptionBreakdown.map((d, i) => (
                      <span
                        key={d.name}
                        className="flex items-center gap-1.5 text-xs text-[#5B4A40]"
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-sm"
                          style={{
                            background: PIE_COLORS[i % PIE_COLORS.length],
                          }}
                        />
                        {d.name} ({d.value})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PENDING GYMS ALERT */}
          {!loading && pendingGyms !== "—" && pendingGyms > 0 && (
            <div className="flex items-start gap-3 rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-amber-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">
                  {fmt(pendingGyms)} gyms awaiting approval
                </p>
                <p className="mt-1 text-sm opacity-80">
                  Review onboarding applications to maintain platform quality.
                </p>
              </div>
            </div>
          )}

          {/* RECENT GYMS */}
          <div className="overflow-hidden rounded-[30px] border border-[#E7DDD3] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F0E8E1] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#2B160B]">
                  Recent Gym Registrations
                </h2>
                <p className="mt-1 text-sm text-[#7A6A5D]">
                  Latest platform onboarding activity
                </p>
              </div>
              <div className="rounded-full bg-[#F5EFE8] px-3 py-1 text-xs font-medium text-[#5B3A29]">
                Latest 6
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF7F4]">
                  <tr>
                    {["Gym", "Owner", "Location", "Status", "Tier"].map(
                      (head) => (
                        <th
                          key={head}
                          className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#7A6A5D]"
                        >
                          {head}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-t border-[#F4ECE5]">
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-6 py-5">
                            <div className="h-4 w-24 animate-pulse rounded bg-[#EEE6DE]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : recentGyms.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-sm text-[#7A6A5D]"
                      >
                        No gyms registered yet
                      </td>
                    </tr>
                  ) : (
                    recentGyms.map((gym) => (
                      <tr
                        key={gym.id}
                        className="border-t border-[#F4ECE5] transition hover:bg-[#FCFAF8]"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-[#2B160B]">
                              {gym.name}
                            </p>
                            <p className="mt-1 text-xs text-[#8D7E73]">
                              ID #{gym.id?.slice(0, 8)}…
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-medium text-[#2B160B]">
                              {gym.owner?.name || "—"}
                            </p>
                            <p className="mt-1 text-xs text-[#8D7E73]">
                              {gym.owner?.email || "No email"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#6D5F54]">
                          {gym.city || "—"}
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={gym.status} />
                        </td>
                        <td className="px-6 py-5">
                          <TierBadge tier={gym.gymTier} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAYOUT OVERVIEW TABLE — WITH PLATFORM COLUMNS */}
          {payoutOverview?.gyms && payoutOverview.gyms.length > 0 && (
            <div className="overflow-hidden rounded-[30px] border border-[#E7DDD3] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#F0E8E1] px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#2B160B]">
                    Payout Overview — All Gyms
                  </h2>
                  <p className="mt-1 text-sm text-[#7A6A5D]">
                    Live from{" "}
                    <code className="text-xs bg-[#F5EFE8] px-1 py-0.5 rounded">
                      /api/payout/admin/overview
                    </code>
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-[#7A6A5D]">Total unpaid (gym)</p>
                  <p className="text-lg font-bold text-red-600">
                    {fmtPKR(payoutOverview.summary?.totalUnpaidPKR ?? 0)}
                  </p>
                  <p className="text-xs text-[#7A6A5D] mt-2">
                    Platform earnings (paid)
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    {fmtPKR(payoutOverview.summary?.totalPaidPlatformPKR ?? 0)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#FAF7F4]">
                    <tr>
                      {[
                        "Gym",
                        "Tier",
                        "Owner",
                        "Paid Visits",
                        "Paid Gym",
                        "Paid Platform",
                        "Unpaid Visits",
                        "Unpaid Gym",
                        "Unpaid Platform",
                        "Total Platform",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#7A6A5D]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payoutOverview.gyms.map((gym) => (
                      <tr
                        key={gym.gymId}
                        className="border-t border-[#F4ECE5] transition hover:bg-[#FCFAF8]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-sm text-[#2B160B]">
                            {gym.gymName}
                          </p>
                          <p className="text-xs text-[#8D7E73]">
                            {gym.gymId?.slice(0, 8)}…
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <TierBadge tier={gym.gymTier} />
                        </td>
                        <td className="px-5 py-4 text-sm text-[#2B160B]">
                          <p>{gym.owner?.name || "—"}</p>
                          <p className="text-xs text-[#8D7E73]">
                            {gym.owner?.email || ""}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-emerald-700 font-medium">
                          {fmt(gym.paidVisits)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-emerald-700">
                          {fmtPKR(gym.paidAmountPKR)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-purple-700">
                          {fmtPKR(gym.paidPlatformAmountPKR ?? 0)}
                        </td>
                        <td className="px-5 py-4 text-sm text-amber-700 font-medium">
                          {fmt(gym.unpaidVisits)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-red-600">
                          {fmtPKR(gym.unpaidAmountPKR)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-purple-600">
                          {fmtPKR(gym.unpaidPlatformAmountPKR ?? 0)}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-purple-800">
                          {fmtPKR(gym.totalPlatformEarningsPKR ?? 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AUDIT LOGS */}
          {auditLogs.length > 0 && (
            <div className="overflow-hidden rounded-[30px] border border-[#E7DDD3] bg-white shadow-sm">
              <div className="border-b border-[#F0E8E1] px-6 py-5">
                <h2 className="text-lg font-semibold text-[#2B160B]">
                  Recent Payout Audit Logs
                </h2>
                <p className="mt-1 text-sm text-[#7A6A5D]">
                  Last 5 processed payouts
                </p>
              </div>
              <div className="divide-y divide-[#F4ECE5]">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#FCFAF8]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#2B160B]">
                        {log.metadata?.gymName || log.gymId?.slice(0, 8)}
                      </p>
                      <p className="text-xs text-[#8D7E73] mt-0.5">
                        By {log.admin?.name || "Admin"} ·{" "}
                        {new Date(log.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-700">
                        {fmtPKR(log.metadata?.totalGymPKR ?? 0)}
                      </p>
                      <p className="text-xs text-[#8D7E73]">
                        {fmt(log.metadata?.checkInsPaid ?? 0)} check-ins ·{" "}
                        {log.metadata?.payoutMethod || "manual"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYOUT RATES — SIMPLE PER-GYM-TIER CARDS */}
          {payoutRates.length > 0 && (
            <div className="overflow-hidden rounded-[30px] border border-[#E7DDD3] bg-white shadow-sm">
              <div className="border-b border-[#F0E8E1] px-6 py-5">
                <h2 className="text-lg font-semibold text-[#2B160B]">
                  Gym Payout Rates
                </h2>
                <p className="mt-1 text-sm text-[#7A6A5D]">
                  What each gym tier earns per member visit
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
                {payoutRates
                  .filter(
                    (r, idx, arr) =>
                      r.isActive &&
                      arr.findIndex(
                        (x) => x.gymTier === r.gymTier && x.isActive,
                      ) === idx,
                  )
                  .sort((a, b) => {
                    const order = { BASIC: 1, ULTIMATE: 2, ELITE: 3 };
                    return (order[a.gymTier] || 99) - (order[b.gymTier] || 99);
                  })
                  .map((r) => (
                    <div
                      key={r.gymTier}
                      className="rounded-2xl border border-[#E7DDD3] bg-[#FAF7F4] p-5 text-center"
                    >
                      <TierBadge tier={r.gymTier} />
                      <p className="mt-3 text-3xl font-bold text-[#2B160B]">
                        PKR {fmt(r.gymGets)}
                      </p>
                      <p className="text-xs text-[#7A6A5D] mt-1">per visit</p>
                      <div className="mt-3 pt-3 border-t border-[#E7DDD3] space-y-1">
                        <p className="text-xs text-[#7A6A5D]">
                          Platform keeps{" "}
                          <span className="font-semibold text-purple-700">
                            PKR {fmt(r.platformKeeps)}
                          </span>
                        </p>
                        <p className="text-xs text-[#7A6A5D]">
                          Total per visit{" "}
                          <span className="font-semibold text-[#2B160B]">
                            PKR {fmt(r.gymGets + r.platformKeeps)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
