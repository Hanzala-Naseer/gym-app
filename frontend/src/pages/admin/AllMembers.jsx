// import { useState } from 'react';
// import { Users, Search } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import AdminLayout from '@/components/layouts/AdminLayout';

// const mockMembers = [
//   { id: 1, name: 'John Smith', email: 'john@example.com', gym: 'FitZone Downtown', joinDate: '2024-01-01' },
//   { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', gym: 'CrossFit Central', joinDate: '2024-01-05' },
// ];

// export default function AllMembers() {
//   const [search, setSearch] = useState('');
//   const filteredMembers = mockMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <AdminLayout>
//       <div className="space-y-8">
//         <div><h1 className="text-2xl lg:text-3xl font-bold text-foreground">All Members</h1></div>
//         <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
//         <div className="bg-card rounded-2xl shadow-card overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-muted/50"><tr><th className="text-left p-4 text-sm font-medium text-muted-foreground">Member</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">Gym</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th></tr></thead>
//             <tbody>{filteredMembers.map((m) => (<tr key={m.id} className="border-t border-border"><td className="p-4 font-medium text-foreground">{m.name}</td><td className="p-4 text-muted-foreground">{m.email}</td><td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{m.gym}</span></td><td className="p-4 text-muted-foreground">{m.joinDate}</td></tr>))}</tbody>
//           </table>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AllMembers() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users);
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

  // 🔍 Frontend search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            All Members
          </h1>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* TABLE */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
