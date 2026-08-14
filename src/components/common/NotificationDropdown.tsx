import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { InAppNotification } from '../../types';
import { Bell, Check, ExternalLink, Trash2, Volume2, Shield } from 'lucide-react';

interface NotificationDropdownProps {
  onNavigate?: (view: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNavigate }) => {
  const { role, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [hasPushPermission, setHasPushPermission] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  const refreshNotifications = () => {
    const notifs = storage.getNotifications(
      role === 'admin' ? 'admin' : 'student',
      user?.id
    );
    setNotifications(notifs);
  };

  useEffect(() => {
    refreshNotifications();
    const handleDataChange = () => refreshNotifications();
    window.addEventListener('apex_data_changed', handleDataChange);
    return () => window.removeEventListener('apex_data_changed', handleDataChange);
  }, [role, user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.markNotificationAsRead(id);
    refreshNotifications();
  };

  const handleMarkAllRead = () => {
    storage.markAllNotificationsAsRead(
      role === 'admin' ? 'admin' : 'student',
      user?.id
    );
    refreshNotifications();
  };

  const handleEnablePush = async () => {
    const granted = await storage.requestPushPermission();
    setHasPushPermission(granted);
    if (granted) {
      storage.sendPushNotification(
        'Apex Notifications Enabled',
        'You will now receive instant alerts for admission enquiries, test results, and study materials!'
      );
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* Push notification banner */}
            {!hasPushPermission && 'Notification' in window && (
              <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-amber-800">
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Enable instant push alerts</span>
                </div>
                <button
                  onClick={handleEnablePush}
                  className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded font-medium transition"
                >
                  Enable
                </button>
              </div>
            )}

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 15).map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) storage.markNotificationAsRead(n.id);
                      refreshNotifications();
                      if (n.link && onNavigate) {
                        onNavigate(n.link);
                        setIsOpen(false);
                      }
                    }}
                    className={`p-3 text-left hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                      !n.isRead ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className={`text-xs ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>

                    {!n.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(n.id, e)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                        title="Mark read"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
              Real-time In-App & Push Notification Architecture
            </div>
          </div>
        </>
      )}
    </div>
  );
};
