import { useState } from 'react';
import { Calendar, QrCode, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/layouts/AdminLayout';

const mockCheckins = [
  { id: 1, member: 'John Smith', gym: 'FitZone Downtown', time: '10:30 AM', date: '2024-01-15' },
  { id: 2, member: 'Sarah Wilson', gym: 'CrossFit Central', time: '10:15 AM', date: '2024-01-15' },
  { id: 3, member: 'Mike Johnson', gym: 'FitZone Downtown', time: '09:45 AM', date: '2024-01-15' },
  { id: 4, member: 'Emily Davis', gym: 'Iron Paradise', time: '09:30 AM', date: '2024-01-15' },
  { id: 5, member: 'Alex Brown', gym: 'FlexFit Studio', time: '09:00 AM', date: '2024-01-15' },
  { id: 6, member: 'Lisa Anderson', gym: 'CrossFit Central', time: '08:45 AM', date: '2024-01-15' },
  { id: 7, member: 'David Lee', gym: 'Iron Paradise', time: '08:30 AM', date: '2024-01-15' },
  { id: 8, member: 'Rachel Green', gym: 'FitZone Downtown', time: '08:00 AM', date: '2024-01-15' },
];

export default function AdminCheckins() {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredCheckins = mockCheckins.filter(checkin =>
    checkin.member.toLowerCase().includes(search.toLowerCase()) ||
    checkin.gym.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Check-ins</h1>
            <p className="text-muted-foreground">View all member check-ins across gyms.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent">
            <QrCode className="w-5 h-5" />
            <span className="font-semibold">{mockCheckins.length} Today</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by member or gym..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>

        {/* Check-ins Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Gym</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCheckins.map((checkin) => (
                  <tr key={checkin.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                          <span className="text-primary-foreground font-bold">
                            {checkin.member.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{checkin.member}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {checkin.gym}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{checkin.time}</td>
                    <td className="p-4 text-muted-foreground">{checkin.date}</td>
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
