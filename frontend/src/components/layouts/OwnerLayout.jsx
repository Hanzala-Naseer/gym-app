// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Building2,
//   QrCode,
//   Users,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Dumbbell,
// } from "lucide-react";
// import { useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";

// const menuItems = [
//   { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/owner" },
//   { icon: Building2, label: "My Gym", path: "/dashboard/owner/my-gym" },
//   { icon: QrCode, label: "QR Code", path: "/dashboard/owner/qr" },
//   { icon: Users, label: "Members", path: "/dashboard/owner/members" },
//   { icon: Settings, label: "Settings", path: "/dashboard/owner/settings" },
// ];

// export default function OwnerLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logout, user } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* Mobile Header */}
//       <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
//         <div className="flex items-center justify-between p-4">
//           <Link to="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
//               <Dumbbell className="w-5 h-5 text-primary-foreground" />
//             </div>
//             <span className="text-lg font-bold text-sidebar-foreground">
//               GymKey
//             </span>
//           </Link>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="text-sidebar-foreground"
//           >
//             {sidebarOpen ? (
//               <X className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </Button>
//         </div>
//       </header>

//       {/* Sidebar Overlay */}
//       {sidebarOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//         fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border
//         transform transition-transform duration-300 ease-in-out
//         lg:translate-x-0
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//       `}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="p-6 border-b border-sidebar-border">
//             <Link to="/" className="flex items-center gap-2">
//               <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
//                 <Dumbbell className="w-6 h-6 text-primary-foreground" />
//               </div>
//               <span className="text-xl font-bold text-sidebar-foreground">
//                 GymKey
//               </span>
//             </Link>
//           </div>

//           {/* User Info */}
//           <div className="p-4 border-b border-sidebar-border">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
//                 <span className="text-primary-foreground font-bold">
//                   {user?.fullName?.charAt(0) || "O"}
//                 </span>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-sidebar-foreground">
//                   {user?.fullName || "Owner"}
//                 </p>
//                 <p className="text-xs text-sidebar-foreground/60">Gym Owner</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 p-4 space-y-1">
//             {menuItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`
//                     flex items-center gap-3 px-4 py-3 rounded-xl transition-all
//                     ${
//                       isActive
//                         ? "bg-sidebar-primary text-sidebar-primary-foreground"
//                         : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
//                     }
//                   `}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Logout */}
//           <div className="p-4 border-t border-sidebar-border">
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all"
//             >
//               <LogOut className="w-5 h-5" />
//               <span className="font-medium">Logout</span>
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
//         <div className="p-6 lg:p-8">{children}</div>
//       </main>
//     </div>
//   );
// }
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
  Dumbbell,
  TrendingUp,
  Wallet,
  Activity,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { gymService } from "@/services/gymService";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard/owner",
  },
  {
    icon: Building2,
    label: "My Gym",
    path: "/dashboard/owner/my-gym",
  },
  {
    icon: Users,
    label: "Members",
    path: "/dashboard/owner/members",
  },
  {
    icon: QrCode,
    label: "QR Access",
    path: "/dashboard/owner/qr",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/dashboard/owner/settings",
  },
];

