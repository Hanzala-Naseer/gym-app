
import { Users, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function Members() {
  const { token } = useAuth();

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/gyms/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch members");

        const data = await res.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [token]);

  const filteredMembers = members.filter(
    (m) =>
      m.user.name.toLowerCase().includes(search.toLowerCase()) ||
      m.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <OwnerLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Members</h1>
            <p className="text-muted-foreground">
              View all members who have checked in at your gym.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{members.length} Total</span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* TABLE */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <p className="p-6 text-muted-foreground">Loading members...</p>
          ) : filteredMembers.length === 0 ? (
            <p className="p-6 text-muted-foreground">No members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Member
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Joined
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Check-ins
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-t hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                            <span className="text-primary-foreground font-bold">
                              {member.user.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium">
                            {member.user.name}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {member.user.email}
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                          {member.totalCheckins}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
