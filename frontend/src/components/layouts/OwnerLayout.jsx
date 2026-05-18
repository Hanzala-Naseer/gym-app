// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Building2,
//   Users,
//   CalendarCheck,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Dumbbell,
//   PlusCircle,
//   QrCode,
//   DollarSign,
// } from "lucide-react";
// import { useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";

// const menuItems = [
//   {
//     icon: LayoutDashboard,
//     label: "Dashboard",
//     path: "/dashboard/owner",
//   },
//   {
//     icon: PlusCircle,
//     label: "Register Gym",
//     path: "/dashboard/owner/register-gym",
//   },
//   {
//     icon: Building2,
//     label: "My Gym",
//     path: "/dashboard/owner/my-gym",
//   },
//   {
//     icon: QrCode,
//     label: "QR Access",
//     path: "/dashboard/owner/qr",
//   },
//   {
//     icon: Users,
//     label: "Members",
//     path: "/dashboard/owner/members",
//   },
//   {
//     icon: DollarSign,
//     label: "Payouts",
//     path: "/dashboard/owner/payouts",
//   },
//   {
//     icon: Settings,
//     label: "Settings",
//     path: "/dashboard/owner/settings",
//   },
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

//   const displayName = user?.name || "Owner";
//   const displayLetter = displayName.charAt(0).toUpperCase();

//   return (
//     <div className="h-screen overflow-hidden bg-[#f8f5f1] flex">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed lg:relative top-0 left-0 z-50
//           h-screen w-[260px] shrink-0
//           bg-[#1f140c]
//           border-r border-[#3a2414]
//           flex flex-col
//           transition-transform duration-300
//           ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//           }
//         `}
//       >
//         {/* Logo */}
//         <div className="h-[72px] px-5 flex items-center border-b border-[#342015] shrink-0">
//           <Link to="/" className="flex items-center gap-2.5">
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center shadow-lg">
//               <Dumbbell className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-white text-lg font-black leading-none">
//                 GymKey
//               </h2>
//               <p className="text-[#fdb56c] text-[10px] uppercase tracking-[0.2em] mt-0.5">
//                 Owner Panel
//               </p>
//             </div>
//           </Link>
//         </div>

//         {/* User */}
//         <div className="px-5 py-3 border-b border-[#342015] shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center text-white font-bold text-sm shadow-md">
//               {displayLetter}
//             </div>
//             <div className="min-w-0">
//               <h3 className="text-white font-semibold text-sm leading-none truncate">
//                 {displayName}
//               </h3>
//               <p className="text-[#c6b4a3] text-[11px] mt-0.5">Gym Owner</p>
//             </div>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin">
//           <div className="space-y-1">
//             {menuItems.map((item) => {
//               const isActive =
//                 item.path === "/dashboard/owner"
//                   ? location.pathname === item.path
//                   : location.pathname.startsWith(item.path);

//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`
//                     group flex items-center gap-3
//                     px-3 py-2.5 rounded-xl
//                     transition-all duration-200
//                     ${
//                       isActive
//                         ? "bg-gradient-to-r from-[#885210] to-[#a96617] text-white shadow-md"
//                         : "text-[#c8b9ab] hover:bg-[#2a1a10] hover:text-white"
//                     }
//                   `}
//                 >
//                   <div
//                     className={`
//                       w-8 h-8 rounded-lg
//                       flex items-center justify-center
//                       transition-all flex-shrink-0
//                       ${
//                         isActive
//                           ? "bg-white/15"
//                           : "bg-[#2f1d12] group-hover:bg-[#3a2416]"
//                       }
//                     `}
//                   >
//                     <item.icon className="w-4 h-4" />
//                   </div>
//                   <span className="font-medium text-[13px] truncate">
//                     {item.label}
//                   </span>
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>

//         {/* Logout */}
//         <div className="p-3 border-t border-[#342015] shrink-0">
//           <button
//             onClick={handleLogout}
//             className="
//               w-full flex items-center gap-3
//               px-3 py-2.5 rounded-xl
//               text-[#c8b9ab]
//               hover:bg-red-500/10
//               hover:text-red-400
//               transition-all
//             "
//           >
//             <div className="w-8 h-8 rounded-lg bg-[#2f1d12] flex items-center justify-center flex-shrink-0">
//               <LogOut className="w-4 h-4" />
//             </div>
//             <span className="font-medium text-[13px]">Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <div className="flex-1 flex flex-col h-screen overflow-hidden">
//         {/* Mobile Header */}
//         <header className="lg:hidden h-16 px-4 bg-white border-b border-[#eadfce] flex items-center justify-between shrink-0">
//           <Link to="/" className="flex items-center gap-2.5">
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center">
//               <Dumbbell className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h2 className="font-black text-[#2c1a0e] text-sm">GymKey</h2>
//               <p className="text-[9px] uppercase tracking-[0.2em] text-[#885210]">
//                 Owner
//               </p>
//             </div>
//           </Link>

