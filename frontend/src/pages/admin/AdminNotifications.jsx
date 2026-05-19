// components/admin/AdminNotifications.jsx
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Shield,
  DollarSign,
  Building2,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function AdminNotifications({ onClose }) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await adminService.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast({ title: "Failed to mark as read", variant: "destructive" });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await adminService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast({ title: "All notifications marked as read" });
    } catch (err) {
      toast({ title: "Failed to mark all as read", variant: "destructive" });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "payout_processed":
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case "account_verified":
        return <Shield className="w-4 h-4 text-blue-600" />;
      case "gym_registered":
        return <Building2 className="w-4 h-4 text-purple-600" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#7A6A5D]" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString("en-PK");
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E9DED3] shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#E9DED3]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 text-[#2B160B]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="font-bold text-[#2B160B]">Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[#9A5A17] hover:text-[#2A1608] font-medium flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F5EFE8] transition-colors"
          >
            <X className="w-4 h-4 text-[#7A6A5D]" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-5 h-5 animate-spin text-[#9A5A17]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-10 h-10 text-[#D9CDBF] mx-auto mb-3" />
            <p className="text-sm text-[#7A6A5D]">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EAE3]">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-[#FCFAF8] transition-colors ${
                  !notification.isRead ? "bg-[#FFF8F0]" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFE8] flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#2B160B] leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="w-3 h-3 text-[#8A7B70]" />
                      <span className="text-xs text-[#8A7B70]">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="p-1.5 rounded-lg hover:bg-[#E9DED3] transition-colors shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5 text-[#8A7B70]" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
