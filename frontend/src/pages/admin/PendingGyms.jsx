// import { useState } from 'react';
// import { Building2, CheckCircle, XCircle, MapPin, Clock } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import AdminLayout from '@/components/layouts/AdminLayout';

// const mockPendingGyms = [
//   { id: '1', name: 'PowerLift Gym', owner: 'Jane Smith', email: 'jane@example.com', address: '456 Muscle Ave', planType: 'Pro', submittedAt: '2024-01-15' },
//   { id: '2', name: 'Yoga Haven', owner: 'Sarah Lee', email: 'sarah@example.com', address: '789 Zen Street', planType: 'Standard', submittedAt: '2024-01-14' },
// ];

// export default function PendingGyms() {
//   const [gyms, setGyms] = useState(mockPendingGyms);
//   const [loadingId, setLoadingId] = useState(null);
//   const { toast } = useToast();

//   const handleApprove = async (gymId) => {
//     setLoadingId(gymId);
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     setGyms(gyms.filter(g => g.id !== gymId));
//     toast({ title: 'Gym Approved', description: 'The gym has been approved successfully.' });
//     setLoadingId(null);
//   };

//   const handleReject = async (gymId) => {
//     setLoadingId(gymId);
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     setGyms(gyms.filter(g => g.id !== gymId));
//     toast({ title: 'Gym Rejected', description: 'The gym registration has been rejected.' });
//     setLoadingId(null);
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Pending Gyms</h1>
//             <p className="text-muted-foreground">Review and approve gym registrations.</p>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent">
//             <Clock className="w-5 h-5" />
//             <span className="font-semibold">{gyms.length} Pending</span>
//           </div>
//         </div>
//         {gyms.length === 0 ? (
//           <div className="bg-card rounded-2xl p-12 shadow-card text-center">
//             <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-foreground">All caught up!</h3>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {gyms.map((gym) => (
//               <div key={gym.id} className="bg-card rounded-2xl p-6 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center"><Building2 className="w-7 h-7 text-primary-foreground" /></div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-foreground">{gym.name}</h3>
//                     <p className="text-sm text-muted-foreground">Owner: {gym.owner} | {gym.email}</p>
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" />{gym.address}</div>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <Button variant="outline" onClick={() => handleReject(gym.id)} disabled={loadingId === gym.id} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"><XCircle className="w-4 h-4 mr-2" />Reject</Button>
//                   <Button onClick={() => handleApprove(gym.id)} disabled={loadingId === gym.id} className="gradient-hero text-primary-foreground"><CheckCircle className="w-4 h-4 mr-2" />Approve</Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
import { useEffect, useState } from "react";
import { Building2, CheckCircle, XCircle, MapPin, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function PendingGyms() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [gyms, setGyms] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch Pending Gyms ----------------
  useEffect(() => {
    fetchPendingGyms();
  }, []);

  const fetchPendingGyms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/gyms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const pendingOnly = data.gyms.filter((g) => g.status === "pending");

      setGyms(pendingOnly);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Approve Gym ----------------
  const handleApprove = async (gymId) => {
    try {
      setLoadingId(gymId);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/gyms/${gymId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setGyms((prev) => prev.filter((g) => g.id !== gymId));
      toast({
        title: "Gym Approved",
        description: "The gym has been approved successfully.",
      });
    } catch (err) {
      toast({
        title: "Approval failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // ---------------- Reject Gym ----------------
  const handleReject = async (gymId) => {
    try {
      setLoadingId(gymId);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/gyms/${gymId}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setGyms((prev) => prev.filter((g) => g.id !== gymId));
      toast({
        title: "Gym Rejected",
        description: "The gym registration has been rejected.",
      });
    } catch (err) {
      toast({
        title: "Rejection failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Pending Gyms</h1>
            <p className="text-muted-foreground">
              Review and approve gym registrations.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{gyms.length} Pending</span>
          </div>
        </div>

        {/* Empty State */}
        {!loading && gyms.length === 0 && (
          <div className="bg-card rounded-2xl p-12 shadow-card text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold">All caught up!</h3>
          </div>
        )}

        {/* List */}
        <div className="grid gap-6">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="bg-card rounded-2xl p-6 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-primary-foreground" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{gym.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Owner: {gym.owner?.name} | {gym.owner?.email}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {gym.addressLine}, {gym.city}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleReject(gym.id)}
                  disabled={loadingId === gym.id}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>

                <Button
                  className="gradient-hero text-primary-foreground"
                  onClick={() => handleApprove(gym.id)}
                  disabled={loadingId === gym.id}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
