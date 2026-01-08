import { useState } from 'react';
import { Building2, CheckCircle, XCircle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layouts/AdminLayout';

const mockPendingGyms = [
  { 
    id: '1', 
    name: 'PowerLift Gym', 
    owner: 'Jane Smith', 
    email: 'jane@example.com',
    address: '456 Muscle Ave, Fitness City',
    planType: 'Pro',
    submittedAt: '2024-01-15'
  },
  { 
    id: '2', 
    name: 'Yoga Haven', 
    owner: 'Sarah Lee',
    email: 'sarah@example.com',
    address: '789 Zen Street, Peaceful Town',
    planType: 'Standard',
    submittedAt: '2024-01-14'
  },
  { 
    id: '3', 
    name: 'CrossFit Elite', 
    owner: 'Tom Hardy',
    email: 'tom@example.com',
    address: '321 Box Lane, Training District',
    planType: 'Pro',
    submittedAt: '2024-01-13'
  },
];

export default function PendingGyms() {
  const [gyms, setGyms] = useState(mockPendingGyms);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApprove = async (gymId: string) => {
    setLoadingId(gymId);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGyms(gyms.filter(g => g.id !== gymId));
      toast({
        title: 'Gym Approved',
        description: 'The gym has been approved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve gym.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (gymId: string) => {
    setLoadingId(gymId);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGyms(gyms.filter(g => g.id !== gymId));
      toast({
        title: 'Gym Rejected',
        description: 'The gym registration has been rejected.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject gym.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Pending Gyms</h1>
            <p className="text-muted-foreground">Review and approve gym registrations.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{gyms.length} Pending</span>
          </div>
        </div>

        {gyms.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 shadow-card text-center">
            <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending gym registrations to review.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {gyms.map((gym) => (
              <div key={gym.id} className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{gym.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Owner: {gym.owner}</span>
                        <span>Email: {gym.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{gym.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {gym.planType}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Submitted: {gym.submittedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 lg:flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(gym.id)}
                      disabled={loadingId === gym.id}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(gym.id)}
                      disabled={loadingId === gym.id}
                      className="gradient-hero text-primary-foreground"
                    >
                      {loadingId === gym.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