//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="w-9 h-9 rounded-xl border border-[#eadfce] bg-white flex items-center justify-center"
//           >
//             {sidebarOpen ? (
//               <X className="w-4 h-4 text-[#2c1a0e]" />
//             ) : (
//               <Menu className="w-4 h-4 text-[#2c1a0e]" />
//             )}
//           </button>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// }
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Dumbbell,
  PlusCircle,
  QrCode,
  DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { gymService } from "@/services/gymService";

export default function OwnerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasGym, setHasGym] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    checkOwnerGym();
  }, []);

  const checkOwnerGym = async () => {
    try {
      const data = await gymService.getMyGyms();
      const gyms = data?.gyms || [];
      setHasGym(gyms.length > 0);
    } catch (err) {
      console.log("Error checking gym:", err);
      setHasGym(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.name || "Owner";
  const displayLetter = displayName.charAt(0).toUpperCase();

  // Build menu items dynamically based on gym status
  const getMenuItems = () => {
    const items = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard/owner",
      },
    ];

    // Only show Register Gym if owner has NO gym yet
    if (!hasGym) {
      items.push({
        icon: PlusCircle,
        label: "Register Gym",
        path: "/dashboard/owner/register-gym",
      });
    }

    // Only show gym-related items if owner HAS a gym
    if (hasGym) {
      items.push(
        {
          icon: Building2,
          label: "My Gym",
          path: "/dashboard/owner/my-gym",
        },
        {
          icon: QrCode,
          label: "QR Access",
          path: "/dashboard/owner/qr",
        },
        {
          icon: Users,
          label: "Members",
          path: "/dashboard/owner/members",
        },
        {
          icon: DollarSign,
          label: "Payouts",
          path: "/dashboard/owner/payouts",
        },
      );
    }

    items.push({
      icon: Settings,
      label: "Settings",
      path: "/dashboard/owner/settings",
    });

    return items;
  };

  const menuItems = getMenuItems();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8f5f1]">
        <div className="w-8 h-8 border-4 border-[#885210] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f8f5f1] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-50
          h-screen w-[260px] shrink-0
          bg-[#1f140c]
          border-r border-[#3a2414]
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="h-[72px] px-5 flex items-center border-b border-[#342015] shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center shadow-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white text-lg font-black leading-none">
                GymKey
              </h2>
              <p className="text-[#fdb56c] text-[10px] uppercase tracking-[0.2em] mt-0.5">
                Owner Panel
              </p>
            </div>
          </Link>
        </div>

        {/* User */}
        <div className="px-5 py-3 border-b border-[#342015] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center text-white font-bold text-sm shadow-md">
              {displayLetter}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm leading-none truncate">
                {displayName}
              </h3>
              <p className="text-[#c6b4a3] text-[11px] mt-0.5">Gym Owner</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
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
                    group flex items-center gap-3
                    px-3 py-2.5 rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#885210] to-[#a96617] text-white shadow-md"
                        : "text-[#c8b9ab] hover:bg-[#2a1a10] hover:text-white"
                    }
                  `}
                >
                  <div
                    className={`
                      w-8 h-8 rounded-lg
                      flex items-center justify-center
                      transition-all flex-shrink-0
                      ${
                        isActive
                          ? "bg-white/15"
                          : "bg-[#2f1d12] group-hover:bg-[#3a2416]"
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-[13px] truncate">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#342015] shrink-0">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3
              px-3 py-2.5 rounded-xl
              text-[#c8b9ab]
              hover:bg-red-500/10
              hover:text-red-400
              transition-all
            "
          >
            <div className="w-8 h-8 rounded-lg bg-[#2f1d12] flex items-center justify-center flex-shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium text-[13px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 px-4 bg-white border-b border-[#eadfce] flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#885210] to-[#fdb56c] flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-black text-[#2c1a0e] text-sm">GymKey</h2>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#885210]">
                Owner
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 rounded-xl border border-[#eadfce] bg-white flex items-center justify-center"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4 text-[#2c1a0e]" />
            ) : (
              <Menu className="w-4 h-4 text-[#2c1a0e]" />
            )}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
