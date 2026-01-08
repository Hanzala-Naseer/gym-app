import { Users, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import OwnerLayout from '@/components/layouts/OwnerLayout';

const mockMembers = [
  { id: 1, name: 'John Smith', email: 'john@example.com', joinDate: '2024-01-01', checkins: 24 },
  { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', joinDate: '2024-01-05', checkins: 18 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2024-01-08', checkins: 32 },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', joinDate: '2024-01-10', checkins: 15 },
  { id: 5, name: 'Alex Brown', email: 'alex@example.com', joinDate: '2024-01-12', checkins: 28 },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', joinDate: '2024-01-14', checkins: 22 },
];

export default function Members() {
  const [search, setSearch] = useState('');

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Members</h1>
            <p className="text-muted-foreground">View all members who have checked in at your gym.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{mockMembers.length} Total</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Members Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check-ins</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                          <span className="text-primary-foreground font-bold">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{member.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{member.email}</td>
                    <td className="p-4 text-muted-foreground">{member.joinDate}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {member.checkins}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
