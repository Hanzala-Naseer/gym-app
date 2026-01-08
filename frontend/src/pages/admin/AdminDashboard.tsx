import { Building2, Users, QrCode, Clock } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

const stats = [
  { label: 'Total Gyms', value: '48', icon: Building2, color: 'gradient-hero' },
  { label: 'Pending Approvals', value: '5', icon: Clock, color: 'gradient-accent' },
  { label: 'Total Members', value: '2,847', icon: Users, color: 'gradient-hero' },
  { label: "Today's Check-ins", value: '342', icon: QrCode, color: 'gradient-accent' },
];

const recentGyms = [
  { id: 1, name: 'FitZone Downtown', owner: 'John Doe', status: 'APPROVED', members: 156 },
  { id: 2, name: 'PowerLift Gym', owner: 'Jane Smith', status: 'PENDING', members: 0 },
  { id: 3, name: 'CrossFit Central', owner: 'Mike Wilson', status: 'APPROVED', members: 89 },
  { id: 4, name: 'Yoga Haven', owner: 'Sarah Lee', status: 'PENDING', members: 0 },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of all gyms and members on GymKey.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-2xl p-6 shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Gyms */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Gyms</h2>
            <p className="text-muted-foreground text-sm">Latest gym registrations</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Gym Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Owner</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Members</th>
                </tr>
              </thead>
              <tbody>
                {recentGyms.map((gym) => (
                  <tr key={gym.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{gym.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{gym.owner}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        gym.status === 'APPROVED'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {gym.status}
                      </span>
                    </td>
                    <td className="p-4 text-foreground font-medium">{gym.members}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