export default function OwnerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [gym, setGym] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  useEffect(() => {
    loadGym();
  }, []);

  const loadGym = async () => {
    try {
      const data = await gymService.getMyGyms();
      setGym(data?.gyms?.[0] || null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.fullName || user?.name || "Gym Owner";

  const displayLetter = displayName.charAt(0).toUpperCase();

  const stats = [
    {
      icon: Users,
      label: "Members",
      value: gym?.memberCount || "0",
    },
    {
      icon: Wallet,
      label: "Revenue",
      value: gym?.estimatedRevenue ? `$${gym.estimatedRevenue}` : "$0",
    },
    {
      icon: Activity,
      label: "Check-ins",
      value: gym?.todayCheckins || "0",
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#f8f5f1] flex">
      {/* ===================================================== */}
      {/* Mobile Overlay */}
      {/* ===================================================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ===================================================== */}
      {/* Sidebar */}
      {/* ===================================================== */}

      <aside
        className={`
    fixed lg:relative top-0 left-0 z-50
    h-screen w-[290px] shrink-0
    bg-[#1b120b]
    border-r border-[#342015]
    flex flex-col
    transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        {/* ===================================================== */}
        {/* LOGO */}
        {/* ===================================================== */}

        <div className="h-[88px] px-5 flex items-center border-b border-[#342015] shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#fdb56c]/20 blur-2xl rounded-full" />

              <div className="relative w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center shadow-2xl">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-white text-[1.55rem] leading-none font-black">
                GymKey
              </h2>

              <p className="text-[#fdb56c] text-[10px] uppercase tracking-[0.28em] mt-1">
                Owner Panel
              </p>
            </div>
          </Link>
        </div>

        {/* ===================================================== */}
        {/* OWNER INFO */}
        {/* ===================================================== */}

        <div className="px-4 py-5 border-b border-[#342015] shrink-0">
          <div className="rounded-[24px] bg-gradient-to-br from-[#24170f] to-[#1d120b] border border-[#372315] p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center text-white font-black text-lg shadow-lg shrink-0">
                {displayLetter}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold text-[15px] truncate">
                  {displayName}
                </h3>

                <p className="text-[#bda997] text-xs mt-1">Gym Owner</p>
              </div>
            </div>

            {/* Gym Name */}
            {gym?.name && (
              <div className="mt-4 rounded-2xl bg-[#171009] border border-[#342015] p-3">
                <p className="text-[#9f8a79] text-[10px] uppercase tracking-[0.18em] mb-2">
                  Active Gym
                </p>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-white text-sm font-bold truncate">
                      {gym.name}
                    </h4>

                    <p className="text-[#bda997] text-xs mt-1 truncate">
                      {gym.city || "Fitness Center"}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#2b1b10] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#fdb56c]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================== */}
        {/* NAVIGATION */}
        {/* ===================================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive =
                item.path === "/dashboard/owner"
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
              group relative flex items-center gap-4
              px-4 py-3 rounded-2xl
              transition-all duration-200
              overflow-hidden
              ${
                isActive
                  ? "bg-gradient-to-r from-[#8d5715] to-[#b7741f] text-white shadow-xl"
                  : "text-[#c4b3a5] hover:bg-[#27180f] hover:text-white"
              }
            `}
                >
                  <div
                    className={`
                w-10 h-10 rounded-xl
                flex items-center justify-center
                transition-all shrink-0
                ${
                  isActive
                    ? "bg-white/15"
                    : "bg-[#2a1a10] group-hover:bg-[#372215]"
                }
              `}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>

                  <span className="font-semibold text-[14px] flex-1">
                    {item.label}
                  </span>

                  {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ===================================================== */}
        {/* LOGOUT */}
        {/* ===================================================== */}

        <div className="p-4 border-t border-[#342015] shrink-0 bg-[#1b120b]">
          <button
            onClick={handleLogout}
            className="
        w-full flex items-center gap-4
        px-4 py-3 rounded-2xl
        text-[#c8b9ab]
        hover:bg-red-500/10
        hover:text-red-400
        transition-all
      "
          >
            <div className="w-10 h-10 rounded-xl bg-[#2b1b10] flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>

            <span className="font-semibold text-[14px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* ===================================================== */}
      {/* Main */}
      {/* ===================================================== */}

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* ===================================================== */}
        {/* Mobile Header */}
        {/* ===================================================== */}

        <header className="lg:hidden h-20 px-5 bg-white border-b border-[#eadfce] flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center shadow-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>

            <div>
              <h2 className="font-black text-[#2c1a0e]">GymKey</h2>

              <p className="text-[10px] uppercase tracking-[0.25em] text-[#885210]">
                Owner
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-11 h-11 rounded-2xl border border-[#eadfce] bg-white flex items-center justify-center shadow-sm"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-[#2c1a0e]" />
            ) : (
              <Menu className="w-5 h-5 text-[#2c1a0e]" />
            )}
          </button>
        </header>

        {/* ===================================================== */}
        {/* Content */}
        {/* ===================================================== */}

        <main className="flex-1 overflow-y-auto bg-[#f8f5f1]">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
