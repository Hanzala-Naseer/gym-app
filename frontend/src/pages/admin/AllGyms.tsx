import { useState } from 'react';
import { Building2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/layouts/AdminLayout';

const mockGyms = [
  { id: 1, name: 'FitZone Downtown', owner: 'John Doe', status: 'APPROVED', members: 156, address: '123 Main St' },
  { id: 2, name: 'PowerLift Gym', owner: 'Jane Smith', status: 'PENDING', members: 0, address: '456 Muscle Ave' },
  { id: 3, name: 'CrossFit Central', owner: 'Mike Wilson', status: 'APPROVED', members: 89, address: '789 Box Lane' },
  { id: 4, name: 'Yoga Haven', owner: 'Sarah Lee', status: 'PENDING', members: 0, address: '321 Zen Street' },
  { id: 5, name: 'Iron Paradise', owner: 'Tom Hardy', status: 'APPROVED', members: 234, address: '555 Pump Road' },
  { id: 6, name: 'FlexFit Studio', owner: 'Emily Clark', status: 'APPROVED', members: 67, address: '888 Stretch Blvd' },
];

export default function AllGyms() {
  const [search, setSearch] = useState('');

  const filteredGyms = mockGyms.filter(gym =>
    gym.name.toLowerCase().includes(search.toLowerCase()) ||
    gym.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">All Gyms</h1>
            <p className="text-muted-foreground">View all registered gyms on GymKey.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary">
            <Building2 className="w-5 h-5" />
            <span className="font-semibold">{mockGyms.length} Total</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search gyms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Gyms Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Gym</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Owner</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Address</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Members</th>
                </tr>
              </thead>
              <tbody>
                {filteredGyms.map((gym) => (
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
                    <td className="p-4 text-muted-foreground">{gym.address}</td>
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
