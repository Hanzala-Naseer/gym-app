import { useEffect, useState } from "react";
import { Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AllGyms() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [gyms, setGyms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/gyms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch gyms");
      }

      setGyms(data.gyms);
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

  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl lg:text-3xl font-bold">All Gyms</h1>

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

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm">Gym</th>
                <th className="p-4 text-left text-sm">Owner</th>
                <th className="p-4 text-left text-sm">Status</th>
                <th className="p-4 text-left text-sm">Address</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Loading gyms...
                  </td>
                </tr>
              ) : filteredGyms.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    No gyms found
                  </td>
                </tr>
              ) : (
                filteredGyms.map((gym) => (
                  <tr key={gym.id} className="border-t hover:bg-muted/30">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {gym.name}
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {gym.owner?.name || "—"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          gym.status === "approved"
                            ? "bg-primary/10 text-primary"
                            : gym.status === "pending"
                            ? "bg-accent/10 text-accent"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {gym.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {gym.addressLine}
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
