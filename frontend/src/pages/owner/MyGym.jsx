import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
} from "lucide-react";

import OwnerLayout from "@/components/layouts/OwnerLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function MyGym() {
  const { token } = useAuth();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGym();
  }, [token]);

  const fetchGym = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/owners/my-gyms`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch gym");

      const data = await res.json();

      // ✅ BACKEND RETURNS ARRAY
      const myGym = data.gyms?.[0] || null;
      setGym(myGym);
    } catch (err) {
      console.error("Fetch gym error:", err);
      setGym(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <OwnerLayout>
        <p className="text-muted-foreground">Loading gym details...</p>
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

  // ✅ NORMALIZE STATUS
  const status = gym.status?.toLowerCase();

  const isApproved = status === "approved";
  const isPending = status === "pending";
  const isRejected = status === "rejected";

  return (
    <OwnerLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">My Gym</h1>
            <p className="text-muted-foreground">
              View and manage your gym details
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isApproved
                ? "bg-primary/10 text-primary"
                : isRejected
                ? "bg-destructive/10 text-destructive"
                : "bg-accent/10 text-accent"
            }`}
          >
            {isApproved && <CheckCircle2 className="w-4 h-4" />}
            {isPending && <Hourglass className="w-4 h-4" />}
            {isRejected && <AlertTriangle className="w-4 h-4" />}

            {isApproved && "Active"}
            {isPending && "Pending Approval"}
            {isRejected && "Rejected"}
          </span>
        </div>

        {/* STATUS BANNER */}
        <div
          className={`rounded-2xl p-5 border ${
            isApproved
              ? "bg-primary/10 border-primary text-primary"
              : isRejected
              ? "bg-destructive/10 border-destructive text-destructive"
              : "bg-accent/10 border-accent text-accent"
          }`}
        >
          <div className="flex items-start gap-3">
            {isApproved && <CheckCircle2 className="w-6 h-6 mt-1" />}
            {isPending && <Hourglass className="w-6 h-6 mt-1" />}
            {isRejected && <AlertTriangle className="w-6 h-6 mt-1" />}

            <div>
              <h3 className="font-semibold text-lg">
                {isApproved && "Gym Approved"}
                {isPending && "Approval Pending"}
                {isRejected && "Gym Rejected"}
              </h3>

              <p className="text-sm opacity-90">
                {isApproved && "Your gym has been approved and is now live."}
                {isPending && "Your gym is under admin review."}
                {isRejected && "Your gym was rejected. Please update details."}
              </p>

              {isRejected && gym.rejectionReason && (
                <p className="mt-2 text-sm font-medium">
                  Reason: {gym.rejectionReason}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card icon={Building2} title="Basic Information">
            <Info label="Gym Name" value={gym.name} />

            <div>
              <p className="text-sm text-muted-foreground mb-1">Address</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <p>{gym.addressLine || gym.address}</p>
              </div>
            </div>

            <Info label="City" value={gym.city} />

            <div className="grid grid-cols-2 gap-4">
              <Info label="Latitude" value={gym.latitude} />
              <Info label="Longitude" value={gym.longitude} />
            </div>
          </Card>

          {/* OPERATING HOURS */}
          <Card icon={Clock} title="Operating Hours">
            <div className="space-y-3">
              {Object.entries(gym.operatingHours || {}).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="font-medium">{day}</span>
                  <span className="text-muted-foreground">{hours}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </OwnerLayout>
  );
}

/* ---------- UI HELPERS ---------- */

function Card({ icon: Icon, title, children }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
