import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  QrCode, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Dumbbell
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/owner' },
  { icon: Building2, label: 'My Gym', path: '/dashboard/owner/my-gym' },
  { icon: QrCode, label: 'QR Code', path: '/dashboard/owner/qr' },
  { icon: Users, label: 'Members', path: '/dashboard/owner/members' },
  { icon: Settings, label: 'Settings', path: '/dashboard/owner/settings' },
];

export default function OwnerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">GymKey</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">GymKey</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  {user?.fullName?.charAt(0) || 'O'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">{user?.fullName || 'Owner'}</p>
                <p className="text-xs text-sidebar-foreground/60">Gym Owner</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
